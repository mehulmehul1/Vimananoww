import React from 'react';

/**
 * Layout 2: "The Word" — Structural Grid with Hangetsu
 * - 12-column grid system
 * - Large display text centered
 * - Lead text in left column
 * - Caption in top-right
 * - Hangetsu (half-moon) CSS shape
 * - Japanese editorial: whitespace, asymmetric balance
 */
export function Layout2Word() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'var(--color-canvas, #ffffff)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'var(--font-primary, "Space Grotesk", sans-serif)',
      display: 'grid',
      gridTemplateColumns: 'repeat(12, 1fr)',
      gap: 'var(--space-5, 24px)',
      padding: 'var(--space-7, 48px)',
    }}>
      {/* Top-right: caption navigation */}
      <div style={{
        gridColumn: '10 / 13',
        gridRow: '1',
        fontSize: 'var(--text-caption, 14px)',
        lineHeight: 'var(--leading-caption, 1.4)',
        fontWeight: 'var(--font-weight-regular, 400)',
        color: 'var(--color-inkwell, #252525)',
        textAlign: 'right',
        paddingTop: 'var(--space-3, 12px)',
      }}>
        <div style={{ marginBottom: 'var(--space-2, 8px)', fontWeight: 'var(--font-weight-medium, 500)' }}>navigation</div>
        <div style={{ fontSize: 'var(--text-micro, 11px)', letterSpacing: 'var(--tracking-micro, -0.045em)', marginBottom: 'var(--space-1, 4px)' }}>design review</div>
        <div style={{ fontSize: 'var(--text-micro, 11px)', letterSpacing: 'var(--tracking-micro, -0.045em)' }}>layout 2 / 3</div>
      </div>

      {/* Left column: lead text */}
      <div style={{
        gridColumn: '2 / 6',
        gridRow: '2 / 4',
        fontSize: 'var(--text-lead, 24px)',
        lineHeight: 'var(--leading-lead, 1.3)',
        fontWeight: 'var(--font-weight-medium, 500)',
        letterSpacing: 'var(--tracking-lead, -0.01em)',
        color: 'var(--color-pitch-black, #000000)',
        paddingTop: 'var(--space-6, 32px)',
      }}>
        <div style={{ marginBottom: 'var(--space-4, 16px)' }}>
          The word crystallizes from the first vibration.
        </div>
        <div style={{
          fontSize: 'var(--text-body, 18px)',
          lineHeight: 'var(--leading-body, 1.5)',
          fontWeight: 'var(--font-weight-regular, 400)',
          color: 'var(--color-inkwell, #252525)',
          marginBottom: 'var(--space-4, 16px)',
        }}>
          Every syllable carries the weight of unspoken worlds.
          Language becomes weather, and weather becomes pure knowledge.
        </div>
        <div style={{
          fontSize: 'var(--text-micro, 11px)',
          lineHeight: 'var(--leading-micro, 1.2)',
          letterSpacing: 'var(--tracking-micro, -0.045em)',
          color: 'var(--color-inkwell, #252525)',
        }}>
          <div style={{ marginBottom: 'var(--space-1, 4px)' }}>phase 1 — the word</div>
        </div>
      </div>

      {/* Center: main display text */}
      <div style={{
        gridColumn: '4 / 10',
        gridRow: '2 / 4',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          fontSize: 'var(--text-display-sm, 96px)',
          lineHeight: 'var(--leading-display-sm, 0.85)',
          fontWeight: 'var(--font-weight-bold, 700)',
          letterSpacing: 'var(--tracking-display-sm, -0.04em)',
          color: 'var(--color-pitch-black, #000000)',
          marginBottom: 'var(--space-5, 24px)',
        }}>
          VIMANA
        </div>

        {/* Hangetsu (half-moon) shape - Japanese geometric accent */}
        <div style={{
          width: '200px',
          height: '100px',
          border: '2px solid rgba(0, 0, 0, 0.15)',
          borderBottom: 'none',
          borderRadius: '200px 200px 0 0',
          margin: 'var(--space-5, 24px) auto',
          position: 'relative',
        }}>
          {/* Subtle text inside hangetsu */}
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 'var(--text-caption, 14px)',
            color: 'var(--color-inkwell, #252525)',
            whiteSpace: 'nowrap',
          }}>
            linguistic genesis
          </div>
        </div>

        <div style={{
          fontSize: 'var(--text-body, 18px)',
          lineHeight: 'var(--leading-body, 1.5)',
          fontWeight: 'var(--font-weight-regular, 400)',
          color: 'var(--color-inkwell, #252525)',
          maxWidth: '400px',
        }}>
          A single microscopic white dot appears in the void.
          High-frequency visual hum resonates through space.
        </div>
      </div>

      {/* Right column: body text */}
      <div style={{
        gridColumn: '10 / 13',
        gridRow: '2 / 4',
        fontSize: 'var(--text-body, 18px)',
        lineHeight: 'var(--leading-body, 1.5)',
        fontWeight: 'var(--font-weight-regular, 400)',
        color: 'var(--color-inkwell, #252525)',
        paddingTop: 'var(--space-6, 32px)',
      }}>
        <div style={{ marginBottom: 'var(--space-4, 16px)' }}>
          The string stretches into a filament of consciousness.
          It loops, braids, and entangles with itself.
        </div>
        <div style={{
          fontSize: 'var(--text-caption, 14px)',
          lineHeight: 'var(--leading-caption, 1.4)',
          fontWeight: 'var(--font-weight-regular, 400)',
          color: 'var(--color-inkwell, #252525)',
          marginBottom: 'var(--space-3, 12px)',
        }}>
          <div style={{ marginBottom: 'var(--space-1, 4px)', fontWeight: 'var(--font-weight-medium, 500)' }}>phase details</div>
          <div>phase 1 — the word</div>
          <div>duration: 4.0s</div>
          <div>frequency: variable</div>
        </div>
        <div style={{
          fontSize: 'var(--text-micro, 11px)',
          lineHeight: 'var(--leading-micro, 1.2)',
          letterSpacing: 'var(--tracking-micro, -0.045em)',
          color: 'var(--color-inkwell, #252525)',
        }}>
          <div>time: 00:02:35</div>
        </div>
      </div>

      {/* Bottom: full-width metadata bar */}
      <div style={{
        gridColumn: '1 / -1',
        gridRow: '4',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        fontSize: 'var(--text-micro, 11px)',
        lineHeight: 'var(--leading-micro, 1.2)',
        fontWeight: 'var(--font-weight-regular, 400)',
        letterSpacing: 'var(--tracking-micro, -0.045em)',
        color: 'var(--color-inkwell, #252525)',
        paddingBottom: 'var(--space-3, 12px)',
        borderTop: '1px solid rgba(0, 0, 0, 0.1)',
        paddingTop: 'var(--space-3, 12px)',
      }}>
        <div>vimana — linguistic genesis</div>
        <div>design system preview — layout 2</div>
        <div>{`${new Date().toISOString().split('T')[0]}`}</div>
      </div>
    </div>
  );
}
