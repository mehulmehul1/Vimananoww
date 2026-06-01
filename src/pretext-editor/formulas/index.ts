import type { Template } from './types';
import { fractalTree } from './organic/fractalTree';
import { fractalFern } from './organic/fractalFern';
import { lSystemTree } from './organic/lSystemTree';
import { dendriticCrystal } from './organic/dendriticCrystal';
import { hexagonalFractal } from './organic/hexagonalFractal';
import { goldenSpiral } from './organic/goldenSpiral';
import { textCircle } from './organic/textCircle';
import { cymaticRing } from './organic/cymaticRing';
import { dnaHelix } from './organic/dnaHelix';
import { wordCloud } from './organic/wordCloud';
import { slimycreature } from './organic/slimycreature';
import { butterflys } from './organic/butterflys';
import { symmetryWave } from './organic/symmetryWave';
import { corticalFold } from './organic/corticalFold';
import { mycelialWeb } from './organic/mycelialWeb';
import { brainMesh, brainSurfacePoint } from './organic/brainMesh';
import { brainStreamlines } from './organic/brainStreamlines';
import { brainContourText } from './organic/brainContourText';
import { globalCircuit } from './organic/globalCircuit';
import { myceliumNetwork } from './organic/myceliumNetwork';
import { BRAIN_PATHS, BRAIN_WORDS, getCompiledPaths, wordColor, approxPathLength, type WordEntry, type CompiledPath } from './organic/brainWordNet';
import { sierpinskiTriangle } from './geometric/sierpinskiTriangle';
import { sierpinskiCarpet } from './geometric/sierpinskiCarpet';
import { fractalSnowflake } from './geometric/fractalSnowflake';
import { scribeFlow } from './organic/scribeFlow';
import { brushStroke } from './organic/brushStroke';
import { knittingStitch } from './organic/knittingStitch';
import { letterGrid } from './organic/letterGrid';
import { rootCircuit } from './organic/rootCircuit';
import { circuitBoard } from './organic/circuitBoard';
import { fluidStream, traceWorldStreamlines, projectWorldStreamlines } from './organic/fluidStream';
import type { WorldStreamlineData, ProjectedStreamlineResult } from './organic/fluidStream';

export * from './types';
export * from './helpers';
export {
  fractalTree,
  fractalFern,
  lSystemTree,
  dendriticCrystal,
  hexagonalFractal,
  goldenSpiral,
  textCircle,
  cymaticRing,
  dnaHelix,
  wordCloud,
  slimycreature,
  butterflys,
  symmetryWave,
  corticalFold,
  mycelialWeb,
  brainMesh,
  brainSurfacePoint,
  brainStreamlines,
  brainContourText,
  globalCircuit,
  myceliumNetwork,
  BRAIN_PATHS,
  BRAIN_WORDS,
  getCompiledPaths,
  wordColor,
  approxPathLength,
  sierpinskiTriangle,
  sierpinskiCarpet,
  fractalSnowflake,
  brushStroke,
  scribeFlow,
  letterGrid,
  knittingStitch,
  rootCircuit,
  circuitBoard,
  fluidStream,
  traceWorldStreamlines,
  projectWorldStreamlines,
};
export type {
  WorldStreamlineData,
  ProjectedStreamlineResult,
};

export const TEMPLATES: Template[] = [
  {
    name: 'Fractal Tree',
    description: 'Text flows along recursive branches',
    defaultParams: { rootBranches: 5, depth: 6, angleSpread: 52, branchLength: 90, lengthDecay: 0.68 },
    formula: fractalTree,
  },
  {
    name: 'Barnsley Fern',
    description: 'Text flows along fern fronds',
    defaultParams: { stemLength: 120, frondPairs: 6, depth: 5, angleSpread: 0.45, lengthDecay: 0.72 },
    formula: fractalFern,
  },
  {
    name: 'L-System Tree',
    description: 'Text follows L-system turtle graphics',
    defaultParams: { angle: 25, stepLength: 6, iterations: 5, startAngle: 90 },
    formula: lSystemTree,
  },
  {
    name: 'Dendritic Crystal',
    description: 'Text flows along crystal branches',
    defaultParams: { seedLength: 120, branches: 6, depth: 6, angleSpread: 0.55, lengthDecay: 0.72, symmetry: 6 },
    formula: dendriticCrystal,
  },
  {
    name: 'Hexagonal Fractal',
    description: 'Text follows hexagonal branching',
    defaultParams: { iterations: 4, size: 200 },
    formula: hexagonalFractal,
  },
  {
    name: 'Golden Spiral',
    description: 'Text flows along logarithmic spiral',
    defaultParams: { turns: 4, growthRate: 0.1759 },
    formula: goldenSpiral,
  },
  {
    name: 'Text Circle',
    description: 'Text follows circular path',
    defaultParams: { radius: 200 },
    formula: textCircle,
  },
  {
    name: 'Cymatic Ring',
    description: 'Text flows along wobbly concentric rings',
    defaultParams: { ringCount: 8, waveFreq: 5, waveAmp: 25, modeRadial: 3 },
    formula: cymaticRing,
  },
  {
    name: 'Sierpinski Triangle',
    description: 'Text fills triangular interior',
    defaultParams: { size: 300, iterations: 4 },
    formula: sierpinskiTriangle,
  },
  {
    name: 'Sierpinski Carpet',
    description: 'Text fills carpet pattern',
    defaultParams: { size: 300, iterations: 4 },
    formula: sierpinskiCarpet,
  },
  {
    name: 'Koch Snowflake',
    description: 'Text fills snowflake interior',
    defaultParams: { size: 280, iterations: 4 },
    formula: fractalSnowflake,
  },
  {
    name: 'DNA Helix',
    description: 'Text flows along double helix strands',
    defaultParams: { turns: 6, radius: 80, height: 400, basePairs: 12 },
    formula: dnaHelix,
  },
  {
    name: 'Word Cloud',
    description: 'Text drifts in elliptical word clouds',
    defaultParams: { cloudCount: 5, wordCount: 40, radius: 150, spread: 80 },
    formula: wordCloud,
  },
  {
    name: 'Slimy Creature',
    description: 'Text flows along undulating, organic wobble paths',
    defaultParams: { pathCount: 8, resolution: 60, spacing: 30, yRange: 800, amplitude: 1.0 },
    formula: slimycreature,
    sortSegments: false,
  },
  {
    name: 'Butterflies',
    description: 'Text flows along chaotic butterfly attractor paths',
    defaultParams: { concentricRings: 3, ringSpacing: 6, animationSpeed: 15, disableDepth: 0 },
    formula: butterflys,
    sortSegments: false,
  },
  {
    name: 'Symmetry Wave',
    description: 'Text flows along symmetric wave patterns',
    defaultParams: { animationSpeed: 30, ringOffset: 12 },
    formula: symmetryWave,
    sortSegments: false,
  },
  {
    name: 'Knitting Stitch',
    description: 'Text flows along yarn through V-shaped knit stitches with needles',
    defaultParams: { stitchWidth: 24, stitchHeight: 20, rows: 12, stitchesPerRow: 16, needleLength: 160, cableFrequency: 0, cableOffset: 3, yarnSlack: 0.2, tension: 0.85, progress: 1.0 },
    formula: knittingStitch,
    sortSegments: false,
  },
  {
    name: 'Letter Grid',
    description: 'Text flows across letterpress blocks with mechanical printing',
    defaultParams: { gridCols: 12, gridRows: 6, blockWidth: 28, blockHeight: 32, lineSpacing: 18 },
    formula: letterGrid,
    sortSegments: false,
  },
  {
    name: 'Scribe Flow',
    description: 'Text flows along manuscript lines like a quill writing on paper',
    defaultParams: { pageWidth: 320, pageHeight: 440, lineCount: 18, marginX: 30, marginY: 40 },
    formula: scribeFlow,
  },
  {
    name: 'Root Circuit',
    description: 'Technology grown — roots ascending into circuit grid',
    defaultParams: { gridRows: 10, gridCols: 12, tendrilCount: 14, branchDepth: 2, knotDensity: 50, tiltAngle: 0.55, progress: 1 },
    formula: rootCircuit,
  },
  {
    name: 'Fluid Stream',
    description: 'Text flows along potential-flow streamlines around a sphere',
    defaultParams: { sphereRadius: 100, flowAngle: Math.PI / 4, streamlineCount: 40, turbulence: 8, turbStrength: 12, canvasSize: 400 },
    formula: fluidStream,
  },
];


