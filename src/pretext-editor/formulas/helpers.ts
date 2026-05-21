import type { LineSegment } from './types';

/**
 * Create a line segment with calculated angle and length
 */
export function seg(
  x1: number, y1: number,
  x2: number, y2: number,
  depth: number,
  visualOnly?: boolean
): LineSegment {
  const dx = x2 - x1, dy = y2 - y1;
  return {
    x1, y1, x2, y2,
    angle: Math.atan2(dy, dx),
    length: Math.sqrt(dx * dx + dy * dy),
    depth,
    visualOnly,
  };
}


