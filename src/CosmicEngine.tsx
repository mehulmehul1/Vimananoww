import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three/webgpu';
import { 
  Fn, uniform, vec2, vec4, float,
  texture, uv, attribute, mix,
  positionLocal, sin, cos
} from 'three/tsl';
import { useGenesisStore } from './store';

const PROSE = `pure frequency to environmental manifestation. absolute black vacuum silence prevails. a single microscopic white dot appears in the void. high-frequency visual hum resonates through space. crystallizes into a word that breathes and pulses. fundamental strings of the universe vibrate endlessly. a storm of language descending from the heavens above. torrential immersive environment envelops all consciousness. liquid typography pool reflects the storm-lit sky. deep sea of rainy text gathers below the surface. nebulas of prose drifting through the endless void. typographic explosions illuminate the surrounding darkness. the architecture of meaning dissolves into primordial letters. each character a vessel carrying the weight of unspoken worlds. language becomes weather and weather becomes pure knowledge. from the first vibration emerged syllables of understanding. consciousness written in the rain falling through infinite space. the ocean floor where all text settles and dreams of new meaning. words accumulate in layers of thought forming new continents.`;
const MAX_CHARS = 2048;

class WebGPUFontAtlas {
  public texture: THREE.CanvasTexture;
  public map: Map<string, { u: number; v: number; w: number; h: number; pxWidth: number }>;
  public fontSize = 64;

  constructor(charSet: string) {
    const c = document.createElement('canvas');
    const ctx = c.getContext('2d')!;
    c.width = c.height = 1024; 
    ctx.clearRect(0, 0, 1024, 1024);
    
    // Sharp, crisp text. Bloom is handled by post-processing if needed.
    ctx.font = `${this.fontSize}px 'Space Grotesk', 'Arial Narrow', sans-serif`;
    ctx.fillStyle = 'white';
    ctx.textBaseline = 'top';
    
    this.map = new Map();
    let x = 0, y = 0;

    for (const ch of new Set(charSet)) {
      if (this.map.has(ch)) continue;
      const pxW = Math.ceil(ctx.measureText(ch).width);
      if (x + pxW + 4 > 1024) { x = 0; y += this.fontSize + 4; }
      ctx.fillText(ch, x, y);
      
      this.map.set(ch, {
        u: x / 1024,
        v: (1024 - y - this.fontSize) / 1024,
        w: pxW / 1024,
        h: this.fontSize / 1024,
        pxWidth: pxW
      });
      x += pxW + 4;
    }
    this.texture = new THREE.CanvasTexture(c);
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;
  }
}

export function CosmicEngine() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const phase = useGenesisStore(s => s.phase);
  
  // Using a ref to prevent stale closures in useFrame
  const phaseRef = useRef(phase);
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const setPhase = useGenesisStore(s => s.setPhase);
  const advanceTime = useGenesisStore(s => s.advanceTime);
  const phaseTime = useGenesisStore(s => s.phaseTime);

  const { atlas, geometry, material, instanceData } = useMemo(() => {
    const charSet = ('VIMANA ' + PROSE + 'abcdefghijklmnopqrstuvwxyz.,-\'').split('');
    const atlas = new WebGPUFontAtlas(Array.from(new Set(charSet)).join(''));
    
    const geo = new THREE.PlaneGeometry(1, 1);
    const iData = new Float32Array(MAX_CHARS * 11);
    const interleavedBuffer = new THREE.InstancedInterleavedBuffer(iData, 11);

    geo.setAttribute('aOffset', new THREE.InterleavedBufferAttribute(interleavedBuffer, 3, 0));
    geo.setAttribute('aScale', new THREE.InterleavedBufferAttribute(interleavedBuffer, 2, 3));
    geo.setAttribute('aRot', new THREE.InterleavedBufferAttribute(interleavedBuffer, 1, 5));
    geo.setAttribute('aOpacity', new THREE.InterleavedBufferAttribute(interleavedBuffer, 1, 6));
    geo.setAttribute('aUvRect', new THREE.InterleavedBufferAttribute(interleavedBuffer, 4, 7));

    const atlasTexture = new THREE.Texture(atlas.texture.image);
    atlasTexture.needsUpdate = true;
    atlasTexture.minFilter = THREE.LinearFilter;
    atlasTexture.magFilter = THREE.LinearFilter;

    const uGlobalOpacity = uniform(1.0);
    const uFlash = uniform(0.0);

    const mat = new THREE.MeshBasicNodeMaterial();
    mat.transparent = true;
    mat.blending = THREE.AdditiveBlending;
    mat.depthWrite = false;
    mat.side = THREE.DoubleSide;

    mat.positionNode = Fn(() => {
      const offset = attribute('aOffset', 'vec3');
      const scale = attribute('aScale', 'vec2');
      const rot = attribute('aRot', 'float');
      const p = positionLocal.toVar();
      p.x.assign(p.x.mul(scale.x));
      p.y.assign(p.y.mul(scale.y));
      const cosR = cos(rot);
      const sinR = sin(rot);
      const rx = p.x.mul(cosR).sub(p.y.mul(sinR));
      const ry = p.x.mul(sinR).add(p.y.mul(cosR));
      p.x.assign(rx.add(offset.x));
      p.y.assign(ry.add(offset.y));
      p.z.assign(offset.z);
      return p;
    })();

    mat.colorNode = Fn(() => {
      const uvRect = attribute('aUvRect', 'vec4');
      const alpha = attribute('aOpacity', 'float');
      const atlasUV = vec2( uv().x.mul(uvRect.z).add(uvRect.x), uv().y.mul(uvRect.w).add(uvRect.y) );
      const t = texture(atlasTexture, atlasUV);
      const charAlpha = t.r.mul(alpha).mul(uGlobalOpacity);
      const flashBoost = uFlash.mul(0.3);
      return vec4( float(0.9).add(flashBoost), float(0.95).add(flashBoost), float(1.0).add(flashBoost), charAlpha );
    })();

    return { atlas, geometry: geo, material: mat, instanceData: iData };
  }, []);

  const engineState = useRef({
    ascensionY: 0,
    holdTime: 0,
    chars: PROSE.split(''),
    numStrings: 5,
    charsPerString: 60,
    ringRadius: 180,
  });

  const setChar = (idx: number, x: number, y: number, sx: number, sy: number, rot: number, op: number, ch: string) => {
    const base = idx * 11;
    instanceData[base+0] = x; instanceData[base+1] = y; instanceData[base+2] = 0;
    instanceData[base+3] = sx; instanceData[base+4] = sy;
    instanceData[base+5] = rot; instanceData[base+6] = op;
    const cd = atlas.map.get(ch) || atlas.map.get(' ')!;
    instanceData[base+7] = cd.u; instanceData[base+8] = cd.v;
    instanceData[base+9] = cd.w; instanceData[base+10] = cd.h;
  };

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const est = engineState.current;
    const currentPhase = phaseRef.current;
    
    // Process ascension if in phase 6
    if (currentPhase === 6) {
      est.ascensionY += 4.0;
    }

    // Hide all if phase 7+
    if (currentPhase >= 7) {
      if (meshRef.current) meshRef.current.count = 0;
      return;
    }

    // Calculate lerp factors for visual transitions
    const lerpRing = currentPhase === 2 ? 0 : (currentPhase === 3 ? Math.min(1, phaseTime * 2) : 1);
    const lerpFracture = currentPhase <= 3 ? 0 : (currentPhase === 4 ? Math.min(1, phaseTime / 2) : 1);
    const lerpMulti = currentPhase <= 4 ? 0 : (currentPhase === 5 ? Math.min(1, phaseTime / 2) : 1);
    const lerpCondense = currentPhase === 6 ? Math.min(1, phaseTime / 3) : 0;

    if (!meshRef.current) return;
    const totalCount = est.numStrings * est.charsPerString;
    meshRef.current.count = totalCount;

    const manifestWord = 'VIMANA';

    for (let s = 0; s < est.numStrings; s++) {
      const instanceScale = s === 0 ? 1 : lerpMulti;
      const yOffset = (s - Math.floor(est.numStrings / 2)) * 80 * lerpMulti;

      for (let i = 0; i < est.charsPerString; i++) {
        const idx = s * est.charsPerString + i;
        const char = est.chars[idx % est.chars.length];
        const theta = (i / est.charsPerString) * Math.PI * 2;

        let posX = 0, posY = 0, rot = 0;

        if (currentPhase === 2) {
          const charIdx = i % (manifestWord.length + 1);
          if (charIdx < manifestWord.length && s === 0) {
            posX = (charIdx - (manifestWord.length - 1) / 2) * 50;
            posY = Math.sin(t * 5 + charIdx) * 10;
          } else { posX = 9999; }
        } else {
          const noiseWobble = Math.sin(theta * 6 + t * 2) * 15;
          const ringX = Math.cos(theta + t * 0.2) * (est.ringRadius + noiseWobble);
          const ringY = Math.sin(theta + t * 0.2) * (est.ringRadius + noiseWobble);
          const ringRot = theta + t * 0.2 + Math.PI / 2;

          const stringX = (i - est.charsPerString / 2) * 20; // mathematical space
          const stringY = Math.sin(t * 2.5 + i * 0.1) * 20;

          const cloudRX = 120, cloudRY = 40;
          const condenseX = (s - 2) * 200 + Math.cos(theta * 2 + t * 3) * cloudRX;
          const condenseY = Math.sin(theta * 2 + t * 3) * cloudRY;

          posX = ringX + (stringX - ringX) * lerpFracture;
          posY = ringY + (stringY - ringY) * lerpFracture;
          rot = ringRot * (1 - lerpFracture);

          if (lerpCondense > 0) {
            posX += (condenseX - posX) * lerpCondense;
            posY += (condenseY - posY) * lerpCondense;
          }
        }

        posY += yOffset + est.ascensionY;

        const cd = atlas.map.get(char) || atlas.map.get(' ')!;
        const charScaleX = cd.pxWidth * 0.45 * instanceScale;
        const charScaleY = atlas.fontSize * 0.45 * instanceScale;
        const opacity = instanceScale > 0.01 ? (1 - Math.min(1, est.ascensionY/600)) : 0;

        setChar(idx, posX, posY, charScaleX, charScaleY, rot, opacity, char);
      }
    }

    const attr = meshRef.current.geometry.getAttribute('aOffset') as THREE.InterleavedBufferAttribute;
    attr.data.needsUpdate = true;
  });

  if (phase >= 8) return null;

  return (
    <instancedMesh ref={meshRef} args={[geometry, material, MAX_CHARS]} />
  );
}
