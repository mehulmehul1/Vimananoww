import React, { useEffect, useRef } from 'react';
import { cymaticRing, type LineSegment } from '../pretext-editor/formulas/index';
import { prepareWithSegments, layoutNextLine, type LayoutCursor } from '@chenglou/pretext';
import { LayoutMetadata } from './LayoutMetadata';

const FONT_DISPLAY = `'Jacquarda Bastarda 9', serif`;
const FONT_PRIMARY = `'Space Grotesk', 'Arial Narrow', sans-serif`;

interface LinePlacement {
  text: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  opacity: number;
}

function layoutTextOnSegmentsRich(text: string, segments: LineSegment[], fontSize: number, fontFamily: string): LinePlacement[] {
  if (!text.trim() || segments.length === 0) return [];
  const font = `600 ${fontSize}px ${fontFamily}`;
  const prepared = prepareWithSegments(text, font);
  const placements: LinePlacement[] = [];
  let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };
  
  const indexed = segments.map((seg, i) => ({ seg, index: i }));
  const sorted = indexed.sort((a, b) => {
    const midA = (a.seg.y1 + a.seg.y2) / 2;
    const midB = (b.seg.y1 + b.seg.y2) / 2;
    if (Math.abs(midA - midB) > 20) return midA - midB;
    return (a.seg.x1 + a.seg.x2) / 2 - (b.seg.x1 + b.seg.x2) / 2;
  });
  
  for (const { seg, index } of sorted) {
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
    cursor = line.end;
  }
  return placements;
}

export function Layout4Ring() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let animationId = 0;
    
    const TEXT = 'VIMANA pure frequency to environmental manifestation absolute black vacuum silence';
    
    const render = () => {
      const t = timeRef.current;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const dpr = window.devicePixelRatio || 1;
      
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      
      // Clean white background
      ctx.fillStyle = '#f2f0ec';
      ctx.fillRect(0, 0, w, h);
      
      const result = cymaticRing(TEXT, { ringCount: 14, waveAmp: 55, waveFreq: 2 }, t);
      
      if (result.type === 'segments') {
        const placements = layoutTextOnSegmentsRich(TEXT, result.segments, 22, FONT_DISPLAY);
        
        // Move to left third - asymmetric tension
        const centerX = w * 0.35; 
        const centerY = h * 0.45;
        
        ctx.save();
        ctx.translate(centerX, centerY);
        
        // Burnt umber ring segments - subtle
        ctx.strokeStyle = `rgba(139, 69, 50, 0.08)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (const seg of result.segments) {
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
        }
        ctx.stroke();
        
        // Text with depth-based rendering
        for (const p of placements) {
          if (!p.text.trim()) continue;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.scale(p.scale, p.scale);
          ctx.font = `600 22px ${FONT_DISPLAY}`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = '#1a1a1a';
          ctx.fillText(p.text, 0, 0);
          ctx.restore();
        }
        
        ctx.restore();
      }
      
      timeRef.current += 0.016;
      animationId = requestAnimationFrame(render);
    };
    
    render();
    return () => cancelAnimationFrame(animationId);
  }, []);
  
  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      fontFamily: FONT_PRIMARY,
      backgroundColor: '#f2f0ec',
    }}>
      <LayoutMetadata 
        phase={3} 
        frequency="variable" 
        layoutId={4} 
        totalLayouts={6} 
        time="00:08:45" 
        cursor="512, 384"
      />

      {/* CHINESE EDITORIAL: Right side vertical composition */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 80,
        height: '100%',
        width: '280px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingRight: 60,
        zIndex: 10,
      }}>
        {/* Massive vertical title */}
        <div style={{
          writingMode: 'vertical-rl',
          fontSize: '72px',
          fontWeight: 300,
          letterSpacing: '0.15em',
          color: '#0a0a0a',
          height: '420px',
          marginBottom: 40,
          fontFamily: FONT_DISPLAY,
        }}>
          RESONANCE
        </div>
        
        {/* Horizontal divider - strong design element */}
        <div style={{
          width: '180px',
          height: '1px',
          background: '#0a0a0a',
          marginBottom: 32,
        }} />
        
        {/* Body text - vertical */}
        <div style={{
          writingMode: 'vertical-rl',
          fontSize: '13px',
          lineHeight: '2',
          color: '#666',
          height: '320px',
          letterSpacing: '0.02em',
        }}>
          Cymatic resonance mapping the interaction between sound frequency and physical matter. A linguistic torus where text orbits a central void.
        </div>
        
        {/* Technical specs - horizontal at bottom */}
        <div style={{
          marginTop: 40,
          display: 'flex',
          gap: 24,
          alignItems: 'center',
        }}>
          <div style={{
            width: 40,
            height: '1px',
            background: '#0a0a0a',
          }} />
          <span style={{
            fontSize: '10px',
            letterSpacing: '0.2em',
            color: '#999',
            textTransform: 'uppercase',
          }}>
            Phase 3.0 — 136.1Hz
          </span>
        </div>
      </div>

      {/* Left corner accent - vertical line */}
      <div style={{
        position: 'absolute',
        left: 40,
        top: '50%',
        transform: 'translateY(-50%)',
        width: '1px',
        height: '300px',
        background: 'linear-gradient(to bottom, transparent, #0a0a0a, transparent)',
      }} />

      {/* Bottom left: small utilitarian text */}
      <div style={{
        position: 'absolute',
        bottom: 40,
        left: 40,
        zIndex: 10,
      }}>
        <div style={{
          fontSize: '9px',
          letterSpacing: '0.15em',
          color: '#ccc',
          textTransform: 'uppercase',
          marginBottom: 8,
        }}>
          cymaticRing / ringCount: 14 / waveAmp: 55
        </div>
        <div style={{
          fontSize: '9px',
          letterSpacing: '0.15em',
          color: '#ccc',
          textTransform: 'uppercase',
        }}>
          Frequency — Variable
        </div>
      </div>

      {/* Top right corner - geometric accent */}
      <div style={{
        position: 'absolute',
        top: 40,
        right: 40,
        width: 60,
        height: 60,
        borderRight: '1px solid #ddd',
        borderTop: '1px solid #ddd',
      }} />

      <canvas 
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      />
    </div>
  );
}