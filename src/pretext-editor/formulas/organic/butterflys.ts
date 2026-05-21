import type { FormulaFn, FormulaParams, LineSegment } from '../types';
import { seg } from '../helpers';

/**
 * Butterflys Formula — Performance-Optimized
 *
 * The Lorenz attractor trajectory is deterministic. We precompute it once
 * per lobe configuration, then reuse for all animation frames. Only the
 * sin phases (time-dependent) are recomputed per frame.
 */

const D = 0.0006;

const lorenzStep = (x: number, y: number, z: number): [number, number, number] => [
  x + 9 * (y - x) * D,
  y + (x * (28 - z) - y) * D,
  z + (x * y - 2 * z) * D,
];

/** Precomputed trajectory cache — one trajectory per lobe configuration */
let trajectoryCache: Float64Array | null = null;
let cachedPointsPerLobe = 0;

/** Build or reuse cached Lorenz trajectory.
 *  trajectory[idx*2] = x after idx lorenz steps from (2,2,2)
 *  trajectory[idx*2+1] = z after idx lorenz steps from (2,2,2)
 */
function getTrajectory(pointsPerLobe: number): Float64Array {
  if (trajectoryCache && cachedPointsPerLobe === pointsPerLobe) {
    return trajectoryCache;
  }

  const traj = new Float64Array(pointsPerLobe * 2);
  let x = 2, y = 2, z = 2;

  for (let idx = 0; idx < pointsPerLobe; idx++) {
    traj[idx * 2] = x;
    traj[idx * 2 + 1] = z;
    [x, y, z] = lorenzStep(x, y, z);
  }

  trajectoryCache = traj;
  cachedPointsPerLobe = pointsPerLobe;
  return traj;
}

/** Screen coordinate from precomputed state */
const getPoint = (x: number, z: number, i: number, time: number) => {
  const f = time * Math.PI / 40 - (x * x) / 99 + (i % 8);
  const k = z / 69 + time * Math.PI / 720 + (i % 4) * 8;
  return {
    x: x * (Math.sin(f) + 1.5) + 99 * Math.sin(k) + 200,
    y: 200 - 139 * Math.sin(k + 1.5) - Math.abs(x * 3) * Math.sin(6 - f),
  };
};

export const butterflys: FormulaFn = (_text, params, time) => {
  const segments: LineSegment[] = [];

  const concentricRings = Math.max(1, Math.min(10, params.concentricRings ?? 2));
  const ringSpacing = params.ringSpacing ?? 6;
  const animationSpeed = params.animationSpeed ?? 15;
  const disableDepth = (params.disableDepth ?? 0) > 0;

  const t = time * animationSpeed;
  const lobeCount = 8; // Fixed: matches i%8 in the formula
  const totalIterations = 6400;
  const pointsPerLobe = Math.floor(totalIterations / lobeCount);
  const sampleStep = 16;

  // Precompute trajectory once, reuse for all lobes and frames
  const trajectory = getTrajectory(pointsPerLobe);

  for (let lobe = 0; lobe < lobeCount; lobe++) {
    const basePoints: { x: number; y: number }[] = [];

    for (let idx = 0; idx < pointsPerLobe; idx += sampleStep) {
      const i = lobe + idx * lobeCount;
      const tx = trajectory[idx * 2];
      const tz = trajectory[idx * 2 + 1];
      const pt = getPoint(tx, tz, i, t);
      basePoints.push(pt);
    }

    for (let ring = 0; ring < concentricRings; ring++) {
      const offset = ring * ringSpacing;
      const sign = ring % 2 === 0 ? 1 : -1;

      for (let p = 1; p < basePoints.length; p++) {
        const prev = basePoints[p - 1];
        const curr = basePoints[p];

        const dx = curr.x - prev.x;
        const dy = curr.y - prev.y;
        const angle = Math.atan2(dy, dx);

        const ox = -Math.sin(angle) * offset * sign;
        const oy = Math.cos(angle) * offset * sign;

        const depth = disableDepth ? 0 : ring * 3; // 0=big, 3=medium, 6=small, or all same if disabled
        segments.push(seg(prev.x + ox, prev.y + oy, curr.x + ox, curr.y + oy, depth));
      }
    }
  }

  return { type: 'segments' as const, segments };
};
