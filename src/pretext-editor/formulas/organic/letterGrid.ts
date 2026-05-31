import type {
  FormulaFn,
  LineSegment,
} from '../types';

import { seg } from '../helpers';

/**
 * THE PRESS — Letterpress grid with animated block printing
 * 
 * Creates a grid of letter blocks that "press down" to reveal text.
 * Scroll progress controls the wave animation of blocks pressing.
 */
export const letterGrid: FormulaFn = (
  _text,
  params,
  time
) => {
  const segments: LineSegment[] = [];

  const gridCols = Math.floor(params.gridCols ?? 12);
  const gridRows = Math.floor(params.gridRows ?? 6);
  const blockWidth = params.blockWidth ?? 28;
  const blockHeight = params.blockHeight ?? 32;
  const progress = params.progress ?? 0; // Scroll progress 0-1

  // Paper area dimensions
  const paperWidth = gridCols * (blockWidth + 4) + 40;
  const paperHeight = gridRows * (blockHeight + 6) + 60;

  // Paper bounds
  const paperLeft = -paperWidth / 2;
  const paperRight = paperWidth / 2;
  const paperTop = -paperHeight / 2;
  const paperBottom = paperHeight / 2;

  // =========================================
  // PAPER BORDER — decorative double line
  // =========================================
  segments.push(seg(paperLeft - 5, paperTop - 5, paperRight + 5, paperTop - 5, 0, true));
  segments.push(seg(paperRight + 5, paperTop - 5, paperRight + 5, paperBottom + 5, 0, true));
  segments.push(seg(paperRight + 5, paperBottom + 5, paperLeft - 5, paperBottom + 5, 0, true));
  segments.push(seg(paperLeft - 5, paperBottom + 5, paperLeft - 5, paperTop - 5, 0, true));

  // Inner border
  segments.push(seg(paperLeft, paperTop, paperRight, paperTop, 0, true));
  segments.push(seg(paperRight, paperTop, paperRight, paperBottom, 0, true));
  segments.push(seg(paperRight, paperBottom, paperLeft, paperBottom, 0, true));
  segments.push(seg(paperLeft, paperBottom, paperLeft, paperTop, 0, true));

  // =========================================
  // TEXT LINES — horizontal lines on paper
  // =========================================
  const textLines = gridRows + 4;
  const textStartY = paperTop + 25;
  const textEndY = paperBottom - 25;
  const textLineSpacing = (textEndY - textStartY) / (textLines - 1);

  for (let i = 0; i < textLines; i++) {
    const y = textStartY + i * textLineSpacing;
    const lineWidth = paperWidth - 50;
    const x1 = paperLeft + 25;
    const x2 = x1 + lineWidth;

    // Only show lines that have been "printed" based on progress
    const lineProgress = i / (textLines - 1);
    if (progress > lineProgress * 0.8) {
      segments.push(seg(x1, y, x2, y, i % 6));
    }
  }

  // =========================================
  // LETTER BLOCKS — grid of raised/pressed blocks
  // =========================================
  const blockStartX = -((gridCols * (blockWidth + 4)) / 2);
  const blockStartY = paperBottom + 30;

  for (let row = 0; row < gridRows; row++) {
    for (let col = 0; col < gridCols; col++) {
      const x = blockStartX + col * (blockWidth + 4);
      const y = blockStartY + row * (blockHeight + 6);

      // Wave animation: blocks press down left→right, top→bottom
      // Progress controls how far the wave has traveled
      const wavePos = (col + row * 0.7) / (gridCols + gridRows * 0.7);
      const pressThreshold = progress * 1.2; // Wave moves faster than scroll
      
      // Block is pressed if wave has passed it
      const isPressed = wavePos < pressThreshold;
      
      // Press depth (0 = raised, 1 = fully pressed)
      const pressDepth = isPressed 
        ? Math.min(1, (pressThreshold - wavePos) * 3)
        : 0;

      // Y offset when pressed (blocks sink down)
      const yOffset = pressDepth * 4;

      // Block outline (visual only) - color changes when pressed
      const depth = isPressed ? 10 + row : 20 + row;
      
      // Top edge
      segments.push(seg(x, y + yOffset, x + blockWidth, y + yOffset, depth, true));
      // Right edge
      segments.push(seg(x + blockWidth, y + yOffset, x + blockWidth, y + blockHeight + yOffset, depth, true));
      // Bottom edge
      segments.push(seg(x + blockWidth, y + blockHeight + yOffset, x, y + blockHeight + yOffset, depth, true));
      // Left edge
      segments.push(seg(x, y + blockHeight + yOffset, x, y + yOffset, depth, true));

      // Block face detail (letter impression) - only when pressed
      if (isPressed && pressDepth > 0.3) {
        const cx = x + blockWidth / 2;
        const cy = y + blockHeight / 2 + yOffset;
        
        // Horizontal line (represents letter)
        segments.push(seg(cx - 8, cy, cx + 8, cy, 30 + row, true));
        
        // Vertical line (cross for emphasis)
        if (row % 2 === 0) {
          segments.push(seg(cx, cy - 6, cx, cy + 6, 31 + row, true));
        }
      }
    }
  }

  return {
    type: 'segments',
    segments,
  };
};
