/**
 * Knitting Stitch Formula v3 — Fluid fabric with animated needles
 *
 * - Needles rock/tilt based on scroll progress (simulates knitting motion)
 * - Fabric drapes organically: rows bow, edges wave, gravity pulls lower rows
 * - Stitches have organic variation + slight jitter
 * - Scroll-driven reveal with fluid growth
 */

import type { FormulaFn, LineSegment, FormulaResult } from '../types';
import { seg } from '../helpers';

function stitchRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** Smooth noise for organic curves */
function smoothNoise(t: number, seed: number): number {
  const i = Math.floor(t);
  const f = t - i;
  const u = f * f * (3 - 2 * f); // smoothstep
  return lerp(stitchRandom(i + seed), stitchRandom(i + 1 + seed), u);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export const knittingStitch: FormulaFn = (_text, params, time) => {
  const {
    stitchWidth = 24,
    stitchHeight = 20,
    rows = 12,
    stitchesPerRow = 16,
    needleLength = 160,
    cableFrequency = 0,
    cableOffset = 3,
    yarnSlack = 0.2,
    tension = 0.85,
    progress = 1.0,
  } = params;

  const segments: LineSegment[] = [];
  const w = stitchWidth * tension;
  const h = stitchHeight * tension;
  const baseRowHeight = h * 1.5;
  const halfW = w / 2;

  // Visible rows (scroll-driven)
  const visibleRows = Math.floor(rows * Math.min(1, Math.max(0, progress)));
  if (visibleRows === 0) return { type: 'segments', segments };

  // ─── Needle animation (tilts based on scroll progress) ──────────
  // Left needle tilts up, right needle tilts down (and vice versa)
  const needleTilt = Math.sin(progress * Math.PI * 2) * 0.06;
  const needleBob = Math.sin(progress * Math.PI * 3) * 4;

  const fabricCenterY = 0;
  const fabricTopY = fabricCenterY - (rows * baseRowHeight) / 2 - h * 2;

  // Left needle position (animated)
  const leftNeedleY = fabricTopY - h * 1.5 + needleBob;
  const leftNeedleAngle = -needleTilt;
  const leftTipX = -25;
  const leftTipY = leftNeedleY + 6;

  // Right needle position (animated — opposite phase)
  const rightNeedleY = fabricTopY - h * 1.5 - needleBob;
  const rightNeedleAngle = needleTilt;
  const rightTipX = 25;
  const rightTipY = rightNeedleY + 6;

  // Left needle (rotated)
  const lnx1 = -needleLength - 20;
  const lny1 = leftNeedleY - 10;
  const lnx2 = leftTipX;
  const lny2 = leftTipY;
  segments.push({
    ...seg(
      lnx1 * Math.cos(leftNeedleAngle) - lny1 * Math.sin(leftNeedleAngle),
      lnx1 * Math.sin(leftNeedleAngle) + lny1 * Math.cos(leftNeedleAngle),
      lnx2 * Math.cos(leftNeedleAngle) - lny2 * Math.sin(leftNeedleAngle),
      lnx2 * Math.sin(leftNeedleAngle) + lny2 * Math.cos(leftNeedleAngle),
      0
    ),
    visualOnly: true,
  });
  // Left needle tip
  segments.push({
    ...seg(
      leftTipX * Math.cos(leftNeedleAngle) - leftTipY * Math.sin(leftNeedleAngle),
      leftTipX * Math.sin(leftNeedleAngle) + leftTipY * Math.cos(leftNeedleAngle),
      (leftTipX + 14) * Math.cos(leftNeedleAngle) - (leftTipY + 6) * Math.sin(leftNeedleAngle),
      (leftTipX + 14) * Math.sin(leftNeedleAngle) + (leftTipY + 6) * Math.cos(leftNeedleAngle),
      0
    ),
    visualOnly: true,
  });

  // Right needle (rotated)
  const rnx1 = needleLength + 20;
  const rny1 = rightNeedleY - 10;
  segments.push({
    ...seg(
      rnx1 * Math.cos(rightNeedleAngle) - rny1 * Math.sin(rightNeedleAngle),
      rnx1 * Math.sin(rightNeedleAngle) + rny1 * Math.cos(rightNeedleAngle),
      rightTipX * Math.cos(rightNeedleAngle) - rightTipY * Math.sin(rightNeedleAngle),
      rightTipX * Math.sin(rightNeedleAngle) + rightTipY * Math.cos(rightNeedleAngle),
      0
    ),
    visualOnly: true,
  });
  // Right needle tip
  segments.push({
    ...seg(
      rightTipX * Math.cos(rightNeedleAngle) - rightTipY * Math.sin(rightNeedleAngle),
      rightTipX * Math.sin(rightNeedleAngle) + rightTipY * Math.cos(rightNeedleAngle),
      (rightTipX - 14) * Math.cos(rightNeedleAngle) - (rightTipY + 6) * Math.sin(rightNeedleAngle),
      (rightTipX - 14) * Math.sin(rightNeedleAngle) + (rightTipY + 6) * Math.cos(rightNeedleAngle),
      0
    ),
    visualOnly: true,
  });

  // ─── Active loops on needles (visualOnly) ──────────────────────
  const activeCount = Math.min(stitchesPerRow, 10);
  const activeSpacing = (40) / (activeCount + 1);

  for (let i = 1; i <= activeCount; i++) {
    const baseX = -20 + i * activeSpacing;
    const baseY = leftTipY + 4;
    const loopH = 8 + stitchRandom(i * 3.7) * 3;

    // Transform by needle angle
    const cosL = Math.cos(leftNeedleAngle);
    const sinL = Math.sin(leftNeedleAngle);
    const tx = (x: number, y: number) => ({
      x: x * cosL - y * sinL,
      y: x * sinL + y * cosL,
    });

    const p1 = tx(baseX - 4, baseY + loopH);
    const p2 = tx(baseX - 1, baseY);
    const p3 = tx(baseX + 1, baseY);
    const p4 = tx(baseX + 4, baseY + loopH);
    const pBot1 = tx(baseX - 4, baseY + loopH);
    const pBotM = tx(baseX, baseY + loopH + 2);
    const pBot2 = tx(baseX + 4, baseY + loopH);

    segments.push({ ...seg(p1.x, p1.y, p2.x, p2.y, 0), visualOnly: true });
    segments.push({ ...seg(p3.x, p3.y, p4.x, p4.y, 0), visualOnly: true });
    segments.push({ ...seg(pBot1.x, pBot1.y, pBotM.x, pBotM.y, 0), visualOnly: true });
    segments.push({ ...seg(pBotM.x, pBotM.y, pBot2.x, pBot2.y, 0), visualOnly: true });
  }

  // ─── Working yarn (from right needle to off-screen) ─────────────
  const yarnSourceX = needleLength + 70;
  const yarnSourceY = rightNeedleY - 40;

  const cosR = Math.cos(rightNeedleAngle);
  const sinR = Math.sin(rightNeedleAngle);
  const rtx = (x: number, y: number) => ({
    x: x * cosR - y * sinR,
    y: x * sinR + y * cosR,
  });

  const yarnToNeedle = rtx(rightTipX + 6, rightTipY - 2);
  const yarnWrap1 = rtx(rightTipX + 2, rightTipY + 10);
  const yarnWrap2 = rtx(rightTipX - 5, rightTipY + 6);
  const yarnDrop = rtx(rightTipX - 8, rightTipY + 30);

  segments.push({ ...seg(yarnSourceX, yarnSourceY, yarnToNeedle.x, yarnToNeedle.y, 0.1) });
  segments.push({ ...seg(yarnToNeedle.x, yarnToNeedle.y, yarnWrap1.x, yarnWrap1.y, 0.15) });
  segments.push({ ...seg(yarnWrap1.x, yarnWrap1.y, yarnWrap2.x, yarnWrap2.y, 0.15) });
  segments.push({ ...seg(yarnWrap2.x, yarnWrap2.y, yarnDrop.x, yarnDrop.y, 0.1) });

  // ─── Yarn tail (bottom left, drooping) ─────────────────────────
  const tailY = fabricCenterY + (visibleRows * baseRowHeight) / 2 + h;
  segments.push({ ...seg(-stitchesPerRow * w / 2 - halfW, tailY, -stitchesPerRow * w / 2 - 55, tailY + 25, 0) });
  segments.push({ ...seg(-stitchesPerRow * w / 2 - 55, tailY + 25, -stitchesPerRow * w / 2 - 100, tailY + 18, 0) });

  // ─── Fabric body: Fluid V-stitches ──────────────────────────────
  const totalWidth = stitchesPerRow * w;

  for (let r = 0; r < visibleRows; r++) {
    // Row Y with gravity: lower rows hang lower (draping effect)
    const gravityDip = Math.pow(r / rows, 1.5) * h * 0.8;
    const rowBaseY = fabricCenterY - (rows * baseRowHeight) / 2 + r * baseRowHeight + gravityDip;

    // Row curvature: bow downward in center (fabric weight)
    const rowBow = Math.sin((r / Math.max(1, rows - 1)) * Math.PI) * h * 0.3;

    const isEvenRow = r % 2 === 0;

    // Edge waviness (left and right edges aren't straight)
    const edgeWaveL = smoothNoise(r * 0.8, 42) * w * 0.3;
    const edgeWaveR = smoothNoise(r * 0.8, 99) * w * 0.3;

    // Row-end connector
    if (r > 0) {
      const prevRow = r - 1;
      const prevGravityDip = Math.pow(prevRow / rows, 1.5) * h * 0.8;
      const prevRowY = fabricCenterY - (rows * baseRowHeight) / 2 + prevRow * baseRowHeight + prevGravityDip;

      const endX = (prevRow % 2 === 0)
        ? -totalWidth / 2 + halfW + edgeWaveL
        : totalWidth / 2 - halfW - edgeWaveR;
      const startX = isEvenRow
        ? -totalWidth / 2 + halfW + edgeWaveL
        : totalWidth / 2 - halfW - edgeWaveR;

      // Curved connector
      const midX = (endX + startX) / 2;
      const midY = prevRowY + baseRowHeight * 0.5;
      segments.push({ ...seg(endX, prevRowY + h * 0.5, midX, midY - 4, 0.2) });
      segments.push({ ...seg(midX, midY - 4, startX, rowBaseY - h * 0.2, 0.2) });
    }

    // First stitch connection
    if (r === 0) {
      const firstX = isEvenRow
        ? -totalWidth / 2 + halfW + edgeWaveL
        : totalWidth / 2 - halfW - edgeWaveR;
      segments.push({ ...seg(yarnDrop.x, yarnDrop.y, firstX, rowBaseY + h * 0.5, 0.1) });
    }

    // Generate curved V-stitches across the row
    for (let s = 0; s < stitchesPerRow; s++) {
      const col = isEvenRow ? s : stitchesPerRow - 1 - s;

      // X position with edge wave interpolation
      const edgeT = col / (stitchesPerRow - 1);
      const edgeOffset = lerp(edgeWaveL, -edgeWaveR, edgeT);
      const x = -totalWidth / 2 + col * w + halfW + edgeOffset;

      // Y with row curvature (bow in center)
      const bowFactor = Math.sin(edgeT * Math.PI);
      const y = rowBaseY + bowFactor * rowBow;

      // Organic wobble
      const seed = r * 100 + s;
      const wobbleX = (stitchRandom(seed) - 0.5) * w * 0.1;
      const wobbleH = (stitchRandom(seed + 50) - 0.5) * h * 0.15;

      // Cable crossing
      let cableShift = 0;
      if (cableFrequency > 0 && col % cableFrequency === 0 && col + cableOffset < stitchesPerRow) {
        const cablePhase = Math.sin(time * 0.4 + col * 0.7);
        cableShift = cablePhase * w * 0.35;
      }

      const cx = x + wobbleX + cableShift;
      const bottomY = y + h + wobbleH;
      const topY = y;

      // Curved V-stitch (6 segments per stitch)
      const leftBotX = cx - halfW * 0.9;
      const leftMidX = cx - halfW * 0.3;
      const leftMidY = bottomY - h * 0.4;
      segments.push({ ...seg(leftBotX, bottomY, leftMidX, leftMidY, r * 0.08) });
      segments.push({ ...seg(leftMidX, leftMidY, cx, topY, r * 0.08) });

      const rightMidX = cx + halfW * 0.3;
      const rightMidY = bottomY - h * 0.4;
      const rightBotX = cx + halfW * 0.9;
      segments.push({ ...seg(cx, topY, rightMidX, rightMidY, r * 0.08) });
      segments.push({ ...seg(rightMidX, rightMidY, rightBotX, bottomY, r * 0.08) });

      // Bottom curve
      segments.push({ ...seg(leftBotX, bottomY, cx, bottomY + 2, r * 0.08 + 0.03) });
      segments.push({ ...seg(cx, bottomY + 2, rightBotX, bottomY, r * 0.08 + 0.03) });

      // Slack connector to next stitch
      if (s < stitchesPerRow - 1) {
        const nextCol = isEvenRow ? col + 1 : col - 1;
        const nextEdgeT = nextCol / (stitchesPerRow - 1);
        const nextEdgeOffset = lerp(edgeWaveL, -edgeWaveR, nextEdgeT);
        const nextX = -totalWidth / 2 + nextCol * w + halfW + nextEdgeOffset;
        const nextBowFactor = Math.sin(nextEdgeT * Math.PI);
        const nextY = rowBaseY + nextBowFactor * rowBow;
        const slackY = Math.max(bottomY, nextY) + h * yarnSlack;

        segments.push({ ...seg(rightBotX, bottomY, (rightBotX + nextX) / 2, slackY, r * 0.08 + 0.04) });
        segments.push({ ...seg((rightBotX + nextX) / 2, slackY, nextX - halfW * 0.9, nextY + h + wobbleH, r * 0.08 + 0.04) });
      }
    }
  }

  return { type: 'segments', segments };
};
