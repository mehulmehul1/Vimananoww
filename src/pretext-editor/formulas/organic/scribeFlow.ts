/**
 * THE SCRIBE — Paper stack with progressive reveal and flying pages
 *
 * Visual: A stack of papers viewed from a high-angle, three-quarter perspective.
 * The quill writes on the top page. When complete, the page flies away
 * (curves, rotates, fades) revealing the next page underneath.
 *
 * Stack anatomy:
 *   - Bottom layers: visible as edge lines on the left side
 *   - Active page: where writing happens, lines reveal progressively
 *   - Flying pages: completed pages animate upward with curl and fade
 *
 * Progress: 0 to totalPages (4). Each 1.0 = one full page written.
 */

import type { FormulaFn, LineSegment, FormulaResult } from '../types';
import { seg } from '../helpers';

export interface ScribeParams {
  pageWidth?: number;
  pageHeight?: number;
  marginX?: number;
  marginY?: number;
  lineSpacing?: number;
  linesPerPage?: number;
  totalPages?: number;
  progress?: number;
  stackLayers?: number;
  [key: string]: unknown;
}

export const scribeFlow: FormulaFn = (
  _text,
  params,
  _time,
): FormulaResult => {
  const pageWidth = (params as ScribeParams).pageWidth ?? 300;
  const pageHeight = (params as ScribeParams).pageHeight ?? 420;
  const marginX = (params as ScribeParams).marginX ?? 30;
  const marginY = (params as ScribeParams).marginY ?? 40;
  const lineSpacing = (params as ScribeParams).lineSpacing ?? 22;
  const linesPerPage = (params as ScribeParams).linesPerPage ?? 16;
  const totalPages = (params as ScribeParams).totalPages ?? 4;
  const progress = (params as ScribeParams).progress ?? 0;
  const stackLayers = (params as ScribeParams).stackLayers ?? 6;

  const segments: LineSegment[] = [];

  // ── Progress decomposition ──────────────────────────────────────
  const clampedProgress = Math.max(0, Math.min(progress, totalPages));
  const currentPageIndex = Math.min(Math.floor(clampedProgress), totalPages - 1);
  const progressWithinPage = clampedProgress - currentPageIndex;
  const currentLineFloat = progressWithinPage * linesPerPage;
  const currentLineIndex = Math.min(Math.floor(currentLineFloat), linesPerPage - 1);
  const progressWithinLine = currentLineFloat - currentLineIndex;

  // ── Page geometry ───────────────────────────────────────────────
  const lineStartX = -pageWidth / 2 + marginX;
  const lineEndX = pageWidth / 2 - marginX;
  const lineStartY = -pageHeight / 2 + marginY;
  const lineLength = lineEndX - lineStartX;

  // ── 1. Stack edge lines (bottom layers visible on left side) ────
  // These represent the thickness of the paper stack
  const edgeX = -pageWidth / 2 - 2;
  const edgeStartY = -pageHeight / 2 + 3;
  const layerSpacing = 2.5;

  for (let i = 0; i < stackLayers; i++) {
    const y = edgeStartY + i * layerSpacing;
    // Short horizontal line showing page edge
    segments.push({
      ...seg(edgeX - 4, y, edgeX + 12, y, 0),
      visualOnly: true,
    });
  }

  // ── 2. Active page border ──────────────────────────────────────
  const px = -pageWidth / 2;
  const py = -pageHeight / 2;

  // Full page outline
  segments.push({ ...seg(px, py, px + pageWidth, py, 0), visualOnly: true });
  segments.push({ ...seg(px + pageWidth, py, px + pageWidth, py + pageHeight, 0), visualOnly: true });
  segments.push({ ...seg(px + pageWidth, py + pageHeight, px, py + pageHeight, 0), visualOnly: true });
  segments.push({ ...seg(px, py + pageHeight, px, py, 0), visualOnly: true });

  // ── 3. Manuscript lines (for text layout) ──────────────────────
  const visibleLines = currentLineIndex + 1;

  for (let lineIdx = 0; lineIdx < visibleLines; lineIdx++) {
    const y = lineStartY + lineIdx * lineSpacing;

    if (lineIdx === currentLineIndex) {
      // Current line: partially revealed
      const revealLength = lineLength * Math.max(0.02, progressWithinLine);
      segments.push({
        ...seg(lineStartX, y, lineStartX + revealLength, y, 0),
      });
    } else {
      // Completed line: fully visible
      segments.push({
        ...seg(lineStartX, y, lineEndX, y, 0),
      });
    }
  }

  return { type: 'segments', segments };
};
