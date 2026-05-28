import type { FormulaFn, LineSegment } from '../types';
import { seg } from '../helpers';

/**
 * brainMesh — Anatomically structured 3D wireframe brain.
 *
 * Pipeline:
 *   1. Correct macro silhouette (elongated, flattened, tapered)
 *   2. Hemisphere separation (two volumes + longitudinal fissure)
 *   3. Lobe shaping (frontal, temporal, occipital, cerebellum, brainstem)
 *   4. Primary anatomical sulci (central, lateral, parieto-occipital, superior frontal)
 *   5. Directional cortical flow folds
 *   6. Cerebellar folia
 *   7. Hemisphere asymmetry (2-5%)
 *   8. View-aware visibility + silhouette extraction
 *   9. Gyri ridges + sulci grooves (additive + subtractive)
 */

// ─── Noise ───────────────────────────────────────────────────────────────

function hash3(x: number, y: number, z: number): number {
  let h = (x * 374761393 + y * 668265263 + z * 1274126177) | 0;
  h = ((h ^ (h >> 13)) * 1274126177) | 0;
  return (h & 0x7fffffff) / 0x7fffffff;
}

function lerpN(a: number, b: number, t: number): number { return a + (b - a) * t; }
function fade(t: number): number { return t * t * t * (t * (t * 6 - 15) + 10); }

function noise3D(x: number, y: number, z: number): number {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = fade(x - xi), yf = fade(y - yi), zf = fade(z - zi);
  const c000 = hash3(xi, yi, zi);       const c100 = hash3(xi + 1, yi, zi);
  const c010 = hash3(xi, yi + 1, zi);   const c110 = hash3(xi + 1, yi + 1, zi);
  const c001 = hash3(xi, yi, zi + 1);   const c101 = hash3(xi + 1, yi, zi + 1);
  const c011 = hash3(xi, yi + 1, zi + 1); const c111 = hash3(xi + 1, yi + 1, zi + 1);
  return lerpN(
    lerpN(lerpN(c000, c100, xf), lerpN(c010, c110, xf), yf),
    lerpN(lerpN(c001, c101, xf), lerpN(c011, c111, xf), yf),
    zf,
  );
}

function fbm3(x: number, y: number, z: number, octaves: number): number {
  let val = 0, amp = 0.5, freq = 1;
  for (let i = 0; i < octaves; i++) {
    val += amp * noise3D(x * freq, y * freq, z * freq);
    amp *= 0.5; freq *= 2.1;
  }
  return val;
}

/** Domain-warped FBM — essential for organic cortical folding */
function warpedNoise(x: number, y: number, z: number, strength: number): number {
  const qx = fbm3(x + 0.0, y + 0.0, z + 0.0, 3);
  const qy = fbm3(x + 5.2, y + 1.3, z + 2.8, 3);
  const qz = fbm3(x + 1.7, y + 9.2, z + 3.4, 3);
  return fbm3(x + strength * qx, y + strength * qy, z + strength * qz, 4);
}

// ─── Smoothstep ──────────────────────────────────────────────────────────

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

// ─── Types ───────────────────────────────────────────────────────────────

export interface BrainVertex {
  pos: [number, number, number];
  normal: [number, number, number];
  visibility: number;
  silhouette: number;
}

// ─── Brain Surface Point ─────────────────────────────────────────────────

export function brainSurfacePoint(
  u: number, v: number,
  _foldDepth: number, _foldFreq: number, _fissureDepth: number,
): BrainVertex {
  const sinU = Math.sin(u);
  const cosU = Math.cos(u);
  const sinV = Math.sin(v);
  const cosV = Math.cos(v);

  // ─── 1. GLOBAL SILHOUETTE — correct proportions, not a sphere ───
  const Rx = 210;
  const Ry = 280;
  const Rz = 170;

  let x = Rx * sinU * cosV;
  let y = Ry * sinU * sinV;
  let z = Rz * cosU;

  // ─── 2. HEMISPHERE STRUCTURE ───
  const hemisphereSep = 0.06;
  if (x > 0) x += Rx * hemisphereSep;
  else x -= Rx * hemisphereSep;

  // ─── 3. LOBE SHAPING ───

  // Frontal bulge
  const frontalBulge = 1 + 0.18 * smoothstep(0.1, 1.0, sinV) * sinU;
  x *= frontalBulge;

  // Occipital taper
  const occipitalTaper = 1 - 0.12 * smoothstep(0.2, 1.0, -sinV) * sinU;
  x *= occipitalTaper;

  // Temporal widening
  const temporalMask = Math.exp(-((u - Math.PI * 0.58) ** 2) / 0.12);
  const temporalWidth = 1 + 0.15 * temporalMask * (1 - Math.abs(cosV) * 0.15);
  x *= temporalWidth;

  // Bottom flattening
  const bottomFlat = Math.max(0, -cosU) * 0.08 * sinU;
  z -= Rz * bottomFlat;

  // Frontal lobe
  const frontalPush = Math.max(0, sinV) * sinU * 0.06;
  y += Ry * frontalPush;
  const frontalFlat = Math.max(0, cosU) * (1 - Math.abs(sinV) * 0.3) * 0.06;
  z *= 1 - frontalFlat;

  // Occipital roundness
  const occipitalBulge = Math.max(0, -sinV) * sinU * 0.04;
  y -= Ry * occipitalBulge;
  z += Rz * occipitalBulge * 0.3;

  // Cerebellum
  const cereU = Math.exp(-((u - Math.PI * 0.76) ** 2) / 0.025);
  const cereV = Math.exp(-((v - Math.PI * 1.5) ** 2) / 0.35) +
                Math.exp(-((v + Math.PI * 0.5) ** 2) / 0.35);
  const cereStrength = cereU * cereV * 0.12;
  z -= Rz * cereStrength * 0.5;
  y -= Ry * cereStrength * 0.35;
  x *= 1 + cereStrength * 0.25;

  // Cerebellar folia (parallel stripes on cerebellum)
  const cerebellarFolia = Math.sin(v * 34 + u * 3) * cereStrength * 0.03;
  z += cerebellarFolia * Rz;

  // Brain stem
  const stemU = Math.exp(-((u - Math.PI * 0.92) ** 2) / 0.01);
  const stemV = Math.exp(-(cosV * cosV) / 0.05);
  const stemStrength = stemU * stemV * 0.05;
  z -= Rz * stemStrength;
  y -= Ry * stemStrength * 0.4;

  // ─── 4. LONGITUDINAL FISSURE ───
  const fissureDepth = 0.20;
  const fissureMask = Math.exp(-(cosV * cosV) / 0.008) * Math.max(0, cosU);
  z -= Rz * fissureDepth * fissureMask;
  const pushDir = x === 0 ? 0 : Math.sign(x);
  x += pushDir * Rx * fissureDepth * 0.6 * fissureMask;

  // ─── 5. PRIMARY ANATOMICAL SULCI ───
  const r = Math.sqrt(x * x + y * y + z * z) || 1;
  const nx = x / r, ny = y / r, nz = z / r;

  const centralU = Math.exp(-((u - Math.PI * 0.45) ** 2) * 12);
  const centralV = Math.exp(-((v - Math.PI * 0.52) ** 2) * 80) +
                   Math.exp(-((v - Math.PI * 1.48) ** 2) * 80);
  const centralSulcus = centralU * centralV * 0.10;

  const lateralU = Math.exp(-((u - Math.PI * 0.52) ** 2) * 15);
  const lateralV = Math.exp(-((v - Math.PI * 0.3) ** 2) * 60) +
                   Math.exp(-((v - Math.PI * 1.7) ** 2) * 60);
  const lateralSulcus = lateralU * lateralV * 0.09;

  const parietoOccU = Math.exp(-((u - Math.PI * 0.32) ** 2) * 14);
  const parietoOccV = Math.exp(-((v - Math.PI * 1.6) ** 2) * 40) +
                      Math.exp(-((v - Math.PI * 0.4) ** 2) * 40);
  const parietoOccSulcus = parietoOccU * parietoOccV * 0.08;

  const supFrontalU = Math.exp(-((u - Math.PI * 0.28) ** 2) * 16);
  const supFrontalV = smoothstep(0.1, 0.5, sinV);
  const supFrontalSulcus = supFrontalU * supFrontalV * 0.07;

  const primarySulci = centralSulcus + lateralSulcus + parietoOccSulcus + supFrontalSulcus;

  // ─── 6. DIRECTIONAL CORTICAL FLOW FOLDS ───
  const uNorm = u / Math.PI;
  const vNorm = v / (Math.PI * 2);

  const warpX = warpedNoise(uNorm * 4, vNorm * 4, 0.5, 1.2);
  const warpY = warpedNoise(uNorm * 4 + 10, vNorm * 4 + 10, 0.5, 1.2);

  // Directional cortical flow — folds follow tangent directions
  const flowAngle =
    Math.atan2(y, x) +
    warpedNoise(uNorm * 2.5, vNorm * 2.5, 0.5, 1.0) * 1.4;

  const directionalFold1 =
    Math.sin(flowAngle * 10 + warpX * 5 + uNorm * 8);

  const directionalFold2 =
    Math.sin(flowAngle * 18 + warpY * 7 + vNorm * 12);

  const secondaryFold =
    directionalFold1 * 0.07 +
    directionalFold2 * 0.04;

  // ─── 7. ASYMMETRY ───
  let asymmetryFold = 1.0;
  if (x > 0) {
    asymmetryFold = 1.03;
  }

  // ─── 8. CURVATURE-AWARE FOLD STRENGTHENING ───
  const localCurvature = 0.5 + 0.5 * Math.sin(u * 3) * Math.cos(v * 2.7);
  const curvatureMask = Math.pow(localCurvature, 0.7);
  const foldEnvelope = sinU;

  // ─── 9. COMBINE ───
  const totalDisplacement = (
    -primarySulci +
    secondaryFold * asymmetryFold * curvatureMask * foldEnvelope
  );

  x += totalDisplacement * Rx * nx;
  y += totalDisplacement * Ry * ny;
  z += totalDisplacement * Rz * nz;

  // ─── 10. VIEW-AWARE VISIBILITY + SILHOUETTE ───
  const normalLength = Math.sqrt(x * x + y * y + z * z) || 1;
  const nx2 = x / normalLength;
  const ny2 = y / normalLength;
  const nz2 = z / normalLength;

  // Camera direction (towards viewer)
  const viewDot = nz2;

  // Visibility weighting
  const visibility = Math.max(0, viewDot * 0.5 + 0.5);

  // Silhouette detection
  const silhouette = 1.0 - Math.abs(viewDot);

  return {
    pos: [x, y, z],
    normal: [nx2, ny2, nz2],
    visibility,
    silhouette,
  };
}

// ─── Cached static brain geometry ────────────────────────────────────────

interface BrainCache {
  grid: BrainVertex[][];
  sulciSegs: Array<{ p1: [number, number, number]; p2: [number, number, number] }>;
  resU: number;
  resV: number;
}

let brainCache: BrainCache | null = null;

function buildBrainCache(resU: number, resV: number): BrainCache {
  const grid: BrainVertex[][] = [];
  for (let i = 0; i <= resU; i++) {
    const row: BrainVertex[] = [];
    const u = (i / resU) * Math.PI;
    for (let j = 0; j <= resV; j++) {
      const v = (j / resV) * Math.PI * 2;
      row.push(brainSurfacePoint(u, v, 0, 0, 0));
    }
    grid.push(row);
  }

  // Sulci overlay lines
  const sulciSegs: BrainCache['sulciSegs'] = [];
  const sulciPaths = [
    { uCenter: Math.PI * 0.45, vCenters: [Math.PI * 0.52, Math.PI * 1.48] },
    { uCenter: Math.PI * 0.52, vCenters: [Math.PI * 0.3, Math.PI * 1.7] },
    { uCenter: Math.PI * 0.32, vCenters: [Math.PI * 0.4, Math.PI * 1.6] },
    { uCenter: Math.PI * 0.28, vCenters: [Math.PI * 0.5, Math.PI * 1.5] },
  ];

  for (const path of sulciPaths) {
    for (const vCenter of path.vCenters) {
      const res = 16;
      for (let k = 0; k < res; k++) {
        const u1 = path.uCenter + (k / res - 0.5) * 0.4;
        const u2 = path.uCenter + ((k + 1) / res - 0.5) * 0.4;
        const wobble = 0.04 * Math.sin(u1 * 8 + vCenter * 3);
        const v1 = vCenter + wobble;
        const v2 = vCenter + 0.04 * Math.sin(u2 * 8 + vCenter * 3);
        sulciSegs.push({
          p1: brainSurfacePoint(u1, v1, 0, 0, 0).pos,
          p2: brainSurfacePoint(u2, v2, 0, 0, 0).pos,
        });
      }
    }
  }

  return { grid, sulciSegs, resU, resV };
}

// ─── Formula ─────────────────────────────────────────────────────────────

export const brainMesh: FormulaFn = (_text, params, time) => {
  const resU = Math.floor(params.resU ?? 18);
  const resV = Math.floor(params.resV ?? 16);
  const scale = (params.scale ?? 1) * 0.85;
  const rotSpeed = params.rotSpeed ?? 0.04;
  const tiltX = params.tiltX ?? 0.35;

  if (!brainCache || brainCache.resU !== resU || brainCache.resV !== resV) {
    brainCache = buildBrainCache(resU, resV);
  }

  const rotX = params.userRotX ?? tiltX;
  const rotY = params.userRotY ?? (rotSpeed === 0 ? 0 : time * rotSpeed);
  const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
  const cosY = Math.cos(rotY), sinY = Math.sin(rotY);

  const segments: LineSegment[] = [];
  const { grid, sulciSegs } = brainCache;

  // Project all vertices (using .pos from BrainVertex)
  const projected: [number, number, number][][] = [];
  for (let i = 0; i <= resU; i++) {
    const row: [number, number, number][] = [];
    for (let j = 0; j <= resV; j++) {
      row.push(project(rotate(grid[i][j].pos, cosX, sinX, cosY, sinY)));
    }
    projected.push(row);
  }

  // Cortical flow lines only (NO longitude lines)
  for (let i = 0; i < resU; i++) {
    for (let j = 0; j < resV; j++) {
      const vA = grid[i][j];
      const vB = grid[i][j + 1];

      // Strong visibility rejection
      if (vA.visibility < 0.18 || vB.visibility < 0.18)
        continue;

      const [ax, ay, ad] = projected[i][j];
      const [bx, by, bd] = projected[i][j + 1];

      const silhouetteBoost = Math.max(vA.silhouette, vB.silhouette);
      const depth = (ad + bd) * 0.5;

      const s = seg(ax, ay, bx, by, depth);

      // @ts-ignore — custom alpha for renderer
      s.alpha = 0.12 + silhouetteBoost * 0.45;
      // @ts-ignore — custom silhouette flag for renderer
      s.silhouette = silhouetteBoost;

      segments.push(s);
    }
  }

  // Sulci lines
  for (const s of sulciSegs) {
    const p1 = project(rotate(s.p1, cosX, sinX, cosY, sinY));
    const p2 = project(rotate(s.p2, cosX, sinX, cosY, sinY));
    segments.push(seg(p1[0], p1[1], p2[0], p2[1], p1[2]));
  }

  return { type: 'segments', segments };
};

// ─── Math helpers ────────────────────────────────────────────────────────

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
  const depth = z + 1200;
  return [(x * fov) / depth, (y * fov) / depth, depth];
}
