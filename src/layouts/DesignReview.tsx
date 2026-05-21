import { useState } from 'react';
import { Act1Scene } from '../scene1/Act1Scene';

/**
 * Hybrid Bloom design review.
 * This route previews the same instrument-canvas language used by live Act1.
 */
export function DesignReview() {
  const [mode, setMode] = useState<'scroll' | 'time'>('time');

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      minHeight: mode === 'scroll' ? '805vh' : '100vh',
      background: '#000',
      fontFamily: '"Arial Narrow", "Space Grotesk", sans-serif',
    }}>
      <div style={{
        position: 'fixed',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 8px',
        background: 'rgba(243, 239, 230, 0.92)',
        border: '1px solid rgba(11, 13, 16, 0.16)',
        borderRadius: 6,
        color: '#0b0d10',
        fontSize: 11,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
      }}>
        <span style={{ padding: '0 8px', color: 'rgba(11, 13, 16, 0.58)' }}>Hybrid Bloom Review</span>
        <button
          onClick={() => setMode('time')}
          style={reviewButton(mode === 'time')}
        >
          Time
        </button>
        <button
          onClick={() => setMode('scroll')}
          style={reviewButton(mode === 'scroll')}
        >
          Scroll
        </button>
        <button
          onClick={() => { window.location.hash = ''; }}
          style={reviewButton(false)}
        >
          Back
        </button>
      </div>

      <Act1Scene mode={mode} />
    </div>
  );
}

function reviewButton(active: boolean) {
  return {
    pointerEvents: 'auto' as const,
    background: active ? '#0b0d10' : 'transparent',
    color: active ? '#f3efe6' : '#0b0d10',
    border: '1px solid rgba(11, 13, 16, 0.18)',
    borderRadius: 4,
    padding: '7px 10px',
    font: 'inherit',
    letterSpacing: 'inherit',
    textTransform: 'inherit' as const,
    cursor: 'pointer',
  };
}
