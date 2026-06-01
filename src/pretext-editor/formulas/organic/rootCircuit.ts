import type { FormulaFn, LineSegment } from '../types';
import { seg } from '../helpers';

/**
 * rootCircuit — Technology grown, not built.
 * A dense rhizome knot at bottom, organic tendrils growing upward,
 * connecting to a 3D perspective-tilted circuit grid at top.
 *
 * Parameters:
 *   gridRows       — grid rows (default 10)
 *   gridCols       — grid columns (default 12)
 *   tendrilCount   — number of main tendrils (default 16)
 *   knotStrands    — strands in the knot (default 80)
 *   gridTilt       — perspective tilt in radians (default 0.55)
 *   progress       — scroll progress 0-1 (default 1)
 */

interface CachedRootCircuit {
  gridSegs: LineSegment[];
  tendrilSegs: LineSegment[];
  knotSegs: LineSegment[];
  attachmentPoints: Array<{ x: number; y: number }>;
  gridSegMinDist: number[];  // min distance to nearest attachment point per grid seg
  maxMinDist: number;
  params: string;
}

let cache: CachedRootCircuit | null = null;

function seed(n: number): number {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function buildCache(
  gridRows: number,
  gridCols: number,
  tendrilCount: number,
  knotStrands: number,
  gridTilt: number,
  paramKey: string,
): CachedRootCircuit {
  const gridSegs: LineSegment[] = [];
  const tendrilSegs: LineSegment[] = [];
  const knotSegs: LineSegment[] = [];

  // ─── GRID (2D Perspective) ────────────────────────────────────────
  // Grid is drawn in 2D with a perspective effect: top (back) is narrower
  // than bottom (front), horizontal lines compress going upward.
  // This avoids the coordinate explosion of full 3D projection.
  const gridWidth = 380;
  const gridHeight = 200;
  const gridTop = -170;           // top edge Y
  const persp = gridTilt * 0.65;  // 0 = flat, ~0.36 for tilt=0.55

  // Collect grid intersection points for tendril attachment
  const gridPoints: Array<{ x: number; y: number; row: number; col: number }> = [];

  for (let r = 0; r <= gridRows; r++) {
    const t = r / gridRows; // 0 = top (back), 1 = bottom (front)
    const rowScale = 1 - (1 - t) * persp;
    const rowY = gridTop + t * gridHeight;

    for (let c = 0; c <= gridCols; c++) {
      const x = -gridWidth / 2 + c * (gridWidth / gridCols);
      const sx = x * rowScale;
      const sy = rowY + (t) * (gridWidth / gridCols * 0.15 * (1 - t)); // subtle curve to horizontal lines

      gridPoints.push({ x: sx, y: sy, row: r, col: c });

      // Horizontal lines
      if (c < gridCols) {
        const x2 = -gridWidth / 2 + (c + 1) * (gridWidth / gridCols);
        gridSegs.push(seg(sx, sy, x2 * rowScale, sy, 0));
      }
      // Vertical lines
      if (r < gridRows) {
        const t2 = (r + 1) / gridRows;
        const rowScale2 = 1 - (1 - t2) * persp;
        const rowY2 = gridTop + t2 * gridHeight;
        gridSegs.push(seg(sx, sy, x * rowScale2, rowY2, 0));
      }
    }
  }

  // Grid nodes — small crosses at select intersections (more in back rows)
  for (const pt of gridPoints) {
    const isBackHalf = pt.row > gridRows * 0.3;
    const nodeChance = isBackHalf ? 0.12 : 0.04;
    if (seed(pt.row * 100 + pt.col * 7 + 999) < nodeChance) {
      const s = 2.0;
      gridSegs.push(seg(pt.x - s, pt.y - s, pt.x + s, pt.y + s, 0.5));
      gridSegs.push(seg(pt.x - s, pt.y + s, pt.x + s, pt.y - s, 0.5));
    }
  }

  // ─── KNOT (Dense Rhizome at Bottom) ────────────────────────────────
  const knotCX = 0;
  const knotCY = 180;
  const knotRadiusX = 50;
  const knotRadiusY = 35;

  // Dense tangle of overlapping curved strands
  for (let i = 0; i < knotStrands; i++) {
    const angle1 = seed(i * 11) * Math.PI * 2;
    const angle2 = angle1 + (seed(i * 23) - 0.5) * 2.0;
    const r1 = seed(i * 37) * knotRadiusX;
    const r2 = seed(i * 43) * knotRadiusX;

    const x1 = knotCX + Math.cos(angle1) * r1;
    const y1 = knotCY + Math.sin(angle1) * r1 * (knotRadiusY / knotRadiusX);
    const x2 = knotCX + Math.cos(angle2) * r2;
    const y2 = knotCY + Math.sin(angle2) * r2 * (knotRadiusY / knotRadiusX);

    knotSegs.push(seg(x1, y1, x2, y2, 1 + seed(i * 59) * 0.5));
  }

  // Extra dense core — tighter, smaller loops
  for (let i = 0; i < 30; i++) {
    const angle1 = seed(i * 71 + 500) * Math.PI * 2;
    const angle2 = angle1 + (seed(i * 83 + 500) - 0.5) * 1.2;
    const r1 = seed(i * 97 + 500) * knotRadiusX * 0.5;
    const r2 = seed(i * 109 + 500) * knotRadiusX * 0.5;

    const x1 = knotCX + Math.cos(angle1) * r1;
    const y1 = knotCY + Math.sin(angle1) * r1 * 0.6;
    const x2 = knotCX + Math.cos(angle2) * r2;
    const y2 = knotCY + Math.sin(angle2) * r2 * 0.6;

    knotSegs.push(seg(x1, y1, x2, y2, 1.5));
  }

  // ─── TENDRILS (From Knot → Grid, Organic Curves) ──────────────────
  // Select ~25% of grid bottom-half points as attachment targets
  const attachmentPoints: Array<{ x: number; y: number }> = [];
  for (const pt of gridPoints) {
    if (pt.row >= gridRows * 0.4 && seed(pt.row * 200 + pt.col * 13 + 777) < 0.25) {
      attachmentPoints.push({ x: pt.x, y: pt.y });
    }
  }

  // Ensure we have enough attachment points
  while (attachmentPoints.length < tendrilCount) {
    const row = Math.floor(gridRows * 0.5 + seed(attachmentPoints.length * 31) * gridRows * 0.5);
    const col = Math.floor(seed(attachmentPoints.length * 47 + 111) * gridCols);
    const pt = gridPoints.find(p => p.row === row && p.col === col);
    if (pt) attachmentPoints.push({ x: pt.x, y: pt.y });
  }

  // Generate tendril paths from knot to grid attachment points
  for (let i = 0; i < Math.min(tendrilCount, attachmentPoints.length); i++) {
    const target = attachmentPoints[i];

    // Start point: random position within knot
    const startAngle = seed(i * 31) * Math.PI * 2;
    const startR = seed(i * 47) * knotRadiusX * 0.7;
    const startX = knotCX + Math.cos(startAngle) * startR;
    const startY = knotCY + Math.sin(startAngle) * startR * 0.6;

    // Vector from start to target
    const dx = target.x - startX;
    const dy = target.y - startY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Control points proportional to distance — guarantees organic curves
    // regardless of how far the tendril must travel
    const cpOffset1 = 0.15 + seed(i * 61) * 0.15; // 0.15-0.30
    const cpOffset2 = 0.15 + seed(i * 73) * 0.15; // 0.15-0.30
    const lateralAmt = 0.15 + seed(i * 89) * 0.12; // 0.15-0.27

    // First control: reaches forward, sways sideways significantly
    const cp1x = startX + dx * cpOffset1 + lateralAmt * dist * (seed(i * 101) * 2 - 1);
    const cp1y = startY + dy * cpOffset1 + (seed(i * 113) - 0.5) * dist * 0.12;

    // Second control: pulls back from target, sways sideways opposite
    const cp2x = target.x - dx * cpOffset2 + lateralAmt * dist * (seed(i * 127) * 2 - 1);
    const cp2y = target.y - dy * cpOffset2 - (seed(i * 131) - 0.5) * dist * 0.10;

    // Approximate cubic Bezier with line segments
    const steps = 16;
    let prevX = startX;
    let prevY = startY;

    for (let s = 1; s <= steps; s++) {
      const t = s / steps;
      const mt = 1 - t;

      const x = mt * mt * mt * startX
        + 3 * mt * mt * t * cp1x
        + 3 * mt * t * t * cp2x
        + t * t * t * target.x;
      const y = mt * mt * mt * startY
        + 3 * mt * mt * t * cp1y
        + 3 * mt * t * t * cp2y
        + t * t * t * target.y;

      tendrilSegs.push(seg(prevX, prevY, x, y, 1));
      prevX = x;
      prevY = y;
    }

    // Add organic sub-branches along the tendril
    const branchCount = 1 + Math.floor(seed(i * 139) * 2);
    for (let b = 0; b < branchCount; b++) {
      const branchT = 0.25 + seed(i * 151 + b * 17) * 0.5;
      const mt = 1 - branchT;
      const bx = mt * mt * mt * startX
        + 3 * mt * mt * branchT * cp1x
        + 3 * mt * branchT * branchT * cp2x
        + branchT * branchT * branchT * target.x;
      const by = mt * mt * mt * startY
        + 3 * mt * mt * branchT * cp1y
        + 3 * mt * branchT * branchT * cp2y
        + branchT * branchT * branchT * target.y;

      // Branch direction: perpendicular to main path, slight upward bias
      const mainDx = target.x - startX;
      const mainDy = target.y - startY;
      const mainLen = Math.sqrt(mainDx * mainDx + mainDy * mainDy);
      const perpX = -mainDy / mainLen;
      const perpY = mainDx / mainLen;

      const branchRatio = 0.1 + seed(i * 163 + b * 23) * 0.12;
      const branchLen = dist * branchRatio;
      const side = seed(i * 179 + b * 29) > 0.5 ? 1 : -1;

      const ex = bx + perpX * branchLen * side;
      const ey = by + perpY * branchLen * side - branchLen * 0.15; // upward bias

      tendrilSegs.push(seg(bx, by, ex, ey, 2));
    }
  }

  // ─── Loose strands escaping from bottom of knot ────────────────────
  for (let i = 0; i < 5; i++) {
    const sx = knotCX + (seed(i * 61 + 200) - 0.5) * knotRadiusX * 0.6;
    const sy = knotCY + knotRadiusY * 0.4;
    const ex = sx + (seed(i * 71 + 200) - 0.5) * 25;
    const ey = sy + 20 + seed(i * 79 + 200) * 25;
    knotSegs.push(seg(sx, sy, ex, ey, 2));
  }

  // ─── Pre-compute proximity to attachment points for grid reveal ─────
  const gridSegMinDist: number[] = [];
  let maxMinDist = 0;
  for (const s of gridSegs) {
    const midX = (s.x1 + s.x2) / 2;
    const midY = (s.y1 + s.y2) / 2;
    let minDist = Infinity;
    for (const ap of attachmentPoints) {
      const d = Math.sqrt((midX - ap.x) ** 2 + (midY - ap.y) ** 2);
      if (d < minDist) minDist = d;
    }
    gridSegMinDist.push(minDist);
    if (minDist > maxMinDist) maxMinDist = minDist;
  }

  return { gridSegs, tendrilSegs, knotSegs, attachmentPoints, gridSegMinDist, maxMinDist, params: paramKey };
}

export const rootCircuit: FormulaFn = (_text, params, time) => {
  const gridRows = Math.floor(params.gridRows ?? 10);
  const gridCols = Math.floor(params.gridCols ?? 12);
  const tendrilCount = Math.floor(params.tendrilCount ?? 16);
  const knotStrands = Math.floor(params.knotStrands ?? 80);
  const gridTilt = params.gridTilt ?? 0.55;
  const progress = params.progress ?? 1;

  const paramKey = `${gridRows}-${gridCols}-${tendrilCount}-${knotStrands}-${gridTilt}`;

  if (!cache || cache.params !== paramKey) {
    cache = buildCache(gridRows, gridCols, tendrilCount, knotStrands, gridTilt, paramKey);
  }

  // Gentle breathing animation
  const breathe = 1 + Math.sin(time * 0.2) * 0.008;

  const segments: LineSegment[] = [];

  // ─── PROGRESS-BASED REVEAL ──────────────────────────────────────────
  // 0.0-0.2: Knot appears
  // 0.2-0.6: Tendrils grow upward from knot to grid
  // 0.6-1.0: Grid crystallizes, everything visible

  const knotReveal = Math.min(1, progress * 5);
  const tendrilReveal = Math.max(0, Math.min(1, (progress - 0.15) * 2.5));
  const gridReveal = Math.max(0, Math.min(1, (progress - 0.5) * 2.5));

  // ─── KNOT (always present when visible, breathing) ──────────────────
  for (const s of cache.knotSegs) {
    if (knotReveal <= 0) break;

    // Slight organic movement in the knot
    const wobbleX = Math.sin(time * 0.3 + s.x1 * 0.08) * 1.0;
    const wobbleY = Math.cos(time * 0.25 + s.y1 * 0.08) * 0.8;

    segments.push(seg(
      (s.x1 + wobbleX) * breathe,
      (s.y1 + wobbleY) * breathe,
      (s.x2 + wobbleX) * breathe,
      (s.y2 + wobbleY) * breathe,
      s.depth,
    ));
  }

  // ─── TENDRILS (grow from knot upward to grid) ───────────────────────
  for (const s of cache.tendrilSegs) {
    // Progress-based reveal: tendril length revealed proportionally
    const segMidY = (s.y1 + s.y2) / 2;
    // Normalize Y: 180 = knot (bottom), -200 = grid (top)
    const normalizedY = 1 - (segMidY + 200) / 380; // 0 = grid, 1 = knot

    if (normalizedY > tendrilReveal) continue;

    // Gentle sway along the tendril path
    const swayAmt = Math.sin(time * 0.15 + s.x1 * 0.008 + s.y1 * 0.005) * 1.5;
    const dx = s.x2 - s.x1;
    const dy = s.y2 - s.y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) continue;
    const nx = -dy / len;
    const ny = dx / len;

    segments.push(seg(
      (s.x1 + nx * swayAmt) * breathe,
      (s.y1 + ny * swayAmt) * breathe,
      (s.x2 + nx * swayAmt) * breathe,
      (s.y2 + ny * swayAmt) * breathe,
      s.depth,
    ));
  }

  // ─── GRID (crystallizes outward from attachment points) ──────────────
  for (let i = 0; i < cache.gridSegs.length; i++) {
    const s = cache.gridSegs[i];
    if (gridReveal <= 0) break;

    // Normalized distance (0=at attachment point, 1=farthest)
    const normDist = cache.maxMinDist > 0 ? cache.gridSegMinDist[i] / cache.maxMinDist : 0;

    // Reveal from attachment points outward: segments nearest to attachment points appear first
    if (normDist > gridReveal) continue;

    segments.push(seg(s.x1, s.y1, s.x2, s.y2, s.depth));
  }

  return { type: 'segments', segments };
};
