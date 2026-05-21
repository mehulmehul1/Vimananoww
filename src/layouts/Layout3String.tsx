import React from 'react';

/**
 * Layout 3: "The String" — Radical Asymmetry
 * - Diagonal flow breaking the grid
 * - Display text flowing top-left to bottom-right
 * - Body text in right column (1/3 width)
 * - Micro text in corners
 * - Japanese editorial: bold typography, strong contrasts, ma (negative space)
 */
export function Layout3String() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'var(--color-canvas, #ffffff)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'var(--font-primary, "Space Grotesk", sans-serif)',
    }}>
      {/* Diagonal main text - top-left to bottom-right flow */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '8%',
        transform: 'rotate(-8deg)',
        maxWidth: '60%',
      }}>
        <div style={{
          fontSize: 'var(--text-display, 64px)',
          lineHeight: 'var(--leading-display, 0.85)',
          fontWeight: 'var(--font-weight-bold, 700)',
          letterSpacing: 'var(--tracking-display, -0.04em)',
          color: 'var(--color-pitch-black, #000000)',
          marginBottom: 'var(--space-4, 16px)',
        }}>
          The String
        </div>
        <div style={{
          fontSize: 'var(--text-lead, 24px)',
          lineHeight: 'var(--leading-lead, 1.3)',
          fontWeight: 'var(--font-weight-medium, 500)',
          letterSpacing: 'var(--tracking-lead, -0.01em)',
          color: 'var(--color-inkwell, #252525)',
          marginBottom: 'var(--space-4, 16px)',
          maxWidth: '500px',
        }}>
          Fundamental strings of the universe vibrate endlessly.
          The architecture of meaning dissolves into primordial letters.
        </div>
        <div style={{
          fontSize: 'var(--text-body, 18px)',
          lineHeight: 'var(--leading-body, 1.5)',
          fontWeight: 'var(--font-weight-regular, 400)',
          color: 'var(--color-inkwell, #252525)',
          maxWidth: '450px',
        }}>
          A single microscopic white dot appears in the void.
          High-frequency visual hum resonates through space.
          Crystallizes into a word that breathes and pulses.
        </div>
      </div>

      {/* Right column: body text with Japanese-style framing */}
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '5%',
        width: '28%',
        background: 'var(--color-canvas, #ffffff)',
        borderLeft: '1px solid rgba(0, 0, 0, 0.1)',
        paddingLeft: 'var(--space-5, 24px)',
        paddingTop: 'var(--space-6, 32px)',
      }}>
        <div style={{
          fontSize: 'var(--text-body, 18px)',
          lineHeight: 'var(--leading-body, 1.5)',
          fontWeight: 'var(--font-weight-regular, 400)',
          color: 'var(--color-inkwell, #252525)',
          marginBottom: 'var(--space-5, 24px)',
        }}>
          <div style={{ marginBottom: 'var(--space-3, 12px)' }}>
            The word crystallizes from the first vibration.
            Every syllable carries the weight of unspoken worlds.
          </div>
          <div style={{ marginBottom: 'var(--space-4, 16px)' }}>
            Language becomes weather, and weather becomes pure knowledge.
            From the first vibration emerged syllables of understanding.
          </div>
          <div style={{
            fontSize: 'var(--text-caption, 14px)',
            lineHeight: 'var(--leading-caption, 1.4)',
            fontWeight: 'var(--font-weight-regular, 400)',
            color: 'var(--color-inkwell, #252525)',
            marginBottom: 'var(--space-3, 12px)',
          }}>
            <div style={{ marginBottom: 'var(--space-1, 4px)', fontWeight: 'var(--font-weight-medium, 500)' }}>phase details</div>
            <div>phase 2 — the string</div>
            <div>duration: 4.0s</div>
            <div>frequency: variable</div>
          </div>
        </div>

        {/* Micro text at bottom of column */}
        <div style={{
          fontSize: 'var(--text-micro, 11px)',
          lineHeight: 'var(--leading-micro, 1.2)',
          fontWeight: 'var(--font-weight-regular, 400)',
          letterSpacing: 'var(--tracking-micro, -0.045em)',
          color: 'var(--color-inkwell, #252525)',
          marginTop: 'var(--space-5, 24px)',
          paddingTop: 'var(--space-3, 12px)',
          borderTop: '1px solid rgba(0, 0, 0, 0.08)',
        }}>
          <div>vimana linguistic genesis</div>
          <div>design preview — layout 3 / 3</div>
        </div>
      </div>

      {/* Top-left: micro */}
      <div style={{
        position: 'absolute',
        top: 'var(--space-7, 48px)',
        left: 'var(--space-7, 48px)',
        fontSize: 'var(--text-micro, 11px)',
        lineHeight: 'var(--leading-micro, 1.2)',
        fontWeight: 'var(--font-weight-regular, 400)',
        letterSpacing: 'var(--tracking-micro, -0.045em)',
        color: 'var(--color-inkwell, #252525)',
      }}>
        <div>phase 2. the string</div>
        <div style={{ marginTop: 'var(--space-1, 4px)' }}>diagonal composition</div>
      </div>

      {/* Top-right: micro */}
      <div style={{
        position: 'absolute',
        top: 'var(--space-7, 48px)',
        right: 'var(--space-7, 48px)',
        fontSize: 'var(--text-micro, 11px)',
        lineHeight: 'var(--leading-micro, 1.2)',
        fontWeight: 'var(--font-weight-regular, 400)',
        letterSpacing: 'var(--tracking-micro, -0.045em)',
        color: 'var(--color-inkwell, #252525)',
        textAlign: 'right',
      }}>
        <div>design review</div>
        <div style={{ marginTop: 'var(--space-1, 4px)' }}>layout 3 / 3</div>
      </div>

      {/* Bottom-left: micro */}
      <div style={{
        position: 'absolute',
        bottom: 'var(--space-7, 48px)',
        left: 'var(--space-7, 48px)',
        fontSize: 'var(--text-micro, 11px)',
        lineHeight: 'var(--leading-micro, 1.2)',
        fontWeight: 'var(--font-weight-regular, 400)',
        letterSpacing: 'var(--tracking-micro, -0.045em)',
        color: 'var(--color-inkwell, #252525)',
      }}>
        <div>00:04:12</div>
        <div style={{ marginTop: 'var(--space-1, 4px)' }}>cursor: 512, 384</div>
      </div>

      {/* Bottom-right: micro */}
      <div style={{
        position: 'absolute',
        bottom: 'var(--space-7, 48px)',
        right: 'var(--space-7, 48px)',
        fontSize: 'var(--text-micro, 11px)',
        lineHeight: 'var(--leading-micro, 1.2)',
        fontWeight: 'var(--font-weight-regular, 400)',
        letterSpacing: 'var(--tracking-micro, -0.045em)',
        color: 'var(--color-inkwell, #252525)',
        textAlign: 'right',
      }}>
        <div>vimana — linguistic genesis</div>
        <div style={{ marginTop: 'var(--space-1, 4px)' }}>{`${new Date().toISOString().split('T')[0]}`}</div>
      </div>

      {/* Diagonal accent line - Japanese enso-inspired */}
      <svg
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        <line
          x1="8%"
          y1="15%"
          x2="72%"
          y2="85%"
          stroke="rgba(0,0,0,0.06)"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}
