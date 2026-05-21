import React from 'react';

interface LayoutMetadataProps {
  phase: string | number;
  frequency?: string;
  status?: string;
  layoutId: number;
  totalLayouts: number;
  time?: string;
  cursor?: string;
}

/**
 * LayoutMetadata — Shared ritual corners for Design Review layouts.
 * Ensures consistent micro-typography and positioning across all editorial views.
 */
export function LayoutMetadata({
  phase,
  frequency = 'variable',
  status = 'active',
  layoutId,
  totalLayouts,
  time = '00:00:00',
  cursor = '0, 0',
}: LayoutMetadataProps) {
  const microStyle: React.CSSProperties = {
    fontSize: 'var(--text-micro, 11px)',
    lineHeight: 'var(--leading-micro, 1.2)',
    fontWeight: 'var(--font-weight-regular, 400)',
    letterSpacing: 'var(--tracking-micro, -0.045em)',
    color: 'var(--color-inkwell, #252525)',
    fontFamily: 'var(--font-primary, "Space Grotesk", sans-serif)',
  };

  return (
    <>
      {/* TOP-LEFT: Phase & Frequency */}
      <div style={{
        position: 'absolute',
        top: 'var(--space-7, 48px)',
        left: 'var(--space-7, 48px)',
        ...microStyle,
      }}>
        <div>phase {phase} — {status}</div>
        <div style={{ marginTop: 'var(--space-1, 4px)' }}>frequency: {frequency}</div>
      </div>

      {/* TOP-RIGHT: Design Review Label */}
      <div style={{
        position: 'absolute',
        top: 'var(--space-7, 48px)',
        right: 'var(--space-7, 48px)',
        ...microStyle,
        textAlign: 'right',
      }}>
        <div>design review</div>
        <div style={{ marginTop: 'var(--space-1, 4px)' }}>layout {layoutId} / {totalLayouts}</div>
      </div>

      {/* BOTTOM-LEFT: Time & Cursor */}
      <div style={{
        position: 'absolute',
        bottom: 'var(--space-7, 48px)',
        left: 'var(--space-7, 48px)',
        ...microStyle,
      }}>
        <div>{time}</div>
        <div style={{ marginTop: 'var(--space-1, 4px)' }}>cursor: {cursor}</div>
      </div>

      {/* BOTTOM-RIGHT: Project Branding */}
      <div style={{
        position: 'absolute',
        bottom: 'var(--space-7, 48px)',
        right: 'var(--space-7, 48px)',
        ...microStyle,
        textAlign: 'right',
      }}>
        <div>vimana — linguistic genesis</div>
        <div style={{ marginTop: 'var(--space-1, 4px)' }}>{new Date().toISOString().split('T')[0]}</div>
      </div>
    </>
  );
}
