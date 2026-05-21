import './style.css';
import * as THREE from 'three/webgpu';
import { 
  Fn, uniform, vec2, vec3, vec4, float,
  texture, uv, attribute, mix, smoothstep,
  instanceIndex, positionLocal, time, sin, cos
} from 'three/tsl';
import { prepareWithSegments, layoutWithLines, measureNaturalWidth } from '@chenglou/pretext';
import { Pane } from 'tweakpane';

/* 
  Vimana Engine v2.2: Hybrid Architecture 
  Restores perfect native Canvas2D typography for weather while
  maintaining WebGPU Instanced mesh for the cosmic intro sequences.
*/

const PARAMS = {
  cloudOpacity: 0.8,
  cloudDriftSpeed: 0.6,
  cloudSpawnChance: 0.003,
  cloudMax: 4,
  rainSpawnRate: 0.5,
  rainMaxDrops: 150,
  rainMinSpeed: 2.0,
  rainMaxSpeed: 5.5,
  rainWindAngle: 0.08,
  rainOpacityMin: 0.6,
  rainOpacityMax: 0.9,
  rainWobble: 0.02,
  particleRadius: 6,
  fluidViscosity: 0.94,
  gravity: 0.4,
  collisionIterations: 2,
  poolOpacity: 0.9,
  poolMaxParticles: 1500,
  lightningChance: 0.003,
  lightningFlashIntensity: 0.08,
  umbrellaRadius: 60,
  umbrellaForce: 35,
  rainColorR: 200, rainColorG: 220, rainColorB: 255,
  poolColorR: 150, poolColorG: 180,  poolColorB: 255,
};

const PROSE = `pure frequency to environmental manifestation. absolute black vacuum silence prevails. a single microscopic white dot appears in the void. high-frequency visual hum resonates through space. crystallizes into a word that breathes and pulses. fundamental strings of the universe vibrate endlessly. a storm of language descending from the heavens above. torrential immersive environment envelops all consciousness. liquid typography pool reflects the storm-lit sky. deep sea of rainy text gathers below the surface. nebulas of prose drifting through the endless void. typographic explosions illuminate the surrounding darkness. the architecture of meaning dissolves into primordial letters. each character a vessel carrying the weight of unspoken worlds. language becomes weather and weather becomes pure knowledge. from the first vibration emerged syllables of understanding. consciousness written in the rain falling through infinite space. the ocean floor where all text settles and dreams of new meaning. words accumulate in layers of thought forming new continents.`;

// ===== FONT ATLAS (WebGPU Sharp Primitives) =====
class FontAtlas {
  public texture: THREE.CanvasTexture;
  public map: Map<string, { u: number; v: number; w: number; h: number; pxWidth: number }>;
  public fontSize = 64;

  constructor(charSet: string) {
    const c = document.createElement('canvas');
    const ctx = c.getContext('2d')!;
    c.width = c.height = 1024; 
    ctx.clearRect(0, 0, 1024, 1024);
    
    // Sharp, unpadded font for the vibrating primitives
    ctx.font = `${this.fontSize}px 'Space Grotesk', 'Arial Narrow', sans-serif`;
    ctx.fillStyle = 'white';
    ctx.textBaseline = 'top';
    
    this.map = new Map();
    let x = 0, y = 0;

    for (const ch of new Set(charSet)) {
      if (this.map.has(ch)) continue;
      const metrics = ctx.measureText(ch);
      const pxW = Math.ceil(metrics.width);
      
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

// ===== PRETEXT ENGINE =====
class PretextEngine {
  private font: string;
  private prepared: ReturnType<typeof prepareWithSegments> | null = null;

  constructor(font: string) {
    this.font = font;
  }

  prepare(text: string) {
    this.prepared = prepareWithSegments(text, this.font);
    return this.prepared;
  }

  getSegmentWidths(): { segments: string[]; widths: number[] } {
    if (!this.prepared) throw new Error('Call prepare() first');
    return {
      segments: this.prepared.segments,
      widths: this.prepared.widths
    };
  }

  layout(maxWidth: number, lineHeight: number) {
    if (!this.prepared) throw new Error('Call prepare() first');
    return layoutWithLines(this.prepared, maxWidth, lineHeight);
  }

  naturalWidth(): number {
    if (!this.prepared) throw new Error('Call prepare() first');
    return measureNaturalWidth(this.prepared);
  }
}

// ===== HYBRID WEATHER DATA MODELS (Canvas 2D) =====
interface CloudWord {
  text: string;
  x: number; y: number;
  opacity: number;
}
interface Cloud {
  cx: number; cy: number; rx: number; ry: number;
  words: CloudWord[];
  driftPhase: number; speed: number;
  life: number; maxLife: number;
}
interface RainDrop {
  x: number; y: number;
  vx: number; vy: number;
  word: string;
  opacity: number;
  wobblePhase: number;
  wobbleAmp: number;
  angle: number;
  spawnYWorld: number;
}
interface PoolParticle {
  id: number;
  char: string;
  x: number; y: number;
  vx: number; vy: number;
}

// ===== MAIN ENGINE =====
class VimanaEngine {
  // Canvases
  private webgpuCanvas: HTMLCanvasElement;
  private c2d: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private renderer!: THREE.WebGPURenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.OrthographicCamera;

  private atlas!: FontAtlas;
  private pretext!: PretextEngine;
  
  private proseChars: string[] = [];
  private proseWords: string[] = [];
  private proseWidths: number[] = [];
  private proseCumulativeWidths: number[] = [];

  // WebGPU buffers (For state 0->6 only)
  private instanceData = new Float32Array(2048 * 11);
  private mesh!: THREE.InstancedMesh;

  // Weather data (For state 7+ only)
  private clouds: Cloud[] = [];
  private rain: RainDrop[] = [];
  private pool: PoolParticle[] = [];
  private particleTargetList: number[] = [];
  private nextParticleId = 0;

  // State machine
  private state = 0;
  private phaseTime = 0;
  private holdTime = 0;
  private isHovering = false;
  private ascensionY = 0;
  private globalFlash = 0;
  private frame = 0;

  private mouse = { x: -9999, y: -9999 };
  private lastMouse = { x: -9999, y: -9999 };

  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private audioData: Uint8Array | null = null;

  private numStrings = 5;
  private charsPerString = 60;
  private ringRadius = 180;
  private uOpacity = uniform(1.0);
  private uFlash = uniform(0.0);
  private pane: Pane | null = null;

  constructor() {
    this.webgpuCanvas = document.getElementById('vimana-canvas') as HTMLCanvasElement;
    
    // Inject overlay Canvas2D
    this.c2d = document.createElement('canvas');
    this.c2d.id = 'vimana-canvas-2d';
    this.c2d.style.position = 'absolute';
    this.c2d.style.top = '0';
    this.c2d.style.left = '0';
    this.c2d.style.width = '100vw';
    this.c2d.style.height = '100vh';
    this.c2d.style.pointerEvents = 'none'; // WebGPU handles true clicks if needed
    this.c2d.style.zIndex = '10'; // Above webgpu
    document.body.appendChild(this.c2d);
    
    this.ctx = this.c2d.getContext('2d', { alpha: true })!;
    this.init();
  }

  private async init() {
    console.log('[VIMANA v2.2] Initializing Hybrid Renderer (WebGPU + Canvas2D)');

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x30302f);

    const hw = window.innerWidth / 2;
    const hh = window.innerHeight / 2;
    this.camera = new THREE.OrthographicCamera(-hw, hw, hh, -hh, 0.1, 2000);
    this.camera.position.z = 1000;

    this.renderer = new THREE.WebGPURenderer({ canvas: this.webgpuCanvas, antialias: true });
    this.renderer.setClearColor(0x30302f, 1);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    
    try {
      await this.renderer.init();
    } catch (e) {
      this.showError('WebGPU not supported.');
      return;
    }

    this.resizeCanvas2D();
    window.addEventListener('resize', () => this.handleResize());
    window.addEventListener('mousemove', (e) => { this.mouse.x = e.clientX; this.mouse.y = e.clientY; });

    // Setup Text parsing
    this.pretext = new PretextEngine(`11px 'Space Grotesk', 'Arial Narrow', sans-serif`);
    this.pretext.prepare(PROSE);
    const { segments, widths } = this.pretext.getSegmentWidths();
    
    let cumWidth = 0;
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      const segWidth = widths[i];
      const chars = seg.split('');
      const perCharWidth = segWidth / Math.max(1, chars.length);
      for (const ch of chars) {
        this.proseChars.push(ch);
        this.proseWidths.push(perCharWidth);
        this.proseCumulativeWidths.push(cumWidth);
        cumWidth += perCharWidth;
      }
    }
    this.proseWords = PROSE.split(/\s+/).filter(w => w.length > 0);

    const allChars = new Set(('VIMANA ' + PROSE + 'abcdefghijklmnopqrstuvwxyz.,-\'').split(''));
    this.atlas = new FontAtlas(Array.from(allChars).join(''));

    this.setupMesh();

    const dot = document.getElementById('dot-hum');
    dot?.addEventListener('mouseenter', () => this.isHovering = true);
    dot?.addEventListener('mouseleave', () => this.isHovering = false);
    dot?.addEventListener('click', () => {
      if (this.state === 0) {
        this.startAudio();
        this.state = 1;
      }
    });

    this.setupTweakpane();
    this.animate();
  }

  private setupMesh() {
    const geo = new THREE.PlaneGeometry(1, 1);

    this.instanceData.fill(0);
    // Stride = 11 floats: pos(3) + scale(2) + rot(1) + op(1) + uv(4)
    const interleavedBuffer = new THREE.InstancedInterleavedBuffer(this.instanceData, 11);

    geo.setAttribute('aOffset', new THREE.InterleavedBufferAttribute(interleavedBuffer, 3, 0));
    geo.setAttribute('aScale', new THREE.InterleavedBufferAttribute(interleavedBuffer, 2, 3));
    geo.setAttribute('aRot', new THREE.InterleavedBufferAttribute(interleavedBuffer, 1, 5));
    geo.setAttribute('aOpacity', new THREE.InterleavedBufferAttribute(interleavedBuffer, 1, 6));
    geo.setAttribute('aUvRect', new THREE.InterleavedBufferAttribute(interleavedBuffer, 4, 7));

    const atlasTexture = new THREE.Texture(this.atlas.texture.image);
    atlasTexture.needsUpdate = true;
    atlasTexture.minFilter = THREE.LinearFilter;
    atlasTexture.magFilter = THREE.LinearFilter;

    const mat = new THREE.MeshBasicNodeMaterial();
    mat.transparent = true;
    mat.blending = THREE.AdditiveBlending; // Perfect for cosmic rings
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
      
      const atlasUV = vec2(
        uv().x.mul(uvRect.z).add(uvRect.x),
        uv().y.mul(uvRect.w).add(uvRect.y)
      );
      const t = texture(atlasTexture, atlasUV);
      const charAlpha = t.r.mul(alpha).mul(this.uOpacity);
      const flashBoost = this.uFlash.mul(0.3);
      
      return vec4(
        float(0.9).add(flashBoost),
        float(0.95).add(flashBoost),
        float(1.0).add(flashBoost),
        charAlpha
      );
    })();

    this.mesh = new THREE.InstancedMesh(geo, mat, 2048);
    this.mesh.count = 0;
    this.scene.add(this.mesh);
  }

  private setChar(idx: number, posX: number, posY: number, scaleX: number, scaleY: number, 
                  rotation: number, opacity: number, char: string) {
    const base = idx * 11;
    this.instanceData[base + 0] = posX;
    this.instanceData[base + 1] = posY;
    this.instanceData[base + 2] = 0;
    this.instanceData[base + 3] = scaleX;
    this.instanceData[base + 4] = scaleY;
    this.instanceData[base + 5] = rotation;
    this.instanceData[base + 6] = opacity;

    const cd = this.atlas.map.get(char) || this.atlas.map.get(' ')!;
    this.instanceData[base + 7] = cd.u;
    this.instanceData[base + 8] = cd.v;
    this.instanceData[base + 9] = cd.w;
    this.instanceData[base + 10] = cd.h;
  }

  private startAudio() {
    if (this.audioCtx && this.audioCtx.state === 'running') return;
    if (!this.audioCtx) this.audioCtx = new AudioContext();
    this.audioCtx.resume();
    this.analyser = this.audioCtx.createAnalyser();
    const osc = this.audioCtx.createOscillator();
    osc.frequency.setValueAtTime(55, this.audioCtx.currentTime);
    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(0.008, this.audioCtx.currentTime);
    osc.connect(gain); gain.connect(this.analyser); this.analyser.connect(this.audioCtx.destination);
    osc.start();
    this.audioData = new Uint8Array(this.analyser.frequencyBinCount);
  }

  private setupManifest() {
    document.getElementById('start-overlay')!.style.display = 'none';
    const totalCount = this.numStrings * this.charsPerString;
    this.mesh.count = totalCount;
    for (let i = 0; i < totalCount; i++) {
        const char = this.proseChars[i % this.proseChars.length];
        this.setChar(i, 9999, 9999, 0, 0, 0, 0, char);
    }
    this.state = 2;
    this.phaseTime = 0;
  }

  // === WEATHER LOGIC (CANVAS2D) ===
  private spawnCloud(px: number, py: number) {
    const rx = 150 + Math.random() * 100;
    const ry = 40 + Math.random() * 20;
    const maxLife = 1800 + Math.random() * 1200;

    const cloudText = this.proseWords.slice(
      Math.floor(Math.random() * this.proseWords.length),
      Math.floor(Math.random() * this.proseWords.length) + 15
    ).join(' ');

    const cloudPretext = new PretextEngine(`11px 'Space Grotesk', 'Arial Narrow', sans-serif`);
    cloudPretext.prepare(cloudText);
    const { segments, widths } = cloudPretext.getSegmentWidths();
    const { lines } = cloudPretext.layout(rx * 1.6, 13);

    const words: CloudWord[] = [];
    
    for (let li = 0; li < lines.length; li++) {
      const lineText = lines[li].text;
      const ly = -ry + li * 13;
      const ny = ly / ry;
      const hw = rx * Math.sqrt(Math.max(0, 1 - ny * ny));
      
      const linePretext = new PretextEngine(`11px 'Space Grotesk', sans-serif`);
      linePretext.prepare(lineText);
      const lineW = linePretext.naturalWidth();
      let currX = -lineW / 2;

      // Split into word objects for rain physics
      const wordTokens = lineText.split(' ');
      for (let w = 0; w < wordTokens.length; w++) {
          const wd = wordTokens[w] + (w < wordTokens.length - 1 ? ' ' : '');
          if (wd.trim() === '') {
              currX += 4; continue;
          }
          words.push({ text: wd, x: currX, y: ly, opacity: PARAMS.cloudOpacity * (1 - Math.abs(ny) * 0.5) });
          linePretext.prepare(wd);
          currX += linePretext.naturalWidth();
      }
    }

    this.clouds.push({
      cx: px, cy: py, rx, ry,
      words: words,
      speed: PARAMS.cloudDriftSpeed * (0.8 + Math.random() * 0.4),
      driftPhase: Math.random() * Math.PI * 2,
      life: 0, maxLife
    });
  }

  private transitionToWeather() {
    if (this.state >= 7) return;
    this.state = 7;
    // Hide WebGPU instantly, Canvas2D takes over natively
    this.uOpacity.value = 0; 
    
    const w = window.innerWidth;
    for (let s = 0; s < 7; s++) { 
      this.spawnCloud((s + 1) * w / 8, 80 + Math.random() * 80);
    }
    
    // Seed initial pool particles softly
    const floorY = window.innerHeight - 20; 
    for(let i=0; i<150; i++) {
        this.pool.push({
            id: this.nextParticleId++,
            char: this.proseChars[i % this.proseChars.length],
            x: Math.random() * window.innerWidth,
            y: floorY - 5 + Math.random() * 10,
            vx: 0, vy: 0
        });
    }
  }

  private renderWeather(t: number, avgFreq: number) {
    const w = window.innerWidth, h = window.innerHeight;
    this.ctx.clearRect(0, 0, w, h);

    if (Math.random() < PARAMS.lightningChance) {
      this.globalFlash = PARAMS.lightningFlashIntensity;
    }

    // Canvas styling for perfect aesthetic
    this.ctx.font = "11px 'Space Grotesk', 'Arial Narrow', sans-serif";
    this.ctx.textBaseline = 'middle';

    // 1. Render Clouds
    for (let ci = this.clouds.length - 1; ci >= 0; ci--) {
      const cloud = this.clouds[ci];
      cloud.life++;
      cloud.cx += cloud.speed;
      const dy = Math.cos(t * 0.8 + cloud.driftPhase) * 10;

      const lifeRatio = cloud.life / cloud.maxLife;
      if (lifeRatio >= 1 || cloud.cx - cloud.rx > w) {
        this.clouds.splice(ci, 1);
        continue;
      }

      const fade = Math.sin(lifeRatio * Math.PI);
      this.ctx.shadowBlur = 12;
      this.ctx.shadowColor = `rgba(${PARAMS.rainColorR}, ${PARAMS.rainColorG}, ${PARAMS.rainColorB}, ${0.8 * fade})`;
      
      for (let i = cloud.words.length - 1; i >= 0; i--) {
        const word = cloud.words[i];
        this.ctx.fillStyle = `rgba(255,255,255,${word.opacity * fade})`;
        this.ctx.fillText(word.text, cloud.cx + word.x, cloud.cy + dy + word.y);

        // Spawn rain natively as full words
        if (Math.random() < PARAMS.rainSpawnRate * fade * 0.005) {
          const vx = Math.sin(PARAMS.rainWindAngle) * 1.5;
          const vy = PARAMS.rainMinSpeed + Math.random() * (PARAMS.rainMaxSpeed - PARAMS.rainMinSpeed); // Positive goes down in Canvas2D
          
          this.rain.push({
            x: cloud.cx + word.x,
            y: cloud.cy + dy + word.y,
            vx, vy,
            word: word.text,
            opacity: PARAMS.rainOpacityMin + Math.random() * (PARAMS.rainOpacityMax - PARAMS.rainOpacityMin),
            wobblePhase: Math.random() * Math.PI * 2,
            wobbleAmp: Math.random() * PARAMS.rainWobble,
            angle: PARAMS.rainWindAngle,
            spawnYWorld: cloud.cy + dy + word.y
          });
          
          cloud.words.splice(i, 1);
        }
      }
    }

    if (Math.random() < PARAMS.cloudSpawnChance && this.clouds.length < PARAMS.cloudMax) {
      this.spawnCloud(-150, 80 + Math.random() * 80);
    }

    // 2. Render Rain
    this.ctx.shadowBlur = 8;
    this.ctx.shadowColor = `rgba(${PARAMS.rainColorR}, ${PARAMS.rainColorG}, ${PARAMS.rainColorB}, 0.9)`;
    for (let i = this.rain.length - 1; i >= 0; i--) {
      const drop = this.rain[i];
      drop.x += drop.vx + Math.sin(t * 3 + drop.wobblePhase) * drop.wobbleAmp;
      drop.y += drop.vy;
      drop.vy += PARAMS.gravity * 0.1;
      
      this.ctx.fillStyle = `rgba(255, 255, 255, ${drop.opacity})`;
      this.ctx.save();
      this.ctx.translate(drop.x, drop.y);
      this.ctx.rotate(drop.angle);
      this.ctx.fillText(drop.word, 0, 0);
      this.ctx.restore();

      const floorY = h - 20;
      if (drop.y > floorY) {
        // Shatter Word into Pool Particles
        for (const ch of drop.word.trim()) {
            this.pool.push({
                id: this.nextParticleId++,
                char: ch,
                x: drop.x + (Math.random() - 0.5) * 20,
                y: floorY + Math.random() * 5,
                vx: drop.vx + (Math.random() - 0.5) * 4,
                vy: -drop.vy * 0.3
            });
        }
        if (this.pool.length > PARAMS.poolMaxParticles) {
            this.pool.splice(0, this.pool.length - PARAMS.poolMaxParticles);
        }
        this.rain.splice(i, 1);
      }
    }

    // 3. Render Pool & Mouse Interaction
    this.ctx.shadowBlur = 10;
    this.ctx.shadowColor = `rgba(${PARAMS.poolColorR}, ${PARAMS.poolColorG}, ${PARAMS.poolColorB}, 0.9)`;
    const floorY = h - 10;

    // SPH/Grid acceleration arrays
    const len = this.pool.length;
    
    // Fill text pool
    for (let i = 0; i < len; i++) {
      const p = this.pool[i];
      p.vy += PARAMS.gravity * 0.05;
      
      const dx = p.x - this.mouse.x;
      const dy = p.y - this.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < PARAMS.umbrellaRadius && dist > 0.1) {
        const force = (PARAMS.umbrellaRadius - dist) * 0.05;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }

      p.vx *= PARAMS.fluidViscosity;
      p.vy *= PARAMS.fluidViscosity;
      p.x += p.vx;
      p.y += p.vy;

      if (p.y > floorY) { p.y = floorY; p.vy *= -0.3; p.vx *= 0.8; }
      if (p.x < 0) { p.x = 0; p.vx *= -0.5; }
      if (p.x > w) { p.x = w; p.vx *= -0.5; }

      this.ctx.fillStyle = `rgba(255, 255, 255, ${PARAMS.poolOpacity})`;
      this.ctx.fillText(p.char, p.x, p.y);
    }
  }

  // === MAIN LOOP ===
  private setupTweakpane() {
    this.pane = new Pane({ title: 'Vimana Engine', container: document.body });
    const el = this.pane.element as HTMLElement;
    el.style.position = 'fixed'; el.style.top = '8px'; el.style.right = '8px'; el.style.zIndex = '9999';
    // Add same folders...
  }

  private animate() {
    requestAnimationFrame(() => this.animate());
    try {
      this.frame++;
      const t = this.frame * 0.016;

      let avgFreq = 0;
      if (this.analyser && this.audioData) {
        this.analyser.getByteFrequencyData(this.audioData);
        for (let i = 0; i < 32; i++) avgFreq += this.audioData[i];
        avgFreq = avgFreq / (32 * 255);
      }

      const dot = document.getElementById('dot-hum');
      
      // WebGPU states (0 - 6)
      if (this.state < 7) {
        // Clear Canvas2D so it doesn't block while waiting
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        if (this.state === 0 && dot) {
          if (this.isHovering) {
            this.holdTime += 0.016;
            dot.style.transform = `scale(${1 + this.holdTime * 8})`;
          } else {
            this.holdTime *= 0.9;
            dot.style.transform = `scale(${1 + this.holdTime * 8})`;
          }
        }
        else if (this.state === 1 && dot) {
          this.holdTime += 0.016;
          dot.style.transform = `scale(${1 + this.holdTime * 15})`;
          dot.style.opacity = `${Math.max(0, 1 - this.holdTime)}`;
          if (this.holdTime > 2.0) {
            this.setupManifest();
          }
        }
        else if (this.state >= 2 && this.state <= 6) {
          this.phaseTime += 0.016;
          
          if (this.state === 2 && this.phaseTime > 2.5) {
            this.state = 3; this.phaseTime = 0;
          } else if (this.state === 3 && this.phaseTime > 4.0) {
            this.state = 4; this.phaseTime = 0;
          } else if (this.state === 4 && this.phaseTime > 2.0) {
            this.state = 5; this.phaseTime = 0;
          } else if (this.state === 5 && this.phaseTime > 3.0) {
            this.state = 6; this.phaseTime = 0;
          }

          const lerpFracture = this.state <= 3 ? 0 : (this.state === 4 ? Math.min(1, this.phaseTime / 2) : 1);
          const lerpMulti = this.state <= 4 ? 0 : (this.state === 5 ? Math.min(1, this.phaseTime / 2) : 1);
          const lerpCondense = this.state === 6 ? Math.min(1, this.phaseTime / 3) : 0;

          if (this.state >= 6) {
            this.ascensionY += 4.0;
            if (this.ascensionY > 800) {
              this.transitionToWeather();
            }
          }

          const manifestWord = 'VIMANA';
          const totalProseWidth = this.proseCumulativeWidths[this.proseCumulativeWidths.length - 1] || 1;

          for (let s = 0; s < this.numStrings; s++) {
            const instanceScale = s === 0 ? 1 : lerpMulti;
            const yOffset = (s - Math.floor(this.numStrings / 2)) * 80 * lerpMulti;

            for (let i = 0; i < this.charsPerString; i++) {
              const idx = s * this.charsPerString + i;
              const proseIdx = idx % this.proseChars.length;
              const char = this.proseChars[proseIdx];
              
              const charCumWidth = this.proseCumulativeWidths[proseIdx] || 0;
              const theta = (charCumWidth / totalProseWidth) * Math.PI * 2;

              let posX = 0, posY = 0, rot = 0;

              if (this.state === 2) {
                const charIdx = i % (manifestWord.length + 1);
                if (charIdx < manifestWord.length && s === 0) {
                  posX = (charIdx - (manifestWord.length - 1) / 2) * 50;
                  posY = Math.sin(t * 5 + charIdx) * (10 + avgFreq * 30);
                } else { posX = 9999; }
              } else {
                const noiseWobble = Math.sin(theta * 6 + t * 2) * (15 + avgFreq * 40);
                const ringX = Math.cos(theta + t * 0.2) * (this.ringRadius + noiseWobble);
                const ringY = Math.sin(theta + t * 0.2) * (this.ringRadius + noiseWobble);
                const ringRot = theta + t * 0.2 + Math.PI / 2;

                const stringX = (charCumWidth - totalProseWidth / 2) * 1.5;
                const stringY = Math.sin(t * 2.5 + charCumWidth * 0.01) * (20 + avgFreq * 50);

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

              posY += yOffset + this.ascensionY;

              // Camera space WebGPU coords
              const webgpuMouseX = this.mouse.x - window.innerWidth / 2;
              const webgpuMouseY = -(this.mouse.y - window.innerHeight / 2);
              const dx = posX - webgpuMouseX, dy = posY - webgpuMouseY;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 120) posY += (webgpuMouseY - posY) * 0.4;

              const cd = this.atlas.map.get(char) || this.atlas.map.get(' ')!;
              const charScaleX = cd.pxWidth * 0.35 * instanceScale;
              const charScaleY = this.atlas.fontSize * 0.35 * instanceScale;
              const opacity = instanceScale > 0.01 ? 0.9 : 0;

              this.setChar(idx, posX, posY, charScaleX, charScaleY, rot, opacity, char);
            }
          }
          
          const attr = this.mesh.geometry.getAttribute('aOffset') as THREE.InterleavedBufferAttribute;
          attr.data.needsUpdate = true;
        }

        if (this.globalFlash > 0) {
          this.globalFlash *= 0.8;
          if (this.globalFlash < 0.002) this.globalFlash = 0;
        }
        this.uFlash.value = this.globalFlash;
        this.renderer.render(this.scene, this.camera);
      }

      // Hybrid Handoff (State 7+)
      if (this.state >= 7) {
        // Only Canvas2D renders. WebGPU is frozen/cleared visually.
        this.renderer.render(this.scene, this.camera); // uOpacity is 0, so it renders black
        this.renderWeather(t, avgFreq);
      }

      this.lastMouse.x = this.mouse.x;
      this.lastMouse.y = this.mouse.y;

    } catch (e: any) {
      this.showError(e.message);
    }
  }

  private resizeCanvas2D() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;
    this.c2d.width = w * dpr;
    this.c2d.height = h * dpr;
    this.ctx.scale(dpr, dpr);
  }

  private handleResize() {
    const w = window.innerWidth, h = window.innerHeight;
    this.camera.left = -w / 2;
    this.camera.right = w / 2;
    this.camera.top = h / 2;
    this.camera.bottom = -h / 2;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    
    this.resizeCanvas2D();
  }

  private showError(msg: string) {
    const errDiv = document.createElement('div');
    errDiv.style.cssText = 'position:fixed;bottom:20px;left:20px;background:rgba(255,0,0,0.8);color:white;padding:20px;z-index:99999;font-family:monospace;max-width:80vw;';
    errDiv.innerHTML = `<b>ENGINE CRASH:</b><br>${msg}`;
    if (!document.getElementById('engine-error')) {
      errDiv.id = 'engine-error';
      document.body.appendChild(errDiv);
    }
  }
}

new VimanaEngine();
