import type {
  FormulaFn,
  LineSegment,
} from '../types';

import { seg } from '../helpers';
import {
  getLetterStrokes,
  getStrokePoint,
  getWritingState,
} from './handwritingStrokes';

/**
 * THE SCRIBE — Handwriting strokes as pretext segments
 * 
 * Returns LineSegments that trace letter strokes.
 * Text flows along these stroke paths.
 * Animation controlled by progress parameter.
 */
export const scribeFlow: FormulaFn = (
  text,
  params,
  time
) => {
  const segments: LineSegment[] = [];

  const pageWidth = params.pageWidth ?? 340;
  const pageHeight = params.pageHeight ?? 460;
  const marginX = params.marginX ?? 35;
  const marginY = params.marginY ?? 50;
  const charWidth = params.charWidth ?? 18;
  const charHeight = params.charHeight ?? 24;
  const charsPerLine = params.charsPerLine ?? 16;
  const lineSpacing = params.lineSpacing ?? 26;
  const progress = params.progress ?? 0;

  // Page bounds
  const paperX = -pageWidth / 2;
  const paperY = -pageHeight / 2;

  // Get writing state
  const upperText = text.toUpperCase();
  const writingState = getWritingState(upperText, progress);

  // =========================================
  // BORDER SEGMENTS (visual only)
  // =========================================
  const borderInset = 12;
  segments.push(seg(paperX + borderInset, paperY + borderInset, paperX + pageWidth - borderInset, paperY + borderInset, 0, true));
  segments.push(seg(paperX + pageWidth - borderInset, paperY + borderInset, paperX + pageWidth - borderInset, paperY + pageHeight - borderInset, 0, true));
  segments.push(seg(paperX + pageWidth - borderInset, paperY + pageHeight - borderInset, paperX + borderInset, paperY + pageHeight - borderInset, 0, true));
  segments.push(seg(paperX + borderInset, paperY + pageHeight - borderInset, paperX + borderInset, paperY + borderInset, 0, true));

  // Header line
  segments.push(seg(paperX + marginX, paperY + marginY - 20, paperX + pageWidth - marginX, paperY + marginY - 20, 0, true));

  // Footer line
  segments.push(seg(paperX + pageWidth / 2 - 35, paperY + pageHeight - marginY + 20, paperX + pageWidth / 2 + 35, paperY + pageHeight - marginY + 20, 0, true));

  // =========================================
  // HANDWRITING STROKE SEGMENTS
  // =========================================
  for (let i = 0; i < upperText.length; i++) {
    const ch = upperText[i];
    const strokes = getLetterStrokes(ch);

    // Calculate character position on page
    const lineIdx = Math.floor(i / charsPerLine);
    const charInLine = i % charsPerLine;
    const charX = paperX + marginX + charInLine * charWidth;
    const charY = paperY + marginY + lineIdx * lineSpacing;

    // Check if character is written
    const charFullyWritten = i < writingState.charIndex;
    const charIsCurrent = i === writingState.charIndex;

    if (!charFullyWritten && !charIsCurrent) continue;

    // Draw each stroke of the letter
    for (let s = 0; s < strokes.length; s++) {
      const stroke = strokes[s];
      
      const isFullyDrawn = charFullyWritten || 
        (charIsCurrent && s < writingState.strokeIndex);
      const isCurrentStroke = charIsCurrent && s === writingState.strokeIndex;

      if (!isFullyDrawn && !isCurrentStroke) continue;

      // Sample points along the stroke to create segments
      const samples = 6;
      const drawT = isCurrentStroke ? writingState.strokeProgress : 1;

      for (let p = 0; p < samples; p++) {
        const t1 = (p / samples) * drawT;
        const t2 = ((p + 1) / samples) * drawT;

        const pt1 = getStrokePoint(stroke, t1);
        const pt2 = getStrokePoint(stroke, t2);

        // Transform to page coordinates
        const x1 = charX + pt1.x * charWidth * 0.8;
        const y1 = charY + pt1.y * charHeight * 0.8;
        const x2 = charX + pt2.x * charWidth * 0.8;
        const y2 = charY + pt2.y * charHeight * 0.8;

        // Depth: 1-5 for text lanes, 100+ for visual strokes
        // Use character index % 5 for lane assignment
        const depth = i % 5;
        
        segments.push(seg(x1, y1, x2, y2, depth));
      }
    }
  }

  return {
    type: 'segments',
    segments,
  };
};
