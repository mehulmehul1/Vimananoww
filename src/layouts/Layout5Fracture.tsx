import React, { useEffect, useRef } from 'react';
import { fractalTree } from '../pretext-editor/formulas/index';
import { layoutTextOnSegments } from '../pretext-utils';
import { LayoutMetadata } from './LayoutMetadata';

const FONT_FAMILY = `'Space Grotesk', 'Arial Narrow', sans-serif`;
const FONT_DISPLAY = `'Jacquarda Bastarda 9', serif`;

export function Layout5Fracture() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let animationId = 0;
    
    const TEXT = 'VIMANA fractal branches split into fragments into primordial letters each character a vessel carrying the weight of unspoken worlds';
    
    const render = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const dpr = window.devicePixelRatio || 1;
      
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      
      // Deep charcoal background
      ctx.fillStyle = '#0d0d0d';
      ctx.fillRect(0, 0, w, h);
      
      const time = timeRef.current;
      const result = fractalTree(TEXT, { rootBranches: 4, depth: 7, angleSpread: 45, branchLength: 100, lengthDecay: 0.7 }, time);
      
      if (result.type === 'segments') {
        const mapping = layoutTextOnSegments(TEXT, result.segments, 14, FONT_DISPLAY);
        const placements = mapping.placements;
        
        // Move to left side - more asymmetric
        const offsetX = w * 0.28;
        const offsetY = h * 0.55;
        
        // Subtle skeleton in warm amber
        ctx.strokeStyle = 'rgba(220, 149, 64, 0.06)'; 
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        for (const seg of result.segments) {
          ctx.moveTo(offsetX + seg.x1, offsetY + seg.y1);
          ctx.lineTo(offsetX + seg.x2, offsetY + seg.y2);
        }
        ctx.stroke();
        
        // Golden amber text with depth
        for (const p of placements) {
          if (!p.text.trim()) continue;
          ctx.save();
          ctx.translate(offsetX + p.x, offsetY + p.y);
          ctx.rotate(p.rotation);
          ctx.scale(p.scale, p.scale);
          ctx.font = `600 ${14}px ${FONT_DISPLAY}`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = '#c4923d';
          ctx.fillText(p.text, 0, 0);
          ctx.restore();
        }
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
      fontFamily: FONT_FAMILY,
      backgroundColor: '#0d0d0d',
    }}>
      <LayoutMetadata 
        phase={4} 
        frequency="variable" 
        layoutId={5} 
        totalLayouts={6} 
        time="00:08:45" 
        cursor="512, 384"
      />

      {/* CHINESE EDITORIAL LAYOUT - Left side vertical composition */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 80,
        height: '100%',
        width: '260px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingLeft: 60,
        zIndex: 10,
      }}>
        {/* Small label - horizontal */}
        <div style={{
          fontSize: '9px',
          letterSpacing: '0.25em',
          color: '#666',
          textTransform: 'uppercase',
          marginBottom: 16,
        }}>
          Phase 04
        </div>
        
        {/* Vertical title - massive */}
        <div style={{
          writingMode: 'vertical-rl',
          fontSize: '84px',
          fontWeight: 300,
          letterSpacing: '0.08em',
          color: '#fff',
          height: '380px',
          marginBottom: 48,
          fontFamily: FONT_DISPLAY,
        }}>
          FRACTURE
        </div>
        
        {/* Horizontal rule */}
        <div style={{
          width: '120px',
          height: '1px',
          background: 'linear-gradient(to right, #c4923d, transparent)',
          marginBottom: 24,
        }} />
        
        {/* Body text - vertical */}
        <div style={{
          writingMode: 'vertical-rl',
          fontSize: '12px',
          lineHeight: '2.2',
          color: 'rgba(255,255,255,0.5)',
          height: '280px',
          letterSpacing: '0.03em',
        }}>
          Recursive subdivision of linguistic structures. Information entropy mapped as biological growth patterns.
        </div>
        
        {/* Technical code block - horizontal at bottom */}
        <div style={{
          marginTop: 48,
          padding: '16px 20px',
          background: 'rgba(255,255,255,0.03)',
          borderLeft: '2px solid #c4923d',
        }}>
          <div style={{
            fontSize: '10px',
            color: '#888',
            fontFamily: 'monospace',
            lineHeight: '1.8',
            letterSpacing: '0.05em',
          }}>
            rootBranches: 4<br/>
            depth: 7<br/>
            decay: 0.7<br/>
            <span style={{ color: '#c4923d' }}>state: unstable</span>
          </div>
        </div>
      </div>

      {/* Right side - geometric accents */}
      <div style={{
        position: 'absolute',
        right: 60,
        top: '30%',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        zIndex: 10,
      }}>
        <div style={{
          width: 80,
          height: '1px',
          background: '#333',
        }} />
        <div style={{
          width: 60,
          height: '1px',
          background: '#333',
        }} />
        <div style={{
          width: 40,
          height: '1px',
          background: '#333',
        }} />
      </div>

      {/* Top left accent */}
      <div style={{
        position: 'absolute',
        top: 40,
        left: 40,
        width: 40,
        height: 40,
        borderLeft: '1px solid #333',
        borderTop: '1px solid #333',
      }} />

      {/* Bottom right utilitarian */}
      <div style={{
        position: 'absolute',
        bottom: 40,
        right: 40,
        textAlign: 'right',
        zIndex: 10,
      }}>
        <div style={{
          fontSize: '9px',
          letterSpacing: '0.15em',
          color: '#444',
          textTransform: 'uppercase',
          marginBottom: 6,
        }}>
          fractalTree / depth: 7
        </div>
        <div style={{
          fontSize: '9px',
          letterSpacing: '0.15em',
          color: '#444',
          textTransform: 'uppercase',
        }}>
          Recursive — Unstable
        </div>
      </div>

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