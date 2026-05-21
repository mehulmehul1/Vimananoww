import type { LineSegment } from '../pretext-editor/formulas';
import { prepareWithSegments, layoutNextLine, type LayoutCursor } from '@chenglou/pretext';

export interface LinePlacement {
  text: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  opacity: number;
}

/**
 * Layout pretext text along formula-generated line segments.
 * Shared across all Act 1 scenes that use formulas (textCircle, cymaticRing, etc.)
 */
export function layoutTextOnSegments(
  text: string,
  segments: LineSegment[],
  fontSize: number,
  fontFamily: string
): LinePlacement[] {
  if (!text.trim() || segments.length === 0) return [];

  const font = `600 ${fontSize}px ${fontFamily}`;
  const prepared = prepareWithSegments(text, font);
  const placements: LinePlacement[] = [];
  let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };

  const indexed = segments.map((seg, i) => ({ seg, index: i }));
  const sorted = indexed.sort((a, b) => {
    const midA = (a.seg.y1 + a.seg.y2) / 2;
    const midB = (b.seg.y1 + b.seg.y2) / 2;
    if (Math.abs(midA - midB) > 20) return midA - midB;
    return (a.seg.x1 + a.seg.x2) / 2 - (b.seg.x1 + b.seg.x2) / 2;
  });

  for (const { seg } of sorted) {
    if (seg.visualOnly) continue;
    const depthScale = Math.max(0.2, 1.0 - seg.depth * 0.12);
    if (seg.length < fontSize * depthScale * 0.5) continue;

    const line = layoutNextLine(prepared, cursor, seg.length * 0.9 / depthScale);
    if (!line) {
      cursor = { segmentIndex: 0, graphemeIndex: 0 };
      continue;
    }

    const midX = (seg.x1 + seg.x2) / 2;
    const midY = (seg.y1 + seg.y2) / 2;

    placements.push({
      text: line.text,
      x: midX - (line.width / 2) * Math.cos(seg.angle) * depthScale,
      y: midY - (line.width / 2) * Math.sin(seg.angle) * depthScale,
      rotation: seg.angle,
      scale: depthScale,
      opacity: 0.6 + depthScale * 0.4,
    });
    cursor = line.end;
  }

  return placements;
}
