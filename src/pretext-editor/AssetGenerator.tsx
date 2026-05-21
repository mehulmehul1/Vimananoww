/**
 * Pretext Asset Generator — Main UI Component
 *
 * DUAL ARCHITECTURE:
 *   - Organic formulas (tree, fern, etc.): Text flows along actual branch segments
 *     with tangent rotation. Each segment gets one line of text.
 *   - Geometric formulas (triangle, carpet, snowflake): Text fills shape interior
 *     using Pretext's variable-width line layout.
 *
 * No infinite loops — all render state in refs, Canvas 2D via requestAnimationFrame.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { prepareWithSegments, layoutNextLine, type LayoutCursor } from '@chenglou/pretext';
import {
  TEMPLATES,
  type Template,
  type FormulaParams,
  type FormulaResult,
  type LineSegment,
} from './formulas';

// ============================================================================
// CONSTANTS
// ============================================================================

const FONT_FAMILY = `'Space Grotesk', 'Arial Narrow', sans-serif`;
const LINE_HEIGHT = 28;

// ============================================================================
// TYPES
// ============================================================================

interface LinePlacement {
  text: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  opacity: number;
}

// ============================================================================
// ORGANIC MODE: Text flows along line segments
// ============================================================================

interface SegmentMapping {
  placements: LinePlacement[];
  segmentIndices: number[]; // which original segment index each placement maps to
}

function layoutTextOnSegments(text: string, segments: LineSegment[], fontSize: number, selectedTemplate: Template): SegmentMapping {
  if (!text.trim() || segments.length === 0) return { placements: [], segmentIndices: [] };


  const font = `600 ${fontSize}px ${FONT_FAMILY}`;
  const prepared = prepareWithSegments(text, font);
  const placements: LinePlacement[] = [];
  const segmentIndices: number[] = [];
  let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };

  // Sort segments top-to-bottom, left-to-right for reading flow
  // Unless the template explicitly disables sorting (for continuous paths)
  const indexed = segments.map((seg, i) => ({ seg, index: i }));
  const sorted = selectedTemplate.sortSegments === false 
    ? indexed 
    : indexed.sort((a, b) => {
        const midA = (a.seg.y1 + a.seg.y2) / 2;
        const midB = (b.seg.y1 + b.seg.y2) / 2;
        if (Math.abs(midA - midB) > 20) return midA - midB;
        return (a.seg.x1 + a.seg.x2) / 2 - (b.seg.x1 + b.seg.x2) / 2;
      });


  for (const { seg, index } of sorted) {
    // Skip visual-only segments (e.g. DNA helix rungs) — draw red line but no text
    if (seg.visualOnly) continue;

    const depthScale = Math.max(0.2, 1.0 - seg.depth * 0.12);

    if (seg.length < fontSize * depthScale * 0.5) continue;

    const line = layoutNextLine(prepared, cursor, seg.length * 0.9 / depthScale);
    if (!line) {
      cursor = { segmentIndex: 0, graphemeIndex: 0 };
      continue;
    }

    const midX = (seg.x1 + seg.x2) / 2;
    const midY = (seg.y1 + seg.y2) / 2;

    placements.push({
      text: line.text,
      x: midX - (line.width / 2) * Math.cos(seg.angle) * depthScale,
      y: midY - (line.width / 2) * Math.sin(seg.angle) * depthScale,
      rotation: seg.angle,
      scale: depthScale,
      opacity: 0.6 + depthScale * 0.4,
    });
    segmentIndices.push(index);

    cursor = line.end;
  }

  return { placements, segmentIndices };
}

/** Update placement coordinates from new segments without re-layout */
function updatePlacementsFromSegments(
  placements: LinePlacement[],
  segmentIndices: number[],
  segments: LineSegment[]
): LinePlacement[] {
  return placements.map((p, i) => {
    const segIndex = segmentIndices[i];
    if (segIndex === undefined || segIndex >= segments.length) return p;
    const seg = segments[segIndex];
    const midX = (seg.x1 + seg.x2) / 2;
    const midY = (seg.y1 + seg.y2) / 2;
    return {
      ...p,
      x: midX,
      y: midY,
      rotation: seg.angle,
    };
  });
}

// ============================================================================
// GEOMETRIC MODE: Text fills shape interior
// ============================================================================

function layoutTextInShape(text: string, boundsFn: (y: number) => { left: number; right: number } | null, fontSize: number): LinePlacement[] {
  if (!text.trim()) return [];

  const font = `600 ${fontSize}px ${FONT_FAMILY}`;
  const prepared = prepareWithSegments(text, font);
  const placements: LinePlacement[] = [];
  let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };

  for (let y = -400; y < 400; y += LINE_HEIGHT) {
    const bounds = boundsFn(y);
    if (!bounds || bounds.right - bounds.left < fontSize * 2) continue;

    const line = layoutNextLine(prepared, cursor, bounds.right - bounds.left);
    if (!line) break;

    placements.push({
      text: line.text,
      x: bounds.left,
      y: y,
      rotation: 0,
      scale: 1.0,
      opacity: 0.9,
    });

    cursor = line.end;
  }

  return placements;
}

// ============================================================================
// CAMERA
// ============================================================================

function computeCamera(placements: LinePlacement[], width: number, height: number) {
  if (placements.length === 0) return { scale: 1, x: 0, y: 0 };

  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  for (const p of placements) {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x + p.text.length * 12 * p.scale); // approximate width
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y + 20 * p.scale);
  }

  const contentW = maxX - minX + 100;
  const contentH = maxY - minY + 100;
  const scaleX = width / contentW;
  const scaleY = height / contentH;
  const scale = Math.min(scaleX, scaleY, 3) * 0.85;

  return {
    scale,
    x: -((minX + maxX) / 2) * scale,
    y: -((minY + maxY) / 2) * scale,
  };
}

// ============================================================================
// PARAMETER SLIDER
// ============================================================================

interface ParamSliderProps {
  label: string;
  paramKey: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (key: string, value: number) => void;
}

const ParamSlider: React.FC<ParamSliderProps> = ({ label, paramKey, value, min, max, step, onChange }) => (
  <div style={{ marginBottom: 10 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
      <label style={{ fontSize: 12, color: '#aaa' }}>{label}</label>
      <span style={{ fontSize: 12, color: '#fff', fontFamily: 'monospace' }}>
        {Number.isInteger(value) ? value : value.toFixed(2)}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(paramKey, parseFloat(e.target.value))}
      style={{ width: '100%', accentColor: '#00e5ff' }}
    />
  </div>
);

// ============================================================================
// PARAMETER RANGES
// ============================================================================

interface ParamRange {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
}

const PARAM_RANGES: Record<string, ParamRange[]> = {
  fractalTree: [
    { key: 'rootBranches', label: 'Root Branches', min: 2, max: 12, step: 1 },
    { key: 'depth', label: 'Depth', min: 2, max: 9, step: 1 },
    { key: 'angleSpread', label: 'Branch Angle (°)', min: 15, max: 90, step: 1 },
    { key: 'branchLength', label: 'Branch Length', min: 30, max: 200, step: 5 },
    { key: 'lengthDecay', label: 'Length Decay', min: 0.4, max: 0.9, step: 0.02 },
  ],
  fractalFern: [
    { key: 'stemLength', label: 'Stem Length', min: 60, max: 200, step: 10 },
    { key: 'frondPairs', label: 'Frond Pairs', min: 3, max: 10, step: 1 },
    { key: 'depth', label: 'Depth', min: 3, max: 7, step: 1 },
    { key: 'angleSpread', label: 'Angle Spread', min: 0.2, max: 0.8, step: 0.05 },
    { key: 'lengthDecay', label: 'Length Decay', min: 0.5, max: 0.85, step: 0.02 },
  ],
  lSystemTree: [
    { key: 'angle', label: 'Branch Angle (°)', min: 5, max: 60, step: 1 },
    { key: 'stepLength', label: 'Step Length', min: 2, max: 15, step: 1 },
    { key: 'iterations', label: 'Iterations', min: 2, max: 7, step: 1 },
    { key: 'startAngle', label: 'Start Angle (°)', min: 0, max: 180, step: 5 },
  ],
  dendriticCrystal: [
    { key: 'seedLength', label: 'Seed Length', min: 40, max: 200, step: 5 },
    { key: 'branches', label: 'Branch Count', min: 3, max: 12, step: 1 },
    { key: 'depth', label: 'Depth', min: 3, max: 8, step: 1 },
    { key: 'angleSpread', label: 'Angle Spread', min: 0.1, max: 1.2, step: 0.05 },
    { key: 'lengthDecay', label: 'Length Decay', min: 0.5, max: 0.85, step: 0.02 },
    { key: 'symmetry', label: 'Symmetry', min: 3, max: 12, step: 1 },
  ],
  hexagonalFractal: [
    { key: 'iterations', label: 'Iterations', min: 1, max: 6, step: 1 },
    { key: 'size', label: 'Size', min: 80, max: 400, step: 10 },
  ],
  goldenSpiral: [
    { key: 'turns', label: 'Turns', min: 1, max: 8, step: 0.5 },
    { key: 'growthRate', label: 'Growth Rate', min: 0.05, max: 0.4, step: 0.005 },
  ],
  textCircle: [
    { key: 'radius', label: 'Radius', min: 50, max: 400, step: 5 },
  ],
  cymaticRing: [
    { key: 'ringCount', label: 'Ring Count', min: 2, max: 20, step: 1 },
    { key: 'waveAmp', label: 'Wave Amplitude', min: 5, max: 60, step: 1 },
    { key: 'modeRadial', label: 'Radial Mode', min: 1, max: 8, step: 1 },
  ],
  sierpinskiTriangle: [
    { key: 'size', label: 'Size', min: 100, max: 500, step: 10 },
    { key: 'iterations', label: 'Iterations', min: 1, max: 6, step: 1 },
  ],
  sierpinskiCarpet: [
    { key: 'size', label: 'Size', min: 100, max: 500, step: 10 },
    { key: 'iterations', label: 'Iterations', min: 1, max: 5, step: 1 },
  ],
  fractalSnowflake: [
    { key: 'size', label: 'Size', min: 100, max: 500, step: 10 },
    { key: 'iterations', label: 'Iterations', min: 1, max: 5, step: 1 },
  ],
  dnaHelix: [
    { key: 'turns', label: 'Turns', min: 2, max: 12, step: 0.5 },
    { key: 'radius', label: 'Radius', min: 30, max: 200, step: 5 },
    { key: 'height', label: 'Height', min: 200, max: 800, step: 20 },
    { key: 'basePairs', label: 'Base Pairs', min: 6, max: 24, step: 1 },
  ],
  wordCloud: [
    { key: 'cloudCount', label: 'Cloud Count', min: 1, max: 12, step: 1 },
    { key: 'wordCount', label: 'Words per Cloud', min: 10, max: 100, step: 5 },
    { key: 'radius', label: 'Cloud Radius', min: 50, max: 300, step: 10 },
    { key: 'spread', label: 'Cloud Spread', min: 0, max: 300, step: 10 },
  ],
  slimycreature: [
    { key: 'amplitude', label: 'Amplitude', min: 0.1, max: 5, step: 0.1 },
    { key: 'frequency', label: 'Frequency', min: 0.1, max: 10, step: 0.1 },
    { key: 'complexity', label: 'Complexity', min: 1, max: 100, step: 1 },
  ],
  butterflys: [
    { key: 'concentricRings', label: 'Concentric Rings', min: 1, max: 10, step: 1 },
    { key: 'ringSpacing', label: 'Ring Spacing', min: 1, max: 30, step: 1 },
    { key: 'animationSpeed', label: 'Animation Speed', min: 0, max: 50, step: 1 },
    { key: 'disableDepth', label: 'Disable Depth (0/1)', min: 0, max: 1, step: 1 },
  ],
  symmetryWave: [
    { key: 'animationSpeed', label: 'Animation Speed', min: 0, max: 100, step: 1 },
    { key: 'ringOffset', label: 'Ring Offset', min: 5, max: 40, step: 1 },
  ],
};

const TEMPLATE_NAME_TO_KEY: Record<string, string> = {
  'Fractal Tree': 'fractalTree',
  'Barnsley Fern': 'fractalFern',
  'L-System Tree': 'lSystemTree',
  'Dendritic Crystal': 'dendriticCrystal',
  'Hexagonal Fractal': 'hexagonalFractal',
  'Golden Spiral': 'goldenSpiral',
  'Text Circle': 'textCircle',
  'Cymatic Ring': 'cymaticRing',
  'Sierpinski Triangle': 'sierpinskiTriangle',
  'Sierpinski Carpet': 'sierpinskiCarpet',
  'Koch Snowflake': 'fractalSnowflake',
  'DNA Helix': 'dnaHelix',
  'Word Cloud': 'wordCloud',
  'Slimy Creature': 'slimycreature',
  'Butterflies': 'butterflys',
  'Symmetry Wave': 'symmetryWave',
};


// ============================================================================
// MAIN COMPONENT
// ============================================================================

const DEFAULT_TEXT =
  'The quick brown fox jumps over the lazy dog. Pure frequency to environmental manifestation. Absolute black vacuum silence prevails. A single microscopic white dot appears in the void. High-frequency visual hum resonates through space.';

export const AssetGenerator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(TEMPLATES[0]!);
  const [params, setParams] = useState<FormulaParams>({ ...TEMPLATES[0]!.defaultParams });
  const [text, setText] = useState(DEFAULT_TEXT);
  const [bgColor, setBgColor] = useState('#000000');
  const [textColor, setTextColor] = useState('#00e5ff');
  const [fontSize, setFontSize] = useState(14);
  const [showSegments, setShowSegments] = useState(true);
  const [animate, setAnimate] = useState(false);
  const animateRef = useRef(false);
  useEffect(() => { animateRef.current = animate; }, [animate]);

  // Refs for canvas rendering
  const placementsRef = useRef<LinePlacement[]>([]);
  const segmentsRef = useRef<LineSegment[]>([]);
  const segmentIndicesRef = useRef<number[]>([]);
  const cameraRef = useRef({ scale: 1, x: 0, y: 0 });

  // ── REGENERATE LAYOUT ──
  const timeRef = useRef(0);
  const lastRegenTimeRef = useRef(0);

  const regenerate = useCallback((time: number, fullLayout: boolean = true) => {
    const result: FormulaResult = selectedTemplate.formula(text, params, time);

    if (result.type === 'segments') {
      segmentsRef.current = result.segments;
      if (fullLayout) {
        const mapped = layoutTextOnSegments(text, result.segments, fontSize, selectedTemplate);

        placementsRef.current = mapped.placements;
        segmentIndicesRef.current = mapped.segmentIndices;
      } else {
        // Animation: only update coordinates, keep same text-to-segment mapping
        placementsRef.current = updatePlacementsFromSegments(
          placementsRef.current,
          segmentIndicesRef.current,
          result.segments
        );
      }
    } else {
      segmentsRef.current = result.segments || [];
      placementsRef.current = layoutTextInShape(text, result.boundsFn, fontSize);
    }

    const canvas = canvasRef.current;
    if (canvas) {
      cameraRef.current = computeCamera(placementsRef.current, canvas.offsetWidth, canvas.offsetHeight);
    }
    lastRegenTimeRef.current = time;
  }, [selectedTemplate, params, text, fontSize]);

  // Reset animation time when switching templates
  useEffect(() => {
    timeRef.current = 0;
  }, [selectedTemplate]);

  // Regenerate layout whenever formula inputs change.
  useEffect(() => {
    regenerate(animateRef.current ? timeRef.current : 0, true);
  }, [regenerate]);

  // ── CANVAS RENDER LOOP ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    let animationId = 0;

    const render = () => {
      if (animateRef.current) {
        timeRef.current += 0.016;
        // During animation: only update segment positions, don't re-layout text
        if (timeRef.current - lastRegenTimeRef.current > 0.05) {
          regenerate(timeRef.current, false);
        }
      }

      const placements = placementsRef.current;
      const segments = segmentsRef.current;
      const camera = cameraRef.current;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      ctx.save();
      ctx.translate(canvas.offsetWidth / 2 + camera.x, canvas.offsetHeight / 2 + camera.y);
      ctx.scale(camera.scale, camera.scale);

      const font = `600 ${fontSize}px ${FONT_FAMILY}`;

      // Draw red segment lines for organic formulas
      if (showSegments && segments.length > 0) {
        ctx.strokeStyle = 'rgba(255, 50, 50, 0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (const seg of segments) {
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
        }
        ctx.stroke();
      }

      // Render text lines
      for (const p of placements) {
        if (!p.text.trim()) continue;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.scale(p.scale, p.scale);

        ctx.font = font;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = textColor;
        ctx.fillText(p.text, 0, 0);
        ctx.restore();
      }

      ctx.restore();

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [bgColor, textColor, fontSize, showSegments, regenerate, animate]);

  // ── TEMPLATE SELECTION ──
  const handleTemplateChange = useCallback((name: string) => {
    const tmpl = TEMPLATES.find((t) => t.name === name);
    if (tmpl) {
      setSelectedTemplate(tmpl);
      setParams({ ...tmpl.defaultParams });
    }
  }, []);

  // ── PARAMETER UPDATE ──
  const handleParamChange = useCallback((key: string, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  }, []);

  // ── EXPORT PNG ──
  const exportPNG = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvas.width * 2;
    exportCanvas.height = canvas.height * 2;
    const ctx = exportCanvas.getContext('2d')!;
    ctx.scale(2, 2);

    const placements = placementsRef.current;
    const segments = segmentsRef.current;
    const camera = cameraRef.current;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    ctx.save();
    ctx.translate(canvas.offsetWidth / 2 + camera.x, canvas.offsetHeight / 2 + camera.y);
    ctx.scale(camera.scale, camera.scale);

    const exportFont = `600 ${fontSize}px ${FONT_FAMILY}`;

    // Draw segments
    if (segments.length > 0) {
      ctx.strokeStyle = 'rgba(255, 50, 50, 0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (const seg of segments) {
        ctx.moveTo(seg.x1, seg.y1);
        ctx.lineTo(seg.x2, seg.y2);
      }
      ctx.stroke();
    }

    // Draw text
    for (const p of placements) {
      if (!p.text.trim()) continue;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.font = exportFont;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillStyle = textColor;
      ctx.fillText(p.text, 0, 0);
      ctx.restore();
    }

    ctx.restore();

    const link = document.createElement('a');
    link.download = `pretext-${selectedTemplate.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
  }, [bgColor, textColor, selectedTemplate, fontSize]);

  // Utils
  const paramRanges = PARAM_RANGES[TEMPLATE_NAME_TO_KEY[selectedTemplate.name] || ''] || [];
  const panelStyle: React.CSSProperties = { background: '#0a0a0f', border: '1px solid #1a1a2e', borderRadius: 8, padding: 16, marginBottom: 12 };
  const sectionLabel: React.CSSProperties = { fontSize: 11, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: '#666', marginBottom: 8, display: 'block' };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#050508', color: '#e0e0e0', fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>
      {/* ── LEFT PANEL ── */}
      <div style={{ width: 320, minWidth: 320, padding: 16, overflowY: 'auto', borderRight: '1px solid #1a1a2e', background: '#08080c' }}>
        <h1 style={{ fontSize: 18, margin: '0 0 4px', color: '#00e5ff' }}>Pretext Asset Generator</h1>
        <p style={{ fontSize: 11, color: '#555', margin: '0 0 16px' }}>Fractal text — segments or shape fill</p>

        {/* Template */}
        <div style={panelStyle}>
          <span style={sectionLabel}>Template</span>
          <select
            value={selectedTemplate.name}
            onChange={(e) => handleTemplateChange(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', background: '#111', border: '1px solid #333', borderRadius: 6, color: '#fff', fontSize: 13, outline: 'none' }}
          >
            {TEMPLATES.map((t) => (
              <option key={t.name} value={t.name}>{t.name}</option>
            ))}
          </select>
          <p style={{ fontSize: 11, color: '#666', margin: '8px 0 0' }}>{selectedTemplate.description}</p>
        </div>

        {/* Parameters */}
        <div style={panelStyle}>
          <span style={sectionLabel}>Parameters</span>
          {paramRanges.map((pr) => (
            <ParamSlider key={pr.key} label={pr.label} paramKey={pr.key} value={(params[pr.key] as number) ?? pr.min} min={pr.min} max={pr.max} step={pr.step} onChange={handleParamChange} />
          ))}
        </div>

        {/* Text */}
        <div style={panelStyle}>
          <span style={sectionLabel}>Text Content</span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            style={{ width: '100%', padding: 8, background: '#111', border: '1px solid #333', borderRadius: 6, color: '#ddd', fontSize: 12, fontFamily: 'inherit', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
          />
          <p style={{ fontSize: 10, color: '#555', margin: '4px 0 0' }}>{text.length} chars · {placementsRef.current.length} lines</p>
        </div>

        {/* Appearance */}
        <div style={panelStyle}>
          <span style={sectionLabel}>Appearance</span>
          
          <ParamSlider label="Font Size" paramKey="fontSize" value={fontSize} min={8} max={48} step={1} onChange={(_, v) => setFontSize(v)} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <input type="checkbox" id="showSegments" checked={showSegments} onChange={(e) => setShowSegments(e.target.checked)} style={{ accentColor: '#00e5ff' }} />
            <label htmlFor="showSegments" style={{ fontSize: 12, color: '#aaa', cursor: 'pointer' }}>Show Segment Lines (Red)</label>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <input type="checkbox" id="animate" checked={animate} onChange={(e) => setAnimate(e.target.checked)} style={{ accentColor: '#00e5ff' }} />
            <label htmlFor="animate" style={{ fontSize: 12, color: '#aaa', cursor: 'pointer' }}>Animate (Time-based)</label>
          </div>
          
          <div style={{ display: 'flex', gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Background</label>
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} style={{ width: 48, height: 32, border: 'none', cursor: 'pointer' }} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Text Color</label>
              <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} style={{ width: 48, height: 32, border: 'none', cursor: 'pointer' }} />
            </div>
          </div>
        </div>

        {/* Export */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={exportPNG} style={{ flex: 1, padding: '10px 16px', background: '#00e5ff', border: 'none', borderRadius: 6, color: '#000', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Export PNG</button>
        </div>
      </div>

      {/* ── CANVAS ── */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      </div>
    </div>
  );
};

export default AssetGenerator;
