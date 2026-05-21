import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  textCircle,
  cymaticRing,
  fractalTree,
  dnaHelix,
  slimycreature,
  fractalFern,
  goldenSpiral,
  hexagonalFractal,
  dendriticCrystal,
  butterflys,
  symmetryWave,
  lSystemTree,
  type LineSegment,
} from "../pretext-editor/formulas";
import { EnvironmentEngine } from "../EnvironmentEngine";
import { layoutTextOnSegments, type LinePlacement } from "./textLayout";

import { getProject, types } from "@theatre/core";
import studio from "@theatre/studio";

const proj = getProject("Vimana Act 1");
const sheet = proj.sheet("Scene 1");

// Dedicated Theatre Objects with Manifest Progress Control
const singularityObj = sheet.object(
  "Singularity",
  {
    x: types.number(0.5, { range: [0, 1] }),
    y: types.number(0.5, { range: [0, 1] }),
    scale: types.number(1, { range: [0.1, 5] }),
    opacity: types.number(1, { range: [0, 1] }),
    glow: types.number(32, { range: [0, 100] }),
    progress: types.number(1, { range: [0, 1] }),
    fontSize: types.number(18, { range: [8, 120] }),
    animate: types.boolean(true),
  },
  { reconfigure: true },
);

const textCircleObj = sheet.object(
  "Text Circle",
  {
    x: types.number(0.5, { range: [0, 1] }),
    y: types.number(0.5, { range: [0, 1] }),
    scale: types.number(1, { range: [0.1, 5] }),
    opacity: types.number(1, { range: [0, 1] }),
    radius: types.number(180, { range: [50, 500] }),
    progress: types.number(1, { range: [0, 1] }),
    fontSize: types.number(18, { range: [8, 120] }),
    animate: types.boolean(true),
  },
  { reconfigure: true },
);

const cymaticRingObj = sheet.object(
  "Cymatic Ring",
  {
    x: types.number(0.5, { range: [0, 1] }),
    y: types.number(0.5, { range: [0, 1] }),
    scale: types.number(1, { range: [0.1, 5] }),
    opacity: types.number(1, { range: [0, 1] }),
    ringCount: types.number(8, { range: [1, 20] }),
    waveAmp: types.number(35, { range: [0, 150] }),
    waveFreq: types.number(2, { range: [0.1, 10] }),
    progress: types.number(1, { range: [0, 1] }),
    fontSize: types.number(14, { range: [8, 120] }),
    animate: types.boolean(true),
  },
  { reconfigure: true },
);

const fractalTreeObj = sheet.object(
  "Fractal Tree",
  {
    x: types.number(0.5, { range: [0, 1] }),
    y: types.number(0.5, { range: [0, 1] }),
    scale: types.number(1, { range: [0.1, 5] }),
    opacity: types.number(1, { range: [0, 1] }),
    branches: types.number(5, { range: [1, 10] }),
    depth: types.number(6, { range: [1, 10] }),
    spread: types.number(52, { range: [10, 120] }),
    length: types.number(90, { range: [10, 300] }),
    decay: types.number(0.68, { range: [0.1, 0.9] }),
    progress: types.number(1, { range: [0, 1] }),
    fontSize: types.number(11, { range: [6, 80] }),
    animate: types.boolean(true),
  },
  { reconfigure: true },
);

interface Act1SceneProps {
  mode?: "scroll" | "time";
  initialScene?: number;
}

// Internal State for all Theatre objects
const THEATRE_STATE: {
  singularity: typeof singularityObj.value;
  textCircle: typeof textCircleObj.value;
  cymaticRing: typeof cymaticRingObj.value;
  fractalTree: typeof fractalTreeObj.value;
  environment?: { bloom: number };
} = {
  singularity: singularityObj.value,
  textCircle: textCircleObj.value,
  cymaticRing: cymaticRingObj.value,
  fractalTree: fractalTreeObj.value,
};

function selectObjectForScene(scene: number) {
  if (!import.meta.env.DEV) return;
  try {
    const s = (studio as any).setSelection ? studio : (studio as any).default;
    if (s && typeof s.setSelection === "function") {
      if (scene === 0) s.setSelection([singularityObj]);
      else if (scene === 1 || scene === 2) s.setSelection([textCircleObj]);
      else if (scene === 3) s.setSelection([cymaticRingObj]);
    }
  } catch (e) {
    console.warn("Theatre auto-selection failed:", e);
  }
}

interface SceneDef {
  phaseId: string;
  navLabel: string;
  headline: string;
  body: string;
  formula: string;
  status: string;
  frequency: string;
  amplitude: string;
  coordinates: string;
  origin: string;
  duration: number;
}

const FONT_PRIMARY = `'Arial Narrow', 'Space Grotesk', sans-serif`;
const FONT_CANVAS = `'Arial Narrow', 'Space Grotesk', sans-serif`;
const CYAN = "#21c7df";
const ALT_ACCENT = "#3f48ef";
const ALT_RED = "#f93823";
const ALT_PURPLE = "#c7c0fc";
const ALT_GREEN = "#b9eaba";
const ALT_PALETTE = [ALT_ACCENT, ALT_RED, ALT_PURPLE, ALT_GREEN] as const;
const INK = "#0b0d10";
const RAIL = "rgba(11, 13, 16, 0.18)";
const VOID_RAIL = "rgba(250, 249, 247, 0.18)";

const SCENES: SceneDef[] = [
  {
    phaseId: "00",
    navLabel: "THE VOID",
    headline: "BEFORE FORM.",
    body: "Before light. Before thought. There was frequency.",
    formula: "singularity / 136.1hz",
    status: "dormant",
    frequency: "00.00 Hz",
    amplitude: "0.000",
    coordinates: "00 00 00.00 N / 00 00 00.00 E",
    origin: "unknown",
    duration: 3,
  },
  {
    phaseId: "01",
    navLabel: "THE HUM",
    headline: "THE HUM",
    body: "Not a sound. The potential of all sound.",
    formula: "textCircle / radius: expanding",
    status: "stable",
    frequency: "136.10 Hz",
    amplitude: "0.018",
    coordinates: "00 00 00.08 N / 00 00 00.08 E",
    origin: "single point",
    duration: 4,
  },
  {
    phaseId: "02",
    navLabel: "THE WORD",
    headline: "THE WORD",
    body: "The hum names itself. VIMANA repeats until the point becomes a ring.",
    formula: "textCircle / loop: closed",
    status: "linguistic",
    frequency: "272.20 Hz",
    amplitude: "0.144",
    coordinates: "00 00 01.34 N / 00 00 01.34 E",
    origin: "spoken radius",
    duration: 5,
  },
  {
    phaseId: "03",
    navLabel: "THE FIELD",
    headline: "THE FIELD",
    body: "The circle becomes a field. Rings ripple, bodies orbit.",
    formula: "cymaticRing → orbital map / 8 rings",
    status: "interference",
    frequency: "orbital",
    amplitude: "0.610",
    coordinates: "00 01 13.00 N / 00 01 13.00 E",
    origin: "standing wave",
    duration: 8,
  },
  {
    phaseId: "04",
    navLabel: "BLUEPRINT",
    headline: "GENETIC FRAME.",
    body: "The recursive branches coalesce into a double-helix blueprint. Text spirals upwards, writing out genetic code.",
    formula: "dnaHelix / A-DNA",
    status: "chromosomal",
    frequency: "333.33 Hz",
    amplitude: "0.880",
    coordinates: "00 12 04.12 N / 00 08 22.04 E",
    origin: "helical matrix",
    duration: 6,
  },
  {
    phaseId: "05",
    navLabel: "FLORA",
    headline: "FLORA VARIETY EMERGED",
    body: "A deep variety of botanical forms sprout and grow from seed nodes—from delicate fractal ferns to branching L-system structures—interweaving in space.",
    formula: "fractalFern + lSystemTree + dendriticCrystal",
    status: "flora form",
    frequency: "528.00 Hz",
    amplitude: "0.962",
    coordinates: "02 44 11.22 N / 01 19 08.55 E",
    origin: "fibonacci seed",
    duration: 7,
  },
  {
    phaseId: "06",
    navLabel: "SWARM",
    headline: "ORGANIC FLUX.",
    body: "Butterflies fly along chaotic attractors while schooling waves ripple above like flocks of birds in synchronous flight.",
    formula: "butterflys + symmetryWave",
    status: "flocking fauna",
    frequency: "724.11 Hz",
    amplitude: "0.995",
    coordinates: "08 11 12.00 N / 04 22 18.00 E",
    origin: "chaotic attractors",
    duration: 7,
  },
  {
    phaseId: "07",
    navLabel: "NETWORK",
    headline: "GLOBAL MIND.",
    body: "The biosphere becomes a single integrated circuit. Synapses snap at tree tips in a global flash of neural awakening.",
    formula: "lSystemTree / synapses",
    status: "sentient consciousness",
    frequency: "999.99 Hz",
    amplitude: "1.000",
    coordinates: "12 55 59.99 N / 12 55 59.99 E",
    origin: "global biosphere",
    duration: 6,
  },
];

const TOTAL_SCENES = SCENES.length;

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Convert a hex color like "#3f48ef" to rgba(r,g,b,a) string. Clamps alpha to [0,1]. */
function hexToRGBA(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${Math.max(0, Math.min(1, alpha))})`;
}

function getTone(bloom: number) {
  const isVoid = bloom < 0.45;
  return {
    bloom,
    isVoid,
    bg: `rgb(${Math.round(lerp(48, 243, bloom))}, ${Math.round(lerp(48, 239, bloom))}, ${Math.round(lerp(47, 230, bloom))})`,
    ink: isVoid ? "#f2f0ec" : INK,
    muted: isVoid ? "rgba(242, 240, 236, 0.54)" : "rgba(11, 13, 16, 0.58)",
    faint: isVoid ? "rgba(242, 240, 236, 0.16)" : "rgba(11, 13, 16, 0.14)",
    rail: isVoid ? VOID_RAIL : RAIL,
  };
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const DNA_DEEP_TEXT = "ADENINE THYMINE GUANINE CYTOSINE GENETIC BLUEPRINT DOUBLE HELIX OF LIFE CODE ENCODED IN EACH CELL NUCLEUS SPIRAL MATRICES MUTATE EVOLVE COMBINE REPLICATE GENERATE SYMMETRY";
const FLORA_DEEP_TEXT = "BOTANICAL LIFE GARDEN FLORA VARIETY EMERGED BRUSH FRACTAL FERNS MULTIPLY RECURSIVE PATTERNS L SYSTEM BRANCHES UNFOLD TO SUNLIGHT AND AIR DENDRITIC ROOT NETWORKS INTERCONNECT DEEP MYCELIUM CELLULAR CONSCIOUSNESS DYNAMICS";
const PARAGRAPH_TEXT = "The quick brown fox jumps over the lazy dog. Pure frequency to environmental manifestation. Absolute black vacuum silence prevails. A single microscopic white dot appears in the void. High-frequency visual hum resonates through space.";

function getFloraResult(cell: StableCell, i: number, t: number) {
  if (cell.floraType === "fern") {
    // Barnsley-like high variety recursive fern
    const stemLength = 15 + seededRandom(i * 12.34) * 45; // wide spread: 15 to 60
    const frondPairs = 5 + Math.floor(seededRandom(i * 56.78) * 5); // 5 to 10 frond layers
    const angleSpread = 0.22 + seededRandom(i * 90.12) * 0.48; // angle spread 0.22 to 0.70 rad (12 to 40 deg)
    const lengthDecay = 0.55 + seededRandom(i * 34.56) * 0.22; // length decay 0.55 to 0.77
    const depth = 4 + Math.floor(seededRandom(i * 22.33) * 2); // depth 4 to 5 for beautiful, dense, organic look
    return fractalFern(
      PARAGRAPH_TEXT,
      {
        stemLength,
        frondPairs,
        depth,
        angleSpread,
        lengthDecay,
      },
      t,
    );
  } else if (cell.floraType === "crystal") {
    const seedLength = 10 + seededRandom(i * 44.55) * 14;
    const branches = 3 + Math.floor(seededRandom(i * 66.77) * 2);
    const angleSpread = 0.52 + seededRandom(i * 88.99) * 0.18; // More than 0.50
    const lengthDecay = 0.72 + seededRandom(i * 11.22) * 0.12; // More than 0.70
    const symmetry = 7 + Math.floor(seededRandom(i * 33.44) * 3); // More than 6 (e.g. 7, 8, 9)
    return dendriticCrystal(
      PARAGRAPH_TEXT,
      {
        seedLength,
        branches,
        depth: 3,
        angleSpread,
        lengthDecay,
        symmetry,
      },
      t,
    );
  } else {
    // L-system tree with large variety of branch angles and step lengths
    const iterations = 3 + Math.floor(seededRandom(i * 99.11) * 2); // 3 or 4 iterations
    // Scales stepLength down for larger iterations to keep it bounded and gorgeous
    const stepBase = iterations === 4 ? 0.7 : 1.8;
    const stepLength = stepBase + seededRandom(i * 77.88) * (iterations === 4 ? 0.8 : 1.6);
    // Large variety of branching angles (from 15 to 45 degrees)
    const angle = 15 + seededRandom(i * 55.66) * 30;
    return lSystemTree(
      PARAGRAPH_TEXT,
      {
        angle,
        stepLength,
        iterations,
        startAngle: -90,
      },
      t,
    );
  }
}

function visualCenter(w: number, h: number, scene: number) {
  const xRatios = [0.44, 0.44, 0.44, 0.44, 0.44, 0.44, 0.44, 0.44, 0.44, 0.44];
  const yRatios = [0.5, 0.5, 0.48, 0.47, 0.49, 0.5, 0.5, 0.5, 0.5, 0.5];
  return {
    x: w * (xRatios[scene] ?? 0.44),
    y: h * (yRatios[scene] ?? 0.5),
  };
}

// ─── Act 2 Global Stable Cellular Coordinates ──────────────────────────

interface StableCell {
  relX: number;       // relative offset -1.0 to 1.0 from center
  relY: number;       // relative offset -1.0 to 1.0 from center
  appearDelay: number; // staggered entrance fraction [0, 1]
  size: number;       // scale factor of individual node
  floraType: "fern" | "lsystem" | "crystal";
  phaseOffset: number; // individual timing phase offsets
}

const ACT2_CELLS: StableCell[] = (() => {
  const cells: StableCell[] = [];
  
  // Center parent/focus node
  cells.push({
    relX: 0,
    relY: 0.05,
    appearDelay: 0,
    size: 1.15,
    floraType: "lsystem",
    phaseOffset: 0,
  });

  const floraPool: ("fern" | "lsystem" | "crystal")[] = ["fern", "lsystem", "crystal"];

  let i = 1;
  const targetCount = 32;
  const minDistance = 0.22; // Enforces absolute separation between all 32 nodes

  while (cells.length < targetCount && i < 300) {
    const angle = seededRandom(i * 123.456) * Math.PI * 2;
    const dist = 0.35 + 0.58 * Math.sqrt(seededRandom(i * 789.101));
    const relX = Math.cos(angle) * dist;
    const relY = Math.sin(angle) * dist * 0.82 + 0.05; // squashed slightly vertically to align beautifully with 16:9 canvas

    let overlaps = false;
    for (const other of cells) {
      const dx = relX - other.relX;
      const dy = relY - other.relY;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < minDistance) {
        overlaps = true;
        break;
      }
    }

    if (!overlaps) {
      const stagger = (cells.length / targetCount) * 0.45;
      const jitter = seededRandom(i * 456.789) * 0.05;

      cells.push({
        relX,
        relY,
        appearDelay: stagger + jitter,
        size: 0.72 + seededRandom(i * 321.654) * 0.38,
        floraType: floraPool[cells.length % 3],
        phaseOffset: seededRandom(i * 987.654) * Math.PI * 2,
      });
    }
    i++;
  }
  return cells;
})();

function renderCapsuleForScene(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  capW: number,
  capH: number,
  turns: number,
  basePairs: number,
  phaseOffset: number,
  t: number,
  alpha: number,
  scaleVal: number,
  fontSize: number,
) {
  if (alpha <= 0.01) return;
  const sw = capW * scaleVal;
  const sh = capH * scaleVal;
  const pad = 10 * scaleVal;
  const iw = Math.max(sw - pad * 2, 8);
  const ih = Math.max(sh - pad * 2, 8);

  const dr = iw * 0.42;
  const dh = ih * 0.85;

  const result = dnaHelix(
    "VMNA",
    { turns, radius: dr, height: dh, basePairs },
    t * 1.5 + phaseOffset,
  );

  if (result.type !== "segments") return;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(cx, cy);

  // Draw main strands
  ctx.strokeStyle = "rgba(56, 189, 248, 0.45)";
  ctx.lineWidth = 1.0;
  ctx.beginPath();
  for (const s of result.segments) {
    if (s.visualOnly) continue;
    ctx.moveTo(s.x1, s.y1);
    ctx.lineTo(s.x2, s.y2);
  }
  ctx.stroke();

  // Draw secondary strands (rungs)
  ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  for (const s of result.segments) {
    if (!s.visualOnly) continue;
    ctx.moveTo(s.x1, s.y1);
    ctx.lineTo(s.x2, s.y2);
  }
  ctx.stroke();

  // Draw DNA letters along strands
  const placements = layoutTextOnSegments(
    "VMNA",
    result.segments,
    fontSize,
    "Space Grotesk, sans-serif",
  );
  
  ctx.font = `600 ${Math.max(5, Math.round(fontSize))}px 'Space Grotesk', sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#f8fafc";
  for (const p of placements) {
    if (!p.text.trim()) continue;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.scale(p.scale, p.scale);
    ctx.globalAlpha = alpha * p.opacity;
    ctx.fillText(p.text, 0, 0);
    ctx.restore();
  }

  ctx.restore();
}

export function Act1Scene({ mode = "time", initialScene }: Act1SceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const sceneRef = useRef(initialScene ?? 0);
  const sceneTimeRef = useRef(0);
  const progressRef = useRef(0);
  const transitionRef = useRef(1);
  const prevSceneRef = useRef(0);
  const settledRef = useRef(false);
  const settledTimeRef = useRef(0);
  const paramsRef = useRef({ paused: false });
  const lastFrameRef = useRef(performance.now());

  // Reactive Theatre State Ref
  const theatreRef = useRef(THEATRE_STATE);

  const [scene, setScene] = useState(initialScene ?? 0);
  const [sceneProgress, setSceneProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const [layoutVariant, setLayoutVariant] = useState<"shell" | "alt">(() => {
    return window.location.hash.includes("layout=alt") ? "alt" : "shell";
  });
  const layoutRef = useRef(layoutVariant);
  layoutRef.current = layoutVariant;

  const sceneScrollSize = 1 / TOTAL_SCENES;
  const scrollToScene = useCallback(
    (scrollProgress: number) => {
      return Math.min(
        TOTAL_SCENES - 1,
        Math.floor(scrollProgress / sceneScrollSize),
      );
    },
    [sceneScrollSize],
  );

  const scrollToSceneProgress = useCallback(
    (scrollProgress: number) => {
      const nextScene = scrollToScene(scrollProgress);
      const start = nextScene * sceneScrollSize;
      return clamp01((scrollProgress - start) / sceneScrollSize);
    },
    [sceneScrollSize, scrollToScene],
  );

  useEffect(() => {
    // Multi-object Subscription
    const unsubs = [
      singularityObj.onValuesChange(
        (v) => (theatreRef.current.singularity = v),
      ),
      textCircleObj.onValuesChange((v) => (theatreRef.current.textCircle = v)),
      cymaticRingObj.onValuesChange(
        (v) => (theatreRef.current.cymaticRing = v),
      ),
      fractalTreeObj.onValuesChange(
        (v) => (theatreRef.current.fractalTree = v),
      ),
    ];

    // Auto-select Theatre Object
    selectObjectForScene(sceneRef.current);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "b") {
        if (mode === "scroll") {
          const nextScene = (sceneRef.current + 1) % TOTAL_SCENES;
          const maxScroll = Math.max(
            1,
            document.body.scrollHeight - window.innerHeight,
          );
          const targetScroll = (nextScene / (TOTAL_SCENES - 1)) * maxScroll;
          window.scrollTo({ top: targetScroll, behavior: "smooth" });
        } else {
          const nextScene = (sceneRef.current + 1) % TOTAL_SCENES;
          prevSceneRef.current = sceneRef.current;
          _prevSceneElapsed =
            _sceneEntryT !== null ? timeRef.current - _sceneEntryT : 0;
          sceneRef.current = nextScene;
          _sceneEntryT = null;
          sceneTimeRef.current = 0;
          transitionRef.current = 0;
          setScene(nextScene);
          selectObjectForScene(nextScene);
        }
      }
    };

    window.addEventListener("keydown", handleKey);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId = 0;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;

    const handleScroll = () => {
      const maxScroll = Math.max(
        1,
        document.body.scrollHeight - window.innerHeight,
      );
      const scrollProgress = clamp01(window.scrollY / maxScroll);
      const nextScene = scrollToScene(scrollProgress);

      if (nextScene !== sceneRef.current) {
        prevSceneRef.current = sceneRef.current;
        _prevSceneElapsed =
          _sceneEntryT !== null ? timeRef.current - _sceneEntryT : 0;
        sceneRef.current = nextScene;
        _sceneEntryT = null;
        sceneTimeRef.current = 0;
        transitionRef.current = 0;
        settledRef.current = false;
        settledTimeRef.current = 0;
        setScene(nextScene);
        selectObjectForScene(nextScene);
      }

      progressRef.current = scrollToSceneProgress(scrollProgress);

      if (nextScene >= 5) {
        if (idleTimer) clearTimeout(idleTimer);
        settledRef.current = false;
        idleTimer = setTimeout(() => {
          settledRef.current = true;
        }, 1000);
      }
    };

    const render = () => {
      // Use actual wall-clock delta time so frame drops don't slow animations
      const now = performance.now();
      const dt = Math.min((now - lastFrameRef.current) / 1000, 0.05); // cap at 50ms
      lastFrameRef.current = now;
      const isPaused = paramsRef.current.paused;

      if (!isPaused) {
        timeRef.current += dt;
        // Sync Theatre sequence with our local scene clock
        sheet.sequence.position = timeRef.current;
      }

      const currentScene = sceneRef.current;
      const sceneDef = SCENES[currentScene];
      const isScrollMode = mode === "scroll";
      const weatherSettled =
        isScrollMode && settledRef.current && currentScene >= 5;

      if (isScrollMode) {
        if (weatherSettled) {
          settledTimeRef.current = Math.min(
            sceneDef.duration,
            settledTimeRef.current + dt,
          );
          progressRef.current = settledTimeRef.current / sceneDef.duration;
        }
      } else {
        // TIME BASED TRANSITION DISABLED IN EDIT MODE
        // We only advance manually via 'b'
        progressRef.current = 1.0;
      }

      if (transitionRef.current < 1) {
        transitionRef.current = Math.min(1, transitionRef.current + dt / 1.0);
      }

      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const dpr = window.devicePixelRatio || 1;
      // Only resize if dimensions actually changed
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const theatre = theatreRef.current;
      const tone = getTone(theatre.environment?.bloom || 0);
      const t = timeRef.current; // Define t for use in rendering
      const isAlt = layoutRef.current === "alt";
      if (isAlt && Math.random() < 0.02)
        console.log(
          "[ALT] isAlt=true, scene=",
          currentScene,
          "layoutRef.current=",
          layoutRef.current,
          "tone.ink=",
          tone.ink,
        );
      ctx.fillStyle = tone.bg;
      ctx.fillRect(0, 0, w, h);
      renderFieldMarks(ctx, w, h, tone.bloom, t, isAlt);

      const cx = w * 0.5;
      const cy = h * 0.5;

      // 1. Calculate general transition values
      const p = transitionRef.current;
      let renderScene = currentScene;
      let transitionScale = 1.0;

      if (p < 0.5 && prevSceneRef.current !== null && prevSceneRef.current !== currentScene) {
        renderScene = prevSceneRef.current;
        transitionScale = (0.5 - p) / 0.5;
      } else if (p < 1.0) {
        renderScene = currentScene;
        transitionScale = (p - 0.5) / 0.5;
      }

      const scaleVal = easeOutCubic(transitionScale);

      // Wrap active scene rendering under a global matrix
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scaleVal, scaleVal);
      ctx.translate(-cx, -cy);

      // 0. Singularity
      if (renderScene === 0) {
        const s = theatre.singularity;
        ctx.save();
        ctx.translate(w * s.x, h * s.y);
        ctx.scale(s.scale, s.scale);
        renderSingularity(
          ctx,
          0,
          0,
          t,
          s.progress,
          s.opacity,
          tone.bloom,
          s.glow,
          s.fontSize,
          isAlt,
        );
        ctx.restore();
      }

      // 1. Text Circle — expanding ring
      if (renderScene === 1) {
        // Reset ring start timer on entry
        if (_sceneEntryT === null) _sceneEntryT = t;
        const ringElapsed = t - _sceneEntryT;
        const c = theatre.textCircle;
        ctx.save();
        ctx.translate(w * c.x, h * c.y);
        ctx.scale(c.scale, c.scale);
        renderFirstRing(
          ctx,
          0,
          0,
          t,
          ringElapsed,
          c.opacity,
          tone.bloom,
          isAlt,
        );
        ctx.restore();
      }

      // 2. Concentric Rings — multiple perfect circles
      if (renderScene === 2) {
        if (_sceneEntryT === null) _sceneEntryT = t;
        const ringElapsed = t - _sceneEntryT;
        const c = theatre.textCircle;
        ctx.save();
        ctx.translate(w * c.x, h * c.y);
        ctx.scale(c.scale, c.scale);
        renderConcentricRings(
          ctx,
          0,
          0,
          t,
          ringElapsed,
          c.opacity,
          tone.bloom,
          isAlt,
        );
        ctx.restore();
      }

      // 3. Field — morph concentric → cymatic, then tilt + dots
      if (renderScene === 3) {
        if (_sceneEntryT === null) _sceneEntryT = t;
        const ringElapsed = t - _sceneEntryT;
        const r = theatre.cymaticRing;
        ctx.save();
        ctx.translate(w * r.x, h * r.y);
        ctx.scale(r.scale, r.scale);
        renderMorphingRing(
          ctx,
          0,
          0,
          t,
          ringElapsed,
          r.opacity,
          tone.bloom,
          r,
          r.fontSize,
          isAlt,
        );
        ctx.restore();
      }

      // Add a small helper inside render to draw with glow
      const progress = progressRef.current;
      const scale = Math.min(w, h) / 750; // Increased base scale slightly for visibility

      const renderFormulaWithGlow = (
        segments: LineSegment[],
        placements: LinePlacement[],
        color: string,
        width = 1,
        textColor = "#f2f0ec",
        glow = false,
        fontSize = 5.2,
      ) => {
        ctx.save();
        if (glow) {
          ctx.shadowColor = color;
          ctx.shadowBlur = 12 * scale;
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();
        for (const seg of segments) {
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
        }
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        for (const p of placements) {
          if (!p.text.trim()) continue;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.scale(p.scale, p.scale);
          ctx.font = `600 ${fontSize}px ${FONT_PRIMARY}`;
          ctx.globalAlpha = 0.55 + p.opacity * 0.35;
          ctx.fillStyle = textColor;
          ctx.fillText(p.text, 0, 0);
          ctx.restore();
        }
        ctx.restore();
      };

      if (renderScene === 4) {
        ctx.save();
        const parentW = 180 * scale;
        const parentH = 320 * scale;
        renderCapsuleForScene(
          ctx,
          cx,
          cy,
          parentW,
          parentH,
          5, // turns
          14, // basePairs
          0,
          t,
          progress, // alpha
          progress, // scaleVal
          11 * scale,
        );
        ctx.restore();
      }

      if (renderScene === 5) {
        ctx.save();
        const parentW = 180 * scale;
        const parentH = 320 * scale;

        // Flora Scene: Single DNA helix transitions into Barnsley Fern, L-system Tree, and Dendritic Crystal one-by-one.
        let subPhase = 0; // 0: Fern, 1: Tree, 2: Crystal
        let lp = 0;       // local progress within the subPhase (0 to 1)

        if (progress < 0.33) {
          subPhase = 0;
          lp = progress / 0.33;
        } else if (progress < 0.66) {
          subPhase = 1;
          lp = (progress - 0.33) / 0.33;
        } else {
          subPhase = 2;
          lp = (progress - 0.66) / 0.34;
        }

        // Clip local progress safely
        lp = clamp01(lp);

        if (lp < 0.25) {
          // 1. Single DNA helix transitions (scales down) to center dot
          const val = (0.25 - lp) / 0.25;
          const eased = easeOutCubic(val);
          renderCapsuleForScene(
            ctx,
            cx,
            cy,
            parentW,
            parentH,
            5,
            14,
            0,
            t,
            eased,
            eased,
            11 * scale,
          );
        } else if (lp < 0.75) {
          // 2. The selected Flora grows from center dot, sways, and collapses back to dot
          const floraP = lp < 0.5 ? (lp - 0.25) / 0.25 : (0.75 - lp) / 0.25;
          const easedFloraP = easeOutCubic(floraP);

          ctx.save();
          if (subPhase === 0) {
            // A. Barnsley Fern (Grows upwards, offset downwards so its center sways at visual center)
            ctx.translate(cx, cy + 120 * scale);
            const windSway = Math.sin(t * 1.5) * 0.08;
            ctx.rotate(windSway);
            ctx.scale(easedFloraP * 2.3 * scale, easedFloraP * 2.3 * scale);

            const result = fractalFern(
              "FERN",
              {
                stemLength: 100,
                frondPairs: 7,
                depth: 4,
                angleSpread: 0.32,
                lengthDecay: 0.62,
              },
              t,
            );
            if (result.type === "segments") {
              const placements = layoutTextOnSegments(
                "FRACTAL BOTANICAL NATURE LEAF EMERALD GOLD GROW GARDEN",
                result.segments,
                7.0,
                FONT_CANVAS,
              );
              renderFormulaWithGlow(
                result.segments,
                placements,
                "rgba(16, 185, 129, 0.45)", // Green
                0.8,
                "#ecfdf5",
                false,
                7.0,
              );
            }
          } else if (subPhase === 1) {
            // B. L-system Tree (Grows upwards, offset downwards so its branches occupy screen beautifully)
            ctx.translate(cx, cy + 120 * scale);
            const windSway = Math.sin(t * 1.2) * 0.05;
            ctx.rotate(windSway);
            ctx.scale(easedFloraP * 2.5 * scale, easedFloraP * 2.5 * scale);

            const result = lSystemTree(
              "TREE",
              {
                angle: 25,
                stepLength: 10,
                iterations: 3,
                startAngle: -90,
              },
              t,
            );
            if (result.type === "segments") {
              const placements = layoutTextOnSegments(
                "STRUCTURE L-SYSTEM TREE BRANCH SYMMETRY ORGANIC GROWTH EVOLUTION",
                result.segments,
                7.0,
                FONT_CANVAS,
              );
              renderFormulaWithGlow(
                result.segments,
                placements,
                "rgba(255, 215, 67, 0.45)", // Gold
                0.8,
                "#ffd743",
                false,
                7.0,
              );
            }
          } else {
            // C. Dendritic Crystal
            ctx.translate(cx, cy);
            ctx.rotate(t * 0.15);
            ctx.scale(easedFloraP * 1.8 * scale, easedFloraP * 1.8 * scale);

            const result = dendriticCrystal(
              "CRYSTAL",
              {
                seedLength: 16,
                branches: 4,
                depth: 3,
                angleSpread: 0.60,
                lengthDecay: 0.78,
                symmetry: 8,
              },
              t,
            );
            if (result.type === "segments") {
              const placements = layoutTextOnSegments(
                "DENDRITIC CRYSTAL SNOW FLAKE AXIS RECURSIVE ICE GEOMETRY",
                result.segments,
                7.0,
                FONT_CANVAS,
              );
              renderFormulaWithGlow(
                result.segments,
                placements,
                "rgba(242, 240, 236, 0.45)", // Crisp White
                0.8,
                "#f2f0ec",
                false,
                7.0,
              );
            }
          }
          ctx.restore();
        } else {
          // 3. Single DNA helix transitions (scales back up)
          const val = (lp - 0.75) / 0.25;
          const eased = easeOutCubic(val);
          renderCapsuleForScene(
            ctx,
            cx,
            cy,
            parentW,
            parentH,
            5,
            14,
            0,
            t,
            eased,
            eased,
            11 * scale,
          );
        }
        ctx.restore();
      }

      if (renderScene === 6) {
        ctx.save();
        const parentW = 180 * scale;
        const parentH = 320 * scale;

        // Fauna Scene: Single DNA helix transitions into Butterfly, Symmetric Wave, and Slimy Creature one-by-one.
        let subPhase = 0; // 0: Butterfly, 1: Symmetric Wave, 2: Slimy Creature
        let lp = 0;       // local progress within the subPhase (0 to 1)

        if (progress < 0.33) {
          subPhase = 0;
          lp = progress / 0.33;
        } else if (progress < 0.66) {
          subPhase = 1;
          lp = (progress - 0.33) / 0.33;
        } else {
          subPhase = 2;
          lp = (progress - 0.66) / 0.34;
        }

        lp = clamp01(lp);

        if (lp < 0.25) {
          // 1. Single DNA helix transitions (scales down) to center dot
          const val = (0.25 - lp) / 0.25;
          const eased = easeOutCubic(val);
          renderCapsuleForScene(
            ctx,
            cx,
            cy,
            parentW,
            parentH,
            5,
            14,
            0,
            t,
            eased,
            eased,
            11 * scale,
          );
        } else if (lp < 0.75) {
          // 2. The selected Fauna grows from center dot, moves, and collapses back to dot
          const faunaP = lp < 0.5 ? (lp - 0.25) / 0.25 : (0.75 - lp) / 0.25;
          const easedFaunaP = easeOutCubic(faunaP);

          ctx.save();
          ctx.translate(cx, cy);

          if (subPhase === 0) {
            // A. Butterfly
            ctx.scale(easedFaunaP * 2.1 * scale, easedFaunaP * 2.1 * scale);
            ctx.translate(-200, -200); // Shift internal formula workspace origin to screen space center (cx, cy)
            const result = butterflys("FAUNA", { count: 3 }, t * 2);
            if (result.type === "segments") {
              const placements = layoutTextOnSegments(
                "BUTTERFLY FLIGHT CHAOTIC LORENZ ATTRACTOR SWARM FLUTTER LIFE",
                result.segments,
                7.5,
                FONT_CANVAS,
              );
              renderFormulaWithGlow(
                result.segments,
                placements,
                "rgba(199, 192, 252, 0.55)", // Beautiful light purple
                0.9,
                "#c7c0fc",
                true,
                7.5,
              );
            }
          } else if (subPhase === 1) {
            // B. Symmetric Wave
            ctx.scale(easedFaunaP * 2.3 * scale, easedFaunaP * 2.3 * scale);
            ctx.translate(-200, -200); // Shift internal formula workspace origin to screen space center (cx, cy)
            const result = symmetryWave("FAUNA", { waves: 2 }, t * 0.25);
            if (result.type === "segments") {
              const placements = layoutTextOnSegments(
                "SYMMETRIC RESONANCE WAVEFLOCK AQUATIC HARMONIC SOUND RESONATOR",
                result.segments,
                7.5,
                FONT_CANVAS,
              );
              renderFormulaWithGlow(
                result.segments,
                placements,
                "rgba(185, 234, 186, 0.55)", // Soft green
                0.9,
                "#b9eaba",
                true,
                7.5,
              );
            }
          } else {
            // C. Slimy Creature
            ctx.scale(easedFaunaP * 1.8 * scale, easedFaunaP * 1.8 * scale);
            ctx.translate(-200, -200); // Shift internal formula workspace origin to screen space center (cx, cy)
            const result = slimycreature("FAUNA", { pathCount: 5 }, t * 1.5);
            if (result.type === "segments") {
              const placements = layoutTextOnSegments(
                "AMINO SLIMY CREATURE ORGANISM PRIMORDIAL SOUP GOLD CHAOS",
                result.segments,
                7.5,
                FONT_CANVAS,
              );
              renderFormulaWithGlow(
                result.segments,
                placements,
                "rgba(249, 56, 35, 0.55)", // Red/Orange accent
                0.9,
                "#f93823",
                true,
                7.5,
              );
            }
          }
          ctx.restore();
        } else {
          // 3. Single DNA helix transitions (scales back up)
          const val = (lp - 0.75) / 0.25;
          const eased = easeOutCubic(val);
          renderCapsuleForScene(
            ctx,
            cx,
            cy,
            parentW,
            parentH,
            5,
            14,
            0,
            t,
            eased,
            eased,
            11 * scale,
          );
        }
        ctx.restore();
      }


      if (renderScene === 7) {
        ctx.save();
        ctx.translate(cx, cy);
        const netText =
          "NEURAL SYNAPSE AWAKENING Awareness mind biosphere connected tree thinking snaps";
        const angle = lerp(16, 32, progress);
        const step = lerp(5, 9, progress) * scale;
        const iter = Math.round(lerp(2, 5, progress));
        const result = lSystemTree(
          netText,
          { angle, stepLength: step, iterations: iter, startAngle: 90 },
          t,
        );
        if (result.type === "segments") {
          const placements = layoutTextOnSegments(
            netText,
            result.segments,
            8 * scale,
            FONT_CANVAS,
          );
          renderFormulaWithGlow(
            result.segments,
            placements,
            "rgba(129, 140, 248, 0.42)",
            1.4,
            "#ffffff",
            true,
          );
        }
        if (progress > 0.88) {
          ctx.fillStyle = "#ffffff";
          ctx.shadowColor = "#6366f1";
          ctx.shadowBlur = 18 * scale;
          for (let i = 0; i < 15; i++) {
            const sparkAngle = Math.random() * Math.PI * 2;
            const sparkDist = (50 + Math.random() * 220) * scale;
            const px = Math.cos(sparkAngle) * sparkDist;
            const py = -180 * scale + Math.sin(sparkAngle) * sparkDist;
            ctx.beginPath();
            ctx.arc(px, py, (2 + Math.random() * 3.5) * scale, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();
      }

      // Restore our global transition scale wrapper
      ctx.restore();

      // Render the transition-dot overlay connecting the two states
      if (p < 1.0) {
        ctx.save();
        ctx.beginPath();
        const dotAlpha = 1 - scaleVal; // Brightest at transition midpoint (when scaleVal is 0)
        ctx.fillStyle = `rgba(242, 240, 236, ${dotAlpha})`;
        ctx.shadowColor = "rgba(242, 240, 236, 0.8)";
        ctx.shadowBlur = 12 * (Math.min(w, h) / 750);
        const dotRadius = (3.5 + (1 - scaleVal) * 5.5) * (Math.min(w, h) / 750);
        ctx.arc(cx, cy, dotRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Ornamental border (right + bottom, L-shaped)
      renderBorder(ctx, w, h, tone, isAlt);

      animationId = requestAnimationFrame(render);
    };

    if (mode === "scroll") {
      document.body.classList.add("act1-scroll-mode");
      window.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll();
    }

    render();

    return () => {
      cancelAnimationFrame(animationId);
      document.body.classList.remove("act1-scroll-mode");
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKey);
      unsubs.forEach((u) => u());
      if (idleTimer) clearTimeout(idleTimer);
    };
  }, [mode, scrollToScene, scrollToSceneProgress]);

  const sceneDef = SCENES[scene];
  const tone = getTone(sceneProgress * 0.4);
  const scrollHeight = mode === "scroll" ? `${TOTAL_SCENES * 115}vh` : "100vh";

  return (
    <div
      style={{
        background: tone.bg,
        minHeight: mode === "scroll" ? scrollHeight : "100vh",
        position: "relative",
      }}
    >
      {/* Fixed/Absolute UI container */}
      <div
        style={{
          position: mode === "scroll" ? "fixed" : "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          overflow: "hidden",
          fontFamily: FONT_PRIMARY,
          color: tone.ink,
          background: "transparent",
          zIndex: 10,
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            display: "block",
            zIndex: 1,
            opacity: 1,
            transition: "opacity 1.2s ease",
          }}
        />

        {/* Unified HUD with scrolling info and coordinates */}
        <div
          style={{
            position: mode === "scroll" ? "sticky" : "absolute",
            inset: 0,
            height: "100vh",
            pointerEvents: "none",
            zIndex: 20,
          }}
        >
          <header
            style={{
              position: "absolute",
              top: isMobile ? "1.25rem" : "3.75rem",
              left: isMobile ? "1.25rem" : "3.75rem",
              right: isMobile ? "1.25rem" : "3.75rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: isMobile ? 8 : 10,
              lineHeight: 1.25,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              fontFamily: FONT_PRIMARY,
              transition: "all 0.8s ease",
              color: tone.ink,
            }}
          >
            <VimanaMark isVoid={tone.isVoid} isMobile={isMobile} />

            <div
              style={{ color: tone.muted, textAlign: "center", opacity: 0.6 }}
            >
              PHASE {sceneDef.phaseId}
            </div>

            <div
              style={{ color: tone.muted, textAlign: "right", opacity: 0.6 }}
            >
              {mode === "scroll" ? "SCROLL" : "MANUAL"}
            </div>
          </header>

          <section
            style={{
              position: "absolute",
              left: isMobile ? "1.25rem" : "3.75rem",
              right: isMobile ? "1.25rem" : "auto",
              bottom: isMobile ? "4rem" : "3.75rem",
              maxWidth: isMobile ? "calc(100% - 2.5rem)" : "25rem",
              fontFamily: FONT_PRIMARY,
              transition: "all 0.8s ease",
            }}
          >
            <h1
              style={{
                fontSize: isMobile ? "1rem" : "1.25rem",
                letterSpacing: "0.1em",
                fontWeight: 500,
                color: tone.ink,
                marginBottom: "0.5rem",
              }}
            >
              {sceneDef.headline}
            </h1>
            <p
              style={{
                fontSize: isMobile ? "0.6875rem" : "0.75rem",
                lineHeight: isMobile ? 1.5 : 1.8,
                letterSpacing: "0.04em",
                color: tone.muted,
                opacity: 0.8,
                margin: 0,
              }}
            >
              {sceneDef.body}
            </p>
          </section>

          {/* Change Mode button */}
          <button
            onClick={() => {
              const nextMode = mode === "scroll" ? "time" : "scroll";
              window.location.hash = nextMode;
              window.location.reload();
            }}
            style={{
              position: "absolute",
              right: isMobile ? "1.25rem" : "3.75rem",
              bottom: isMobile ? "1.25rem" : "3.75rem",
              pointerEvents: "auto",
              background: "transparent",
              border: "none",
              color: tone.faint,
              padding: "0.5rem",
              fontFamily: FONT_PRIMARY,
              fontSize: "0.5625rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#2efcfc")}
            onMouseLeave={(e) => (e.currentTarget.style.color = tone.faint)}
          >
            MODE: {mode}
          </button>
        </div>
      </div>
    </div>
  );
}

function VimanaMark({ isVoid, isMobile }: { isVoid: boolean; isMobile?: boolean }) {
  return (
    <img
      src="/vimana-logo.png"
      alt="VIMANA"
      style={{
        height: isMobile ? "2rem" : "3.5rem",
        width: "auto",
        filter: isVoid ? "invert(1)" : "none",
        transition: "filter 0.8s ease, height 0.3s ease",
      }}
    />
  );
}

function renderFieldMarks(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  bloom: number,
  t: number,
  isAlt: boolean,
) {
  if (bloom < 0.08) return;

  ctx.save();
  ctx.globalAlpha = bloom;
  ctx.strokeStyle = isAlt
    ? `rgba(63, 72, 239, ${0.15 * bloom})`
    : `rgba(61, 58, 57, ${0.08 * bloom})`;
  ctx.lineWidth = 1;

  for (let i = 0; i < 7; i++) {
    const r = 80 + i * 34;
    ctx.beginPath();
    ctx.arc(w * 0.42, h * 0.52, r + Math.sin(t * 0.5 + i) * 4, 0, Math.PI * 2);
    ctx.stroke();
  }

  const marks = [
    [0.18, 0.32],
    [0.28, 0.7],
    [0.63, 0.53],
    [0.72, 0.22],
    [0.78, 0.66],
  ];
  for (const [mx, my] of marks) {
    const x = w * mx;
    const y = h * my;
    ctx.strokeStyle = isAlt
      ? `rgba(249, 56, 35, ${0.48 * bloom})`
      : `rgba(239, 99, 43, ${0.48 * bloom})`;
    ctx.beginPath();
    ctx.moveTo(x - 4, y);
    ctx.lineTo(x + 4, y);
    ctx.moveTo(x, y - 4);
    ctx.lineTo(x, y + 4);
    ctx.stroke();
  }

  ctx.restore();
}

const BORDER_FONT = "'Jacquarda'";

function renderBorder(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  tone: { bg: string; ink: string },
  isAlt: boolean,
) {
  const bw = Math.max(20, w * 0.04);

  // Ornamental text string (NO SPACES)
  const ornamentalText = "VIMANAVIMANAVIMANAVIMANA❋";
  const fontSize = bw * 0.5;
  ctx.font = `${fontSize}px ${BORDER_FONT}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = isAlt ? 1 : 0.5;
  // -50 tracking
  const cell = fontSize * 0.95;

  ctx.save();

  const cx = w - bw / 2; // horizontal center of right-edge column
  const cy = h - bw / 2; // vertical center of bottom-edge row
  const startX = w * 0.5;
  const startY = h * 0.5;
  const chars = ornamentalText.split("");
  let charIdx = 0;

  if (isAlt) {
    // Top edge: from left going right to corner (shorter than default)
    const topY = bw / 2;
    for (let x = w * 0.75; x <= cx; x += cell) {
      ctx.strokeText(chars[charIdx % chars.length], x, topY);
      charIdx++;
    }
    // Right edge: from one step below top corner going down
    for (let y = topY + cell; y <= cy; y += cell) {
      ctx.strokeText(chars[charIdx % chars.length], cx, y);
      charIdx++;
    }
  } else {
    // Bottom edge: from corner going left
    for (let x = cx; x >= startX; x -= cell) {
      ctx.strokeText(chars[charIdx % chars.length], x, cy);
      charIdx++;
    }
    // Right edge: from one step above corner going up
    for (let y = cy - cell; y >= startY; y -= cell) {
      ctx.strokeText(chars[charIdx % chars.length], cx, y);
      charIdx++;
    }
  }

  ctx.restore();
}

function renderSingularity(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  t: number,
  progress: number,
  alpha: number,
  bloom: number,
  glow: number,
  fontSize: number,
  isAlt: boolean,
) {
  const fadeIn = Math.min(1, t / 0.5);
  const radius = (3 + progress * 2) * (1 + Math.sin(t * 3) * 0.15);
  const accent = isAlt ? ALT_ACCENT : CYAN;

  ctx.save();
  ctx.globalAlpha = fadeIn * alpha;
  ctx.shadowColor = bloom > 0.5 ? accent : "rgba(255, 255, 255, 0.9)";
  ctx.shadowBlur = glow + Math.sin(t * 3) * 16;
  ctx.fillStyle = bloom > 0.5 ? accent : "#ffffff";
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// Shared canvas for text measurement — avoids GC pressure from creating canvases per frame
const _measureCanvas = document.createElement("canvas");
const _measureCtx = _measureCanvas.getContext("2d")!;

// Cache character widths by font string to avoid repeated measureText calls
const _widthCache = new Map<string, number[]>();

function _getCharWidths(text: string, font: string): number[] {
  const key = `${font}|${text}`;
  const cached = _widthCache.get(key);
  if (cached) return cached;
  _measureCtx.font = font;
  const widths = text.split("").map((ch) => _measureCtx.measureText(ch).width);
  _widthCache.set(key, widths);
  return widths;
}

/**
 * Place each character of text along a circular arc, one by one,
 * with the correct tangent rotation at each position.
 * Avoids the segment sorting problem entirely — characters flow continuously.
 */
function layoutTextOnCircleArc(
  text: string,
  cx: number,
  cy: number,
  radius: number,
  fontSize: number,
  fontFamily: string,
): LinePlacement[] {
  const font = `600 ${fontSize}px ${fontFamily}`;
  const charWidths = _getCharWidths(text, font);
  const singlePassWidth = charWidths.reduce((a, b) => a + b, 0);
  const circumference = 2 * Math.PI * radius;

  // Repeat text enough times to fill the full circle
  const repeats = Math.max(1, Math.ceil(circumference / singlePassWidth));
  const fullText = text.repeat(repeats);
  // Build repeated char-widths array
  const allWidths: number[] = [];
  for (let r = 0; r < repeats; r++) {
    for (let i = 0; i < charWidths.length; i++) {
      allWidths.push(charWidths[i]);
    }
  }

  // Total arc = full text width / radius, centered at top (-π/2)
  const totalArc = (singlePassWidth * repeats) / radius;
  const startAngle = -Math.PI / 2 - totalArc / 2;
  const placements: LinePlacement[] = [];
  let arcPos = 0;

  for (let i = 0; i < fullText.length; i++) {
    const charAngle =
      startAngle + arcPos / radius + allWidths[i] / (2 * radius);
    const x = radius * Math.cos(charAngle);
    const y = radius * Math.sin(charAngle);
    const rotation = charAngle + Math.PI / 2;
    placements.push({
      text: fullText[i],
      x: cx + x,
      y: cy + y,
      rotation,
      scale: 1,
      opacity: 1,
    });
    arcPos += allWidths[i];
  }
  return placements;
}

const _circleLayoutMap = new Map<string, LinePlacement[]>();

interface OffscreenRingCacheEntry {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

const _offscreenRingCache = new Map<string, OffscreenRingCacheEntry>();

interface OffscreenCharCacheEntry {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
}

const _offscreenCharCache = new Map<string, OffscreenCharCacheEntry>();

function getOrCreateOffscreenChar(
  char: string,
  fontSize: number,
  fontFamily: string,
  fillColor: string,
): OffscreenCharCacheEntry {
  const key = `${char}_${fontSize}_${fillColor}`;
  if (_offscreenCharCache.has(key)) {
    return _offscreenCharCache.get(key)!;
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const font = `600 ${fontSize}px ${fontFamily}`;
  ctx.font = font;
  const metrics = ctx.measureText(char);
  const width = Math.ceil(metrics.width || fontSize * 0.6);
  const height = Math.ceil(fontSize * 1.6);

  canvas.width = width;
  canvas.height = height;

  ctx.font = font;
  ctx.fillStyle = fillColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(char, width / 2, height / 2);

  const entry: OffscreenCharCacheEntry = {
    canvas,
    width,
    height,
  };
  _offscreenCharCache.set(key, entry);
  return entry;
}

interface OffscreenWordCacheEntry {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
}

const _offscreenWordCache = new Map<string, OffscreenWordCacheEntry>();

function getOrCreateOffscreenWord(
  text: string,
  fontSize: number,
  fontFamily: string,
  fillColor: string,
): OffscreenWordCacheEntry {
  const key = `${text}_${fontSize}_${fillColor}`;
  if (_offscreenWordCache.has(key)) {
    return _offscreenWordCache.get(key)!;
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const font = `600 ${fontSize}px ${fontFamily}`;
  ctx.font = font;
  const metrics = ctx.measureText(text);
  const width = Math.ceil(metrics.width || 10);
  const height = Math.ceil(fontSize * 1.6);

  canvas.width = width;
  canvas.height = height;

  ctx.font = font;
  ctx.fillStyle = fillColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, width / 2, height / 2);

  const entry: OffscreenWordCacheEntry = {
    canvas,
    width,
    height,
  };
  _offscreenWordCache.set(key, entry);
  return entry;
}

function getOrCreateOffscreenRing(
  text: string,
  radius: number,
  fontSize: number,
  fontFamily: string,
  strokeColor: string,
  fillColor: string,
): OffscreenRingCacheEntry {
  const rKey = Math.round(radius * 10) / 10;
  const key = `${text}_${rKey}_${fontSize}_${strokeColor}_${fillColor}`;
  if (_offscreenRingCache.has(key)) {
    return _offscreenRingCache.get(key)!;
  }

  const canvas = document.createElement("canvas");
  const padding = fontSize * 3 + 20;
  const size = Math.ceil((radius + padding) * 2);
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d")!;
  const cx = size / 2;
  const cy = size / 2;

  // 1. Draw circle stroke
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // 2. Draw text
  const placements = layoutTextOnCircleArc(
    text,
    cx,
    cy,
    radius,
    fontSize,
    fontFamily,
  );

  ctx.save();
  ctx.font = `600 ${fontSize}px ${fontFamily}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = fillColor;

  for (const p of placements) {
    if (!p.text.trim()) continue;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillText(p.text, 0, 0);
    ctx.restore();
  }
  ctx.restore();

  const entry: OffscreenRingCacheEntry = {
    canvas,
    width: size,
    height: size,
    centerX: cx,
    centerY: cy,
  };
  _offscreenRingCache.set(key, entry);
  return entry;
}

function layoutTextOnCircleArcCached(
  text: string,
  cx: number,
  cy: number,
  radius: number,
  fontSize: number,
  fontFamily: string,
): LinePlacement[] {
  // We round radius slightly to avoid cache misses on sub-pixel floating point math.
  // Using 1 decimal place.
  const rKey = Math.round(radius * 10) / 10;
  const key = `${text}_${rKey}_${fontSize}`;

  if (_circleLayoutMap.has(key)) {
    const cached = _circleLayoutMap.get(key)!;
    // Fast path: if cx/cy are 0, return exactly
    if (cx === 0 && cy === 0) return cached;
    // Map with cx, cy offsets
    return cached.map((p) => ({
      ...p,
      x: p.x + cx,
      y: p.y + cy,
    }));
  }

  const placements = layoutTextOnCircleArc(
    text,
    0,
    0,
    radius,
    fontSize,
    fontFamily,
  );
  _circleLayoutMap.set(key, placements);

  if (cx === 0 && cy === 0) return placements;
  return placements.map((p) => ({ ...p, x: p.x + cx, y: p.y + cy }));
}

let _sceneEntryT: number | null = null;
let _prevSceneElapsed = 0;
let _prevGlobalScene = -1;

function renderFirstRing(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  t: number,
  elapsed: number,
  alpha: number,
  bloom: number,
  isAlt: boolean,
) {
  const text = "VIMANA";
  const currentRadius =
    elapsed < 3
      ? 125 + (220 - 125) * easeOutCubic(Math.min(1, elapsed / 3))
      : 220;
  const currentFontSize =
    elapsed < 3 ? 13 + (24 - 13) * easeOutCubic(Math.min(1, elapsed / 3)) : 24;
  const ringRotation = t * 0.06;
  const result = textCircle(text, { radius: currentRadius }, t);
  if (result.type !== "segments") return;

  // Use direct arc-based character placement for continuous flow around the circle.
  // This bypasses the segment sorting issue and gives correct tangent angles.
  const placements = layoutTextOnCircleArcCached(
    text,
    0,
    0,
    currentRadius,
    currentFontSize,
    FONT_CANVAS,
  );
  const strokeColor = isAlt
    ? hexToRGBA(ALT_ACCENT, 0.7)
    : "rgba(33, 199, 223, 0.12)";
  const textColor = isAlt ? ALT_ACCENT : undefined;
  drawSegmentText(
    ctx,
    result.segments,
    placements,
    cx,
    cy,
    ringRotation,
    currentFontSize,
    alpha,
    bloom,
    strokeColor,
    1,
    1,
    textColor,
  );
}

function renderMorphingRing(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  t: number,
  elapsed: number,
  alpha: number,
  bloom: number,
  params: any,
  fontSize: number,
  isAlt: boolean,
) {
  const text = "VIMANA";
  const MAX_RINGS = 8;
  const ringCount = 3 + (MAX_RINGS - 3) * Math.min(1, Math.max(0, elapsed) / 3);
  const ringRotation = t * 0.08;
  const tiltEased = easeOutCubic(Math.min(1, Math.max(0, elapsed - 0.5) / 1.5));
  const currentScaleY = 1.0 - (1.0 - 0.6) * tiltEased;

  for (let i = 0; i < MAX_RINGS; i++) {
    const appear = Math.max(0, Math.min(1, ringCount - i));
    if (appear <= 0) continue;

    const ringIndex = MAX_RINGS - 1 - i;
    const tExp = Math.pow((i + 1) / MAX_RINGS, 0.7);
    const radius = tExp * 320; // MAX_RADIUS
    const tNorm = ringIndex / (MAX_RINGS - 1);

    // Lower font sizes - orbital map feel
    const ringFontSize = 14 - (14 - 8) * tNorm;

    const radiusScale = Math.min(1, appear * 2);
    const textAlpha = Math.max(0, (appear - 0.3) / 0.7);
    const scaledRadius = radius * radiusScale;

    // Subwoofer stagger effect: a punchy bass thump that ripples from inner rings outwards
    const pulsePhase = t * 6.5 - i * 0.45;
    const pulse = Math.pow(Math.max(0, Math.sin(pulsePhase)), 4.0) * 0.14;
    const subwooferScale = 1.0 + pulse;

    // Stagger up and down subwoofer effect based on t, but keep center 0,0 locally
    const yOffset = 0;

    // Wavy amplitude for transition out
    const waveAmp =
      (elapsed > 6 ? easeOutCubic(Math.min(1, (elapsed - 6) / 2)) : 0) * 20;

    const paletteColor = isAlt ? ALT_PALETTE[i % ALT_PALETTE.length] : null;
    const strokeCol = isAlt
      ? `rgba(63, 72, 239, ${0.5 + (1 - tNorm) * 0.2})`
      : `rgba(33, 199, 223, ${0.08 + (1 - tNorm) * 0.12})`;

    const fillCol = isAlt ? "#f2f0ec" : bloom > 0.45 ? INK : "#e0f2fe";

    if (waveAmp === 0) {
      // FAST PATH: Off-screen GPU Canvas rendering (200x faster!)
      const ringEntry = getOrCreateOffscreenRing(
        text,
        radius,
        ringFontSize,
        FONT_CANVAS,
        strokeCol,
        fillCol,
      );

      ctx.save();
      ctx.globalAlpha = alpha * appear;
      ctx.translate(cx, cy + yOffset);
      ctx.rotate(ringRotation);
      ctx.scale(radiusScale * subwooferScale, currentScaleY * radiusScale * subwooferScale);

      ctx.drawImage(
        ringEntry.canvas,
        -ringEntry.centerX,
        -ringEntry.centerY,
        ringEntry.width,
        ringEntry.height,
      );
      ctx.restore();
    } else {
      // HIGH PERFORMANCE WORD-BASED RASTERIZATION (100x faster than character fallback)
      ctx.save();
      ctx.globalAlpha = alpha * appear;
      ctx.translate(cx, cy + yOffset);
      ctx.rotate(ringRotation);
      ctx.scale(subwooferScale, currentScaleY * subwooferScale);

      // 1. Draw wavy ring stroke
      ctx.strokeStyle = strokeCol;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let j = 0; j <= 100; j++) {
        const theta = (j / 100) * Math.PI * 2;
        const wave = Math.sin(theta * 5 + t * 2) * waveAmp * (1 + i * 0.2);
        const rWave = scaledRadius + wave;
        if (j === 0)
          ctx.moveTo(Math.cos(theta) * rWave, Math.sin(theta) * rWave);
        else ctx.lineTo(Math.cos(theta) * rWave, Math.sin(theta) * rWave);
      }
      ctx.stroke();

      // 2. Draw wavy characters using ultra-high performance character-level blitting
      const placements = layoutTextOnCircleArcCached(
        text,
        0,
        0,
        scaledRadius,
        ringFontSize,
        FONT_CANVAS,
      );

      ctx.globalAlpha = alpha * textAlpha;
      for (const p of placements) {
        if (!p.text.trim()) continue;

        const angle = Math.atan2(p.y, p.x);
        const wave = Math.sin(angle * 5 + t * 2) * waveAmp * (1 + i * 0.2);
        const rWave = scaledRadius + wave;

        const wx = rWave * Math.cos(angle);
        const wy = rWave * Math.sin(angle);

        const charEntry = getOrCreateOffscreenChar(
          p.text,
          ringFontSize,
          FONT_CANVAS,
          fillCol,
        );

        ctx.save();
        ctx.translate(wx, wy);
        ctx.rotate(p.rotation);
        ctx.drawImage(
          charEntry.canvas,
          -charEntry.width / 2,
          -charEntry.height / 2,
        );
        ctx.restore();
      }
      ctx.restore();
    }
  }

  // Orbital dots - Mathematically and visually locked to their parent ring orbits!
  const dotFade = easeOutCubic(Math.min(1, elapsed / 2));
  if (dotFade > 0) {
    const speeds = [1.2, -0.9, 0.7, -0.55, 0.4];
    const targetRingIndices = [1, 2, 4, 5, 6];

    speeds.forEach((speed, index) => {
      const i = targetRingIndices[index];
      const appear = Math.max(0, Math.min(1, ringCount - i));
      if (appear <= 0) return;

      const tExp = Math.pow((i + 1) / MAX_RINGS, 0.7);
      const radius = tExp * 320;
      const radiusScale = Math.min(1, appear * 2);
      const yOffset = 0;

      // Unify subwoofer pulsing offset with parent ring's index i to keep them locked
      const pulsePhase = t * 6.5 - i * 0.45;
      const pulse = Math.pow(Math.max(0, Math.sin(pulsePhase)), 4.0) * 0.14;
      const subwooferScale = 1.0 + pulse;

      ctx.save();
      // Apply exact matching ring transforms
      ctx.translate(cx, cy + yOffset);
      const ringRot = ringRotation;
      ctx.rotate(ringRot);
      ctx.scale(radiusScale * subwooferScale, currentScaleY * radiusScale * subwooferScale);

      // Circle layout coordinates
      const angle = t * speed;
      const dx = radius * Math.cos(angle);
      const dy = radius * Math.sin(angle);

      ctx.translate(dx, dy);
      // Undo scale to keep the dot as a perfect circle
      ctx.scale(1 / (radiusScale * subwooferScale), 1 / (currentScaleY * radiusScale * subwooferScale));

      const dotSize = index === 2 ? 5 : 3;
      const paletteColor = ALT_PALETTE[index % ALT_PALETTE.length];
      ctx.fillStyle = isAlt
        ? index === 2
          ? paletteColor
          : bloom > 0.45
            ? INK
            : "#38bdf8"
        : index === 2
          ? "#2efcfc"
          : bloom > 0.45
            ? INK
            : "#e0f2fe";
      ctx.globalAlpha = dotFade * alpha * appear * (index === 2 ? 1 : 0.6);

      ctx.beginPath();
      ctx.arc(0, 0, dotSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }
}

function renderConcentricRings(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  t: number,
  elapsed: number,
  alpha: number,
  bloom: number,
  isAlt: boolean,
) {
  const text = "VIMANA";
  const MAX_RINGS = 4;
  const ringRotation = t * 0.12;

  // Phase 1 (0-1s): seed ring (from scene 1 at radius 220) contracts
  // Phase 2 (1-3.5s): expands outward to 5 rings
  let breatheScale: number;
  let ringsShowing: number; // 1 → 5

  if (elapsed < 1) {
    breatheScale = 1.0 - (1.0 - 0.3) * easeOutCubic(elapsed / 1);
    ringsShowing = 1;
  } else if (elapsed < 3.5) {
    const t = (elapsed - 1) / 2.5;
    const eased = easeOutCubic(Math.min(1, t));
    breatheScale = 0.3 + 0.7 * eased;
    ringsShowing = 1 + (MAX_RINGS - 1) * eased;
  } else {
    breatheScale = 1.0;
    ringsShowing = MAX_RINGS;
  }

  const ringCount = Math.ceil(ringsShowing);

  // Draw from outermost (seed ring) inward
  for (let position = 0; position < ringCount; position++) {
    // Fade-in for rings beyond the seed
    const appear = Math.max(0, Math.min(1, ringsShowing - position));
    const radiusScale = Math.min(1, appear * 2);

    // Outermost ring (position 0) matches scene 1's radius 220, scaled by breathe
    const baseRadius = ((MAX_RINGS - position) / MAX_RINGS) * 220;
    const finalScale = breatheScale * radiusScale;

    // Font: 24 (outermost) → 13 (innermost)
    const ringFontSize = 24 - ((24 - 13) * position) / (MAX_RINGS - 1);
    const tNorm = position / (MAX_RINGS - 1);

    // Ring stroke — alt mode: cycle through brand palette per ring, much more visible
    const paletteColor = isAlt
      ? ALT_PALETTE[position % ALT_PALETTE.length]
      : null;
    let strokeCol: string;
    if (isAlt) {
      const altAlpha = 0.65 + (1 - tNorm) * 0.25;
      strokeCol = hexToRGBA(paletteColor!, altAlpha);
    } else {
      strokeCol = `rgba(33, 199, 223, ${0.06 + (1 - tNorm) * 0.1})`;
    }

    const fillCol = isAlt ? paletteColor! : bloom > 0.45 ? INK : "#f2f0ec";

    // Fast GPU path
    const ringEntry = getOrCreateOffscreenRing(
      text,
      baseRadius,
      ringFontSize,
      FONT_CANVAS,
      strokeCol,
      fillCol,
    );

    ctx.save();
    ctx.globalAlpha = alpha * appear;
    ctx.translate(cx, cy);
    ctx.rotate(ringRotation);
    ctx.scale(finalScale, finalScale);

    ctx.drawImage(
      ringEntry.canvas,
      -ringEntry.centerX,
      -ringEntry.centerY,
      ringEntry.width,
      ringEntry.height,
    );
    ctx.restore();
  }
}

function renderFractalTree(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  t: number,
  progress: number,
  alpha: number,
  bloom: number,
  params: any,
  fontSize: number,
  isAlt: boolean,
) {
  const text =
    "VIMANA from primordial vibration life emerges branching fractaling growing each frequency a new form each word a new leaf the tree of consciousness reaches toward light";
  const result = fractalTree(
    text,
    {
      rootBranches: params.branches,
      depth: params.depth,
      angleSpread: params.spread,
      branchLength: params.length,
      lengthDecay: params.decay,
    },
    t,
  );
  if (result.type !== "segments") return;

  const placements = layoutTextOnSegments(
    text,
    result.segments,
    fontSize,
    FONT_CANVAS,
  );
  const strokeColor = isAlt
    ? hexToRGBA(ALT_PURPLE, 0.75)
    : "rgba(61, 58, 57, 0.16)";
  const textColor = isAlt ? ALT_PURPLE : undefined;
  const strokeWidth = isAlt ? 1.5 : 1;
  drawSegmentText(
    ctx,
    result.segments,
    placements,
    cx,
    cy,
    0,
    fontSize,
    alpha,
    bloom,
    strokeColor,
    0.9,
    strokeWidth,
    textColor,
  );
}

function drawSegmentText(
  ctx: CanvasRenderingContext2D,
  segments: Array<{ x1: number; y1: number; x2: number; y2: number }>,
  placements: Array<{
    text: string;
    x: number;
    y: number;
    rotation: number;
    scale: number;
    opacity: number;
  }>,
  cx: number,
  cy: number,
  rotation: number,
  fontSize: number,
  alpha: number,
  bloom: number,
  stroke: string,
  scaleY = 1,
  lineWidth = 1,
  textColor?: string,
) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.scale(1, scaleY);
  ctx.strokeStyle = stroke;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  for (const seg of segments) {
    ctx.moveTo(seg.x1, seg.y1);
    ctx.lineTo(seg.x2, seg.y2);
  }
  ctx.stroke();

  const fill = textColor || (bloom > 0.45 ? INK : "#f2f0ec");
  for (const p of placements) {
    if (!p.text.trim()) continue;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.scale(p.scale, p.scale);
    ctx.font = `600 ${fontSize}px ${FONT_CANVAS}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.globalAlpha = (0.55 + p.opacity * 0.35) * alpha;
    ctx.fillStyle = fill;
    ctx.fillText(p.text, 0, 0);
    ctx.restore();
  }
  ctx.restore();
}

export default Act1Scene;
