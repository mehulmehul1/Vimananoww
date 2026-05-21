import React, { useEffect, useRef } from 'react';
import { useGenesisStore } from './store';
import { prepareWithSegments, layoutWithLines } from '@chenglou/pretext';

const PROSE = `pure frequency to environmental manifestation. absolute black vacuum silence prevails. a single microscopic white dot appears in the void. high-frequency visual hum resonates through space. crystallizes into a word that breathes and pulses. fundamental strings of the universe vibrate endlessly. a storm of language descending from the heavens above. torrential immersive environment envelops all consciousness. liquid typography pool reflects the storm-lit sky. deep sea of rainy text gathers below the surface. nebulas of prose drifting through the endless void. typographic explosions illuminate the surrounding darkness. the architecture of meaning dissolves into primordial letters. each character a vessel carrying the weight of unspoken worlds. language becomes weather and weather becomes pure knowledge. from the first vibration emerged syllables of understanding. consciousness written in the rain falling through infinite space. the ocean floor where all text settles and dreams of new meaning. words accumulate in layers of thought forming new continents.`;

const FONT_SPEC = `14px 'Space Grotesk', sans-serif`;

class PretextProcessor {
  font = FONT_SPEC;
  layoutCloud(text: string, maxWidth: number) {
    const prepared = prepareWithSegments(text, this.font);
    const { lines } = layoutWithLines(prepared, maxWidth, 16);
    return lines;
  }
}

interface CloudWord { id: string; text: string; ox: number; oy: number; pulseObj: number; }
interface Cloud { cx: number; cy: number; words: CloudWord[]; rx: number; ry: number; centerPhase: number; }
interface RainDrop { id: string; text: string; x: number; y: number; vx: number; vy: number; }
interface Particle { id: number; char: string; x: number; y: number; vx: number; vy: number; }
interface LightningNode { x: number; y: number; char: string; }

interface EnvironmentEngineProps {
  contained?: boolean;
  backgroundColor?: string;
  textColor?: string;
  glowColor?: string;
}

function colorWithAlpha(color: string, alpha: number) {
  if (color.startsWith('#') && color.length === 7) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return color;
}

export function EnvironmentEngine({
  contained = false,
  backgroundColor = '#000000',
  textColor = '#ffffff',
  glowColor = 'rgba(180, 200, 255, 1.0)',
}: EnvironmentEngineProps) {
  const phase = useGenesisStore(s => s.phase);
  const setEnvironmentCanvas = useGenesisStore(s => s.setEnvironmentCanvas);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999, isDown: false });

  // Persistent simulation state
  const cloudsRef = useRef<Cloud[]>([]);
  const rainRef = useRef<RainDrop[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const lightningRef = useRef<LightningNode[]>([]);
  const stateRef = useRef({ t: 0, nextId: 0, lightningTicks: 0 });

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    setEnvironmentCanvas(canvas);
    const ctx = canvas.getContext('2d', { alpha: true })!;
    let animationId = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);
    const handleMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
    };
    window.addEventListener('mousemove', handleMove);

    const processor = new PretextProcessor();
    const w = canvas.offsetWidth;
    const proseString = PROSE.split(/\s+/).filter(w => w.length > 0);

    // PERSISTENT SETUP
    if (cloudsRef.current.length === 0) {
      const CLOUD_COUNT = 6;
      for (let s = 0; s < CLOUD_COUNT; s++) {
        const rx = (w / CLOUD_COUNT) * 1.5;
        const cloudStr = proseString.slice(s * 15, s * 15 + 40).join(' ');
        const lines = processor.layoutCloud(cloudStr, rx);

        const words: CloudWord[] = [];
        lines.forEach((line, li) => {
          const ly = -60 + li * 16;
          let currX = -rx / 2;
          line.text.split(' ').forEach((wd, wi) => {
            words.push({ id: `c${s}l${li}w${wi}`, text: wd, ox: currX, oy: ly, pulseObj: 1.0 });
            currX += (ctx.measureText(wd).width || (wd.length * 8)) + 4;
          });
        });

        cloudsRef.current.push({
          cx: (s * (w / CLOUD_COUNT)) + (w / CLOUD_COUNT) / 2,
          cy: 120 + Math.random() * 40,
          words, rx, ry: 60, centerPhase: Math.random() * 10
        });
      }
    }

    const UMBRELLA_RADIUS = 40;
    const SPATIAL_CELL = 12;

    const render = () => {
      const clouds = cloudsRef.current;
      const rain = rainRef.current;
      const particles = particlesRef.current;
      const activeLightning = lightningRef.current;

      stateRef.current.t += 0.016;
      const { t } = stateRef.current;
      const H = canvas.offsetHeight;
      const W = canvas.offsetWidth;

      // Clear with transparency
      ctx.clearRect(0, 0, W, H);

      // Background
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, W, H);

      ctx.font = FONT_SPEC;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';

      // ============================================
      // 0. PROCEDURAL FRACTAL LIGHTNING 
      // ============================================
      if (Math.random() < 0.005 && stateRef.current.lightningTicks <= 0) {
        activeLightning.length = 0;
        const chars = ['/', '\\', '|', 'Z', 'X', 'W', 'V', 'Y', '~'];
        
        const generateBranch = (startX: number, startY: number, angle: number, depth: number) => {
           if (depth <= 0 || startY > H - 80) return;
           let lx = startX;
           let ly = startY;
           const length = 15 + Math.random() * 20;
           for (let i = 0; i < length; i++) {
              activeLightning.push({ x: lx, y: ly, char: chars[Math.floor(Math.random() * chars.length)] });
              lx += Math.sin(angle) * 12;
              ly += Math.cos(angle) * 12; 
           }
           if (Math.random() < 0.5) generateBranch(lx, ly, angle + (Math.random() * 0.8 + 0.3), depth - 1);
           if (Math.random() < 0.5) generateBranch(lx, ly, angle - (Math.random() * 0.8 + 0.3), depth - 1);
           generateBranch(lx, ly, angle + (Math.random() - 0.5) * 0.6, depth - 1);
        };
        
        generateBranch(W / 2 + (Math.random() - 0.5) * W * 0.6, 60, (Math.random() - 0.5) * 0.4, 5); 
        stateRef.current.lightningTicks = 4;
      }

      if (stateRef.current.lightningTicks > 0) {
        ctx.fillStyle = colorWithAlpha(glowColor, stateRef.current.lightningTicks === 4 ? 0.08 : 0.01);
        ctx.fillRect(0, 0, W, H);
        ctx.shadowBlur = 20;
        ctx.shadowColor = glowColor;
        ctx.fillStyle = textColor;
        ctx.font = `bold 16px 'Space Grotesk', sans-serif`;

        activeLightning.forEach(node => {
          ctx.fillText(node.char, node.x, node.y);
          if (stateRef.current.lightningTicks > 2) {
             ctx.fillText(node.char, node.x + (Math.random() * 4 - 2), node.y);
          }
        });

        stateRef.current.lightningTicks--;
        ctx.font = FONT_SPEC;
      }

      // ============================================
      // 1. CLOUDS (Eternal)
      // ============================================
      ctx.shadowBlur = 8;
      ctx.shadowColor = glowColor;

      clouds.forEach(c => {
        const dx = Math.sin(t * 0.5 + c.centerPhase) * 20;
        const dy = Math.cos(t * 0.6 + c.centerPhase) * 10;

        c.words.forEach(w => {
          if (w.pulseObj < 1.0) w.pulseObj += 0.01;
          ctx.fillStyle = colorWithAlpha(textColor, Math.max(0.2, w.pulseObj));
          ctx.fillText(w.text, c.cx + dx + w.ox, c.cy + dy + w.oy);
        });

        // Generate heavy rain continuously attached to cloud bottom
        if (Math.random() < 0.25) {
          const randomWord = c.words[Math.floor(Math.random() * c.words.length)];
          randomWord.pulseObj = 0.3;

          rain.push({
            id: Math.random().toString(),
            text: randomWord.text,
            x: c.cx + dx + randomWord.ox,
            y: c.cy + dy + randomWord.oy,
            vx: 0,
            vy: 4 + Math.random() * 4 // Base fall speed
          });
        }
      });

      // ============================================
      // 2. MATRIX RAIN (Realistic Angled Sway)
      // ============================================
      ctx.shadowBlur = 4;
      ctx.shadowColor = glowColor;

      const globalWind = Math.sin(t * 0.8) * 1.5; // Natural swaying drafting

      for (let i = rain.length - 1; i >= 0; i--) {
        const r = rain[i];
        r.vy += 0.4;

        // Realistic wind sway oscillating slightly differently per drop depth
        const windDrift = globalWind + Math.sin(r.y * 0.01 + t * 2) * 1.0;
        r.vx += (windDrift - r.vx) * 0.1; // Smooth interpolate velocity towards wind

        r.x += r.vx;
        r.y += r.vy;

        // Umbrella Collision
        const umbDx = r.x - mouse.current.x;
        const umbDy = r.y - mouse.current.y;
        const umbDist = Math.sqrt(umbDx * umbDx + umbDy * umbDy);

        if (umbDist < UMBRELLA_RADIUS && r.y < mouse.current.y + 40) {
          const force = (UMBRELLA_RADIUS - umbDist) * 0.25;
          r.vx += (umbDx / umbDist) * force;
        }

        const charSpacing = 14;
        const trailLength = r.text.length;

        for (let j = 0; j < trailLength; j++) {
          const alpha = 1.0 - (j / trailLength) * 0.8;
          ctx.fillStyle = colorWithAlpha(textColor, alpha);

          // Fix 1: r.y is now the TOP of the string hanging down from the cloud. Plunges structurally perfectly.
          const dropY = r.y + j * charSpacing;

          // Fix 2: Wind Shear offset - the head is further along the wind vector than the tail, causing it to "lean" exactly like realistic rain.
          const dropX = r.x + j * (r.vx * 1.0);

          ctx.fillText(r.text[j], dropX, dropY);
        }

        const lowestY = r.y + trailLength * charSpacing; // Where the bottom of the drop hits floor

        // Disintegrate when the lowest hanging character hits the pool
        if (lowestY > H - 15) {
          for (let j = 0; j < trailLength; j++) {
            particles.push({
              id: stateRef.current.nextId++,
              char: r.text[j],
              x: r.x + (j * r.vx) + (Math.random() - 0.5) * 8,
              y: H - 15 - (j * charSpacing) * 0.5,
              vx: r.vx + (Math.random() - 0.5) * 6,
              vy: (-r.vy * 0.1) - Math.random() * 4 // gentle impact splash
            });
          }
          if (particles.length > 3000) particles.splice(0, particles.length - 3000);
          rain.splice(i, 1);
        }
      }

      // ============================================
      // 3. CELLULAR SPH POOL 
      // ============================================
      ctx.shadowBlur = 4;
      ctx.shadowColor = glowColor;
      ctx.fillStyle = colorWithAlpha(textColor, 0.9);

      const grid = new Map<string, Particle[]>();
      particles.forEach(p => {
        const cx = Math.floor(p.x / SPATIAL_CELL);
        const cy = Math.floor(p.y / SPATIAL_CELL);
        const key = `${cx},${cy}`;
        if (!grid.has(key)) grid.set(key, []);
        grid.get(key)!.push(p);
      });

      particles.forEach(p => {
        p.vy += 0.3; // tighter gravity map

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
                    const fx = (dx / dist) * force;
                    const fy = (dy / dist) * force;
                    p.vx += fx; p.vy += fy;
                    n.vx -= fx; n.vy -= fy;
                  }
                }
              });
            }
          }
        }

        p.vx *= 0.8;
        p.vy *= 0.8;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) { p.x = 0; p.vx *= -0.5; }
        if (p.x > W) { p.x = W; p.vx *= -0.5; }
        if (p.y > H - 5) { p.y = H - 5; p.vy *= -0.7; p.vx *= 0.5; }

        ctx.fillText(p.char, p.x, p.y);
      });

      animationId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMove);
    };
  }, [phase, backgroundColor, glowColor, textColor]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0, left: 0,
        width: contained ? '100%' : '100vw',
        height: contained ? '100%' : '100vh',
        zIndex: 10,
        pointerEvents: 'none',
        opacity: 1,
        visibility: 'visible',
        transition: 'opacity 2s ease-in-out'
      }}
    />
  );
}
