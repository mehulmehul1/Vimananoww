import type { FormulaFn, LineSegment } from '../types';
import { seg } from '../helpers';

/**
 * circuitBoard — Technology wired, not grown.
 * Generates circuit components and traces that overlay on the same
 * 2D perspective grid from scene 18 (rootCircuit).
 *
 * This formula does NOT output grid segments — the grid is inherited
 * from rootCircuit. Only components, traces, and solder pads.
 *
 * Parameters:
 *   gridRows         — grid rows (must match rootCircuit)
 *   gridCols         — grid columns (must match rootCircuit)
 *   gridTilt         — perspective tilt (must match rootCircuit)
 *   componentDensity — how many components to place 0-1 (default 0.5)
 *   progress         — scroll progress 0-1 (default 1)
 */

interface CachedCircuit {
  componentSegs: LineSegment[];
  traceSegs: LineSegment[];
  padSegs: LineSegment[];
  params: string;
}

let cache: CachedCircuit | null = null;

function seed(n: number): number {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

// ─── Component Body Drawers ──────────────────────────────────────────
// Each draws at origin (0,0) with scale s, horizontal orientation.
// depth = 1 for body segments, depth = 2 for pin/lead segments.

type ComponentType = 'resistor' | 'capacitor' | 'diode' | 'ic' | 'transistor';

function resistorBody(s: number): LineSegment[] {
  return [
    seg(-3*s, 0, -2*s, -1.5*s, 1),
    seg(-2*s, -1.5*s, -1*s, 1.5*s, 1),
    seg(-1*s, 1.5*s, 0, -1.5*s, 1),
    seg(0, -1.5*s, 1*s, 1.5*s, 1),
    seg(1*s, 1.5*s, 2*s, -1.5*s, 1),
    seg(2*s, -1.5*s, 3*s, 0, 1),
  ];
}

function capacitorBody(s: number): LineSegment[] {
  return [
    seg(-3*s, 0, -1.8*s, 0, 2),
    seg(-1.8*s, -2.5*s, -1.8*s, 2.5*s, 1),
    seg(1.8*s, -2.5*s, 1.8*s, 2.5*s, 1),
    seg(1.8*s, 0, 3*s, 0, 2),
  ];
}

function diodeBody(s: number): LineSegment[] {
  return [
    seg(-3*s, 0, -2*s, 0, 2),
    seg(-2*s, -3*s, 3*s, 0, 1),
    seg(3*s, 0, -2*s, 3*s, 1),
    seg(3*s, -3.5*s, 3*s, 3.5*s, 1),
    seg(3*s, 0, 4*s, 0, 2),
  ];
}

function icBody(s: number): LineSegment[] {
  return [
    // Body rectangle
    seg(-4*s, -4*s, 4*s, -4*s, 1),
    seg(4*s, -4*s, 4*s, 4*s, 1),
    seg(4*s, 4*s, -4*s, 4*s, 1),
    seg(-4*s, 4*s, -4*s, -4*s, 1),
    // Pins — left
    seg(-4*s, -2*s, -6*s, -2*s, 2),
    seg(-4*s, 0, -6*s, 0, 2),
    seg(-4*s, 2*s, -6*s, 2*s, 2),
    // Pins — right
    seg(4*s, -2*s, 6*s, -2*s, 2),
    seg(4*s, 0, 6*s, 0, 2),
    seg(4*s, 2*s, 6*s, 2*s, 2),
  ];
}

function transistorBody(s: number): LineSegment[] {
  return [
    seg(-3*s, 0, 0, 0, 2),
    seg(0, -2.5*s, 3*s, -2.5*s, 1),
    seg(0, 0, 3*s, 0, 1),
    seg(0, 2.5*s, 3*s, 2.5*s, 1),
    // Arrow on collector
    seg(3*s, -2.5*s, 2*s, -1.5*s, 1),
    seg(3*s, -2.5*s, 4*s, -1.5*s, 1),
  ];
}

const componentDrawers: Record<ComponentType, (s: number) => LineSegment[]> = {
  resistor: resistorBody,
  capacitor: capacitorBody,
  diode: diodeBody,
  ic: icBody,
  transistor: transistorBody,
};

function solderPad(x: number, y: number, s: number): LineSegment[] {
  const d = s * 1.5;
  return [
    seg(x - d, y - d, x + d, y + d, 3),
    seg(x - d, y + d, x + d, y - d, 3),
  ];
}

// ─── Trace Routing (Grid-Aligned) ────────────────────────────────────
// Traces follow grid lines so they share the same perspective convergence
// as the background grid. The intermediate corner is always at a grid point.

function routeBetween(
  c1: { x: number; y: number; row: number; col: number },
  c2: { x: number; y: number; row: number; col: number },
  seedVal: number,
  gridPoints: Array<{ x: number; y: number; row: number; col: number }>,
  gridCols: number,
): LineSegment[] {
  const se: LineSegment[] = [];
  if (Math.abs(c2.x - c1.x) < 0.1 && Math.abs(c2.y - c1.y) < 0.1) return se;

  // Two grid-aligned routing options:
  // A) column-first: follow column c1 → target row, then row r2 → target col
  // B) row-first: follow row r1 → target col, then column c2 → target row
  // Both maintain perspective because intermediate corners are grid points.
  const useColFirst = Math.sin(seedVal * 127.1 + 311.7) > 0;

  if (useColFirst) {
    // Vertical along column c1 to target row r2
    const mid = gridPoints[c2.row * (gridCols + 1) + c1.col];
    se.push(seg(c1.x, c1.y, mid.x, mid.y, 2));
    // Horizontal along row r2 to target col c2
    se.push(seg(mid.x, mid.y, c2.x, c2.y, 2));
  } else {
    // Horizontal along row r1 to target col c2
    const mid = gridPoints[c1.row * (gridCols + 1) + c2.col];
    se.push(seg(c1.x, c1.y, mid.x, mid.y, 2));
    // Vertical along column c2 to target row r2
    se.push(seg(mid.x, mid.y, c2.x, c2.y, 2));
  }
  return se;
}

// ─── Cache Builder ───────────────────────────────────────────────────

function buildCache(
  gridRows: number,
  gridCols: number,
  gridTilt: number,
  compDensity: number,
  paramKey: string,
): CachedCircuit {
  // Same grid geometry constants as rootCircuit
  const gridWidth = 380;
  const gridHeight = 200;
  const gridTop = -170;
  const persp = gridTilt * 0.65;

  // ─── Generate Grid Points for Component Placement (no grid segments) ─
  const gridPoints: Array<{ x: number; y: number; row: number; col: number }> = [];

  for (let r = 0; r <= gridRows; r++) {
    const t = r / gridRows;
    const rowScale = 1 - (1 - t) * persp;
    const rowY = gridTop + t * gridHeight;

    for (let c = 0; c <= gridCols; c++) {
      const x = -gridWidth / 2 + c * (gridWidth / gridCols);
      const sx = x * rowScale;
      const sy = rowY + t * (gridWidth / gridCols * 0.15 * (1 - t));
      gridPoints.push({ x: sx, y: sy, row: r, col: c });
    }
  }

  // ─── Component Placement ──────────────────────────────────────────
  const componentTypes: ComponentType[] = ['resistor', 'capacitor', 'diode', 'ic', 'transistor'];

  const occRows = gridRows + 1;
  const occCols = gridCols + 1;
  const occupied: boolean[][] = Array.from({ length: occRows }, () => Array(occCols).fill(false));

  const components: Array<{
    x: number; y: number;
    type: ComponentType;
    row: number; col: number;
  }> = [];

  const targetCount = Math.floor(5 + compDensity * 20); // 5–25 components

  const centerCol = gridCols / 2;
  const orderedPoints = [...gridPoints].sort((a, b) => {
    if (a.row !== b.row) return b.row - a.row;
    return Math.abs(a.col - centerCol) - Math.abs(b.col - centerCol);
  });

  for (const pt of orderedPoints) {
    if (components.length >= targetCount) break;
    if (occupied[pt.row][pt.col]) continue;

    if (seed(pt.row * 100 + pt.col * 7 + 444) > 0.35) continue;

    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = pt.row + dr;
        const nc = pt.col + dc;
        if (nr >= 0 && nr < occRows && nc >= 0 && nc < occCols) {
          occupied[nr][nc] = true;
        }
      }
    }

    const typeIdx = Math.floor(seed(pt.row * 50 + pt.col * 30 + 777) * componentTypes.length);
    components.push({
      x: pt.x, y: pt.y,
      type: componentTypes[typeIdx],
      row: pt.row, col: pt.col,
    });
  }

  // ─── Generate Component Segments ──────────────────────────────────
  const componentSegs: LineSegment[] = [];
  const padSegs: LineSegment[] = [];

  for (const comp of components) {
    const t = comp.row / gridRows;
    const rowScale = 1 - (1 - t) * persp;
    const hSpacing = (gridWidth / gridCols) * rowScale;
    const compScale = hSpacing * 0.2;

    const drawer = componentDrawers[comp.type];
    const bodySegs = drawer(compScale);

    const rotateVert = seed(comp.row * 30 + comp.col * 50 + 123) > 0.5;

    for (const bs of bodySegs) {
      let x1 = bs.x1;
      let y1 = bs.y1;
      let x2 = bs.x2;
      let y2 = bs.y2;

      if (rotateVert) {
        [x1, y1] = [-y1, x1];
        [x2, y2] = [-y2, x2];
      }

      componentSegs.push(seg(comp.x + x1, comp.y + y1, comp.x + x2, comp.y + y2, bs.depth));
    }

    padSegs.push(...solderPad(comp.x, comp.y, compScale));
  }

  // ─── Route Traces Between Components ──────────────────────────────
  const traceSegs: LineSegment[] = [];

  if (components.length >= 2) {
    const connected = new Set<number>();
    connected.add(0);

    while (connected.size < components.length) {
      let bestI = -1;
      let bestJ = -1;
      let bestDist = Infinity;

      for (const ci of connected) {
        for (let cj = 0; cj < components.length; cj++) {
          if (connected.has(cj)) continue;
          const dx = components[cj].x - components[ci].x;
          const dy = components[cj].y - components[ci].y;
          const dist = dx * dx + dy * dy;
          if (dist < bestDist) {
            bestDist = dist;
            bestI = ci;
            bestJ = cj;
          }
        }
      }

      if (bestJ < 0) break;

      const route = routeBetween(components[bestI], components[bestJ], bestI * 137 + bestJ * 53 + 999, gridPoints, gridCols);
      traceSegs.push(...route);
      connected.add(bestJ);
    }

    const crossThreshold = 2000;
    for (let i = 0; i < components.length; i++) {
      for (let j = i + 2; j < components.length; j++) {
        const dx = components[j].x - components[i].x;
        const dy = components[j].y - components[i].y;
        const dist = dx * dx + dy * dy;
        if (dist < crossThreshold && seed(i * 137 + j * 53 + 555) < 0.3) {
          const route = routeBetween(components[i], components[j], i * 73 + j * 97 + 333, gridPoints, gridCols);
          traceSegs.push(...route);
        }
      }
    }
  }

  return { componentSegs, traceSegs, padSegs, params: paramKey };
}

// ─── Main Formula ────────────────────────────────────────────────────

export const circuitBoard: FormulaFn = (_text, params, time) => {
  const gridRows = Math.floor(params.gridRows ?? 10);
  const gridCols = Math.floor(params.gridCols ?? 12);
  const gridTilt = params.gridTilt ?? 0.55;
  const compDensity = params.componentDensity ?? 0.5;
  const progress = params.progress ?? 1;

  const paramKey = `${gridRows}-${gridCols}-${gridTilt}-${compDensity}`;

  if (!cache || cache.params !== paramKey) {
    cache = buildCache(gridRows, gridCols, gridTilt, compDensity, paramKey);
  }

  const breathe = 1 + Math.sin(time * 0.2) * 0.008;

  // Progress-Based Reveal:
  // 0.0-0.2: Components appear (staggered)
  // 0.2-0.5: Traces appear
  // 0.3-0.6: Solder pads appear

  const compProgress = Math.max(0, Math.min(1, (progress - 0.05) / 0.35));
  const traceProgress = Math.max(0, Math.min(1, (progress - 0.2) / 0.4));
  const padProgress = Math.max(0, Math.min(1, (progress - 0.3) / 0.4));

  const segments: LineSegment[] = [];

  // ─── Components ─────────────────────────────────────────────────────
  const compCount = cache.componentSegs.length;
  const visibleCompCount = Math.floor(compCount * compProgress);
  for (let i = 0; i < visibleCompCount; i++) {
    const s = cache.componentSegs[i];
    const bx = Math.sin(time * 0.3 + s.x1 * 0.01) * 0.3;
    const by = Math.cos(time * 0.25 + s.y1 * 0.01) * 0.3;
    segments.push(seg(
      s.x1 * breathe + bx, s.y1 * breathe + by,
      s.x2 * breathe + bx, s.y2 * breathe + by,
      s.depth,
    ));
  }

  // ─── Traces ─────────────────────────────────────────────────────────
  const traceCount = cache.traceSegs.length;
  const visibleTraceCount = Math.floor(traceCount * traceProgress);
  for (let i = 0; i < visibleTraceCount; i++) {
    const s = cache.traceSegs[i];
    segments.push(seg(s.x1 * breathe, s.y1 * breathe, s.x2 * breathe, s.y2 * breathe, s.depth));
  }

  // ─── Solder Pads ────────────────────────────────────────────────────
  const padCount = cache.padSegs.length;
  const visiblePadCount = Math.floor(padCount * padProgress);
  for (let i = 0; i < visiblePadCount; i++) {
    const s = cache.padSegs[i];
    segments.push(seg(s.x1 * breathe, s.y1 * breathe, s.x2 * breathe, s.y2 * breathe, s.depth));
  }

  return { type: 'segments', segments };
};
