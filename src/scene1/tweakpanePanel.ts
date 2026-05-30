import { Pane } from "tweakpane";
import type { MutableRefObject } from "react";

// ─── Default Params Per Scene ────────────────────────────────────────

export interface SceneParams {
  singularity: {
    x: number; y: number; scale: number; opacity: number;
    glow: number; progress: number; fontSize: number;
  };
  textCircle: {
    x: number; y: number; scale: number; opacity: number;
    radius: number; progress: number; fontSize: number;
  };
  cymaticRing: {
    x: number; y: number; scale: number; opacity: number;
    ringCount: number; waveAmp: number; waveFreq: number;
    progress: number; fontSize: number;
  };
  dna: { turns: number; basePairs: number; fontSize: number; scale: number };
  fern: {
    stemLength: number; frondPairs: number; depth: number;
    angleSpread: number; lengthDecay: number; fontSize: number;
    textScale: number; windSway: number; windSpeed: number; scale: number;
  };
  lsystem: {
    angle: number; stepLength: number; iterations: number;
    fontSize: number; textScale: number; windSway: number; windSpeed: number; scale: number;
    trunkScale: number;
  };
  crystal: {
    seedLength: number; branches: number; depth: number;
    angleSpread: number; lengthDecay: number; symmetry: number;
    fontSize: number; textScale: number; rotationSpeed: number; scale: number;
  };
  butterfly: { count: number; scale: number };
  symmetryWave: { amplitude: number; frequency: number; waves: number; scale: number };
  slimy: { tentacles: number; scale: number };
  network: {
    iterations: number; stepLength: number; angle: number;
    fontSize: number; textScale: number; scale: number;
  };
  firing: {
    seedLength: number; branches: number; depth: number;
    angleSpread: number; lengthDecay: number; symmetry: number;
    fontSize: number; cascadeSpeed: number; scale: number;
  };
  convergence: {
    sierpinskiSize: number; sierpinskiIter: number;
    spiralTurns: number; spiralGrowth: number;
    fontSize: number; scale: number;
  };
  mycelial: {
    branches: number; depth: number; stepLength: number;
    angleSpread: number; lengthDecay: number; reconnectDist: number;
    fontSize: number; scale: number;
  };
  cortical: {
    f: number; k: number; iterations: number; resolution: number;
    contourLevel: number; fontSize: number; scale: number;
  };
  brainMesh: {
    foldDepth: number; foldFreq: number; fissureDepth: number;
    resU: number; resV: number; scale: number;
    rotSpeed: number; tiltX: number; tiltY: number;
    fontSize: number; autoRotate: boolean; brainRenderer: number;
  };
  globalCircuit: {
    rings: number; meridians: number; connections: number;
    nodeCount: number; scale: number; rotSpeed: number; tiltX: number;
    fontSize: number;
  };
  myceliumNetwork: {
    nodes: number; branches: number; depth: number;
    stepLength: number; angleSpread: number; lengthDecay: number;
    reconnectDist: number; spread: number;
    fontSize: number; scale: number;
  };
  brush: {
    strokeCount: number; maxLength: number; maxWidth: number;
    bristleCount: number; spiralTightness: number; jitter: number;
    fontSize: number; scale: number;
  };
  knitting: {
    stitchWidth: number; stitchHeight: number; rows: number;
    stitchesPerRow: number; needleLength: number; cableFrequency: number;
    cableOffset: number; yarnSlack: number; tension: number;
    progress: number; fontSize: number; scale: number;
  };
}

// Extended params with global controls
export interface AllSceneParams extends SceneParams {
  bloom: number;
  paused: boolean;
}

export const DEFAULT_PARAMS: AllSceneParams = {
  bloom: 0,
  paused: false,
  singularity: { x: 0.5, y: 0.5, scale: 1, opacity: 1, glow: 32, progress: 1, fontSize: 18 },
  textCircle: { x: 0.5, y: 0.5, scale: 1, opacity: 1, radius: 180, progress: 1, fontSize: 18 },
  cymaticRing: { x: 0.5, y: 0.5, scale: 1, opacity: 1, ringCount: 8, waveAmp: 35, waveFreq: 2, progress: 1, fontSize: 14 },
  dna: { turns: 5, basePairs: 14, fontSize: 11, scale: 1 },
  fern: { stemLength: 130, frondPairs: 4, depth: 5, angleSpread: 0.60, lengthDecay: 0.8, fontSize: 8, textScale: 2.3, windSway: 0.08, windSpeed: 1.5, scale: 1 },
  lsystem: { angle: 25, stepLength: 6, iterations: 6, fontSize: 9, textScale: 2.5, windSway: 0.05, windSpeed: 1.2, scale: 0.5, trunkScale: 0.3 },
  crystal: { seedLength: 16, branches: 4, depth: 3, angleSpread: 0.60, lengthDecay: 0.78, symmetry: 8, fontSize: 7, textScale: 1.8, rotationSpeed: 0.15, scale: 1 },
  butterfly: { count: 3, scale: 2.1 },
  symmetryWave: { amplitude: 40, frequency: 3, waves: 5, scale: 2.0 },
  slimy: { tentacles: 8, scale: 2.0 },
  network: { iterations: 4, stepLength: 12, angle: 30, fontSize: 7, textScale: 2.5, scale: 1 },
  firing: { seedLength: 45, branches: 6, depth: 4, angleSpread: 0.55, lengthDecay: 0.72, symmetry: 6, fontSize: 6, cascadeSpeed: 1.5, scale: 1 },
  convergence: { sierpinskiSize: 280, sierpinskiIter: 4, spiralTurns: 4, spiralGrowth: 0.1759, fontSize: 7, scale: 1 },
  mycelial: { branches: 6, depth: 4, stepLength: 60, angleSpread: 0.6, lengthDecay: 0.65, reconnectDist: 80, fontSize: 7, scale: 1 },
  cortical: { f: 0.035, k: 0.065, iterations: 3000, resolution: 80, contourLevel: 0.25, fontSize: 6, scale: 1 },
  brainMesh: { foldDepth: 0.18, foldFreq: 5, fissureDepth: 0.22, resU: 18, resV: 16, scale: 1, rotSpeed: 0.04, tiltX: 0.35, tiltY: 0, fontSize: 7, autoRotate: true, brainRenderer: 0 },
  globalCircuit: { rings: 10, meridians: 14, connections: 30, nodeCount: 40, scale: 1, rotSpeed: 0.15, tiltX: 0.35, fontSize: 7 },
  myceliumNetwork: { nodes: 5, branches: 5, depth: 3, stepLength: 50, angleSpread: 0.55, lengthDecay: 0.62, reconnectDist: 65, spread: 220, fontSize: 7, scale: 1 },
  brush: { strokeCount: 26, maxLength: 180, maxWidth: 110, bristleCount: 1, spiralTightness: 0.8, jitter: 0, fontSize: 0, scale: 1 },
  knitting: { stitchWidth: 24, stitchHeight: 20, rows: 12, stitchesPerRow: 16, needleLength: 160, cableFrequency: 0, cableOffset: 3, yarnSlack: 0.2, tension: 0.85, progress: 1.0, fontSize: 6, scale: 1 },
};

// ─── Scene → Param Group Mapping ─────────────────────────────────────

const SCENE_GROUPS: Record<number, string[]> = {
  0: ["singularity"],
  1: ["textCircle"],
  2: ["textCircle"],
  3: ["cymaticRing"],
  4: ["dna"],
  5: ["fern", "lsystem", "crystal"],
  6: ["butterfly", "symmetryWave", "slimy"],
  7: ["network"],
  8: ["firing"],
  9: ["convergence"],
  10: ["mycelial"],
  11: ["myceliumNetwork"],
  12: ["brainMesh"],
  14: ["brush"],
  16: ["knitting"],
};

const GROUP_LABELS: Record<string, string> = {
  singularity: "✦ Singularity",
  textCircle: "◯ Text Circle",
  cymaticRing: "◎ Cymatic Ring",
  dna: "🧬 DNA Helix",
  fern: "🌿 Barnsley Fern",
  lsystem: "🌳 L-System Tree",
  crystal: "❄ Dendritic Crystal",
  butterfly: "🦋 Butterfly",
  symmetryWave: "〰 Symmetry Wave",
  slimy: "🫧 Slimy Creature",
  network: "🧠 Neural Network",
  firing: "⚡ Dendritic Firing",
  convergence: "🧠 Hemispheric Convergence",
  mycelial: "🍄 Mycelial Web",
  cortical: "🧠 Cortical Folds",
  brainMesh: "🧠 3D Brain Mesh",
  globalCircuit: "🌐 Global Circuit",
  myceliumNetwork: "🍄 Mycelium Network",
  brush: "🖌 Brush Stroke",
  knitting: "🧶 Knitting Stitch",
};

// ─── Save / Load ─────────────────────────────────────────────────────

const STORAGE_KEY = "vimana-tweakpane-params";

export function loadSavedParams(): AllSceneParams {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_PARAMS, ...JSON.parse(raw) };
  } catch {}
  return JSON.parse(JSON.stringify(DEFAULT_PARAMS));
}

export function saveParams(params: AllSceneParams) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(params));
  const blob = new Blob([JSON.stringify(params, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "vimana-params.json";
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Infer binding range from key name and value ─────────────────────

function getRange(key: string, val: number) {
  let min = 0, max = val * 3, step = val < 1 ? 0.01 : val < 10 ? 0.1 : 1;
  if (key === "x" || key === "y") { min = 0; max = 1; step = 0.01; }
  else if (key === "opacity") { min = 0; max = 1; step = 0.01; }
  else if (key === "progress") { min = 0; max = 1; step = 0.01; }
  else if (key.includes("Spread") || key.includes("spread")) { min = 0.05; max = 1.5; step = 0.01; }
  else if (key.includes("angle") || key.includes("Angle")) { min = 0; max = 180; step = 1; }
  else if (key.includes("Decay") || key.includes("decay")) { min = 0.1; max = 0.95; step = 0.01; }
  else if (key === "scale" || key === "textScale") { min = 0.1; max = 8; step = 0.1; }
  else if (key.includes("wind")) { min = 0; max = 5; step = 0.01; }
  else if (key === "fontSize") { min = 3; max = 40; step = 0.5; }
  else if (key === "depth") { min = 1; max = 8; step = 1; }
  else if (key === "iterations") { min = 1; max = 6; step = 1; }
  else if (key === "symmetry") { min = 2; max = 16; step = 1; }
  else if (key === "count" || key === "tentacles") { min = 1; max = 20; step = 1; }
  else if (key === "branches") { min = 2; max = 8; step = 1; }
  else if (key === "waves") { min = 1; max = 12; step = 1; }
  else if (key === "frequency") { min = 0.1; max = 10; step = 0.1; }
  else if (key === "amplitude") { min = 5; max = 150; step = 1; }
  else if (key === "radius") { min = 20; max = 500; step = 5; }
  else if (key === "glow") { min = 0; max = 100; step = 1; }
  else if (key === "ringCount") { min = 1; max = 20; step = 1; }
  else if (key === "waveAmp") { min = 0; max = 150; step = 1; }
  else if (key === "waveFreq") { min = 0.1; max = 10; step = 0.1; }
  else if (key === "frondPairs") { min = 2; max = 12; step = 1; }
  else if (key === "stemLength") { min = 20; max = 200; step = 5; }
  else if (key === "stepLength") { min = 1; max = 30; step = 0.5; }
  else if (key === "trunkScale") { min = 0.05; max = 1; step = 0.05; }
  else if (key === "rotationSpeed") { min = 0; max = 0.5; step = 0.01; }
  else if (key === "seedLength") { min = 5; max = 40; step = 1; }
  else if (key === "basePairs") { min = 4; max = 30; step = 1; }
  else if (key === "turns") { min = 1; max = 10; step = 1; }
  else if (key === "bloom") { min = 0; max = 1; step = 0.01; }
  return { min, max, step };
}

// ─── Pane Creation ───────────────────────────────────────────────────

interface TweakpaneHandle {
  destroy: () => void;
  refresh: () => void;
}

export function createTweakpane(
  paramsRef: MutableRefObject<AllSceneParams>,
  sceneRef: MutableRefObject<number>,
): TweakpaneHandle {
  const container = document.createElement("div");
  container.id = "tweakpane-container";
  container.style.cssText = "position:fixed;top:10px;right:10px;z-index:10000;max-height:90vh;overflow-y:auto;display:none;";
  document.body.appendChild(container);

  // Toggle with 'h' key
  const onKeydown = (e: KeyboardEvent) => {
    if (e.key === "h" && !e.metaKey && !e.ctrlKey && !e.altKey) {
      // Don't toggle if user is typing in an input
      if ((e.target as HTMLElement)?.tagName === "INPUT") return;
      container.style.display = container.style.display === "none" ? "" : "none";
    }
  };
  window.addEventListener("keydown", onKeydown);

  // Load saved params
  const saved = loadSavedParams();
  Object.assign(paramsRef.current, saved);

  const pane = new Pane({ container, title: "🎛 Vimana Params" });
  let currentBlades: any[] = [];

  // Collect ALL unique group keys across all scenes
  const ALL_GROUPS = Array.from(new Set(Object.values(SCENE_GROUPS).flat()));

  function refresh() {
    // Remove old blades
    for (const b of currentBlades) {
      try { pane.remove(b); } catch {}
    }
    currentBlades = [];

    const params = paramsRef.current;
    const scene = sceneRef.current;

    // Global controls
    const globalFolder = pane.addFolder({ title: "⚡ Global", expanded: true });
    globalFolder.addBinding(params, "bloom", { min: 0, max: 1, step: 0.01, label: "bloom" });
    globalFolder.addBinding(params, "paused", { label: "paused" });
    currentBlades.push(globalFolder);

    // Show ALL formula groups — current scene expanded, others collapsed
    for (const groupKey of ALL_GROUPS) {
      const label = GROUP_LABELS[groupKey] || groupKey;
      const isCurrent = (SCENE_GROUPS[scene] || []).includes(groupKey);
      const folder = pane.addFolder({ title: label, expanded: isCurrent });
      const groupParams = (params as any)[groupKey];
      if (!groupParams) continue;

      for (const [key, val] of Object.entries(groupParams)) {
        if (typeof val === "number") {
          const { min, max, step } = getRange(key, val);
          folder.addBinding(groupParams, key, { min, max, step, label: key });
        } else if (typeof val === "boolean") {
          folder.addBinding(groupParams, key, { label: key });
        }
      }
      currentBlades.push(folder);
    }

    // Action buttons
    const btnFolder = pane.addFolder({ title: "Actions" });
    const saveBtn = btnFolder.addButton({ title: "💾 Save Params" });
    saveBtn.on("click", () => saveParams(params));
    const resetBtn = btnFolder.addButton({ title: "↺ Reset to Defaults" });
    resetBtn.on("click", () => {
      Object.assign(paramsRef.current, JSON.parse(JSON.stringify(DEFAULT_PARAMS)));
      refresh();
    });
    currentBlades.push(btnFolder);
  }

  refresh();

  function destroy() {
    window.removeEventListener("keydown", onKeydown);
    pane.dispose();
    container.remove();
  }

  return { destroy, refresh };
}
