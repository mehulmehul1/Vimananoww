/**
 * Knitting Stitch Formula v7 — Sequential Stitch Formation
 *
 * Real knitting: one stitch at a time. The yarn wraps the needle,
 * pulls through a loop, the new stitch slides off. Repeat.
 *
 * Progress controls WHICH stitch is being formed:
 * - 0% = needles ready, no fabric
 * - 50% = halfway through row 5
 * - 100% = all rows complete
 *
 * The working yarn end is always at the "current stitch" being formed.
 */

import type { FormulaFn, LineSegment, FormulaResult } from '../types';
import { seg } from '../helpers';

function noise(t: number, seed: number): number {
  const i = Math.floor(t);
  const f = t - i;
  const u = f * f * (3 - 2 * f);
  const a = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
  const b = Math.sin((i + 1) * 127.1 + seed * 311.7) * 43758.5453;
  return (a - Math.floor(a)) * (1 - u) + (b - Math.floor(b)) * u;
}

function drape(
  row: number, col: number,
  totalRows: number, totalCols: number,
  spacing: number, time: number,
  gravity: number, wind: number,
): { dx: number; dy: number } {
  const rowT = row / Math.max(1, totalRows - 1);
  const colT = col / Math.max(1, totalCols - 1);
  const sag = rowT * rowT * gravity * spacing * 2.5;
  const windX = Math.sin(time * 0.7 + row * 0.4) * wind * spacing * 0.8 * rowT;
  const windX2 = Math.sin(time * 1.3 + col * 0.3) * wind * spacing * 0.3 * rowT;
  const edgeWave = Math.sin(time * 0.5 + row * 0.6) * spacing * 0.15 * (1 - Math.sin(colT * Math.PI)) * rowT;
  const breathe = Math.sin(time * 0.4) * spacing * 0.1 * rowT;
  const centerDroop = Math.sin(colT * Math.PI) * gravity * spacing * 0.75 * rowT;
  const curl = (colT < 0.08 || colT > 0.92)
    ? (colT < 0.5 ? -1 : 1) * (0.5 - Math.abs(colT - 0.5)) * spacing * 0.3 * rowT
    : 0;
  const nx = (noise(row * 0.7 + time * 0.1, col) - 0.5) * spacing * 0.06;
  const ny = (noise(row * 0.7 + time * 0.1, col + 100) - 0.5) * spacing * 0.08;
  return {
    dx: windX + windX2 + edgeWave + curl + nx,
    dy: sag + breathe + centerDroop + ny,
  };
}

export const knittingStitch: FormulaFn = (_text, params, time) => {
  const {
    stitchWidth = 24,
    stitchHeight = 20,
    rows = 10,
    stitchesPerRow = 16,
    needleLength = 160,
    cableFrequency = 0,
    cableOffset = 3,
    yarnSlack = 0.2,
    tension = 0.85,
    progress = 1.0,
    gravity = 1.0,
    wind = 0.4,
  } = params;

  const segments: LineSegment[] = [];
  const spacing = stitchWidth * tension;
  const cols = stitchesPerRow + 1;
  const stitchesPerRow_count = cols - 1;
  const totalStitches = rows * stitchesPerRow_count;

  // Which stitch is currently being formed (0 = none, totalStitches = all done)
  const currentStitch = Math.floor(progress * totalStitches);
  const currentRow = Math.floor(currentStitch / stitchesPerRow_count);
  const currentCol = currentStitch % stitchesPerRow_count;

  const getPos = (r: number, c: number) => {
    const baseX = -((cols - 1) * spacing) / 2 + c * spacing;
    const baseY = -((rows - 1) * spacing) / 2 + r * spacing;
    const d = drape(r, c, rows, cols, spacing, time, gravity, wind);
    return { x: baseX + d.dx, y: baseY + d.dy };
  };

  // ─── Needle animation ──────────────────────────────────────────
  const topRowY = getPos(0, 0).y;
  const needleY = topRowY - spacing * 1.8;
  const rockPhase = time * 1.2;
  const leftRock = Math.sin(rockPhase);
  const rightRock = Math.sin(rockPhase + Math.PI);
  const leftBob = leftRock * 6;
  const rightBob = rightRock * 6;
  const tipConverge = Math.sin(rockPhase * 0.5) * spacing * 0.15;

  const lny = needleY + leftBob;
  const lnxTip = -spacing * 1.2 + tipConverge;
  const rny = needleY + rightBob;
  const rnxTip = spacing * 1.2 - tipConverge;

  // Left needle
  segments.push({
    ...seg(-needleLength - 20, lny - 10 + Math.sin(leftRock * 0.12) * needleLength * 0.3, lnxTip, lny, 0),
    visualOnly: true,
  });
  segments.push({ ...seg(lnxTip, lny, lnxTip + 16, lny + 7, 0), visualOnly: true });

  // Right needle
  segments.push({
    ...seg(needleLength + 20, rny - 10 + Math.sin(rightRock * 0.12) * needleLength * 0.3, rnxTip, rny, 0),
    visualOnly: true,
  });
  segments.push({ ...seg(rnxTip, rny, rnxTip - 16, rny + 7, 0), visualOnly: true });

  // ─── Active loops on needles (visualOnly) ──────────────────────
  const loopStartX = lnxTip + 16;
  const activeCount = Math.min(stitchesPerRow_count, 10);
  const activeSpacing = (rnxTip - loopStartX - 10) / (activeCount + 1);

  for (let i = 1; i <= activeCount; i++) {
    const t = i / (activeCount + 1);
    const lx = loopStartX + activeSpacing * i;
    const ly = lny + (rny - lny) * t + 4;
    const loopH = 8 + Math.sin(time * 2 + i * 0.5) * 1.5;
    segments.push({ ...seg(lx - 4, ly + loopH, lx - 1, ly, 0), visualOnly: true });
    segments.push({ ...seg(lx + 1, ly, lx + 4, ly + loopH, 0), visualOnly: true });
    segments.push({ ...seg(lx - 4, ly + loopH, lx, ly + loopH + 2, 0), visualOnly: true });
    segments.push({ ...seg(lx, ly + loopH + 2, lx + 4, ly + loopH, 0), visualOnly: true });
  }

  // ─── Yarn source to needle ─────────────────────────────────────
  const yarnSourceX = needleLength + 80;
  const yarnSourceY = rny - 40;
  segments.push({ ...seg(yarnSourceX, yarnSourceY, rnxTip + 12, rny - 6, 0.1) });
  segments.push({ ...seg(rnxTip + 12, rny - 6, rnxTip + 4, rny + 12, 0.15) });
  segments.push({ ...seg(rnxTip + 4, rny + 12, rnxTip - 6, rny + 8, 0.15) });

  // ─── Sequential stitch formation ──────────────────────────────
  // Completed stitches: render full V + connector
  // Current stitch: render partial (yarn forming it)
  // Future stitches: nothing

  // First: needle drop to row 0, col 0 (if any stitches formed)
  if (currentStitch > 0) {
    const firstPos = getPos(0, 0);
    segments.push({ ...seg(rnxTip - 6, rny + 8, firstPos.x + spacing * 0.3, firstPos.y + spacing * 0.4, 0.1) });
  }

  // Render each completed stitch and its connectors
  for (let s = 0; s < currentStitch; s++) {
    const row = Math.floor(s / stitchesPerRow_count);
    const colInRow = s % stitchesPerRow_count;
    const isEvenRow = row % 2 === 0;
    const c = isEvenRow ? colInRow : stitchesPerRow_count - 1 - colInRow;
    const cNext = isEvenRow ? colInRow + 1 : stitchesPerRow_count - 2 - colInRow;

    const pos = getPos(row, c);
    const posNext = getPos(row, cNext);

    // Stitch V-shape
    const cx = (pos.x + posNext.x) / 2;
    const bottomY = pos.y + spacing * 0.5;
    const topY = pos.y - spacing * 0.2;
    const leftX = pos.x + spacing * 0.1;
    const rightX = posNext.x - spacing * 0.1;

    let cableShift = 0;
    if (cableFrequency > 0 && c % cableFrequency === 0 && c + cableOffset < cols - 1) {
      cableShift = Math.sin(time * 0.4 + c * 0.7) * spacing * 0.25;
    }

    // Full V (completed stitch)
    segments.push({ ...seg(leftX + cableShift, bottomY, cx + cableShift, topY, row * 0.06) });
    segments.push({ ...seg(cx + cableShift, topY, rightX + cableShift, bottomY, row * 0.06) });

    // Connector to next stitch (if not last in row)
    if (colInRow < stitchesPerRow_count - 1) {
      const slackY = bottomY + spacing * yarnSlack;
      const nextC = isEvenRow ? colInRow + 1 : stitchesPerRow_count - 2 - colInRow;
      const nextPos = getPos(row, isEvenRow ? colInRow + 2 : stitchesPerRow_count - 3 - colInRow);
      segments.push({ ...seg(rightX + cableShift, bottomY, (rightX + nextPos.x - spacing * 0.1) / 2, slackY, row * 0.06 + 0.03) });
      segments.push({ ...seg((rightX + nextPos.x - spacing * 0.1) / 2, slackY, nextPos.x - spacing * 0.1 + cableShift, bottomY, row * 0.06 + 0.03) });
    }

    // Row-end connector (yarn travels up to next row)
    if (colInRow === stitchesPerRow_count - 1 && row < currentRow) {
      const endPos = getPos(row, cNext);
      const nextRowStart = isEvenRow ? 0 : stitchesPerRow_count;
      const nextPos = getPos(row + 1, nextRowStart);
      const midX = (endPos.x + nextPos.x) / 2;
      const midY = endPos.y - spacing * 0.3;
      segments.push({ ...seg(endPos.x, endPos.y - spacing * 0.4, midX, midY, 0.2) });
      segments.push({ ...seg(midX, midY, nextPos.x, nextPos.y + spacing * 0.3, 0.2) });
    }
  }

  // ─── Current stitch being formed (partial V) ──────────────────
  if (currentStitch < totalStitches && currentStitch > 0) {
    const row = currentRow;
    const colInRow = currentCol;
    const isEvenRow = row % 2 === 0;
    const c = isEvenRow ? colInRow : stitchesPerRow_count - 1 - colInRow;
    const cNext = isEvenRow ? colInRow + 1 : stitchesPerRow_count - 2 - colInRow;

    const pos = getPos(row, c);
    const posNext = getPos(row, cNext);

    const cx = (pos.x + posNext.x) / 2;
    const bottomY = pos.y + spacing * 0.5;
    const topY = pos.y - spacing * 0.2;
    const leftX = pos.x + spacing * 0.1;
    const rightX = posNext.x - spacing * 0.1;

    // Partial stitch: yarn is forming the V
    // Interpolation: 0 = just started, 1 = almost done
    const stitchProgress = (progress * totalStitches) - currentStitch;

    if (stitchProgress < 0.5) {
      // First half: left leg forming
      const t = stitchProgress * 2;
      const endX = leftX + (cx - leftX) * t;
      const endY = bottomY + (topY - bottomY) * t;
      segments.push({ ...seg(leftX, bottomY, endX, endY, row * 0.06) });
    } else {
      // Second half: right leg forming
      const t = (stitchProgress - 0.5) * 2;
      const endX = cx + (rightX - cx) * t;
      const endY = topY + (bottomY - topY) * t;
      segments.push({ ...seg(cx, topY, endX, endY, row * 0.06) });
    }

    // Working yarn end: always at the current stitch tip
    const yarnEndX = stitchProgress < 0.5 ? leftX + (cx - leftX) * (stitchProgress * 2) : cx + (rightX - cx) * ((stitchProgress - 0.5) * 2);
    const yarnEndY = stitchProgress < 0.5 ? bottomY + (topY - bottomY) * (stitchProgress * 2) : topY + (bottomY - topY) * ((stitchProgress - 0.5) * 2);

    // Small dot at yarn end (the active stitch point)
    segments.push({ ...seg(yarnEndX - 2, yarnEndY, yarnEndX + 2, yarnEndY, 0) });
    segments.push({ ...seg(yarnEndX, yarnEndY - 2, yarnEndX, yarnEndY + 2, 0) });
  }

  // ─── Yarn tail ────────────────────────────────────────────────
  if (currentStitch >= totalStitches) {
    const tailCol = rows % 2 === 0 ? 0 : cols - 1;
    const tail = getPos(rows - 1, tailCol);
    segments.push({ ...seg(tail.x, tail.y, tail.x - 50, tail.y + 20, 0) });
    segments.push({ ...seg(tail.x - 50, tail.y + 20, tail.x - 90, tail.y + 12, 0) });
  }

  return { type: 'segments', segments };
};
