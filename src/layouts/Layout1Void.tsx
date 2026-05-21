import React from 'react';

/**
 * Layout 1: "The Void" — Minimalist Japanese Editorial
 * - Large ritual text at exact center with golden ratio offset
 * - Micro typography in corners (Japanese ma / negative space)
 * - Generous whitespace as sacred space
 * - Asymmetric balance with golden ratio offset
 */
export function Layout1Void() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'var(--color-canvas, #ffffff)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'var(--font-primary, "Space Grotesk", sans-serif)',
    }}>
      {/* Main ritual text - exact center, Japanese ma (negative space) */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '38.2%', // Golden ratio offset (1 - 0.618 = 0.382)
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: 'var(--text-ritual, 128px)',
          lineHeight: 'var(--leading-ritual, 0.85)',
          fontWeight: 'var(--font-weight-regular, 400)',
          fontFamily: 'var(--font-display, "Jacquarda Bastarda 9", serif)',
          letterSpacing: 'var(--tracking-ritual, -0.055em)',
          color: 'var(--color-pitch-black, #000000)',
          marginBottom: 'var(--space-8, 8px)',
        }}>
          VIMANA
        </div>
        <div style={{
          fontSize: 'var(--text-micro, 11px)',
          lineHeight: 'var(--leading-micro, 1.2)',
          fontWeight: 'var(--font-weight-regular, 400)',
          letterSpacing: 'var(--tracking-micro, -0.045em)',
          color: 'var(--color-inkwell, #252525)',
          marginTop: 'var(--space-6, 6px)',
        }}>
          void / genesis / frequency
        </div>
      </div>

      {/* Bottom-left: micro metadata */}
      <div style={{
        position: 'absolute',
        bottom: 'var(--space-7, 48px)',
        left: 'var(--space-7, 48px)',
        fontSize: 'var(--text-micro, 11px)',
        lineHeight: 'var(--leading-micro, 1.2)',
        fontWeight: 'var(--font-weight-regular, 400)',
        letterSpacing: 'var(--tracking-micro, -0.045em)',
        color: 'var(--color-inkwell, #252525)',
        fontFamily: 'var(--font-primary, "Space Grotesk", sans-serif)',
      }}>
        <div>phase 0 — the hum</div>
        <div style={{ marginTop: 'var(--space-2, 8px)' }}>frequency: 136.1hz</div>
        <div style={{ marginTop: 'var(--space-1, 4px)' }}>status: {`<idle>`}</div>
      </div>

      {/* Top-right: minimal nav */}
      <div style={{
        position: 'absolute',
        top: 'var(--space-7, 48px)',
        right: 'var(--space-7, 48px)',
        fontSize: 'var(--text-caption, 14px)',
        lineHeight: 'var(--leading-caption, 1.4)',
        fontWeight: 'var(--font-weight-regular, 400)',
        color: 'var(--color-inkwell, #252525)',
        fontFamily: 'var(--font-primary, "Space Grotesk", sans-serif)',
        textAlign: 'right',
      }}>
        <div style={{ marginBottom: 'var(--space-2, 8px)' }}>design review</div>
        <div style={{ fontSize: 'var(--text-micro, 11px)', letterSpacing: 'var(--tracking-micro, -0.045em)' }}>layout 1 / 3</div>
      </div>

      {/* Bottom-right: phase indicator */}
      <div style={{
        position: 'absolute',
        bottom: 'var(--space-7, 48px)',
        right: 'var(--space-7, 48px)',
        fontSize: 'var(--text-micro, 11px)',
        lineHeight: 'var(--leading-micro, 1.2)',
        fontWeight: 'var(--font-weight-regular, 400)',
        letterSpacing: 'var(--tracking-micro, -0.045em)',
        color: 'var(--color-inkwell, #252525)',
        fontFamily: 'var(--font-primary, "Space Grotesk", sans-serif)',
        textAlign: 'right',
      }}>
        <div>00:00:00</div>
        <div style={{ marginTop: 'var(--space-1, 4px)' }}>cursor position</div>
      </div>

      {/* Subtle geometric accent - Japanese enso circle inspiration */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '61.8%', // Golden ratio point
        transform: 'translate(-50%, -50%)',
        width: '300px',
        height: '300px',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />
    </div>
  );
}
