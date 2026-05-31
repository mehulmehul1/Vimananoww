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

export interface LayoutTextOptions {
  /** If true, don't sort segments — use their natural generated order */
  preserveOrder?: boolean;
}

// \p{M} = Unicode Mark category (combining marks, vowel signs, virama etc)
// Only matches if line STARTS with a combining mark (orphaned from base char)
const COMBINING_MARK_RE = /^\p{M}/u;
const COMPLEX_SCRIPT_RE = /[\u0900-\u0D7F\u0600-\u06FF\u0750-\u077F]/;

// Cache prepareWithSegments results — text measurement is expensive
const _preparedCache = new Map<string, ReturnType<typeof prepareWithSegments>>();
function getOrCreatePrepared(text: string, font: string) {
  const key = `${font}|${text}`;
  let cached = _preparedCache.get(key);
  if (!cached) {
    cached = prepareWithSegments(text, font);
    _preparedCache.set(key, cached);
    // Cap cache size
    if (_preparedCache.size > 50) {
      const first = _preparedCache.keys().next().value;
      if (first) _preparedCache.delete(first);
    }
  }
  return cached;
}

/**
 * Layout text along formula-generated line segments.
 * Uses @chenglou/pretext's prepareWithSegments + layoutNextLine —
 * the exact same approach as the pretext-editor (Canvas2DRenderer/AssetGenerator).
 */
export function layoutTextOnSegments(
  text: string,
  segments: LineSegment[],
  fontSize: number,
  fontFamily: string,
  options?: LayoutTextOptions,
): LinePlacement[] {
  if (!text.trim() || segments.length === 0) return [];

  const font = `600 ${fontSize}px ${fontFamily}`;
  const complex = COMPLEX_SCRIPT_RE.test(text);

  const prepared = getOrCreatePrepared(text, font);
  const placements: LinePlacement[] = [];
  let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };

  // Sort or preserve order
  let ordered: LineSegment[];
  if (options?.preserveOrder) {
    ordered = segments;
  } else {
    ordered = [...segments].sort((a, b) => {
      const midA = (a.y1 + a.y2) / 2;
      const midB = (b.y1 + b.y2) / 2;
      if (Math.abs(midA - midB) > 20) return midA - midB;
      return (a.x1 + a.x2) / 2 - (b.x1 + b.x2) / 2;
    });
  }

  for (const seg of ordered) {
    // Skip visual-only segments
    if (seg.visualOnly) continue;

    const depthScale = Math.max(0.15, 1.0 - seg.depth * 0.3);

    // For complex scripts, use wider minimum to avoid broken grapheme clusters
    const minLen = complex ? fontSize * depthScale * 0.5 : fontSize * depthScale * 0.06;
    if (seg.length < minLen) continue;

    const line = layoutNextLine(prepared, cursor, seg.length * 0.9 / depthScale);
    if (!line) {
      cursor = { segmentIndex: 0, graphemeIndex: 0 };
      continue;
    }

    // Skip text with orphaned combining marks (render as dotted circles ◌)
    // Only \p{M} matches actual combining marks, NOT base consonants/vowels
    if (complex && COMBINING_MARK_RE.test(line.text)) {
      cursor = line.end;
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
