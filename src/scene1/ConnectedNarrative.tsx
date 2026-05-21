import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { 
  textCircle, 
  cymaticRing, 
  fractalTree, 
  dnaHelix, 
  slimycreature, 
  fractalFern, 
  goldenSpiral, 
  hexagonalFractal, 
  dendriticCrystal, 
  butterflys, 
  symmetryWave, 
  lSystemTree, 
  type LineSegment 
} from '../pretext-editor/formulas';
import { layoutTextOnSegments, type LinePlacement } from './textLayout';
import { useGenesisStore } from '../store';
import { LanguageManager, getFontForLanguage, type Language, FORMULA_TEXTS, SCENE_TEXTS, LANGUAGE_LABELS } from '../i18n';

// ─── Constants ────────────────────────────────────────────────────────────
const FONT_PRIMARY = `'Space Grotesk', 'Inter', sans-serif`;
const FONT_MONO = `'JetBrains Mono', monospace`;
const CYAN = '#21c7df';

interface SceneDef {
  phaseId: string;
  act: 'ACT I' | 'ACT II';
  title: string;
  navLabel: string;
  headline: string;
  body: string;
  formula: string;
  status: string;
  frequency: string;
  amplitude: string;
  coordinates: string;
  origin: string;
  duration: number;
}

const SCENES: SceneDef[] = [
  // ACT 1: Primordial Vibration
  {
    phaseId: '00',
    act: 'ACT I',
    title: 'THE VOID',
    navLabel: 'VOID',
    headline: 'BEFORE LIGHT.',
    body: 'Before light. Before thought. There was only frequency, pulsating in infinite silence.',
    formula: 'singularity / 136.1hz',
    status: 'dormant',
    frequency: '00.00 Hz',
    amplitude: '0.000',
    coordinates: '00 00 00.00 N / 00 00 00.00 E',
    origin: 'unknown vacuum',
    duration: 3,
  },
  {
    phaseId: '01',
    act: 'ACT I',
    title: 'THE HUM',
    navLabel: 'HUM',
    headline: 'FIRST SOUND.',
    body: 'Not a sound. The potential of all sound. A single word names itself and begins to expand.',
    formula: 'textCircle / radius: expanding',
    status: 'stable',
    frequency: '136.10 Hz',
    amplitude: '0.018',
    coordinates: '00 00 00.08 N / 00 00 00.08 E',
    origin: 'single point',
    duration: 4,
  },
  {
    phaseId: '02',
    act: 'ACT I',
    title: 'THE WORD',
    navLabel: 'WORD',
    headline: 'MULTIPLICITY.',
    body: 'The hum names itself. VIMANA repeats until the point becomes concentric rings of pure light.',
    formula: 'textCircle / loop: closed',
    status: 'linguistic',
    frequency: '272.20 Hz',
    amplitude: '0.144',
    coordinates: '00 00 01.34 N / 00 00 01.34 E',
    origin: 'spoken radius',
    duration: 5,
  },
  {
    phaseId: '03',
    act: 'ACT I',
    title: 'THE FIELD',
    navLabel: 'FIELD',
    headline: 'CYMATICS.',
    body: 'The circle becomes an interactive field. Rings ripple, orbital bodies rotate in mathematical harmony.',
    formula: 'cymaticRing → orbit',
    status: 'interference',
    frequency: 'orbital harmonics',
    amplitude: '0.610',
    coordinates: '00 01 13.00 N / 00 01 13.00 E',
    origin: 'standing wave',
    duration: 8,
  },
  {
    phaseId: '04',
    act: 'ACT I',
    title: 'THE TREE',
    navLabel: 'TREE',
    headline: 'RECURSION.',
    body: 'From cosmic order, branching. From branching, memory. Geometry begins to mimic life.',
    formula: 'fractalTree / recursive',
    status: 'recursive',
    frequency: 'biological scale',
    amplitude: '0.813',
    coordinates: '00 05 55.00 N / 00 05 55.00 E',
    origin: 'first growth',
    duration: 6,
  },

  // ACT 2: Biological Manifestation
  {
    phaseId: '05',
    act: 'ACT II',
    title: 'THE BLUEPRINT',
    navLabel: 'BLUEPRINT',
    headline: 'GENETIC FRAME.',
    body: 'The recursive branches coalesce into a double-helix blueprint. Text spirals upwards, writing out genetic code.',
    formula: 'dnaHelix / A-DNA',
    status: 'chromosomal',
    frequency: '333.33 Hz',
    amplitude: '0.880',
    coordinates: '00 12 04.12 N / 00 08 22.04 E',
    origin: 'helical matrix',
    duration: 6,
  },
  {
    phaseId: '06',
    act: 'ACT II',
    title: 'THE SOUP',
    navLabel: 'SOUP',
    headline: 'ORGANIC CHAOS.',
    body: 'The rigid blueprint melts into warm primordial chaos. Cells slide, undulating and multiplying in amino-acid gold pools.',
    formula: 'slimycreature / biology',
    status: 'bioluminescent',
    frequency: '415.30 Hz',
    amplitude: '0.925',
    coordinates: '01 02 45.18 N / 00 55 12.30 E',
    origin: 'thermal pools',
    duration: 5,
  },
  {
    phaseId: '07',
    act: 'ACT II',
    title: 'THE FLORA',
    navLabel: 'FLORA',
    headline: 'FLORA VARIETY EMERGED',
    body: 'A deep variety of botanical forms sprout and grow from seed nodes—from delicate fractal ferns to branching L-system structures—interweaving in space.',
    formula: 'fractalFern + lSystemTree + dendriticCrystal',
    status: 'flora form',
    frequency: '528.00 Hz',
    amplitude: '0.962',
    coordinates: '02 44 11.22 N / 01 19 08.55 E',
    origin: 'fibonacci seed',
    duration: 7,
  },
  {
    phaseId: '08',
    act: 'ACT II',
    title: 'THE SWARM',
    navLabel: 'SWARM',
    headline: 'ORGANIC FLUX.',
    body: 'Butterflies fly along chaotic attractors while schooling waves ripple above like flocks of birds in synchronous flight.',
    formula: 'butterflys + symmetryWave',
    status: 'flocking fauna',
    frequency: '724.11 Hz',
    amplitude: '0.995',
    coordinates: '08 11 12.00 N / 04 22 18.00 E',
    origin: 'chaotic attractors',
    duration: 7,
  },
  {
    phaseId: '09',
    act: 'ACT II',
    title: 'THE NETWORK',
    navLabel: 'NETWORK',
    headline: 'GLOBAL MIND.',
    body: 'The biosphere becomes a single integrated circuit. Synapses snap at tree tips in a global flash of neural awakening.',
    formula: 'lSystemTree / synapses',
    status: 'sentient consciousness',
    frequency: '999.99 Hz',
    amplitude: '1.000',
    coordinates: '12 55 59.99 N / 12 55 59.99 E',
    origin: 'global biosphere',
    duration: 6,
  },
];

const TOTAL_SCENES = SCENES.length;

// Helper: Interpolating colors smoothly
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function hexToRGB(hex: string): { r: number; g: number; b: number } {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

// Custom scene backgrounds for rich atmosphere
const BACKGROUNDS = [
  '#30302f', // Phase 0
  '#040507', // Phase 1
  '#090a0f', // Phase 2
  '#0d0e15', // Phase 3
  '#11121d', // Phase 4
  '#080b0d', // Phase 5: Blueprint Steel
  '#110902', // Phase 6: Amino Soup
  '#020d08', // Phase 7: Garden Forest
  '#0d0a02', // Phase 8: Honey Hive
  '#050412', // Phase 9: Indigo Swarm
  '#0c0414', // Phase 10: Network Violet
];

function getDynamicBG(progress: number): string {
  const totalSlots = TOTAL_SCENES - 1;
  const scaled = progress * totalSlots;
  const index = Math.min(totalSlots - 1, Math.floor(scaled));
  const localT = scaled - index;

  const hexA = BACKGROUNDS[index];
  const hexB = BACKGROUNDS[index + 1];

  const colorA = hexToRGB(hexA);
  const colorB = hexToRGB(hexB);

  const r = Math.round(lerp(colorA.r, colorB.r, localT));
  const g = Math.round(lerp(colorA.g, colorB.g, localT));
  const b = Math.round(lerp(colorA.b, colorB.b, localT));

  return `rgb(${r}, ${g}, ${b})`;
}

export function ConnectedNarrative() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeScene, setActiveScene] = useState(0);
  const [sceneProgress, setSceneProgress] = useState(0); // 0 to 1 within current scene
  const [globalProgress, setGlobalProgress] = useState(0); // 0 to 1 overall scroll

  // Local Animation Clock
  const clockRef = useRef(0);
  const lastFrameRef = useRef(performance.now());
  const langMgrRef = useRef(new LanguageManager(10));
  const currentLangRef = useRef<Language>('en');

  // Frame Resize and Render Loop
  useEffect(() => {
    let animId = 0;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const now = performance.now();
      const dt = Math.min((now - lastFrameRef.current) / 1000, 0.05);
      lastFrameRef.current = now;
      clockRef.current += dt;
      const lang = langMgrRef.current.update(dt);
      currentLangRef.current = lang;

      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const dpr = window.devicePixelRatio || 1;

      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Clean background matching smooth color interpolated transition
      ctx.fillStyle = getDynamicBG(globalProgress);
      ctx.fillRect(0, 0, w, h);

      const t = clockRef.current;
      const scale = Math.min(1.0, Math.max(0.48, Math.min(w, h) / 780));
      const cx = w / 2;
      const cy = h / 2;

      // Draw mathematical backdrop lines (radial circles + subtle crosshairs)
      drawTechnicalGrid(ctx, w, h, scale, globalProgress);

      // Draw based on the active scene
      drawSceneFormula(ctx, activeScene, sceneProgress, t, cx, cy, scale, lang);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [activeScene, sceneProgress, globalProgress]);

  // Unified scroll handler
  const handleScroll = useCallback(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const windowH = window.innerHeight;
    const bodyH = scrollContainer.scrollHeight;
    const scrollY = window.scrollY;
    const maxScroll = Math.max(1, bodyH - windowH);
    const rawProgress = scrollY / maxScroll;
    const gp = Math.min(1.0, Math.max(0, rawProgress));

    setGlobalProgress(gp);

    const segmentSize = 1 / TOTAL_SCENES;
    const activeIdx = Math.min(TOTAL_SCENES - 1, Math.floor(gp / segmentSize));
    const sceneStart = activeIdx * segmentSize;
    const scProgress = Math.min(1.0, Math.max(0, (gp - sceneStart) / segmentSize));

    setActiveScene(activeIdx);
    setSceneProgress(scProgress);
  }, []);

  // Scroll listener registration
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    // First trigger
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const activeDef = SCENES[activeScene];

  return (
    <div 
      ref={scrollRef} 
      style={{ 
        height: `${TOTAL_SCENES * 115}vh`, 
        position: 'relative' 
      }}
    >
      {/* Immersive Fixed Backdrop/Canvas container */}
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          overflow: 'hidden',
          backgroundColor: '#30302f',
        }}
      >
        <canvas 
          ref={canvasRef} 
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            display: 'block'
          }}
        />

        {/* Minimal Border Frame */}
        <div 
          style={{
            position: 'absolute',
            inset: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            pointerEvents: 'none',
            zIndex: 3,
          }}
        />

        {/* Top Header Row / Logo */}
        <header 
          style={{
            position: 'absolute',
            top: '2rem',
            left: '2rem',
            right: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            zIndex: 10,
          }}
        >
          <div className="flex items-center p-4">
            <img 
              src="/vimana-logo.png" 
              alt="Vimana" 
              className="h-10 w-auto opacity-90 object-contain mix-blend-screen"
            />
          </div>
        </header>

        {/* ─── BOTTOM FLOATING METADATA / STORY CARD (Minimal) ─── */}
        <div 
          style={{
            position: 'absolute',
            left: '3rem',
            right: '3rem',
            bottom: '3rem',
            zIndex: 10,
          }}
          className="md:max-w-[28rem] pointer-events-auto transition-all duration-700 font-sans p-4"
        >
          {/* Main Visual Story Card */}
          <div className="bg-transparent border-none p-0">
            {/* Act badge */}
            <div className="flex items-center mb-2">
              <span className="text-[10px] font-mono text-cyan-400/80 tracking-widest uppercase">
                {activeDef.act} / {(SCENE_TEXTS[currentLangRef.current]?.[activeScene] ?? activeDef).navLabel}
              </span>
            </div>

            {/* Main formula title */}
            <h1 
              className="text-white tracking-wide font-medium text-xl md:text-2xl font-display leading-tight mb-2"
              style={{ fontFamily: FONT_PRIMARY }}
            >
              {activeDef.headline}
            </h1>

            {/* Narrative scroll block */}
            <p className="text-gray-400 text-[12px] md:text-sm leading-relaxed tracking-wider mb-4 font-normal max-w-sm">
              {activeDef.body}
            </p>
          </div>
        </div>

        {/* Phase progress visual indicator at bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5 z-20">
          <div 
            className="h-full bg-cyan-400/50 transition-all duration-200"
            style={{ width: `${globalProgress * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── BACKGROUND PLATES / TECHNICAL GRID BACKDROP ─────────────────────────────
function drawTechnicalGrid(ctx: CanvasRenderingContext2D, w: number, h: number, scale: number, progress: number) {
  ctx.save();
  ctx.globalAlpha = 0.05 + Math.sin(progress * Math.PI) * 0.04;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 0.5;

  // Center coordinate lines
  ctx.beginPath();
  ctx.moveTo(0, h / 2);
  ctx.lineTo(w, h / 2);
  ctx.moveTo(w / 2, 0);
  ctx.lineTo(w / 2, h);
  ctx.stroke();

  // Draw concentric alignment ellipses
  ctx.beginPath();
  for (let i = 1; i <= 4; i++) {
    const rx = 140 * i * scale;
    const ry = 140 * i * scale;
    ctx.arc(w / 2, h / 2, rx, 0, Math.PI * 2);
  }
  ctx.stroke();

  // Subtle structural corner crosshairs
  const bracket = 15;
  const padding = 35 * scale;
  ctx.save();
  ctx.globalAlpha = 0.12;
  
  // Top-left
  ctx.beginPath();
  ctx.moveTo(padding, padding + bracket);
  ctx.lineTo(padding, padding);
  ctx.lineTo(padding + bracket, padding);
  // Bottom-right
  ctx.moveTo(w - padding, h - padding - bracket);
  ctx.lineTo(w - padding, h - padding);
  ctx.lineTo(w - padding - bracket, h - padding);
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

// ─── MASTER SCREEN DRAWERS ───────────────────────────────────────────────────
function drawSceneFormula(
  ctx: CanvasRenderingContext2D,
  scene: number,
  progress: number,
  time: number,
  cx: number,
  cy: number,
  scale: number,
  lang: Language = 'en',
) {
  const fontCanvas = `'JetBrains Mono', 'Space Grotesk', sans-serif`;
  const formulaTexts = FORMULA_TEXTS[lang];

  // Helper inside loop: wrapper segment drawing
  const renderFormulaWithGlow = (
    segments: LineSegment[],
    placements: LinePlacement[],
    color: string,
    width = 1,
    textColor = '#f2f0ec',
    glow = false,
    drawLines = true
  ) => {
    ctx.save();
    
    if (drawLines) {
      // Line glow
      if (glow) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 12 * scale;
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.beginPath();
      for (const seg of segments) {
        ctx.moveTo(seg.x1, seg.y1);
        ctx.lineTo(seg.x2, seg.y2);
      }
      ctx.stroke();
    }

    ctx.shadowBlur = 0; // turn off glow for text
    ctx.font = `600 ${Math.max(7, Math.round(11 * scale))}px ${FONT_PRIMARY}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (const p of placements) {
      if (!p.text.trim()) continue;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.scale(p.scale, p.scale);
      ctx.font = `600 ${Math.max(6, Math.round(10 * scale))}px ${FONT_PRIMARY}`;
      ctx.globalAlpha = 0.55 + p.opacity * 0.35;
      ctx.fillStyle = textColor;
      ctx.fillText(p.text, 0, 0);
      ctx.restore();
    }
    ctx.restore();
  };

  switch (scene) {
    // Phase 00: THE VOID (Singularity dot)
    case 0: {
      const pulse = 1.0 + Math.sin(time * 3) * 0.18;
      const glowAmt = 30 + Math.sin(time * 2.5) * 15;
      const radius = 6 * scale * pulse;
      
      ctx.save();
      ctx.translate(cx, cy);
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = glowAmt * scale;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Fine text loop surrounding the dot
      ctx.shadowBlur = 0;
      ctx.font = `500 ${Math.round(8 * scale)}px ${FONT_MONO}`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.textAlign = 'center';
      ctx.fillText(formulaTexts.humCircle.split(' . ').pop() || 'FREQUENCY VOID', 0, -18 * scale);
      ctx.restore();
      break;
    }

    // Phase 01: THE HUM (Expanding circle with single word VIMANA)
    case 1: {
      const radius = lerp(120, 220, progress) * scale;
      const text = formulaTexts.humCircle;
      const result = textCircle(text, { radius }, time);
      if (result.type === 'segments') {
        const placements = layoutTextOnSegments(text, result.segments, 12 * scale, fontCanvas);
        ctx.save();
        ctx.translate(cx, cy);
        renderFormulaWithGlow(result.segments, placements, 'rgba(34, 197, 94, 0.28)', 1, '#ffffff', true);
        ctx.restore();
      }
      break;
    }

    // Phase 02: THE WORD (Multiplying 5 concentric rings)
    case 2: {
      const count = 5;
      ctx.save();
      ctx.translate(cx, cy);
      for (let i = 0; i < count; i++) {
        const r = (90 + i * 42) * scale;
        const speedMultiplier = 1.0 - (i * 0.15);
        const text = formulaTexts.wordRings;
        const result = textCircle(text, { radius: r }, time * speedMultiplier);
        if (result.type === 'segments') {
          const fs = (14 - i * 1.5) * scale;
          const placements = layoutTextOnSegments(text, result.segments, fs, fontCanvas);
          const segmentCol = `rgba(34, 197, 94, ${0.35 - i * 0.05})`;
          renderFormulaWithGlow(result.segments, placements, segmentCol, 0.8, '#f5f5f4', false);
        }
      }
      ctx.restore();
      break;
    }

    // Phase 03: THE FIELD (Cymatic concentric rings with ellipse rotation + orbitals)
    case 3: {
      const rc = 6;
      ctx.save();
      ctx.translate(cx, cy);
      const text = formulaTexts.fieldCymatic;
      
      const result = cymaticRing(text, {
        ringCount: rc,
        waveFreq: 4,
        waveAmp: 0,
        modeRadial: 2
      }, time);

      if (result.type === 'segments') {
        const placements = layoutTextOnSegments(text, result.segments, 10 * scale, fontCanvas);
        renderFormulaWithGlow(result.segments, placements, 'rgba(34, 211, 238, 0.3)', 1.2, '#fafafa', true);
      }

      // Live floating coordinate dots as mathematical particles
      ctx.fillStyle = '#22d3ee';
      for (let i = 0; i < 8; i++) {
        const angle = time * (0.4 + i * 0.15) + i * (Math.PI / 4);
        const dist = (80 + i * 28) * scale;
        const px = Math.cos(angle) * dist;
        const py = Math.sin(angle) * dist;
        ctx.beginPath();
        ctx.arc(px, py, 2.5 * scale, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      break;
    }

    // Phase 04: THE TREE (Fractal branching tree)
    case 4: {
      ctx.save();
      ctx.translate(cx, cy + 80 * scale); // slide trunk down just a bit
      const text = formulaTexts.treeRecursion;
      
      const bCount = Math.round(lerp(4, 8, progress));
      const trDepth = Math.round(lerp(2, 6, progress));
      const trSpread = lerp(45, 80, progress);
      const trLength = lerp(75, 115, progress) * scale;

      const result = fractalTree(text, {
        rootBranches: bCount,
        depth: trDepth,
        angleSpread: trSpread,
        branchLength: trLength,
        lengthDecay: 0.68,
      }, time);

      if (result.type === 'segments') {
        const placements = layoutTextOnSegments(text, result.segments, 9 * scale, fontCanvas);
        renderFormulaWithGlow(result.segments, placements, 'rgba(167, 139, 250, 0.4)', 1.2, '#ffffff', false);
      }
      ctx.restore();
      break;
    }

    // Phase 05: THE BLUEPRINT (DNA Double Helix, architectural blueprints)
    case 5: {
      ctx.save();
      ctx.translate(cx, cy);
      const text = formulaTexts.dnaHelix;
      
      const turns = lerp(2, 7, progress);
      const radius = lerp(50, 95, progress) * scale;
      const height = lerp(220, 480, progress) * scale;
      const basePairs = Math.round(lerp(8, 20, progress));

      const result = dnaHelix(text, {
        turns,
        radius,
        height,
        basePairs
      }, time * 0.8);

      if (result.type === 'segments') {
        const placements = layoutTextOnSegments(text, result.segments, 9 * scale, fontCanvas);
        
        // Helix blueprint lines are Sky Blue, rungs are faint white
        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (const seg of result.segments) {
          if (seg.visualOnly) continue;
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
        }
        ctx.stroke();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        for (const seg of result.segments) {
          if (!seg.visualOnly) continue;
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
        }
        ctx.stroke();

        // Draw texts
        ctx.font = `600 ${Math.max(6, Math.round(9 * scale))}px ${FONT_PRIMARY}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for (const p of placements) {
          if (!p.text.trim()) continue;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.scale(p.scale, p.scale);
          ctx.globalAlpha = 0.55 + p.opacity * 0.35;
          ctx.fillStyle = '#f8fafc';
          ctx.fillText(p.text, 0, 0);
          ctx.restore();
        }
        ctx.restore();
      }
      ctx.restore();
      break;
    }

    // Phase 06: THE SOUP (Slimy Creature undulations in amber gold pool)
    case 6: {
      ctx.save();
      ctx.translate(cx, cy - 80 * scale); // adjusted centering
      const text = formulaTexts.faunaCreature;
      
      const pathCount = Math.round(lerp(2, 9, progress));
      const spacingValue = lerp(16, 38, progress) * scale;
      const rangeValue = lerp(300, 550, progress) * scale;
      const amplitudeValue = lerp(3.2, 0.4, progress);

      const result = slimycreature(text, {
        pathCount,
        resolution: 50,
        spacing: spacingValue,
        yRange: rangeValue,
        amplitude: amplitudeValue,
      }, time);

      if (result.type === 'segments') {
        const placements = layoutTextOnSegments(text, result.segments, 9 * scale, fontCanvas);
        renderFormulaWithGlow(result.segments, placements, 'rgba(245, 158, 11, 0.35)', 1.2, '#fef3c7', true, false);
      }
      ctx.restore();
      break;
    }

    // Phase 07: THE GARDEN (Fern Growing taller + Mathematical Golden Ratio Orbit)
    case 7: {
      // 1. Fractal Fern from the bottom
      ctx.save();
      ctx.translate(cx, cy + 120 * scale); // centered somewhat
      const fernText = formulaTexts.floraFern;
      const fLength = lerp(60, 160, progress) * scale;
      const fFronds = Math.round(lerp(2, 8, progress));
      const fDepth = Math.round(lerp(2, 5, progress));

      const fernResult = fractalFern(fernText, {
        stemLength: fLength,
        frondPairs: fFronds,
        depth: fDepth,
        angleSpread: 0.45,
        lengthDecay: 0.72,
      }, time);

      if (fernResult.type === 'segments') {
        const placements = layoutTextOnSegments(fernText, fernResult.segments, 8 * scale, fontCanvas);
        renderFormulaWithGlow(fernResult.segments, placements, 'rgba(16, 185, 129, 0.38)', 1, '#ecfdf5', false);
      }
      ctx.restore();

      // 2. Cosmic Golden Ratio Spiral floating in center right
      ctx.save();
      ctx.translate(cx, cy - 80 * scale); // slightly offset above fern
      const spiralText = formulaTexts.floraSpiral;
      const turns = lerp(1.5, 5, progress);
      const rate = lerp(0.12, 0.22, progress);

      const spiralResult = goldenSpiral(spiralText, {
        turns,
        growthRate: rate,
      }, time);

      if (spiralResult.type === 'segments') {
        const placements = layoutTextOnSegments(spiralText, spiralResult.segments, 9 * scale, fontCanvas);
        renderFormulaWithGlow(spiralResult.segments, placements, 'rgba(234, 179, 8, 0.28)', 1, '#fef9c3', true);
      }
      ctx.restore();
      break;
    }

    // Phase 08: THE HIVE (Hexagonal hives above + Deep plum mycelium roots beneath)
    case 8: {
      // 1. Above center Hive Hex Lattice (Honey color)
      ctx.save();
      ctx.translate(cx, cy - 100 * scale);
      const hexText = formulaTexts.floraHex;
      const iterations = Math.round(lerp(2, 4, progress));
      const hSize = lerp(110, 240, progress) * scale;

      const hexResult = hexagonalFractal(hexText, {
        iterations,
        size: hSize,
      }, time);

      if (hexResult.type === 'segments') {
        const placements = layoutTextOnSegments(hexText, hexResult.segments, 8.5 * scale, fontCanvas);
        renderFormulaWithGlow(hexResult.segments, placements, 'rgba(217, 119, 6, 0.35)', 1, '#fef3c7', true);
      }
      ctx.restore();

      // 2. Mycelium branch network downward from hive base
      ctx.save();
      ctx.translate(cx, cy + 120 * scale);
      const rootText = formulaTexts.floraMycelium;
      const rootLen = lerp(60, 140, progress) * scale;
      const rootBranches = Math.round(lerp(3, 8, progress));
      const rDepth = Math.round(lerp(2, 5, progress));

      const rootsResult = dendriticCrystal(rootText, {
        seedLength: rootLen,
        branches: rootBranches,
        depth: rDepth,
        angleSpread: 0.58,
        lengthDecay: 0.72,
        symmetry: 4,
      }, time);

      if (rootsResult.type === 'segments') {
        const placements = layoutTextOnSegments(rootText, rootsResult.segments, 8 * scale, fontCanvas);
        renderFormulaWithGlow(rootsResult.segments, placements, 'rgba(162, 28, 175, 0.32)', 1, '#fdf4ff', false);
      }
      ctx.restore();
      break;
    }

    // Phase 09: THE SWARM (Chaotic butterflies & Flocking birds wave)
    case 9: {
      // 1. Butterfly attractors (chaotic flight paths)
      ctx.save();
      ctx.translate(cx, cy - 60 * scale);
      const flyText = formulaTexts.faunaButterfly;
      const rings = Math.round(lerp(1, 4, progress));
      const spacing = lerp(6, 11, progress);

      const flyResult = butterflys(flyText, {
        concentricRings: rings,
        ringSpacing: spacing,
        animationSpeed: 18,
        disableDepth: 1,
      }, time);

      if (flyResult.type === 'segments') {
        const placements = layoutTextOnSegments(flyText, flyResult.segments, 8.5 * scale, fontCanvas);
        renderFormulaWithGlow(flyResult.segments, placements, 'rgba(168, 85, 247, 0.35)', 1.2, '#faf5ff', true, false);
      }
      ctx.restore();

      // 2. Symmetric Ripple Flocking Wave
      ctx.save();
      ctx.translate(cx, cy + 120 * scale);
      const waveText = formulaTexts.faunaWave;
      const waveSpeed = lerp(12, 42, progress);
      const offsetVal = lerp(8, 22, progress);

      const waveResult = symmetryWave(waveText, {
        animationSpeed: waveSpeed,
        ringOffset: offsetVal,
      }, time);

      if (waveResult.type === 'segments') {
        const placements = layoutTextOnSegments(waveText, waveResult.segments, 8.5 * scale, fontCanvas);
        renderFormulaWithGlow(waveResult.segments, placements, 'rgba(6, 182, 212, 0.32)', 1, '#ecfeff', false, false);
      }
      ctx.restore();
      break;
    }

    // Phase 10: THE NETWORK (Sentient L-System global synaptic branch snap)
    case 10: {
      ctx.save();
      ctx.translate(cx, cy + 100 * scale); // base centered
      const netText = formulaTexts.networkNeural;
      
      const angle = lerp(16, 32, progress);
      const step = lerp(5, 9, progress) * scale;
      const iter = Math.round(lerp(2, 5, progress));

      const result = lSystemTree(netText, {
        angle,
        stepLength: step,
        iterations: iter,
        startAngle: 90,
      }, time);

      if (result.type === 'segments') {
        const placements = layoutTextOnSegments(netText, result.segments, 8 * scale, fontCanvas);
        // Deep glowing lavender mesh
        renderFormulaWithGlow(result.segments, placements, 'rgba(129, 140, 248, 0.42)', 1.4, '#ffffff', true);
      }

      // If at peak completion, simulate synaptic light sparks shooting outward!
      if (progress > 0.88) {
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#6366f1';
        ctx.shadowBlur = 18 * scale;
        for (let i = 0; i < 15; i++) {
          const sparkAngle = Math.random() * Math.PI * 2;
          const sparkDist = (50 + Math.random() * 220) * scale;
          const px = Math.cos(sparkAngle) * sparkDist;
          const py = -180 * scale + Math.sin(sparkAngle) * sparkDist;
          ctx.beginPath();
          ctx.arc(px, py, (2 + Math.random() * 3.5) * scale, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
      break;
    }

    default:
      break;
  }
}

// ─── Minimal decorative logo vector image placeholder ───
function VimanaMark({ isVoid }: { isVoid: boolean }) {
  return (
    <div className="flex items-center select-none font-display font-bold tracking-[0.4em] text-white">
      ✦
    </div>
  );
}

export default ConnectedNarrative;
