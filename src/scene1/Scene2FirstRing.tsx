import { useEffect, useRef } from 'react';
import { textCircle } from '../pretext-editor/formulas';
import { LayoutMetadata } from '../layouts/LayoutMetadata';
import { layoutTextOnSegments } from './textLayout';

const FONT_DISPLAY = `'Jacquarda Bastarda 9', serif`;
const FONT_PRIMARY = `'Space Grotesk', 'Arial Narrow', sans-serif`;

interface Scene2FirstRingProps {
  onComplete?: () => void;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function Scene2FirstRing({ onComplete }: Scene2FirstRingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const completeCalledRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let animationId = 0;

    const TEXT = 'VIMANA VIMANA VIMANA VIMANA VIMANA VIMANA VIMANA VIMANA';
    const EXPAND_DURATION = 1.0;
    const TOTAL_DURATION = 4.0;
    const BASE_RADIUS = 180;
    const START_RADIUS = 30;

    const render = () => {
      const t = timeRef.current;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Pure black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, w, h);

      // Calculate animated radius
      let radius: number;
      if (t < EXPAND_DURATION) {
        const progress = t / EXPAND_DURATION;
        radius = START_RADIUS + (BASE_RADIUS - START_RADIUS) * easeOutCubic(progress);
      } else {
        const breathe = Math.sin(t * 2) * 10;
        radius = BASE_RADIUS + breathe;
      }

      const result = textCircle(TEXT, { radius }, t);

      if (result.type === 'segments') {
        const placements = layoutTextOnSegments(TEXT, result.segments, 18, FONT_DISPLAY);

        const centerX = w * 0.5;
        const centerY = h * 0.5;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(t * 0.1);

        // Draw segment strokes — subtle
        ctx.strokeStyle = 'rgba(250, 249, 247, 0.05)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (const seg of result.segments) {
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
        }
        ctx.stroke();

        // Draw text placements
        for (const p of placements) {
          if (!p.text.trim()) continue;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.scale(p.scale, p.scale);
          ctx.font = `600 18px ${FONT_DISPLAY}`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.globalAlpha = 0.7 + p.opacity * 0.3;
          ctx.fillStyle = '#f2f0ec';
          ctx.fillText(p.text, 0, 0);
          ctx.restore();
        }

        ctx.restore();
      }

      timeRef.current += 0.016;

      if (timeRef.current >= TOTAL_DURATION && !completeCalledRef.current) {
        completeCalledRef.current = true;
        if (onComplete) {
          onComplete();
        }
      }

      if (timeRef.current < TOTAL_DURATION || !completeCalledRef.current) {
        animationId = requestAnimationFrame(render);
      }
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [onComplete]);

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      fontFamily: FONT_PRIMARY,
      backgroundColor: '#30302f',
    }}>
      <LayoutMetadata
        phase={0}
        frequency="136.1hz"
        status="the ring"
        layoutId={2}
        totalLayouts={5}
        time="00:03:00"
        cursor="512, 384"
      />

      {/* EDITORIAL OVERLAY: Right side, vertical composition */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 80,
        height: '100%',
        width: 280,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingRight: 60,
        zIndex: 10,
      }}>
        {/* Massive vertical title */}
        <div style={{
          writingMode: 'vertical-rl',
          fontSize: 72,
          fontWeight: 300,
          letterSpacing: '0.15em',
          color: '#f2f0ec',
          height: 420,
          marginBottom: 40,
          fontFamily: FONT_DISPLAY,
        }}>
          THE FIRST RING
        </div>

        {/* Horizontal divider */}
        <div style={{
          width: 180,
          height: 1,
          background: 'rgba(250, 249, 247, 0.3)',
          marginBottom: 32,
        }} />

        {/* Body text — vertical */}
        <div style={{
          writingMode: 'vertical-rl',
          fontSize: 12,
          lineHeight: 2,
          color: 'rgba(250, 249, 247, 0.5)',
          height: 320,
          letterSpacing: '0.02em',
        }}>
          The dot expands into a circle. The word VIMANA repeats around the ring — the first sound wave.
        </div>

        {/* Technical specs — horizontal at bottom */}
        <div style={{
          marginTop: 40,
          display: 'flex',
          gap: 24,
          alignItems: 'center',
        }}>
          <div style={{
            width: 40,
            height: 1,
            background: 'rgba(250, 249, 247, 0.3)',
          }} />
          <span style={{
            fontSize: 10,
            letterSpacing: '0.2em',
            color: 'rgba(250, 249, 247, 0.5)',
            textTransform: 'uppercase',
          }}>
            Phase 0.1 — textCircle
          </span>
        </div>
      </div>

      {/* Left corner accent — vertical line */}
      <div style={{
        position: 'absolute',
        left: 40,
        top: '50%',
        transform: 'translateY(-50%)',
        width: 1,
        height: 280,
        background: 'linear-gradient(to bottom, transparent, rgba(250, 249, 247, 0.15), transparent)',
      }} />

      {/* Bottom left: formula info */}
      <div style={{
        position: 'absolute',
        bottom: 40,
        left: 40,
        zIndex: 10,
      }}>
        <div style={{
          fontSize: 9,
          letterSpacing: '0.15em',
          color: 'rgba(250, 249, 247, 0.3)',
          textTransform: 'uppercase',
        }}>
          textCircle / radius: 180
        </div>
      </div>

      {/* Top right corner — geometric accent */}
      <div style={{
        position: 'absolute',
        top: 40,
        right: 40,
        width: 50,
        height: 50,
        borderRight: '1px solid rgba(250, 249, 247, 0.1)',
        borderTop: '1px solid rgba(250, 249, 247, 0.1)',
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
