/**
 * Handwriting stroke data for calligraphic monoline letters.
 * Each letter is defined as an array of strokes.
 * Each stroke is an array of [x, y] points (0-1 normalized space).
 * Designed for smooth, flowing handwriting look.
 */

export interface StrokePoint {
  x: number;
  y: number;
}

export type Stroke = StrokePoint[];
export type LetterStrokes = Stroke[];

// Letters defined for natural handwriting flow
export const LETTER_STROKES: Record<string, LetterStrokes> = {
  'A': [
    // Left leg (upstroke - lighter)
    [{ x: 0.15, y: 0.95 }, { x: 0.5, y: 0.05 }],
    // Right leg (downstroke - heavier feel)
    [{ x: 0.5, y: 0.05 }, { x: 0.85, y: 0.95 }],
    // Crossbar (quick horizontal)
    [{ x: 0.25, y: 0.55 }, { x: 0.75, y: 0.55 }],
  ],
  'B': [
    // Vertical stem
    [{ x: 0.2, y: 0.05 }, { x: 0.2, y: 0.95 }],
    // Top lobe
    [{ x: 0.2, y: 0.05 }, { x: 0.55, y: 0.05 }, { x: 0.75, y: 0.15 }, { x: 0.75, y: 0.3 }, { x: 0.55, y: 0.45 }, { x: 0.2, y: 0.5 }],
    // Bottom lobe
    [{ x: 0.2, y: 0.5 }, { x: 0.6, y: 0.5 }, { x: 0.8, y: 0.65 }, { x: 0.8, y: 0.8 }, { x: 0.6, y: 0.95 }, { x: 0.2, y: 0.95 }],
  ],
  'C': [
    // Main curve
    [{ x: 0.8, y: 0.2 }, { x: 0.5, y: 0.05 }, { x: 0.15, y: 0.25 }, { x: 0.1, y: 0.5 }, { x: 0.15, y: 0.75 }, { x: 0.5, y: 0.95 }, { x: 0.8, y: 0.8 }],
  ],
  'D': [
    // Vertical stem
    [{ x: 0.2, y: 0.05 }, { x: 0.2, y: 0.95 }],
    // Right curve
    [{ x: 0.2, y: 0.05 }, { x: 0.5, y: 0.05 }, { x: 0.8, y: 0.25 }, { x: 0.85, y: 0.5 }, { x: 0.8, y: 0.75 }, { x: 0.5, y: 0.95 }, { x: 0.2, y: 0.95 }],
  ],
  'E': [
    // Vertical stem
    [{ x: 0.25, y: 0.05 }, { x: 0.25, y: 0.95 }],
    // Top bar
    [{ x: 0.25, y: 0.05 }, { x: 0.75, y: 0.05 }],
    // Middle bar
    [{ x: 0.25, y: 0.5 }, { x: 0.6, y: 0.5 }],
    // Bottom bar
    [{ x: 0.25, y: 0.95 }, { x: 0.75, y: 0.95 }],
  ],
  'F': [
    // Vertical stem
    [{ x: 0.25, y: 0.05 }, { x: 0.25, y: 0.95 }],
    // Top bar
    [{ x: 0.25, y: 0.05 }, { x: 0.75, y: 0.05 }],
    // Middle bar
    [{ x: 0.25, y: 0.5 }, { x: 0.6, y: 0.5 }],
  ],
  'G': [
    // Main curve
    [{ x: 0.75, y: 0.2 }, { x: 0.45, y: 0.05 }, { x: 0.15, y: 0.25 }, { x: 0.1, y: 0.5 }, { x: 0.15, y: 0.75 }, { x: 0.45, y: 0.95 }, { x: 0.75, y: 0.8 }],
    // Horizontal inward
    [{ x: 0.75, y: 0.55 }, { x: 0.5, y: 0.55 }],
    // Vertical down
    [{ x: 0.5, y: 0.55 }, { x: 0.5, y: 0.8 }],
  ],
  'H': [
    // Left vertical
    [{ x: 0.15, y: 0.05 }, { x: 0.15, y: 0.95 }],
    // Right vertical
    [{ x: 0.85, y: 0.05 }, { x: 0.85, y: 0.95 }],
    // Crossbar
    [{ x: 0.15, y: 0.5 }, { x: 0.85, y: 0.5 }],
  ],
  'I': [
    // Top serif
    [{ x: 0.35, y: 0.05 }, { x: 0.65, y: 0.05 }],
    // Vertical stem
    [{ x: 0.5, y: 0.05 }, { x: 0.5, y: 0.95 }],
    // Bottom serif
    [{ x: 0.35, y: 0.95 }, { x: 0.65, y: 0.95 }],
  ],
  'J': [
    // Top serif
    [{ x: 0.35, y: 0.05 }, { x: 0.7, y: 0.05 }],
    // Main curve
    [{ x: 0.7, y: 0.05 }, { x: 0.7, y: 0.65 }, { x: 0.55, y: 0.9 }, { x: 0.35, y: 0.95 }, { x: 0.2, y: 0.85 }],
  ],
  'K': [
    // Vertical stem
    [{ x: 0.25, y: 0.05 }, { x: 0.25, y: 0.95 }],
    // Upper diagonal
    [{ x: 0.65, y: 0.05 }, { x: 0.25, y: 0.5 }],
    // Lower diagonal
    [{ x: 0.3, y: 0.48 }, { x: 0.8, y: 0.95 }],
  ],
  'L': [
    // Vertical stem
    [{ x: 0.25, y: 0.05 }, { x: 0.25, y: 0.95 }],
    // Bottom bar
    [{ x: 0.25, y: 0.95 }, { x: 0.75, y: 0.95 }],
  ],
  'M': [
    // Left vertical
    [{ x: 0.1, y: 0.95 }, { x: 0.1, y: 0.05 }],
    // Left diagonal down
    [{ x: 0.1, y: 0.05 }, { x: 0.5, y: 0.65 }],
    // Right diagonal up
    [{ x: 0.5, y: 0.65 }, { x: 0.9, y: 0.05 }],
    // Right vertical
    [{ x: 0.9, y: 0.05 }, { x: 0.9, y: 0.95 }],
  ],
  'N': [
    // Left vertical
    [{ x: 0.2, y: 0.95 }, { x: 0.2, y: 0.05 }],
    // Diagonal
    [{ x: 0.2, y: 0.05 }, { x: 0.8, y: 0.95 }],
    // Right vertical
    [{ x: 0.8, y: 0.95 }, { x: 0.8, y: 0.05 }],
  ],
  'O': [
    // Full circle (clockwise)
    [{ x: 0.5, y: 0.05 }, { x: 0.8, y: 0.05 }, { x: 0.9, y: 0.3 }, { x: 0.9, y: 0.7 }, { x: 0.8, y: 0.95 }, { x: 0.5, y: 0.95 }, { x: 0.2, y: 0.95 }, { x: 0.1, y: 0.7 }, { x: 0.1, y: 0.3 }, { x: 0.2, y: 0.05 }, { x: 0.5, y: 0.05 }],
  ],
  'P': [
    // Vertical stem
    [{ x: 0.25, y: 0.05 }, { x: 0.25, y: 0.95 }],
    // Top lobe
    [{ x: 0.25, y: 0.05 }, { x: 0.6, y: 0.05 }, { x: 0.75, y: 0.2 }, { x: 0.75, y: 0.35 }, { x: 0.6, y: 0.5 }, { x: 0.25, y: 0.5 }],
  ],
  'Q': [
    // Circle
    [{ x: 0.5, y: 0.05 }, { x: 0.8, y: 0.05 }, { x: 0.9, y: 0.3 }, { x: 0.9, y: 0.7 }, { x: 0.8, y: 0.95 }, { x: 0.5, y: 0.95 }, { x: 0.2, y: 0.95 }, { x: 0.1, y: 0.7 }, { x: 0.1, y: 0.3 }, { x: 0.2, y: 0.05 }, { x: 0.5, y: 0.05 }],
    // Tail
    [{ x: 0.65, y: 0.7 }, { x: 0.85, y: 1.05 }],
  ],
  'R': [
    // Vertical stem
    [{ x: 0.25, y: 0.05 }, { x: 0.25, y: 0.95 }],
    // Top lobe
    [{ x: 0.25, y: 0.05 }, { x: 0.6, y: 0.05 }, { x: 0.75, y: 0.2 }, { x: 0.75, y: 0.35 }, { x: 0.6, y: 0.5 }, { x: 0.25, y: 0.5 }],
    // Leg
    [{ x: 0.5, y: 0.5 }, { x: 0.8, y: 0.95 }],
  ],
  'S': [
    // S curve
    [{ x: 0.75, y: 0.15 }, { x: 0.55, y: 0.05 }, { x: 0.25, y: 0.15 }, { x: 0.25, y: 0.35 }, { x: 0.5, y: 0.5 }, { x: 0.75, y: 0.65 }, { x: 0.75, y: 0.85 }, { x: 0.55, y: 0.95 }, { x: 0.25, y: 0.85 }],
  ],
  'T': [
    // Horizontal top
    [{ x: 0.1, y: 0.05 }, { x: 0.9, y: 0.05 }],
    // Vertical stem
    [{ x: 0.5, y: 0.05 }, { x: 0.5, y: 0.95 }],
  ],
  'U': [
    // Left vertical
    [{ x: 0.2, y: 0.05 }, { x: 0.2, y: 0.7 }],
    // Bottom curve
    [{ x: 0.2, y: 0.7 }, { x: 0.3, y: 0.95 }, { x: 0.5, y: 0.95 }, { x: 0.7, y: 0.95 }, { x: 0.8, y: 0.7 }],
    // Right vertical
    [{ x: 0.8, y: 0.7 }, { x: 0.8, y: 0.05 }],
  ],
  'V': [
    // Left diagonal
    [{ x: 0.1, y: 0.05 }, { x: 0.5, y: 0.95 }],
    // Right diagonal
    [{ x: 0.5, y: 0.95 }, { x: 0.9, y: 0.05 }],
  ],
  'W': [
    // Left diagonal down
    [{ x: 0.05, y: 0.05 }, { x: 0.25, y: 0.95 }],
    // Left diagonal up
    [{ x: 0.25, y: 0.95 }, { x: 0.5, y: 0.4 }],
    // Right diagonal down
    [{ x: 0.5, y: 0.4 }, { x: 0.75, y: 0.95 }],
    // Right diagonal up
    [{ x: 0.75, y: 0.95 }, { x: 0.95, y: 0.05 }],
  ],
  'X': [
    // Left diagonal
    [{ x: 0.15, y: 0.05 }, { x: 0.85, y: 0.95 }],
    // Right diagonal
    [{ x: 0.85, y: 0.05 }, { x: 0.15, y: 0.95 }],
  ],
  'Y': [
    // Left diagonal
    [{ x: 0.1, y: 0.05 }, { x: 0.5, y: 0.5 }],
    // Right diagonal
    [{ x: 0.9, y: 0.05 }, { x: 0.5, y: 0.5 }],
    // Vertical stem
    [{ x: 0.5, y: 0.5 }, { x: 0.5, y: 0.95 }],
  ],
  'Z': [
    // Top bar
    [{ x: 0.15, y: 0.05 }, { x: 0.85, y: 0.05 }],
    // Diagonal
    [{ x: 0.85, y: 0.05 }, { x: 0.15, y: 0.95 }],
    // Bottom bar
    [{ x: 0.15, y: 0.95 }, { x: 0.85, y: 0.95 }],
  ],
  ' ': [],
  '.': [
    [{ x: 0.5, y: 0.85 }, { x: 0.5, y: 0.9 }],
  ],
  ',': [
    [{ x: 0.55, y: 0.7 }, { x: 0.45, y: 0.95 }],
  ],
  '!': [
    [{ x: 0.5, y: 0.05 }, { x: 0.5, y: 0.7 }],
    [{ x: 0.5, y: 0.85 }, { x: 0.5, y: 0.9 }],
  ],
  '?': [
    [{ x: 0.25, y: 0.05 }, { x: 0.65, y: 0.05 }, { x: 0.8, y: 0.2 }, { x: 0.8, y: 0.35 }, { x: 0.5, y: 0.5 }, { x: 0.5, y: 0.6 }],
    [{ x: 0.5, y: 0.85 }, { x: 0.5, y: 0.9 }],
  ],
  ':': [
    [{ x: 0.5, y: 0.3 }, { x: 0.5, y: 0.35 }],
    [{ x: 0.5, y: 0.65 }, { x: 0.5, y: 0.7 }],
  ],
  '-': [
    [{ x: 0.25, y: 0.5 }, { x: 0.75, y: 0.5 }],
  ],
  '\'': [
    [{ x: 0.45, y: 0.05 }, { x: 0.45, y: 0.25 }],
  ],
  '"': [
    [{ x: 0.35, y: 0.05 }, { x: 0.35, y: 0.25 }],
    [{ x: 0.65, y: 0.05 }, { x: 0.65, y: 0.25 }],
  ],
  '0': [
    [{ x: 0.5, y: 0.05 }, { x: 0.8, y: 0.05 }, { x: 0.9, y: 0.3 }, { x: 0.9, y: 0.7 }, { x: 0.8, y: 0.95 }, { x: 0.5, y: 0.95 }, { x: 0.2, y: 0.95 }, { x: 0.1, y: 0.7 }, { x: 0.1, y: 0.3 }, { x: 0.2, y: 0.05 }, { x: 0.5, y: 0.05 }],
  ],
  '1': [
    [{ x: 0.35, y: 0.2 }, { x: 0.5, y: 0.05 }],
    [{ x: 0.5, y: 0.05 }, { x: 0.5, y: 0.95 }],
  ],
  '2': [
    [{ x: 0.2, y: 0.25 }, { x: 0.4, y: 0.05 }, { x: 0.7, y: 0.05 }, { x: 0.85, y: 0.25 }, { x: 0.5, y: 0.5 }],
    [{ x: 0.2, y: 0.95 }, { x: 0.85, y: 0.95 }],
  ],
  '3': [
    [{ x: 0.2, y: 0.15 }, { x: 0.45, y: 0.05 }, { x: 0.7, y: 0.15 }, { x: 0.7, y: 0.35 }, { x: 0.5, y: 0.5 }],
    [{ x: 0.25, y: 0.65 }, { x: 0.5, y: 0.5 }, { x: 0.7, y: 0.65 }, { x: 0.7, y: 0.85 }, { x: 0.5, y: 0.95 }, { x: 0.2, y: 0.85 }],
  ],
  '4': [
    [{ x: 0.15, y: 0.05 }, { x: 0.15, y: 0.6 }],
    [{ x: 0.15, y: 0.6 }, { x: 0.85, y: 0.6 }],
    [{ x: 0.85, y: 0.05 }, { x: 0.85, y: 0.95 }],
  ],
  '5': [
    [{ x: 0.7, y: 0.05 }, { x: 0.25, y: 0.05 }],
    [{ x: 0.25, y: 0.05 }, { x: 0.25, y: 0.5 }],
    [{ x: 0.25, y: 0.5 }, { x: 0.7, y: 0.5 }, { x: 0.85, y: 0.7 }, { x: 0.85, y: 0.85 }, { x: 0.6, y: 0.95 }, { x: 0.25, y: 0.85 }],
  ],
  '6': [
    [{ x: 0.7, y: 0.15 }, { x: 0.4, y: 0.05 }, { x: 0.15, y: 0.3 }, { x: 0.15, y: 0.7 }, { x: 0.4, y: 0.95 }, { x: 0.75, y: 0.85 }, { x: 0.85, y: 0.65 }, { x: 0.85, y: 0.5 }, { x: 0.6, y: 0.5 }, { x: 0.25, y: 0.6 }],
  ],
  '7': [
    [{ x: 0.15, y: 0.05 }, { x: 0.85, y: 0.05 }],
    [{ x: 0.85, y: 0.05 }, { x: 0.35, y: 0.95 }],
  ],
  '8': [
    // Upper loop
    [{ x: 0.5, y: 0.5 }, { x: 0.25, y: 0.35 }, { x: 0.25, y: 0.15 }, { x: 0.5, y: 0.05 }, { x: 0.75, y: 0.15 }, { x: 0.75, y: 0.35 }, { x: 0.5, y: 0.5 }],
    // Lower loop
    [{ x: 0.5, y: 0.5 }, { x: 0.25, y: 0.65 }, { x: 0.25, y: 0.85 }, { x: 0.5, y: 0.95 }, { x: 0.75, y: 0.85 }, { x: 0.75, y: 0.65 }, { x: 0.5, y: 0.5 }],
  ],
  '9': [
    [{ x: 0.75, y: 0.5 }, { x: 0.75, y: 0.65 }, { x: 0.6, y: 0.95 }, { x: 0.35, y: 0.95 }, { x: 0.15, y: 0.8 }, { x: 0.15, y: 0.65 }, { x: 0.35, y: 0.5 }, { x: 0.6, y: 0.5 }, { x: 0.85, y: 0.35 }, { x: 0.85, y: 0.15 }, { x: 0.6, y: 0.05 }, { x: 0.35, y: 0.05 }],
  ],
};

/**
 * Get strokes for a character
 */
export function getLetterStrokes(char: string): LetterStrokes {
  const upper = char.toUpperCase();
  return LETTER_STROKES[upper] || LETTER_STROKES[' '] || [];
}

/**
 * Get point along a stroke at parameter t (0-1)
 */
export function getStrokePoint(stroke: Stroke, t: number): { x: number; y: number; angle: number } {
  const n = stroke.length - 1;
  
  if (n === 0) return { x: stroke[0].x, y: stroke[0].y, angle: 0 };
  
  if (n === 1) {
    // Line
    return {
      x: stroke[0].x + (stroke[1].x - stroke[0].x) * t,
      y: stroke[0].y + (stroke[1].y - stroke[0].y) * t,
      angle: Math.atan2(stroke[1].y - stroke[0].y, stroke[1].x - stroke[0].x),
    };
  }
  
  // Bezier curve (general case using De Casteljau)
  const pts = [...stroke];
  const mt = 1 - t;
  
  // Apply De Casteljau's algorithm
  for (let k = 1; k <= n; k++) {
    for (let i = 0; i <= n - k; i++) {
      pts[i] = {
        x: mt * pts[i].x + t * pts[i + 1].x,
        y: mt * pts[i].y + t * pts[i + 1].y,
      };
    }
  }
  
  // Approximate angle via Bezier derivative (no recursion)
  const dt = 0.01;
  const tA = Math.max(0, t - dt);
  const tB = Math.min(1, t + dt);
  const evalBezier = (tt: number): { x: number; y: number } => {
    const b = [...stroke];
    const bmt = 1 - tt;
    for (let k = 1; k <= n; k++) {
      for (let i = 0; i <= n - k; i++) {
        b[i] = { x: bmt * b[i].x + tt * b[i + 1].x, y: bmt * b[i].y + tt * b[i + 1].y };
      }
    }
    return b[0];
  };
  const pA = evalBezier(tA);
  const pB = evalBezier(tB);

  return {
    x: pts[0].x,
    y: pts[0].y,
    angle: Math.atan2(pB.y - pA.y, pB.x - pA.x),
  };
}

/**
 * Calculate total number of strokes in text
 */
export function getTextStrokeCount(text: string): number {
  let count = 0;
  for (const ch of text.toUpperCase()) {
    count += getLetterStrokes(ch).length;
  }
  return count;
}

/**
 * Get character index and stroke progress from overall progress
 */
export function getWritingState(text: string, progress: number): {
  charIndex: number;
  strokeIndex: number;
  strokeProgress: number;
} {
  const upper = text.toUpperCase();
  const totalStrokes = getTextStrokeCount(text);
  
  if (totalStrokes === 0 || progress <= 0) {
    return { charIndex: 0, strokeIndex: 0, strokeProgress: 0 };
  }
  
  const currentStroke = Math.floor(progress * totalStrokes);
  let strokeCount = 0;
  
  for (let i = 0; i < upper.length; i++) {
    const strokes = getLetterStrokes(upper[i]);
    if (strokeCount + strokes.length > currentStroke) {
      const localStroke = currentStroke - strokeCount;
      const strokeProgress = (progress * totalStrokes) - currentStroke;
      return {
        charIndex: i,
        strokeIndex: localStroke,
        strokeProgress: Math.min(1, strokeProgress),
      };
    }
    strokeCount += strokes.length;
  }
  
  return { charIndex: upper.length - 1, strokeIndex: 0, strokeProgress: 1 };
}
