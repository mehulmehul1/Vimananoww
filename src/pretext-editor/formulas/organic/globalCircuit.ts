import type { FormulaFn, LineSegment } from '../types';
import { seg } from '../helpers';

/**
 * globalCircuit — Rotating sphere wireframe with neural circuit connections.
 * Represents "the biosphere as a single integrated circuit."
 * Sphere = globe/biosphere, nodes = neurons, arcs = synapses.
 *
 * Performance: Pre-computes static sphere points + connection params once,
 * then only applies rotation/project each frame.
 *
 * Parameters:
 *   rings       — latitude ring count (default 10)
 *   meridians   — longitude line count (default 14)
 *   connections — cross-surface neural arcs (default 30)
 *   nodeCount   — neuron nodes on surface (default 40)
 *   scale       — overall scale (default 1)
 *   rotSpeed    — Y-axis rotation speed (default 0.15)
 *   tiltX       — fixed X tilt to show sphere shape (default 0.35)
 */

// ─── Cached static geometry (computed once, reused every frame) ───
interface CachedGeom {
  ringSegs: Array<{ p1: [number, number, number]; p2: [number, number, number] }>;
  meridianSegs: Array<{ p1: [number, number, number]; p2: [number, number, number] }>;
  connArcs: Array<Array<[number, number, number]>>; // pre-slerped arc points
  scale: number;
}

let cache: CachedGeom | null = null;

function buildCache(
  rings: number, meridians: number, connectionCount: number,
  R: number, scale: number
): CachedGeom {
  const ringSegs: CachedGeom['ringSegs'] = [];
  const meridianSegs: CachedGeom['meridianSegs'] = [];
  const connArcs: CachedGeom['connArcs'] = [];

  // Pre-compute seed values (static)
  const seed = (n: number): number => {
    const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return s - Math.floor(s);
  };

  // Latitude rings — pre-compute 3D points
  for (let i = 1; i < rings; i++) {
    const phi = (i / rings) * Math.PI;
    const ringR = R * Math.sin(phi);
    const ringY = R * Math.cos(phi);
    const res = 32; // reduced from 48 (visually identical for wireframe)
    for (let j = 0; j < res; j++) {
      const a1 = (j / res) * Math.PI * 2;
      const a2 = ((j + 1) / res) * Math.PI * 2;
      ringSegs.push({
        p1: [ringR * Math.cos(a1), ringY, ringR * Math.sin(a1)],
        p2: [ringR * Math.cos(a2), ringY, ringR * Math.sin(a2)],
      });
    }
  }

  // Longitude meridians — pre-compute 3D points
  for (let j = 0; j < meridians; j++) {
    const lon = (j / meridians) * Math.PI * 2;
    const res = 32; // reduced from 48
    for (let i = 0; i < res; i++) {
      const phi1 = (i / res) * Math.PI;
      const phi2 = ((i + 1) / res) * Math.PI;
      meridianSegs.push({
        p1: [
          R * Math.sin(phi1) * Math.cos(lon),
          R * Math.cos(phi1),
          R * Math.sin(phi1) * Math.sin(lon),
        ],
        p2: [
          R * Math.sin(phi2) * Math.cos(lon),
          R * Math.cos(phi2),
          R * Math.sin(phi2) * Math.sin(lon),
        ],
      });
    }
  }

  // Neural connection arcs — pre-slerp all arc points
  for (let ci = 0; ci < connectionCount; ci++) {
    const phi1 = seed(ci * 3.7) * Math.PI;
    const lon1 = seed(ci * 7.3) * Math.PI * 2;
    const phi2 = seed(ci * 11.1) * Math.PI;
    const lon2 = seed(ci * 13.9) * Math.PI * 2;

    const arcRes = 20;
    const arcPts: Array<[number, number, number]> = [];
    for (let k = 0; k <= arcRes; k++) {
      const t = k / arcRes;
      arcPts.push(slerpPoint(phi1, lon1, phi2, lon2, t, R));
    }
    connArcs.push(arcPts);
  }

  return { ringSegs, meridianSegs, connArcs, scale };
}

export const globalCircuit: FormulaFn = (_text, params, time) => {
  const rings = Math.floor(params.rings ?? 10);
  const meridians = Math.floor(params.meridians ?? 14);
  const connectionCount = Math.floor(params.connections ?? 30);
  const scale = (params.scale ?? 1) * 0.85;
  const rotSpeed = params.rotSpeed ?? 0.15;
  const tiltX = params.tiltX ?? 0.35;

  const R = 220 * scale;

  // Rebuild cache if params changed
  if (!cache || cache.scale !== scale) {
    cache = buildCache(rings, meridians, connectionCount, R, scale);
  }

  // Rotation — side spin only (Y-axis), fixed X tilt
  const rotX = tiltX;
  const rotY = time * rotSpeed;
  const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
  const cosY = Math.cos(rotY), sinY = Math.sin(rotY);

  const segments: LineSegment[] = [];

  // Batch rotate + project for sphere wireframe
  const { ringSegs, meridianSegs, connArcs } = cache;

  for (let i = 0; i < ringSegs.length; i++) {
    const s = ringSegs[i];
    const p1 = project(rotate(s.p1, cosX, sinX, cosY, sinY));
    const p2 = project(rotate(s.p2, cosX, sinX, cosY, sinY));
    segments.push(seg(p1[0], p1[1], p2[0], p2[1], p1[2]));
  }

  for (let i = 0; i < meridianSegs.length; i++) {
    const s = meridianSegs[i];
    const p1 = project(rotate(s.p1, cosX, sinX, cosY, sinY));
    const p2 = project(rotate(s.p2, cosX, sinX, cosY, sinY));
    segments.push(seg(p1[0], p1[1], p2[0], p2[1], p1[2]));
  }

  // Neural connection arcs (pre-slerped, just rotate + project)
  const elev = 1.02;
  for (let ci = 0; ci < connArcs.length; ci++) {
    const arc = connArcs[ci];
    for (let k = 0; k < arc.length - 1; k++) {
      const p1 = project(rotate([arc[k][0] * elev, arc[k][1] * elev, arc[k][2] * elev], cosX, sinX, cosY, sinY));
      const p2 = project(rotate([arc[k + 1][0] * elev, arc[k + 1][1] * elev, arc[k + 1][2] * elev], cosX, sinX, cosY, sinY));
      segments.push(seg(p1[0], p1[1], p2[0], p2[1], p1[2]));
    }
  }

  return { type: 'segments', segments };
};

// ─── Inlined rotate + project (avoid closure allocation per frame) ───
function rotate(
  [x, y, z]: [number, number, number],
  cosX: number, sinX: number, cosY: number, sinY: number
): [number, number, number] {
  const y1 = y * cosX - z * sinX;
  const z1 = y * sinX + z * cosX;
  const x2 = x * cosY + z1 * sinY;
  const z2 = -x * sinY + z1 * cosY;
  return [x2, y1, z2];
}

function project([x, y, z]: [number, number, number]): [number, number, number] {
  const fov = 900;
  const depth = z + 1000;
  return [(x * fov) / depth, (y * fov) / depth, depth];
}

/** Spherical linear interpolation between two points on a sphere */
function slerpPoint(
  phi1: number, lon1: number,
  phi2: number, lon2: number,
  t: number, R: number
): [number, number, number] {
  const ax = Math.sin(phi1) * Math.cos(lon1);
  const ay = Math.cos(phi1);
  const az = Math.sin(phi1) * Math.sin(lon1);

  const bx = Math.sin(phi2) * Math.cos(lon2);
  const by = Math.cos(phi2);
  const bz = Math.sin(phi2) * Math.sin(lon2);

  let dot = ax * bx + ay * by + az * bz;
  dot = Math.max(-1, Math.min(1, dot));

  const omega = Math.acos(dot);
  if (omega < 0.001) {
    return [R * (ax + (bx - ax) * t), R * (ay + (by - ay) * t), R * (az + (bz - az) * t)];
  }

  const sinOmega = Math.sin(omega);
  const a = Math.sin((1 - t) * omega) / sinOmega;
  const b = Math.sin(t * omega) / sinOmega;

  return [R * (a * ax + b * bx), R * (a * ay + b * by), R * (a * az + b * bz)];
}
