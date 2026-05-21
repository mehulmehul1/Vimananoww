import { useEffect, useRef } from 'react';
import { LayoutMetadata } from '../layouts/LayoutMetadata';

const FONT_DISPLAY = `'Jacquarda Bastarda 9', serif`;
const FONT_PRIMARY = `'Space Grotesk', 'Arial Narrow', sans-serif`;

const COLORS = {
  void: '#30302f',
  whisperWhite: '#f2f0ec',
};

interface Scene1SingularityProps {
  onComplete?: () => void;
}

export function Scene1Singularity({ onComplete }: Scene1SingularityProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const completedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let animationId = 0;

    const render = () => {
      const t = timeRef.current;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Pure black void
      ctx.fillStyle = COLORS.void;
      ctx.fillRect(0, 0, w, h);

      const centerX = w / 2;
      const centerY = h / 2;

      // Fade in: 0-0.5s alpha 0 to 1
      const fadeInDuration = 0.5;
      const fadeInAlpha = t < fadeInDuration ? t / fadeInDuration : 1;

      // Subtle growth over 3s duration
      const duration = 3;
      const growthProgress = Math.min(t / duration, 1);
      const baseRadius = 3 + growthProgress * 2;

      // Pulse with sine wave (1.0 ± 0.15)
      const pulse = 1 + Math.sin(t * 3) * 0.15;
      const radius = baseRadius * pulse;

      // Glow halo
      ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
      ctx.shadowBlur = 30 + Math.sin(t * 3) * 15;

      // Draw the singularity dot
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${fadeInAlpha})`;
      ctx.fill();

      // Reset shadow for next frame
      ctx.shadowBlur = 0;

      timeRef.current += 0.016;

      // Auto-transition after ~3 seconds
      if (timeRef.current >= duration && !completedRef.current) {
        completedRef.current = true;
        if (onComplete) {
          onComplete();
        }
      }

      animationId = requestAnimationFrame(render);
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
      backgroundColor: COLORS.void,
    }}>
      <LayoutMetadata
        phase={0}
        frequency="136.1hz"
        status="the hum"
        layoutId={1}
        totalLayouts={5}
        time="00:00:00"
        cursor="512, 384"
      />

      {/* EDITORIAL OVERLAY: Right side vertical composition */}
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
          color: COLORS.whisperWhite,
          height: '420px',
          marginBottom: 40,
          fontFamily: FONT_DISPLAY,
        }}>
          SINGULARITY
        </div>

        {/* Horizontal divider */}
        <div style={{
          width: '180px',
          height: '1px',
          background: 'rgba(250, 249, 247, 0.3)',
          marginBottom: 32,
        }} />

        {/* Body text - vertical */}
        <div style={{
          writingMode: 'vertical-rl',
          fontSize: '12px',
          lineHeight: '2',
          color: 'rgba(250, 249, 247, 0.5)',
          height: '320px',
          letterSpacing: '0.02em',
        }}>
          A single microscopic white dot appears in the void. High-frequency visual hum resonates through space.
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
            background: 'rgba(250, 249, 247, 0.3)',
          }} />
          <span style={{
            fontSize: '10px',
            letterSpacing: '0.2em',
            color: 'rgba(250, 249, 247, 0.5)',
            textTransform: 'uppercase',
          }}>
            Phase 0.0 — 136.1Hz
          </span>
        </div>
      </div>

      {/* Left center: vertical accent line */}
      <div style={{
        position: 'absolute',
        left: 40,
        top: '50%',
        transform: 'translateY(-50%)',
        width: '1px',
        height: '280px',
        background: 'linear-gradient(to bottom, transparent, rgba(250, 249, 247, 0.15), transparent)',
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
          color: 'rgba(250, 249, 247, 0.3)',
          textTransform: 'uppercase',
        }}>
          Singularity / A dot of light
        </div>
      </div>

      {/* Top right corner - geometric accent */}
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

export default Scene1Singularity;
