import React, { useEffect, useRef, useState } from 'react';
import { LayoutMetadata } from './LayoutMetadata';

const PROSE = `pure frequency to environmental manifestation. absolute black vacuum silence prevails. a single microscopic white dot appears in the void. high-frequency visual hum resonates through space. crystallizes into a word that breathes and pulses. fundamental strings of the universe vibrate endlessly. a storm of language descending from the heavens above. torrential immersive environment envelops all consciousness. liquid typography pool reflects the storm-lit sky. deep sea of rainy text gathers below the surface. nebulas of prose drifting through the endless void. typographic explosions illuminate the surrounding darkness. the architecture of meaning dissolves into primordial letters. each character a vessel carrying the weight of unspoken worlds. language becomes weather and weather becomes pure knowledge. from the first vibration emerged syllables of understanding. consciousness written in the rain falling through infinite space. the ocean floor where all text settles and dreams of new meaning. words accumulate in layers of thought forming new continents.`;

const FONT_SPEC = `14px 'Space Grotesk', sans-serif`;

interface CloudWord { id: string; text: string; ox: number; oy: number; pulseObj: number; }
interface Cloud { cx: number; cy: number; words: CloudWord[]; rx: number; ry: number; centerPhase: number; }
interface RainDrop { id: string; text: string; x: number; y: number; vx: number; vy: number; }
interface Particle { id: number; char: string; x: number; y: number; vx: number; vy: number; }
interface LightningNode { x: number; y: number; char: string; }

export function Layout6Environment() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const lightningRef = useRef<LightningNode[]>([]);
  const stateRef = useRef({ t: 0, nextId: 0, lightningTicks: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true })!;
    let animationId = 0;
    
    const clouds: Array<Cloud> = [];
    const rain: Array<RainDrop> = [];
    const particles: Array<Particle> = [];
    
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const w = window.innerWidth;
    const proseString = PROSE.split(/\s+/).filter(w => w.length > 0);

    if (clouds.length === 0) {
      const CLOUD_COUNT = 6;
      for (let s = 0; s < CLOUD_COUNT; s++) {
        const rx = (w / CLOUD_COUNT) * 1.5;
        const cloudStr = proseString.slice(s * 15, s * 15 + 40).join(' ');
        const words: CloudWord[] = [];
        let currX = -100;
        cloudStr.split(' ').forEach((wd, wi) => {
          const wdWidth = ctx.measureText(wd).width || (wd.length * 8);
          words.push({ id: `c${s}l${wi}`, text: wd, ox: currX + wdWidth / 2, oy: 0, pulseObj: 1.0 });
          currX += wdWidth + 8;
        });
        clouds.push({ cx: (s * (w / CLOUD_COUNT)) + (w / CLOUD_COUNT) / 2, cy: 120 + Math.random() * 40, words, rx, ry: 60, centerPhase: Math.random() * 10 });
      }
    }

    const UMBRELLA_RADIUS = 40;
    const SPATIAL_CELL = 12;

    const render = () => {
      const currentW = canvas.offsetWidth;
      const currentH = canvas.offsetHeight;
      const t = stateRef.current.t;
      
      // BACKGROUND: Refero Sky Gradient (Cosmic Teal to Pale Dawn)
      const bgGrad = ctx.createLinearGradient(0, 0, 0, currentH);
      bgGrad.addColorStop(0, '#0d1a1a'); // Deep Cosmic Teal
      bgGrad.addColorStop(0.4, '#1a2a3a'); // Muted Teal
      bgGrad.addColorStop(1, '#d4e5f0'); // Pale Dawn
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, currentW, currentH);
      
      ctx.font = FONT_SPEC;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      
      if (stateRef.current.lightningTicks > 0) {
        ctx.fillStyle = `rgba(255, 255, 255, ${stateRef.current.lightningTicks === 4 ? 0.15 : 0.01})`;
        ctx.fillRect(0, 0, currentW, currentH);
        ctx.shadowBlur = 20;
        ctx.shadowColor = `rgba(255, 255, 255, 1.0)`;
        ctx.fillStyle = '#000000';
        ctx.font = `bold 16px 'Space Grotesk', sans-serif`;
        lightningRef.current.forEach(node => {
          ctx.fillText(node.char, node.x, node.y);
        });
        stateRef.current.lightningTicks--;
        ctx.font = FONT_SPEC;
      }

      ctx.shadowBlur = 8;
      ctx.shadowColor = `rgba(0, 0, 0, 0.2)`;
      clouds.forEach(c => {
        const dx = Math.sin(t * 0.5 + c.centerPhase) * 20;
        const dy = Math.cos(t * 0.6 + c.centerPhase) * 10;
        c.words.forEach(w => {
          if (w.pulseObj < 1.0) w.pulseObj += 0.01;
          ctx.fillStyle = `rgba(0, 0, 0, ${Math.max(0.2, w.pulseObj)})`;
          ctx.fillText(w.text, c.cx + dx + w.ox, c.cy + dy + w.oy);
        });
        if (Math.random() < 0.25) {
          const randomWord = c.words[Math.floor(Math.random() * c.words.length)];
          randomWord.pulseObj = 0.3;
          rain.push({ id: Math.random().toString(), text: randomWord.text, x: c.cx + dx + randomWord.ox, y: c.cy + dy + randomWord.oy, vx: 0, vy: 4 + Math.random() * 4 });
        }
      });

      ctx.shadowBlur = 4;
      ctx.shadowColor = `rgba(0, 0, 0, 0.3)`;
      const globalWind = Math.sin(t * 0.8) * 1.5;
      for (let i = rain.length - 1; i >= 0; i--) {
        const r = rain[i];
        r.vy += 0.4;
        const windDrift = globalWind + Math.sin(r.y * 0.01 + t * 2) * 1.0;
        r.vx += (windDrift - r.vx) * 0.1;
        r.x += r.vx;
        r.y += r.vy;
        const umbDx = r.x - mousePos.x;
        const umbDy = r.y - mousePos.y;
        const umbDist = Math.sqrt(umbDx * umbDx + umbDy * umbDy);
        if (umbDist < UMBRELLA_RADIUS && r.y < mousePos.y + 40) {
          const force = (UMBRELLA_RADIUS - umbDist) * 0.25;
          r.vx += (umbDx / umbDist) * force;
        }
        const charSpacing = 14;
        const trailLength = r.text.length;
        for (let j = 0; j < trailLength; j++) {
          const alpha = 1.0 - (j / trailLength) * 0.8;
          ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
          ctx.fillText(r.text[j], r.x + j * (r.vx * 1.0), r.y + j * charSpacing);
        }
        if (r.y + trailLength * charSpacing > currentH - 15) {
          for (let j = 0; j < trailLength; j++) {
            particles.push({ id: stateRef.current.nextId++, char: r.text[j], x: r.x + (j * r.vx), y: currentH - 15 - j * charSpacing, vx: r.vx + (Math.random() - 0.5) * 6, vy: (-r.vy * 0.1) - Math.random() * 4 });
          }
          if (particles.length > 3000) particles.splice(0, particles.length - 3000);
          rain.splice(i, 1);
        }
      }

      ctx.shadowBlur = 4;
      ctx.shadowColor = `rgba(0, 0, 0, 0.5)`;
      ctx.fillStyle = `rgba(0, 0, 0, 0.8)`;
      const grid = new Map<string, Particle[]>();
      particles.forEach(p => {
        const cx = Math.floor(p.x / SPATIAL_CELL);
        const cy = Math.floor(p.y / SPATIAL_CELL);
        const key = `${cx},${cy}`;
        if (!grid.has(key)) grid.set(key, []);
        grid.get(key)!.push(p);
      });
      particles.forEach(p => {
        p.vy += 0.3;
        const cx = Math.floor(p.x / SPATIAL_CELL);
        const cy = Math.floor(p.y / SPATIAL_CELL);
        for (let ix = -1; ix <= 1; ix++) {
          for (let iy = -1; iy <= 1; iy++) {
            const key = `${cx + ix},${cy + iy}`;
            const neighbors = grid.get(key);
            if (neighbors) {
              neighbors.forEach(n => {
                if (n.id !== p.id) {
                  const dx = p.x - n.x;
                  const dy = p.y - n.y;
                  const distSq = dx * dx + dy * dy;
                  if (distSq < SPATIAL_CELL * SPATIAL_CELL && distSq > 0.1) {
                    const dist = Math.sqrt(distSq);
                    const force = (SPATIAL_CELL - dist) * 0.35;
                    p.vx += (dx / dist) * force; p.vy += (dy / dist) * force;
                    n.vx -= (dx / dist) * force; n.vy -= (dy / dist) * force;
                  }
                }
              });
            }
          }
        }
        p.vx *= 0.8; p.vy *= 0.8;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) { p.x = 0; p.vx *= -0.5; }
        if (p.x > currentW) { p.x = currentW; p.vx *= -0.5; }
        if (p.y > currentH - 5) { p.y = currentH - 5; p.vy *= -0.7; p.vx *= 0.5; }
        ctx.fillText(p.char, p.x, p.y);
      });

      if (Math.random() < 0.005 && stateRef.current.lightningTicks <= 0) {
        lightningRef.current.length = 0;
        const chars = ['/', '\\', '|', 'Z', 'X', 'W', 'V', 'Y', '~'];
        const generateBranch = (startX: number, startY: number, angle: number, depth: number) => {
          if (depth <= 0 || startY > currentH - 80) return;
          let lx = startX, ly = startY;
          const length = 15 + Math.random() * 20;
          for (let i = 0; i < length; i++) {
            activeLightning.push({ x: lx, y: ly, char: chars[Math.floor(Math.random() * chars.length)] });
            lx += Math.sin(angle) * 12; ly += Math.cos(angle) * 12; 
          }
          if (Math.random() < 0.5) generateBranch(lx, ly, angle + (Math.random() * 0.8 + 0.3), depth - 1);
          if (Math.random() < 0.5) generateBranch(lx, ly, angle - (Math.random() * 0.8 + 0.3), depth - 1);
          generateBranch(lx, ly, angle + (Math.random() - 0.5) * 0.6, depth - 1);
        };
        generateBranch(currentW / 2 + (Math.random() - 0.5) * currentW * 0.6, 60, (Math.random() - 0.5) * 0.4, 5); 
        stateRef.current.lightningTicks = 4;
      }

      stateRef.current.t += 0.016;
      animationId = requestAnimationFrame(render);
    };

    const activeLightning = lightningRef.current;
    render();
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => { setMousePos({ x: e.clientX, y: e.clientY }); };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      fontFamily: '"Space Grotesk", "Arial Narrow", sans-serif',
      cursor: 'none',
    }}>
      <LayoutMetadata 
        phase={5} 
        frequency="variable" 
        layoutId={6} 
        totalLayouts={6} 
        time="00:12:30" 
        cursor={`${mousePos.x.toFixed(0)}, ${mousePos.y.toFixed(0)}`}
      />

      {/* CHINESE EDITORIAL: Right side vertical composition */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 80,
        height: '100%',
        width: '260px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingRight: 60,
        zIndex: 10,
        pointerEvents: 'none',
      }}>
        <div style={{
          writingMode: 'vertical-rl',
          fontSize: '78px',
          fontWeight: 300,
          letterSpacing: '0.12em',
          color: '#0a0a0a',
          height: '400px',
          marginBottom: 40,
          fontFamily: "'Jacquarda Bastarda 9', serif",
        }}>
          ENVIRONMENT
        </div>
        
        <div style={{
          width: '140px',
          height: '1px',
          background: '#0a0a0a',
          marginBottom: 28,
        }} />
        
        <div style={{
          writingMode: 'vertical-rl',
          fontSize: '12px',
          lineHeight: '2.2',
          color: '#444',
          height: '260px',
        }}>
          Interactive environment of rain and text. Characters fall vertically, forming spatial structures.
        </div>
        
        <div style={{
          marginTop: 40,
          display: 'flex',
          gap: 20,
          alignItems: 'center',
        }}>
          <div style={{ width: 30, height: '1px', background: '#0a0a0a' }} />
          <span style={{
            fontSize: '9px',
            letterSpacing: '0.2em',
            color: '#888',
            textTransform: 'uppercase',
          }}>
            Phase 5 — Rain Mode
          </span>
        </div>
      </div>

      {/* Left geometric accent */}
      <div style={{
        position: 'absolute',
        left: 40,
        top: '50%',
        transform: 'translateY(-50%)',
        width: '1px',
        height: '280px',
        background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.15), transparent)',
      }} />

      {/* Top right corner */}
      <div style={{
        position: 'absolute',
        top: 40,
        right: 40,
        width: 50,
        height: 50,
        borderRight: '1px solid rgba(0,0,0,0.1)',
        borderTop: '1px solid rgba(0,0,0,0.1)',
      }} />

      {/* Bottom left utilitarian */}
      <div style={{
        position: 'absolute',
        bottom: 40,
        left: 40,
        zIndex: 10,
      }}>
        <div style={{
          fontSize: '9px',
          letterSpacing: '0.15em',
          color: 'rgba(0,0,0,0.3)',
          textTransform: 'uppercase',
          marginBottom: 6,
        }}>
          Environment / Rain / Lightning
        </div>
        <div style={{
          fontSize: '9px',
          letterSpacing: '0.15em',
          color: 'rgba(0,0,0,0.3)',
          textTransform: 'uppercase',
        }}>
          Mode: Interactive
        </div>
      </div>

      <canvas 
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
      <div style={{
        position: 'fixed',
        left: mousePos.x - 15,
        top: mousePos.y - 15,
        width: 30,
        height: 30,
        borderRadius: '50%',
        border: '1px solid rgba(0, 0, 0, 0.15)',
        pointerEvents: 'none',
        zIndex: 1000,
      }} />
    </div>
  );
}
