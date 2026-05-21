import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three/webgpu';
import {
  Fn,
  attribute,
  cos,
  cross,
  dFdx,
  dFdy,
  float,
  mix,
  normalize,
  oneMinus,
  positionLocal,
  positionWorld,
  pow,
  sin,
  texture,
  uniform,
  uv,
  vec2,
  vec3,
  vec4,
} from 'three/tsl';
import { useGenesisStore } from './store';

const ADNA = {
  basePairsPerTurn: 11,
  twistDeg: 32.7,
  riseAngstrom: 2.6,
  diameterAngstrom: 23,
  radiusAngstrom: 11.5,
  baseTiltDeg: 20,
  offAxisDisplacementAngstrom: 4.5,
  minorGrooveOffsetDeg: 12,
  majorGrooveOffsetDeg: -22,
  majorGrooveWidthDeg: 55,
  minorGrooveWidthDeg: 25,
};

const BASE_PAIR_COUNT = 33;
const BASE_LABELS = ['A-T', 'G-C', 'T-A', 'C-G'];
const ANGSTROM_TO_BUBBLE = 0.052;
const BASE_WIDTH = 8.8 * ANGSTROM_TO_BUBBLE;
const BASE_HEIGHT = 1.8 * ANGSTROM_TO_BUBBLE;

const BEAD_RADIUS = 0.032;
const CONNECTOR_RADIUS = 0.012;

const DUMMY = new THREE.Object3D();

function getBackboneAngles(strand: 1 | -1) {
  const minor = THREE.MathUtils.degToRad(ADNA.minorGrooveOffsetDeg);
  const major = THREE.MathUtils.degToRad(ADNA.majorGrooveOffsetDeg);
  return strand === 1 ? minor : major;
}

function makeBackbonePoint(i: number, dnaT: number, strand: 1 | -1) {
  const sample = i / Math.max(1, BASE_PAIR_COUNT - 1);
  const topTheta = sample * Math.PI * 2;
  const helixTheta = i * (Math.PI * 2 / ADNA.basePairsPerTurn) + (strand === 1 ? 0 : Math.PI);
  const grooveOffset = getBackboneAngles(strand);
  const theta = THREE.MathUtils.lerp(topTheta, helixTheta + grooveOffset, dnaT);
  const radius = (ADNA.radiusAngstrom + ADNA.offAxisDisplacementAngstrom * dnaT + 1.6) * ANGSTROM_TO_BUBBLE;
  const centeredY = (i - (BASE_PAIR_COUNT - 1) / 2) * ADNA.riseAngstrom * ANGSTROM_TO_BUBBLE * dnaT;

  const top = new THREE.Vector3(Math.cos(topTheta) * radius, Math.sin(topTheta) * radius, 0);
  const helix = new THREE.Vector3(Math.cos(theta) * radius, centeredY, Math.sin(theta) * radius);

  return top.lerp(helix, dnaT);
}

type AtlasEntry = { u: number; v: number; w: number; h: number };

function makeLabelAtlas(labels: string[]) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  canvas.width = 1024;
  canvas.height = 256;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "bold 72px 'Space Grotesk', 'Arial Narrow', sans-serif";
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'white';
  ctx.shadowBlur = 18;
  ctx.shadowColor = 'rgba(170, 230, 255, 0.95)';

  const map = new Map<string, AtlasEntry>();
  const cellWidth = canvas.width / labels.length;

  labels.forEach((label, index) => {
    const x = index * cellWidth;
    ctx.fillText(label, x + cellWidth / 2, canvas.height / 2);
    map.set(label, { u: x / canvas.width, v: 0, w: cellWidth / canvas.width, h: 1 });
  });

  const textureAtlas = new THREE.CanvasTexture(canvas);
  textureAtlas.colorSpace = THREE.SRGBColorSpace;
  textureAtlas.minFilter = THREE.LinearFilter;
  textureAtlas.magFilter = THREE.LinearFilter;

  return { textureAtlas, map };
}

export function ADNAInsideBubble({
  delay = 0,
  visible = false,
}: {
  delay?: number;
  visible?: boolean;
}) {
  const phase = useGenesisStore(s => s.phase);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const strandARef = useRef<THREE.InstancedMesh>(null);
  const strandBRef = useRef<THREE.InstancedMesh>(null);
  const connectorARef = useRef<THREE.InstancedMesh>(null);
  const connectorBRef = useRef<THREE.InstancedMesh>(null);
  const elapsedRef = useRef(0);

  const uniforms = useMemo(() => ({
    dnaT: uniform(0),
    opacity: uniform(0),
  }), []);

  const { geometry, material } = useMemo(() => {
    const atlas = makeLabelAtlas(BASE_LABELS);
    const geometry = new THREE.PlaneGeometry(1, 1);
    const stride = 9;
    const data = new Float32Array(BASE_PAIR_COUNT * stride);
    const buffer = new THREE.InstancedInterleavedBuffer(data, stride);

    geometry.setAttribute('aIndex', new THREE.InterleavedBufferAttribute(buffer, 1, 0));
    geometry.setAttribute('aUvRect', new THREE.InterleavedBufferAttribute(buffer, 4, 1));
    geometry.setAttribute('aColor', new THREE.InterleavedBufferAttribute(buffer, 3, 5));

    for (let i = 0; i < BASE_PAIR_COUNT; i++) {
      const label = BASE_LABELS[i % BASE_LABELS.length];
      const entry = atlas.map.get(label)!;
      const color = i % 2 === 0 ? [0.45, 0.95, 1.0] : [1.0, 0.82, 0.48];
      const base = i * stride;

      data[base + 0] = i;
      data[base + 1] = entry.u;
      data[base + 2] = entry.v;
      data[base + 3] = entry.w;
      data[base + 4] = entry.h;
      data[base + 5] = color[0];
      data[base + 6] = color[1];
      data[base + 7] = color[2];
      data[base + 8] = 1;
    }

    const material = new THREE.MeshStandardNodeMaterial({
      roughness: 0.4,
      metalness: 0.1,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });

    material.positionNode = Fn(() => {
      const i = attribute('aIndex', 'float') as any;
      const t = uniforms.dnaT as any;
      const p = positionLocal.toVar() as any;

      const topTheta = i.mul(Math.PI * 2 / BASE_PAIR_COUNT);
      const helixTheta = i.mul(Math.PI * 2 / ADNA.basePairsPerTurn);
      const theta = mix(topTheta, helixTheta, t);
      const radius = float(ADNA.radiusAngstrom * ANGSTROM_TO_BUBBLE)
        .add(float(ADNA.offAxisDisplacementAngstrom * ANGSTROM_TO_BUBBLE).mul(t));
      const centeredY = i.sub(float((BASE_PAIR_COUNT - 1) / 2))
        .mul(ADNA.riseAngstrom * ANGSTROM_TO_BUBBLE)
        .mul(t);

      const topCenter = (vec3 as any)(cos(topTheta).mul(radius), sin(topTheta).mul(radius), 0);
      const helixCenter = (vec3 as any)(cos(theta).mul(radius), centeredY, sin(theta).mul(radius));
      const center = mix(topCenter, helixCenter, t) as any;

      const tangentTop = (vec3 as any)(sin(topTheta).mul(-1), cos(topTheta), float(0));
      const tangentHelix = (vec3 as any)(sin(theta).mul(-1), float(0), cos(theta));
      const tangent = mix(tangentTop, tangentHelix, t) as any;

      const radialTop = (vec3 as any)(cos(topTheta), sin(topTheta), float(0));
      const radialHelix = (vec3 as any)(cos(theta), float(0), sin(theta));
      const radial = mix(radialTop, radialHelix, t) as any;

      const tiltRad = float(THREE.MathUtils.degToRad(ADNA.baseTiltDeg));
      const tiltedNormal = radial.mul(cos(tiltRad)).add((vec3 as any)(float(0), float(1), float(0)).mul(sin(tiltRad)));
      const normal = normalize(tiltedNormal) as any;

      const bitangent = normalize(cross(tangent, normal)) as any;

      return center
        .add(tangent.mul(p.x.mul(BASE_WIDTH)))
        .add(bitangent.mul(p.y.mul(BASE_HEIGHT)));
    })();

    material.colorNode = Fn(() => {
      const uvRect = attribute('aUvRect', 'vec4') as any;
      const baseColor = attribute('aColor', 'vec3') as any;
      const baseUv = uv() as any;
      const atlasUv = vec2(
        baseUv.x.mul(uvRect.z).add(uvRect.x),
        baseUv.y.mul(uvRect.w).add(uvRect.y)
      ) as any;
      const glyph = texture(atlas.textureAtlas, atlasUv) as any;
      const bodyAlpha = float(0.22);
      const alpha = glyph.r.mul(0.85).add(bodyAlpha).mul(uniforms.opacity);

      const posWorld = positionWorld || vec3(0, 0, 0);
      const dx = dFdx(posWorld);
      const dy = dFdy(posWorld);
      const computedNormal = normalize(cross(dx, dy));
      const viewDir = normalize(vec3(0, 0, 5).sub(posWorld));
      const nDotV = computedNormal.dot(viewDir).abs();
      const rim = pow(oneMinus(nDotV), float(3.0));
      const litColor = baseColor.mul(float(0.65)).add(baseColor.mul(rim).mul(float(1.4)));
      const glyphBoost = glyph.r.mul(1.5).add(0.35);

      return vec4(litColor.mul(glyphBoost), alpha);
    })();

    return { geometry, material };
  }, [uniforms]);

  const strandBeadGeo = useMemo(() => new THREE.SphereGeometry(1, 10, 10), []);
  const connectorGeo = useMemo(() => new THREE.CylinderGeometry(1, 1, 1, 6), []);

  const strandMaterials = useMemo(() => ({
    a: new THREE.MeshStandardNodeMaterial({
      color: new THREE.Color('#9befff'),
      roughness: 0.25,
      metalness: 0.2,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
    b: new THREE.MeshStandardNodeMaterial({
      color: new THREE.Color('#ffe0a0'),
      roughness: 0.25,
      metalness: 0.2,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  }), []);

  const connectorMaterials = useMemo(() => ({
    a: new THREE.MeshStandardNodeMaterial({
      color: new THREE.Color('#9befff'),
      roughness: 0.35,
      metalness: 0.15,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
    b: new THREE.MeshStandardNodeMaterial({
      color: new THREE.Color('#ffe0a0'),
      roughness: 0.35,
      metalness: 0.15,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  }), []);

  useFrame((_, delta) => {
    if (phase === 10 && visible) {
      elapsedRef.current = Math.min(1 + delay, elapsedRef.current + delta / 7);
    } else {
      elapsedRef.current = Math.max(0, elapsedRef.current - delta * 1.6);
    }

    const delayedProgress = THREE.MathUtils.clamp((elapsedRef.current - delay) / Math.max(0.001, 1 - delay), 0, 1);
    const localT = THREE.MathUtils.smoothstep(delayedProgress, 0, 1);

    uniforms.dnaT.value = localT;
    uniforms.opacity.value += ((phase === 10 && visible ? Math.max(0.55, localT) : 0) - uniforms.opacity.value) * Math.min(1, delta * 2.8);

    const op = uniforms.opacity.value;

    for (let strandIdx = 0; strandIdx < 2; strandIdx++) {
      const strand = strandIdx === 0 ? 1 : -1;
      const strandRef = strandIdx === 0 ? strandARef : strandBRef;
      const connRef = strandIdx === 0 ? connectorARef : connectorBRef;
      const strandMat = strandIdx === 0 ? strandMaterials.a : strandMaterials.b;
      const connMat = strandIdx === 0 ? connectorMaterials.a : connectorMaterials.b;

      if (strandRef.current) {
        for (let i = 0; i < BASE_PAIR_COUNT; i++) {
          const pt = makeBackbonePoint(i, localT, strand as 1 | -1);
          DUMMY.position.copy(pt);
          DUMMY.scale.setScalar(BEAD_RADIUS);
          DUMMY.updateMatrix();
          strandRef.current.setMatrixAt(i, DUMMY.matrix);
        }
        strandRef.current.instanceMatrix.needsUpdate = true;
        strandMat.opacity = op * 0.85;
      }

      if (connRef.current && meshRef.current) {
        for (let i = 0; i < BASE_PAIR_COUNT; i++) {
          const backbonePt = makeBackbonePoint(i, localT, strand as 1 | -1);

          const topTheta = (i / BASE_PAIR_COUNT) * Math.PI * 2;
          const helixTheta = (i / ADNA.basePairsPerTurn) * Math.PI * 2;
          const theta = THREE.MathUtils.lerp(topTheta, helixTheta, localT);
          const radius = (ADNA.radiusAngstrom + ADNA.offAxisDisplacementAngstrom * localT) * ANGSTROM_TO_BUBBLE;
          const centeredY = (i - (BASE_PAIR_COUNT - 1) / 2) * ADNA.riseAngstrom * ANGSTROM_TO_BUBBLE * localT;

          const topCenter = new THREE.Vector3(Math.cos(topTheta) * radius, Math.sin(topTheta) * radius, 0);
          const helixCenter = new THREE.Vector3(Math.cos(theta) * radius, centeredY, Math.sin(theta) * radius);
          const center = topCenter.lerp(helixCenter, localT);

          const tangent = new THREE.Vector3(-Math.sin(theta), 0, Math.cos(theta)).normalize();
          const radial = new THREE.Vector3(Math.cos(theta), 0, Math.sin(theta)).normalize();
          const tiltRad = THREE.MathUtils.degToRad(ADNA.baseTiltDeg);
          const tiltedUp = radial.clone().multiplyScalar(Math.cos(tiltRad)).add(new THREE.Vector3(0, 1, 0).multiplyScalar(Math.sin(tiltRad))).normalize();
          void tiltedUp;

          const baseEnd = center.clone().add(tangent.clone().multiplyScalar(BASE_WIDTH * 0.5 * (strand as number)));
          const dir = new THREE.Vector3().subVectors(backbonePt, baseEnd);
          const len = dir.length();

          if (len > 0.001) {
            DUMMY.position.copy(baseEnd).add(dir.multiplyScalar(0.5));
            DUMMY.scale.set(CONNECTOR_RADIUS, len, CONNECTOR_RADIUS);
            DUMMY.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
            DUMMY.updateMatrix();
            connRef.current.setMatrixAt(i, DUMMY.matrix);
          } else {
            DUMMY.scale.set(0, 0, 0);
            DUMMY.updateMatrix();
            connRef.current.setMatrixAt(i, DUMMY.matrix);
          }
        }
        connRef.current.instanceMatrix.needsUpdate = true;
        connMat.opacity = op * 0.6;
      }
    }

    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <group scale={2.15}>
      <instancedMesh ref={meshRef} args={[geometry, material, BASE_PAIR_COUNT]} />
      <instancedMesh ref={strandARef} args={[strandBeadGeo, strandMaterials.a, BASE_PAIR_COUNT]} />
      <instancedMesh ref={strandBRef} args={[strandBeadGeo, strandMaterials.b, BASE_PAIR_COUNT]} />
      <instancedMesh ref={connectorARef} args={[connectorGeo, connectorMaterials.a, BASE_PAIR_COUNT]} />
      <instancedMesh ref={connectorBRef} args={[connectorGeo, connectorMaterials.b, BASE_PAIR_COUNT]} />
    </group>
  );
}
