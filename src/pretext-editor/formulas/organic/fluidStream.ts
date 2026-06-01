import type { FormulaFn, FormulaParams, LineSegment } from '../types';
import { seg } from '../helpers';

/**
 * fluidStream 3D — Full 3D potential flow around a sphere with camera projection.
 *
 * Uses the analytic 3D potential flow solution for uniform flow past a sphere.
 * Streamlines are computed in 3D with (x,y,z) positions and projected to 2D
 * screen space via a perspective camera at a low angle (water-level view).
 *
 * The 3D depth (camera-space z) is stored in each segment and used by the
 * renderer for occlusion testing — streamlines behind the sphere are hidden.
 *
 * Parameters:
 *   sphereRadius      — radius of the spherical obstacle (default 80)
 *   streamlineCount   — total number of 3D streamlines (default 100)
 *   domeHeight        — unused (kept for backwards compat)
 *   noiseAmplitude    — Perlin turbulence amplitude (default 50)
 *   noiseFrequency    — Perlin noise frequency (default 0.012)
 *   cameraAzimuth     — camera angle around the vertical axis (default -30°)
 *   cameraElevation   — camera angle above/below horizon (default -20°)
 *   cameraDistance    — camera distance from scene center (default R*3)
 *   canvasSize        — half-canvas for seeding bounds (default 400)
 */

// ─── 3D vector helpers ──────────────────────────────────────────────────

function normalize3(v: [number, number, number]): [number, number, number] {
  const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  if (len < 1e-10) return [0, 0, 0];
  return [v[0] / len, v[1] / len, v[2] / len];
}

function cross3(
  a: [number, number, number],
  b: [number, number, number],
): [number, number, number] {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function dot3(a: [number, number, number], b: [number, number, number]): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

// ─── 2D Perlin noise (same as before) ──────────────────────────────────

function hash2D(x: number, y: number): number {
  let h = (x * 374761393 + y * 668265263) | 0;
  h = ((h ^ (h >> 13)) * 1274126177) | 0;
  return ((h ^ (h >> 16)) & 0x7fffffff) / 0x7fffffff;
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

function noise2D(x: number, y: number): number {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = x - ix, fy = y - iy;
  const sx = smoothstep(fx), sy = smoothstep(fy);
  const n00 = hash2D(ix, iy);
  const n10 = hash2D(ix + 1, iy);
  const n01 = hash2D(ix, iy + 1);
  const n11 = hash2D(ix + 1, iy + 1);
  const a = n00 + (n10 - n00) * sx;
  const b = n01 + (n11 - n01) * sx;
  return a + (b - a) * sy;
}

function fbm(x: number, y: number, octaves = 3): number {
  let v = 0, amp = 1, freq = 1, maxV = 0;
  for (let i = 0; i < octaves; i++) {
    v += amp * noise2D(x * freq, y * freq);
    maxV += amp;
    amp *= 0.5;
    freq *= 2;
  }
  return v / maxV;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

// ─── Camera ─────────────────────────────────────────────────────────────

interface ProjectCamera {
  camPos: [number, number, number];
  forward: [number, number, number];
  right: [number, number, number];
  upAxis: [number, number, number];
  focalLen: number;
  camDist: number;
}

function makeCamera(
  azimuth: number,
  elevation: number,
  distance: number,
  focalLen: number,
): ProjectCamera {
  const camX = distance * Math.cos(elevation) * Math.sin(azimuth);
  const camY = distance * Math.sin(elevation);
  const camZ = -distance * Math.cos(elevation) * Math.cos(azimuth);
  const camPos: [number, number, number] = [camX, camY, camZ];

  // LookAt at origin
  const forward = normalize3([-camX, -camY, -camZ]);
  const worldUp: [number, number, number] = [0, 1, 0];

  // Handle gimbal lock: if forward is parallel to worldUp
  const fDot = dot3(forward, worldUp);
  const right = normalize3(
    Math.abs(fDot) > 0.999
      ? [1, 0, 0] // use world right instead
      : cross3(forward, worldUp),
  );
  const upAxis = cross3(right, forward);

  return { camPos, forward, right, upAxis, focalLen, camDist: distance };
}

function projectPoint(
  x: number, y: number, z: number,
  cam: ProjectCamera,
): [number, number, number] | null {
  const dx = x - cam.camPos[0];
  const dy = y - cam.camPos[1];
  const dz = z - cam.camPos[2];

  const cX = dx * cam.right[0] + dy * cam.right[1] + dz * cam.right[2];
  const cY = dx * cam.upAxis[0] + dy * cam.upAxis[1] + dz * cam.upAxis[2];
  const cZ = dx * cam.forward[0] + dy * cam.forward[1] + dz * cam.forward[2];

  if (cZ <= 0) return null;

  const scale = cam.focalLen / cZ;
  return [cX * scale, cY * scale, cZ];
}

// Compute whether point P is occluded by the sphere (ray from camera hits sphere before P)
function isOccludedBySphere(
  px: number, py: number, pz: number,
  camPos: [number, number, number],
  sphereR: number,
): boolean {
  const dx = px - camPos[0];
  const dy = py - camPos[1];
  const dz = pz - camPos[2];
  const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
  if (dist < 0.01) return false;

  const nx = dx / dist, ny = dy / dist, nz = dz / dist;
  const b = 2 * (camPos[0] * nx + camPos[1] * ny + camPos[2] * nz);
  const c = camPos[0] * camPos[0] + camPos[1] * camPos[1] + camPos[2] * camPos[2] - sphereR * sphereR;
  const disc = b * b - 4 * c;
  if (disc < 0) return false;

  const t = (-b - Math.sqrt(disc)) / 2;
  return t > 0 && t < dist;
}

// ─── 3D potential flow velocity field ──────────────────────────────────

function getVelocity3D(
  px: number, py: number, pz: number,
  R: number, cosA: number, sinA: number, U: number,
): [number, number, number] {
  // Rotate to standard frame (flow in +x direction)
  const rx = px * cosA + py * sinA;
  const ry = -px * sinA + py * cosA;
  const rz = pz;

  const r = Math.sqrt(rx * rx + ry * ry + rz * rz);
  if (r < R * 0.96) return [0, 0, 0];

  const r3 = r * r * r;
  const r5 = r3 * r * r;

  // 3D potential flow around a sphere (flow in +x direction)
  // φ = U·x·(1 + R³/2r³)
  // v = grad(φ)
  const R3 = R * R * R;
  const vrx = U * (1 + R3 / (2 * r3) - 3 * R3 * rx * rx / (2 * r5));
  const vry = U * (-3 * R3 * rx * ry / (2 * r5));
  const vrz = U * (-3 * R3 * rx * rz / (2 * r5));

  // Rotate velocity back to original frame
  return [
    vrx * cosA - vry * sinA,
    vrx * sinA + vry * cosA,
    vrz,
  ];
}

// ─── World-space trace (no camera — cached) ─────────────────────────

export interface WorldStreamlineData {
  rawStreamlines: Array<Array<[number, number, number]>>;
  sphereRadius: number;
}

export function traceWorldStreamlines(params: FormulaParams): WorldStreamlineData {
  const sphereRadius = params.sphereRadius ?? 80;
  const noiseAmp = params.noiseAmplitude ?? 50;
  const noiseFreq = params.noiseFrequency ?? 0.012;
  const streamlineCount = params.streamlineCount ?? 100;
  const CS = params.canvasSize ?? 400;
  const R = sphereRadius;
  const U = 2.0;
  const flowAngle = -Math.PI / 4;
  const cosA = Math.cos(flowAngle);
  const sinA = Math.sin(flowAngle);

  const seeds: Array<[number, number, number]> = [];
  const boxXMin = -CS * 0.75;
  const boxXMax = -CS * 0.15;
  const boxYMin = CS * 0.2;
  const boxYMax = CS * 0.85;
  const boxZMin = -CS * 0.3;
  const boxZMax = CS * 0.3;
  const gx = Math.max(2, Math.round(Math.cbrt(streamlineCount * 0.7)));
  const gy = gx;
  const gz = Math.max(2, Math.round(streamlineCount / (gx * gy)));

  for (let ix = 0; ix < gx; ix++) {
    const fx = gx > 1 ? ix / (gx - 1) : 0.5;
    const sx = boxXMin + fx * (boxXMax - boxXMin);
    for (let iy = 0; iy < gy; iy++) {
      const fy = gy > 1 ? iy / (gy - 1) : 0.5;
      const sy = boxYMin + fy * (boxYMax - boxYMin);
      for (let iz = 0; iz < gz; iz++) {
        if (seeds.length >= streamlineCount) break;
        const fz = gz > 1 ? iz / (gz - 1) : 0.5;
        const sz = boxZMin + fz * (boxZMax - boxZMin);
        seeds.push([sx, sy, sz]);
      }
    }
  }

  const rawStreamlines: Array<Array<[number, number, number]>> = [];
  const dt = 2.0;
  const maxSteps = 1000;

  for (let si = 0; si < seeds.length; si++) {
    const [sx, sy, sz] = seeds[si];
    const points3D: Array<[number, number, number]> = [[sx, sy, sz]];
    let x = sx, y = sy, z = sz;
    const noiseSeed = si * 173.3;

    for (let step = 0; step < maxSteps; step++) {
      const dist = Math.sqrt(x * x + y * y + z * z);
      if (dist < R * 0.96) break;
      if (Math.abs(x) > CS * 1.8 || Math.abs(y) > CS * 1.8 || Math.abs(z) > CS * 1.8) break;

      let [vx, vy, vz] = getVelocity3D(x, y, z, R, cosA, sinA, U);

      if (noiseAmp > 0) {
        const n = (fbm(x * noiseFreq + noiseSeed, y * noiseFreq + noiseSeed, 3) - 0.5) * 2;
        const len = Math.sqrt(vx * vx + vy * vy + vz * vz);
        if (len > 0.001) {
          const perpX = -vy / len;
          const perpY = vx / len;
          const turbScale = 1 + 0.5 / Math.max(0.3, dist / (R * 2));
          vx += perpX * n * (noiseAmp / 30) * turbScale;
          vy += perpY * n * (noiseAmp / 30) * turbScale;
        }
        const nz = (fbm(x * noiseFreq * 1.5 + noiseSeed + 100, y * noiseFreq * 1.5 + z * 0.3, 3) - 0.5) * 2;
        vz += nz * (noiseAmp / 40);
      }

      const vlen = Math.sqrt(vx * vx + vy * vy + vz * vz);
      if (vlen < 0.01) break;
      vx /= vlen;
      vy /= vlen;
      vz /= vlen;

      x += vx * dt;
      y += vy * dt;
      z += vz * dt;

      if (step % 2 === 0) points3D.push([x, y, z]);
    }

    if (points3D.length > 1) {
      rawStreamlines.push(points3D);
    }
  }

  return { rawStreamlines, sphereRadius };
}

// ─── Project world-space streamlines to screen (runs every frame) ──

export interface ProjectedStreamlineResult {
  segments: LineSegment[];
  bounds: number[];
  camPos: [number, number, number];
  focalLen: number;
  sphereScreenX: number;
  sphereScreenY: number;
  sphereScreenR: number;
}

export function projectWorldStreamlines(
  worldData: WorldStreamlineData,
  camAzimuth: number,
  camElevation: number,
  camDist: number,
): ProjectedStreamlineResult {
  const { rawStreamlines, sphereRadius: R } = worldData;
  const focalLen = R * 2.5;
  const camera = makeCamera(camAzimuth, camElevation, camDist, focalLen);
  const allSegments: LineSegment[] = [];
  const streamlineBounds: number[] = [];

  for (let si = 0; si < rawStreamlines.length; si++) {
    const points3D = rawStreamlines[si];
    if (points3D.length < 2) continue;
    streamlineBounds.push(allSegments.length + points3D.length - 1);

    for (let i = 0; i < points3D.length - 1; i++) {
      const [x1w, y1w, z1w] = points3D[i];
      const [x2w, y2w, z2w] = points3D[i + 1];

      const d1 = x1w * x1w + y1w * y1w + z1w * z1w;
      const d2 = x2w * x2w + y2w * y2w + z2w * z2w;
      if (d1 < R * R * 0.95 || d2 < R * R * 0.95) continue;

      const p1 = projectPoint(x1w, y1w, z1w, camera);
      const p2 = projectPoint(x2w, y2w, z2w, camera);
      if (!p1 || !p2) continue;

      const [sx1, sy1, cz1] = p1;
      const [sx2, sy2, cz2] = p2;

      const mxw = (x1w + x2w) / 2;
      const myw = (y1w + y2w) / 2;
      const mzw = (z1w + z2w) / 2;
      const occluded = isOccludedBySphere(mxw, myw, mzw, camera.camPos, R);
      const segDepth = (cz1 + cz2) / 2;

      allSegments.push({
        x1: sx1, y1: sy1,
        x2: sx2, y2: sy2,
        angle: Math.atan2(sy2 - sy1, sx2 - sx1),
        length: Math.sqrt((sx2 - sx1) ** 2 + (sy2 - sy1) ** 2),
        depth: segDepth,
        visualOnly: occluded,
        x1w, y1w, z1w,
        x2w, y2w, z2w,
      });
    }
  }

  const sphereProj = projectPoint(0, 0, 0, camera);
  const sphereScreenR = sphereProj ? R * camera.focalLen / sphereProj[2] : R;

  return {
    segments: allSegments,
    bounds: streamlineBounds,
    camPos: camera.camPos,
    focalLen,
    sphereScreenX: 0,
    sphereScreenY: 0,
    sphereScreenR,
  };
}

// ─── Original formula (unified — kept for backwards compat) ────────

export const fluidStream: FormulaFn = (text: string, params, _time: number) => {
  const sphereRadius = params.sphereRadius ?? 80;
  const CS = params.canvasSize ?? 400;
  const camAzimuth = params.cameraAzimuth ?? -Math.PI * 0.45;
  const camElevation = params.cameraElevation ?? -Math.PI / 6;
  const camDist = params.cameraDistance ?? sphereRadius * 2.0;

  const worldData = traceWorldStreamlines(params);
  const projected = projectWorldStreamlines(worldData, camAzimuth, camElevation, camDist);

  return {
    type: 'segments',
    segments: projected.segments,
    _streamlineBounds: projected.bounds,
    _cameraPos: projected.camPos,
    _focalLen: projected.focalLen,
    _sphereScreenX: projected.sphereScreenX,
    _sphereScreenY: projected.sphereScreenY,
    _sphereScreenR: projected.sphereScreenR,
  } as any;
};
