import { prepareWithSegments, layoutNextLine, type LayoutCursor } from '@chenglou/pretext';

export interface LineSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  length: number;
  angle: number;
  depth: number;
  visualOnly?: boolean;
}

export interface LinePlacement {
  text: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  opacity: number;
}

export interface SegmentMapping {
  placements: LinePlacement[];
  segmentIndices: number[];
}

/**
 * Layouts text along line segments with tangent rotation.
 * Extracted from AssetGenerator for shared use in Design Review layouts.
 */
export function layoutTextOnSegments(text: string, segments: LineSegment[], fontSize: number, fontFamily: string): SegmentMapping {
  if (!text.trim() || segments.length === 0) return { placements: [], segmentIndices: [] };
  
  const font = `600 ${fontSize}px ${fontFamily}`;
  const prepared = prepareWithSegments(text, font);
  const placements: LinePlacement[] = [];
  const segmentIndices: number[] = [];
  let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };

  const indexed = segments.map((seg, i) => ({ seg, index: i }));
  const sorted = indexed.sort((a, b) => {
    const midA = (a.seg.y1 + a.seg.y2) / 2;
    const midB = (b.seg.y1 + b.seg.y2) / 2;
    if (Math.abs(midA - midB) > 20) return midA - midB;
    return (a.seg.x1 + a.seg.x2) / 2 - (b.seg.x1 + b.seg.x2) / 2;
  });

  for (const { seg, index } of sorted) {
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
    segmentIndices.push(index);

    cursor = line.end;
  }

  return { placements, segmentIndices };
}

/**
 * Layouts text filling the interior of a shape.
 */
export function layoutTextInShape(
  text: string, 
  boundsFn: (y: number) => { left: number; right: number } | null, 
  fontSize: number, 
  fontFamily: string,
  lineHeight: number = 28
): LinePlacement[] {
  if (!text.trim()) return [];

  const font = `600 ${fontSize}px ${fontFamily}`;
  const prepared = prepareWithSegments(text, font);
  const placements: LinePlacement[] = [];
  let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };

  for (let y = -400; y < 400; y += lineHeight) {
    const bounds = boundsFn(y);
    if (!bounds || bounds.right - bounds.left < fontSize * 2) continue;

    const line = layoutNextLine(prepared, cursor, bounds.right - bounds.left);
    if (!line) break;

    placements.push({
      text: line.text,
      x: bounds.left,
      y: y,
      rotation: 0,
      scale: 1.0,
      opacity: 0.9,
    });

    cursor = line.end;
  }

  return placements;
}

/**
 * Computes optimal camera transform to center content.
 */
export function computeCamera(placements: LinePlacement[], width: number, height: number) {
  if (placements.length === 0) return { scale: 1, x: 0, y: 0 };

  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  for (const p of placements) {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x + p.text.length * 12 * p.scale);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y + 20 * p.scale);
  }

  const contentW = maxX - minX + 100;
  const contentH = maxY - minY + 100;
  const scaleX = width / contentW;
  const scaleY = height / contentH;
  const scale = Math.min(scaleX, scaleY, 3) * 0.85;

  return {
    scale,
    x: -((minX + maxX) / 2) * scale,
    y: -((minY + maxY) / 2) * scale,
  };
}
