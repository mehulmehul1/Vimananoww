import React, { useEffect, useRef, useState } from 'react';
import { goldenSpiral, type LineSegment } from '../pretext-editor/formulas/index';
import { prepareWithSegments, layoutNextLine, type LayoutCursor } from '@chenglou/pretext';
import { LayoutMetadata } from './LayoutMetadata';

const FONT_DISPLAY = `'Jacquarda Bastarda 9', serif`;
const FONT_MONO = `'DM Mono', 'Courier New', monospace`;
const FONT_PRIMARY = `'Space Grotesk', 'Arial Narrow', sans-serif`;
const FONT_BODY = `'Inter', sans-serif`;

interface LinePlacement {
  text: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  opacity: number;
}

function layoutTextOnSpiral(text: string, segments: LineSegment[], fontSize: number, fontFamily: string): LinePlacement[] {
  if (!text.trim() || segments.length === 0) return [];
  const font = `600 ${fontSize}px ${fontFamily}`;
  const prepared = prepareWithSegments(text, font);
  const placements: LinePlacement[] = [];
  let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };
  
  for (const seg of segments) {
    if (seg.visualOnly) continue;
    const depthScale = Math.max(0.3, 1.0 - seg.depth * 0.08);
    if (seg.length < fontSize * depthScale * 0.4) continue;
    
    const line = layoutNextLine(prepared, cursor, seg.length * 0.85 / depthScale);
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
      opacity: 0.5 + depthScale * 0.5,
    });
    cursor = line.end;
  }
  return placements;
}

export function Layout7Atmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let animationId = 0;
    
    const TEXT = 'VIMANA atmosphere emerges from frequency boundary shifting gradual horizon minimal transition';
    
    const render = () => {
      const t = timeRef.current;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const dpr = window.devicePixelRatio || 1;
      
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      
      // Light background (Fuser canvas)
      ctx.fillStyle = '#f5f5f5';
      ctx.fillRect(0, 0, w, h);
      
      // Subtle grid (Fuser pattern)
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      
      // Golden spiral (subtle)
      const result = goldenSpiral(TEXT, { turns: 6, growthRate: 0.15 }, t);
      
      if (result.type === 'segments') {
        const placements = layoutTextOnSpiral(TEXT, result.segments, 12, FONT_DISPLAY);
        
        const centerX = w * 0.5;
        const centerY = h * 0.5;
        
        ctx.save();
        ctx.translate(centerX, centerY);
        
        ctx.strokeStyle = 'rgba(67, 45, 215, 0.04)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        for (const seg of result.segments) {
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
        }
        ctx.stroke();
        
        for (const p of placements) {
          if (!p.text.trim()) continue;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.scale(p.scale, p.scale);
          ctx.font = `600 12px ${FONT_DISPLAY}`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.globalAlpha = p.opacity * 0.6;
          ctx.fillStyle = '#0a0a0a';
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
      backgroundColor: '#f5f5f5',
    }}>
      <LayoutMetadata 
        phase={5} 
        frequency="variable" 
        layoutId={7} 
        totalLayouts={7} 
        time="00:14:20" 
        cursor="512, 384"
      />

      {/* === TITLE === */}
      <div style={{
        position: 'absolute',
        top: 60,
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        zIndex: 10,
      }}>
        <div style={{
          fontFamily: FONT_MONO,
          fontSize: '11px',
          color: '#737373',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          marginBottom: '8px',
        }}>
          Component Library
        </div>
        <div style={{
          fontFamily: FONT_DISPLAY,
          fontSize: '36px',
          color: '#0a0a0a',
          letterSpacing: '-0.02em',
        }}>
          Monologue vs Fuser
        </div>
        <div style={{
          fontFamily: FONT_BODY,
          fontSize: '14px',
          color: '#525252',
          marginTop: '8px',
          maxWidth: '500px',
        }}>
          Two distinct visual languages — dark terminal depth vs. translucent layering
        </div>
      </div>

      {/* === LEFT: MONOLOGUE — Dark Terminal === */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '8%',
        transform: 'translateY(-50%)',
        width: '400px',
        zIndex: 10,
      }}>
        {/* Section header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '24px',
        }}>
          <div style={{ width: '32px', height: '1px', background: '#19d0e8' }} />
          <div>
            <div style={{
              fontFamily: FONT_MONO,
              fontSize: '12px',
              color: '#19d0e8',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}>
              Monologue
            </div>
            <div style={{
              fontFamily: FONT_BODY,
              fontSize: '11px',
              color: '#7f7f7f',
              marginTop: '2px',
            }}>
              Midnight Terminal with Aqua Glow
            </div>
          </div>
        </div>

        {/* Deep Surface Card — Base layer */}
        <div style={{
          background: '#010101',
          borderRadius: '10px',
          padding: '24px',
          marginBottom: '20px',
          boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.8)',
        }}>
          <div style={{
            fontFamily: FONT_MONO,
            fontSize: '10px',
            color: '#7f7f7f',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}>
            Base Surface — #010101
          </div>
          
          {/* Terminal Input */}
          <input 
            type="text"
            defaultValue="136.1 Hz"
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
              padding: '14px 0',
              color: '#ffffff',
              fontFamily: FONT_MONO,
              fontSize: '18px',
              outline: 'none',
            }}
          />
          
          {/* Inner shadow detail */}
          <div style={{
            marginTop: '16px',
            fontFamily: FONT_MONO,
            fontSize: '10px',
            color: '#3f3f3f',
            letterSpacing: '0.1em',
          }}>
            frequency_input_01
          </div>
        </div>

        {/* Interactive Surface Card */}
        <div style={{
          background: '#191919',
          borderRadius: '10px',
          padding: '24px',
          marginBottom: '20px',
          boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(0, 0, 0, 0.3)',
        }}>
          <div style={{
            fontFamily: FONT_MONO,
            fontSize: '10px',
            color: '#7f7f7f',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}>
            Interactive Surface — #191919
          </div>
          
          {/* Ghost button with hover */}
          <button style={{
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '100000px',
            padding: '12px 24px',
            color: 'rgba(255, 255, 255, 0.6)',
            fontFamily: FONT_MONO,
            fontSize: '12px',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '12px',
            display: 'block',
            width: '100%',
          }}>
            Ghost Button
          </button>
          
          {/* Filled button with aqua */}
          <button style={{
            background: '#282828',
            border: '1px solid #19d0e8',
            borderRadius: '100000px',
            padding: '12px 24px',
            color: '#19d0e8',
            fontFamily: FONT_MONO,
            fontSize: '12px',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            display: 'block',
            width: '100%',
            boxShadow: 'inset 0 0 15px rgba(25, 208, 232, 0.1)',
          }}>
            Primary Action
          </button>
        </div>

        {/* Code block with accent */}
        <div style={{
          background: 'rgba(25, 208, 232, 0.06)',
          border: '1px solid rgba(25, 208, 232, 0.15)',
          borderRadius: '8px',
          padding: '20px',
          fontFamily: FONT_MONO,
          fontSize: '11px',
          color: '#19d0e8',
          lineHeight: '1.8',
        }}>
          <div style={{ color: 'rgba(25, 208, 232, 0.4)', marginBottom: '8px' }}>{'>'} init.system()</div>
          <div><span style={{ color: 'rgba(25, 208, 232, 0.5)' }}>//</span> surface: #010101</div>
          <div><span style={{ color: 'rgba(25, 208, 232, 0.5)' }}>//</span> accent: #19d0e8</div>
          <div><span style={{ color: 'rgba(25, 208, 232, 0.5)' }}>//</span> depth: inner-shadow</div>
          <div style={{ marginTop: '12px', color: '#19d0e8' }}>✓ terminal ready</div>
        </div>
      </div>

      {/* === RIGHT: FUSER — Translucent Layering === */}
      <div style={{
        position: 'absolute',
        top: '50%',
        right: '8%',
        transform: 'translateY(-50%)',
        width: '400px',
        zIndex: 10,
      }}>
        {/* Section header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '24px',
        }}>
          <div style={{ width: '32px', height: '1px', background: '#432dd7' }} />
          <div>
            <div style={{
              fontFamily: FONT_MONO,
              fontSize: '12px',
              color: '#432dd7',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}>
              Fuser
            </div>
            <div style={{
              fontFamily: FONT_BODY,
              fontSize: '11px',
              color: '#737373',
              marginTop: '2px',
            }}>
              Frosted Glass Network
            </div>
          </div>
        </div>

        {/* Canvas surface */}
        <div style={{
          background: '#f5f5f5',
          borderRadius: '6px',
          padding: '24px',
          marginBottom: '20px',
        }}>
          <div style={{
            fontFamily: FONT_MONO,
            fontSize: '10px',
            color: '#737373',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}>
            Canvas — #f5f5f5
          </div>
          
          {/* Prominent input */}
          <input 
            type="text"
            defaultValue="136.1 Hz"
            style={{
              width: '100%',
              background: 'transparent',
              border: '1px solid #262626',
              borderRadius: '6px',
              padding: '14px',
              color: '#262626',
              fontFamily: FONT_BODY,
              fontSize: '16px',
              outline: 'none',
            }}
          />
        </div>

        {/* Fog surface (elevated) */}
        <div style={{
          background: '#e5e5e5',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '20px',
          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px',
        }}>
          <div style={{
            fontFamily: FONT_MONO,
            fontSize: '10px',
            color: '#525252',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}>
            Fog Surface — #e5e5e5
          </div>
          
          {/* Filled button */}
          <button style={{
            background: '#d7defd',
            border: 'none',
            borderRadius: '9999px',
            padding: '12px 24px',
            color: '#000000',
            fontFamily: FONT_BODY,
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '12px',
            display: 'block',
            width: '100%',
          }}>
            Filled Button
          </button>
          
          {/* Outline button */}
          <button style={{
            background: 'transparent',
            border: '1px solid #a6a5fe',
            borderRadius: '6px',
            padding: '12px 24px',
            color: '#312c85',
            fontFamily: FONT_BODY,
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            display: 'block',
            width: '100%',
          }}>
            Outline Accent
          </button>
        </div>

        {/* Paper White surface (highest) */}
        <div style={{
          background: '#fafafa',
          borderRadius: '24px',
          padding: '20px',
          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px',
        }}>
          <div style={{
            fontFamily: FONT_MONO,
            fontSize: '10px',
            color: '#737373',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}>
            Paper White — #fafafa
          </div>
          <div style={{
            fontFamily: FONT_BODY,
            fontSize: '16px',
            fontWeight: '500',
            color: '#0a0a0a',
            marginBottom: '4px',
          }}>
            Elevated Card
          </div>
          <div style={{
            fontFamily: FONT_BODY,
            fontSize: '13px',
            color: '#525252',
          }}>
            Soft shadow creates layered depth
          </div>
          
          {/* Tag */}
          <div style={{
            display: 'inline-block',
            background: '#00c950',
            borderRadius: '24px',
            padding: '4px 12px',
            fontFamily: FONT_BODY,
            fontSize: '11px',
            color: '#ffffff',
            marginTop: '12px',
          }}>
            Active
          </div>
        </div>
      </div>

      {/* === CENTER DIVIDER === */}
      <div style={{
        position: 'absolute',
        top: '18%',
        bottom: '10%',
        left: '50%',
        width: '1px',
        background: 'linear-gradient(to bottom, transparent, #e5e5e5 10%, #e5e5e5 90%, transparent)',
        zIndex: 5,
      }} />

      {/* === BOTTOM: KEY DIFFERENCES === */}
      <div style={{
        position: 'absolute',
        bottom: 60,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '80px',
        zIndex: 10,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: FONT_MONO,
            fontSize: '10px',
            color: '#19d0e8',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}>
            Monologue Approach
          </div>
          <div style={{
            fontFamily: FONT_BODY,
            fontSize: '12px',
            color: '#7f7f7f',
            maxWidth: '200px',
          }}>
            Depth through dark layers + inner shadows + aqua "switched on" glow
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: FONT_MONO,
            fontSize: '10px',
            color: '#432dd7',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}>
            Fuser Approach
          </div>
          <div style={{
            fontFamily: FONT_BODY,
            fontSize: '12px',
            color: '#7f7f7f',
            maxWidth: '200px',
          }}>
            Layering through light translucent surfaces + soft shadows + violet accent
          </div>
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
          opacity: 0.4,
        }}
      />
    </div>
  );
}