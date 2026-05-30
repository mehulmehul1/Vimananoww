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
  sierpinskiTriangle,
  corticalFold,
  mycelialWeb,
  brainMesh,
  brainSurfacePoint,
  brainStreamlines,
  brainContourText,
  globalCircuit,
  myceliumNetwork,
  brushStroke,
  knittingStitch,
  getCompiledPaths,
  BRAIN_WORDS,
  BRAIN_PATHS,
  wordColor,
  type LineSegment,
} from "../pretext-editor/formulas";
import { EnvironmentEngine } from "../EnvironmentEngine";
import { layoutTextOnSegments, type LinePlacement } from "./textLayout";

import { createTweakpane, DEFAULT_PARAMS, type AllSceneParams } from "./tweakpanePanel";

// ─── Brain SVG path data (from Arrow SVG) ───────────────────────────────

const BRAIN_SVG_PATHS: string[] = [
  "m23.6 40.6c3.4-1.1 6.1 0.9 9.4 1.4s4.6 0.2 9 1.3c8.8 2.2 13.7-1.3 19.4-2.8",
  "m54.7 7.8c4.9-2.2 11.8-4.4 18.3-4.8 5.9-0.3 11 0.4 18.4-0.3",
  "m104.7 4c7.7 0 11.9-2.1 16.9-1.6 5.1 0.5 8.6 6.2 2.3 8.7-1.5 0.5-5.8 0.5-5.8 0.5",
  "m65.3 8c5.3-1.4 10.8-2.6 16.3-2.3 5.8 0.4 7.3 0.2 12.5-0.7 1.8-0.4 5.5-0.9 5.5-0.9",
  "m67.1 11c7.8-1.5 16.3-2.5 25.8-1l7 1.1 2.2 0.4",
  "m95.6 13.4c5.8 0.5 10.3 2.6 20.5 1.2 5-0.7 8-1.5 15.5-1.2",
  "m139.6 10.5c5-2.5 9.3-1.5 13.5 2.1 6 5.3 2 12.8-4.7 12.4-3.2-0.1-7.4-4.4-9-4.4",
  "m147.6 27.6c4.8 1.4 6.9-3.1 11.4-3.5 5.1-0.5 9.9 5.3 6.5 11.5-1.6 2.5-4 5-7.4 4",
  "m173.6 36.6c-3.5-1-6.1 0.9-7.2 2.4-2.8 3.5-6.3 4-8.8 4.4-5.5 1-9.2 2.6-19.2 2.7",
  "m188.1 65.1c2.8-3.6 0.5-8.7-2-12.2-2-2.4-5.5-3-8.6-0.9-3.9 2.5-6.6 3.1-10.6 1.9",
  "m195.5 78.4c3.5 3.6 5 13 3 19.1-1 4 3.1 13-4 15.6",
  "m186.4 115c-8-0.5-10.9-5.5-9-12.1 1-3.4 5.5-3.8 4.6-9.8v-5.5",
  "m166.6 133c3.3 2.6 9 2.6 11.5-3 1.4-3.4 6.5-2.6 9-6.9 0.8-4.6-3.2-8.1-6.5-5.1",
  "m146.4 152.9c8.2-0.5 11-11.4 3.5-16.4-2.3-1.4-3.3-0.5-7.3-3.6-3-2.3-5.5-5-8.2-5.8",
  "m103.5 128.1c-6.4 1.8-7 5.5-6 17.5 0.5 5.9 4 6.5 4.5 15.8",
  "m98 197c-1.6-14.4 0-17.4 2.4-24.6",
  "m75.1 127.4c-2.2-0.3-8.7 0-8.6-4.8 0.5-3 4.4-5.1 8-2.1 5.1 4.5 8 5 14.4 4",
  "m53.5 117.9c6.6 3.5 8.9 2.5 14-1.8 5.1-4.1 10.6-10.1 14-11.5l1.5-0.5",
  "m56.6 107.9c11.5-1.3 13 0.7 17.4-1.3 4-2 4.9-5.2 10.1-5.2l8.9-0.8",
  "m30.1 97.9c6.8 2.6 14.4 1.7 21.4-2.3 4.6-2.2 8.9-7.1 15-8.5",
  "m17.9 95c5.1 3.6 14 7.4 24.7 7.9 5 0.1 8.4-1.5 13-4.8",
  "m11.4 90c-3.5-2.5-8-6.9-5.5-11.1 2.7-3.3 7.6-1.5 8 2.1 0.2 3.5 2.2 6.4 3.6 7.6",
  "m7 54.5c-4.1 0.5-5.5 8-5 12.5 1.6 7 8.5 4.1 11.5 7 1.6 1 3.1 2.6 3.1 4.1",
  "m15.1 58.1c2.9 5.5 6.3 3.9 8.9 9.4 2.9 6.5 4.6 12 8 15.5 1.6 1.1 4 2 4.9 2.1",
  "m34.4 61.1c-3.4 2-6 5.3-4.4 11.5 2.4 7.9 14.1 10 16.5-0.1",
  "m42.4 53.6c-8.5 3.8-10.8 6.5-15.9 6-5.9-0.2-12.1-4.1-12-11 0.1-3.6 6-5.6 9.1-8",
  "m29.6 37.4c-5.1-0.8-8.2-8.4-3.5-12.8 2.4-2.2 7.9-5.2 10.4-6 3.1-0.7 4.6-4.5 8.9-6.1",
  "m54.6 11.5c-6.2 1.9-18.1 7.1-14.1 15.1 2 3 2.6 9.5-1.9 11",
  "m55.4 38.1c-7.4 0.5-11.3-6-8.9-12 1.4-3.5 8.5-10.1 14.1-12.5",
  "m62.4 29c-0.8-7.5-3.5-11 3.7-15 3.5-1.5 5.8-0.4 10-1.5 5-0.9 7.5-0.9 7.5-0.5",
  "m82.9 32.1c-6.9-1.5-9.4-8.5-6.4-13.5 4.1-5 9.5-3.5 16.5-1.7",
  "m102 26.6c3-1.1 6.1-3.6 9.9-3.7 3.6-0.3 6.2-2.8 12.1-2.5 2.6 0.2 5.6 1.7 9.1 2.1 3.8 0.1 5 0.5 6.9 1.4",
  "m151.5 37.6c-2.6-1.6-3.9-6.1-9-8.2-5.6-2.9-6.4-2.8-10.6-3.5-5.3-1.3-7.3-2.8-10.8-1.9",
  "m179.6 46.9c-1.7 4.6-5.5 5.6-9.5 4.7-3.5-0.6-10.5-2.6-23.5-2.6",
  "m183 70.6c-3.9 0.5-6.4-1.5-9.9-5-3.5-4.6-12.6-8.1-24-8.1",
  "m168.1 69c-3.2-3-8-5.5-13.5-5.4",
  "m164.4 70.6c4.7 2.4 8.5 10.4 8.5 17.5 0.5 8.4-1.8 14.4-5.4 17.5",
  "m171.1 72c4 4.1 7.9 9.5 7.5 14.6",
  "m180.1 78.6c-1.7-1.1-3.5-5-5.2-6.2",
  "m178.5 94.6c-1.9 4-5.9 8-3.9 14 0.9 3 4.8 6.8 0.9 10.4-3.6 3-7.4 2.6-10.4-1.6",
  "m161.1 122.6c-1.5-6.5-16-15-24-23",
  "m134.5 146.6c-6.6-10-14.6-18.5-20.4-22.7l-4.1-5.3",
  "m116.5 128.1c-5.4-5.5-8.6-4.7-14.4-2.7-2.5 0.7-10.5 0.7-20 2.5",
  "m73.9 91.5c-7.8-1.6-12 5.9-8.4 10 2 2.1 6.1 3.1 9 0.9 2.5-2 4-3.9 6.6-3.8",
  "m86.6 90.5c7.5-0.1 16 2.5 20.5 5 6.5 3.4 8.4 5.6 14 4.1",
  "m122.9 91c-5.3-6.5-11.9-2.9-10.9 2 2 4.9 6.9 3.9 9.5 3 3.1-1 7.9 2.1 10 4",
  "m130.6 116.6c-3.5 5-13.5 5-16.1-3.6-1-3.9-6.6-9.4-11.9-10.4",
  "m88.5 120c3.6-1 3.5-5.5 6.1-7.4 6.8-4.7 13.3 1 11.5 6.9-1.5 3.1-5 4.1-7.5 4.1",
  "m79.6 116.6c-2.6-0.5-4.7-7.5 3.4-8.6 9.1-1.4 21.6-2.5 25.1 2.6",
  "m131.1 116.6c0.4-6.7 0.4-14.2-8-14.6-4 0-7.5 1.6-11.1-0.5-4.5-2.5-9-4.4-18-4.1",
  "m121.5 146.5c1.1-1.6 0.1-5-3.5-5.5-4.4 0-4.6 6.1-8.5 6-3.4-0.4-5.4-5.4-2-8.4 2.9-2.5 5.1-6 1.6-8.6",
  "m117.6 153.4c-1 6.1 7 8.1 10.8 2.1 5.7-8.5 0.2-12.9-4.4-18.9",
  "m52.6 84.4c6-0.3 8-2 14.9-4.9 2.4-1.4 6.4-0.6 18.6-3.6",
  "m64.4 83.4c6.2-3 7.5-1.9 13.5-3.5 6.2-1.5 11-1.3 20.2-6.3",
  "m77.1 84.1c9-1.5 15.5-3.6 19-4.6 10.3-2.1 13 0.1 15.4 0.4",
  "m69.1 87.6c8.9-0.6 18.8-3.6 27-5",
  "m107.5 82c5 0.4 9.4 1.6 11.6 2 4.5 1.6 5 3.9 9.8 6.5 5 2.1 7.6 2.5 10.7 7",
  "m121.6 82.5c2.5 0.5 5 4.5 9.5 6.1 5.5 1.8 6.3 1.9 9.3 4.9 3.2 3 8.7 7.5 10.1 9",
  "m148.6 87c3.8-0.4 4.9 2.9 9.5 2.9 4.4-0.3 8.5-2.3 10.8 3.5 1.5 4.7-1.4 9-3.9 11",
  "m154.6 86.4c8.5 3.6 14.8-4 10.9-10.5-3-4.9-12.1-5.9-16.4-5.9",
  "m139.1 70.5c-7.2-0.9-10.6-0.5-12.5 4.1-3.5 5.3-12.5 4.5-12-2 0.5-3 1.9-3.2 1.9-3.2",
  "m123.6 67.9c5.5-0.9 11-1 17.5-0.9 6.4-0.1 15.5-1.6 22 1.6",
  "m109.6 66.6c4.3-2.1 4-3.2 11.5-3.2l28 0.2",
  "m98 70c6.6-3 10.1-5 13.1-7 3.5-2.5 9.4-2.4 20.5-2.1h9.4",
  "m104 61.4c6.6-2.4 6.5-3.9 13.5-3.8h24.1",
  "m101.5 56.6c8.1-1.2 13.1-1.6 19.1-1.5l15.9 0.3",
  "m99.1 51c10-1.5 17.4-2 30.8-1.6l7.6 0.2",
  "m85.1 50.5c-8.5 0.6-17.2 2.9-20 8.5-2.2 5.6 1.9 7.1 1.4 13.5",
  "m51.6 63c6.3-5.5 11-13.4 21.3-17.1l3.6-2.3",
  "m43.5 56.6c4.9-2.1 8.9-3.6 11.9-5.6 4.5-2.4 10.1-7.6 17.5-10.5l11.6-1.9",
  "m76.1 37c9-0.4 22-3.4 27.5-6.4l6.5-3.1",
  "m93 36.5c12.9-1.5 13.5-3.4 16.4-5.5 2.6-1.6 8.7-3.1 12.2-4.4 4.3-1.2 7.5 3.4 8.3 6.8 0.2 3.7 0.6 7-5.4 7l-12.1-0.4c-6.3 0.1-13.5 1-22.3 2.5",
  "m137.1 30.5c5-0.6 9.3 4.1 7 9.4-2.5 5-6.5 4.1-9.2 4.1h-12.9",
  "m95 42.4c7.5-1.4 16.1-2.4 22.6-1.8l6.3 0.4",
  "m76.5 49c10.5-0.9 13.1-2 20.6-3.5 5-0.9 12.3-1.1 12.3-1.1",
  "m83.5 59.5c5.1-3.9 10.9-4.9 21.6-6.5 6.8-0.9 13.4-1.4 13.4-1.4",
  "m95.9 57.5c-6.4 1.5-11.8 4.9-13.5 7-2.5 4 1.1 10 7.2 5.6l6-3.5",
  "m76.5 66.9c-3.9 2.2-8.6-1.9-7.4-6.9 1.8-3.9 5.4-4 8.4-4.9l13.6-2.6",
  "m55.1 79.5c-5-1-6.7-7.1-3.5-10.5 3.4-3.1 4-3.4 6-6 2.9-3.6 6.9-8 10.5-11",
  "m55.9 88.1c-4.8 2.9-11.5 7.9-19.4 7.5-4.4 0-8.6-1.7-12.9-5",
  "m51 49.6c6.6-2.6 12-7.2 18.4-8.6l12.7-1.9 5.3-1.1",
  "m77.6 43c-8.1 1-16.1 5.5-22.7 9",
  "m85.1 44.5c-7.2 0.6-15.7 2.5-19.7 5.6",
  "m101.5 18c8.6 1.1 13.6 0.6 20-0.4 4-0.2 8.5 1.9 13 2.3",
  "m146.6 53c5.9-2.1 21 0 26.4 3.6",
  "m146.6 49c9.9-0.4 17.5 1.5 20.9 2.4",
  "m146.6 55c7.9-1 15.5 0.4 22.8 3.5 5 2.4 5 6.1 9.7 8.1",
  "m150.6 57.5c7.3-0.5 16 1.5 20 4.5 2.5 2.4 4.9 5 6.9 6.1",
  "m148.4 60.1c6.2-0.1 15.2 0.4 20.7 4.4 2.4 2.1 5.3 4.6 7 6.4",
  "m139.9 87.9c-3.9-1.4-10.5-2.4-10.4-8 0.9-6.9 9-8.4 14.5-1.4",
  "m134.4 102.5c5.2 3.5 21.6 15.5 24 19.5 2.2 4.1-0.3 7.6-2.3 8.1",
  "m145 101.5c4.5 3.6 14.5 10.5 18.1 16.4 2.4 4.1 4.3 8.7 8.5 8.1",
  "m122.6 122.9c-4.5-0.9-8.1-3.4-10.1-8.4",
];

// Word entries for brain network
interface BrainWordEntry { word: string; x: number; y: number; angle: number; spatial: number; }
const BRAIN_WORD_ENTRIES: BrainWordEntry[] = [
  { word: "a", x: 101.1, y: 4.9, angle: 0, spatial: 0 },
  { word: "be", x: 94.6, y: 18.2, angle: 0.124, spatial: 0.05 },
  { word: "because", x: 84.8, y: 32.9, angle: -0.272, spatial: 0.1 },
  { word: "come", x: 63.2, y: 40.9, angle: -0.278, spatial: 0.15 },
  { word: "day", x: 44, y: 54.4, angle: -0.478, spatial: 0.2 },
  { word: "first", x: 36.5, y: 62.1, angle: -0.47, spatial: 0.22 },
  { word: "for", x: 47, y: 69.9, angle: -0.777, spatial: 0.25 },
  { word: "many", x: 39.2, y: 87.4, angle: -0.124, spatial: 0.35 },
  { word: "my", x: 58.2, y: 88.5, angle: -0.53, spatial: 0.36 },
  { word: "out", x: 68.5, y: 86.6, angle: -0.242, spatial: 0.37 },
  { word: "their", x: 75.9, y: 92.5, angle: -0.052, spatial: 0.38 },
  { word: "them", x: 82.4, y: 98.9, angle: -0.009, spatial: 0.4 },
  { word: "they", x: 84, y: 105.3, angle: -0.052, spatial: 0.42 },
  { word: "those", x: 77.7, y: 119.2, angle: 0.53, spatial: 0.5 },
  { word: "time", x: 90.7, y: 125.2, angle: -0.087, spatial: 0.52 },
  { word: "to", x: 76.2, y: 128.9, angle: 0.105, spatial: 0.54 },
  { word: "use", x: 104.5, y: 129.1, angle: 0.423, spatial: 0.55 },
  { word: "up", x: 118.6, y: 152.1, angle: -0.839, spatial: 0.65 },
  { word: "think", x: 141.8, y: 150.1, angle: 0.978, spatial: 0.68 },
  { word: "that", x: 148.9, y: 133.4, angle: -0.342, spatial: 0.58 },
  { word: "take", x: 160, y: 123.9, angle: 0.829, spatial: 0.56 },
  { word: "some", x: 172.9, y: 126.6, angle: 0.559, spatial: 0.55 },
  { word: "like", x: 187.8, y: 116.9, angle: -0.259, spatial: 0.54 },
  { word: "look", x: 183.1, y: 86.3, angle: -0.985, spatial: 0.4 },
  { word: "know", x: 184.1, y: 69.4, angle: 0.454, spatial: 0.33 },
  { word: "no", x: 181.6, y: 68, angle: -0.009, spatial: 0.31 },
  { word: "here", x: 175.9, y: 34.7, angle: 0.883, spatial: 0.13 },
  { word: "by", x: 152.4, y: 39.2, angle: 0.94, spatial: 0.14 },
  { word: "but", x: 139.9, y: 25.2, angle: 0.454, spatial: 0.08 },
  { word: "of", x: 136.8, y: 21.1, angle: -0.978, spatial: 0.06 },
  { word: "as", x: 133.4, y: 13.5, angle: -0.259, spatial: 0.04 },
  { word: "and", x: 86.1, y: 13.2, angle: 0.087, spatial: 0.04 },
  { word: "all", x: 63.2, y: 14.9, angle: -0.829, spatial: 0.04 },
  { word: "your", x: 56.4, y: 12.3, angle: -0.342, spatial: 0.03 },
  { word: "year", x: 46, y: 12.7, angle: -0.5, spatial: 0.03 },
  { word: "you", x: 30.7, y: 39.3, angle: -0.052, spatial: 0.14 },
  { word: "could", x: 15.1, y: 48.4, angle: -0.629, spatial: 0.16 },
  { word: "me", x: 8.6, y: 55.5, angle: 0.629, spatial: 0.22 },
  { word: "more", x: 16.8, y: 80.3, angle: 0.883, spatial: 0.34 },
  { word: "people", x: 18.4, y: 90.9, angle: 0.559, spatial: 0.38 },
  { word: "say", x: 12.2, y: 91.4, angle: 0.629, spatial: 0.39 },
  { word: "these", x: 50.2, y: 109.6, angle: 0.94, spatial: 0.48 },
  { word: "see", x: 56.9, y: 97.9, angle: -0.629, spatial: 0.4 },
  { word: "also", x: 57.7, y: 38.1, angle: -0.829, spatial: 0.12 },
  { word: "how", x: 77.3, y: 67.2, angle: -0.629, spatial: 0.26 },
  { word: "man", x: 89.5, y: 76.1, angle: -0.5, spatial: 0.3 },
  { word: "its", x: 97.6, y: 65.8, angle: -0.5, spatial: 0.27 },
  { word: "six", x: 92.6, y: 53, angle: -0.105, spatial: 0.2 },
  { word: "find", x: 87, y: 45.5, angle: -0.208, spatial: 0.17 },
  { word: "from", x: 78.3, y: 43.8, angle: -0.208, spatial: 0.16 },
  { word: "do", x: 86.8, y: 39.3, angle: -0.278, spatial: 0.14 },
  { word: "can", x: 113, y: 27.9, angle: -0.358, spatial: 0.08 },
  { word: "even", x: 125.2, y: 28.8, angle: 0.966, spatial: 0.11 },
  { word: "get", x: 131.4, y: 34.6, angle: 0.848, spatial: 0.12 },
  { word: "her", x: 130.5, y: 47.4, angle: -0.009, spatial: 0.18 },
  { word: "him", x: 138.1, y: 50.2, angle: -0.052, spatial: 0.19 },
  { word: "if", x: 163.1, y: 54.8, angle: -0.259, spatial: 0.21 },
  { word: "just", x: 142.4, y: 58.4, angle: -0.009, spatial: 0.23 },
  { word: "new", x: 100.3, y: 73.6, angle: -0.5, spatial: 0.29 },
  { word: "she", x: 98.8, y: 83.1, angle: -0.087, spatial: 0.34 },
  { word: "our", x: 113.2, y: 82.5, angle: 0.208, spatial: 0.34 },
  { word: "one", x: 140.4, y: 71.4, angle: 0.005, spatial: 0.29 },
  { word: "make", x: 134.3, y: 62.2, angle: -0.052, spatial: 0.25 },
  { word: "only", x: 144.7, y: 80.6, angle: 0.777, spatial: 0.34 },
  { word: "or", x: 142.9, y: 89.1, angle: -0.5, spatial: 0.37 },
  { word: "other", x: 151.4, y: 103.7, angle: 0.407, spatial: 0.45 },
  { word: "now", x: 163.7, y: 107.5, angle: 0.966, spatial: 0.48 },
  { word: "not", x: 177.7, y: 87.1, angle: 0.996, spatial: 0.38 },
  { word: "speak", x: 123.6, y: 92.5, angle: 0.5, spatial: 0.39 },
  { word: "than", x: 121.3, y: 100.2, angle: 0.208, spatial: 0.42 },
  { word: "tell", x: 131.6, y: 99.4, angle: 0.829, spatial: 0.42 },
  { word: "then", x: 129.5, y: 106.4, angle: 0.883, spatial: 0.46 },
  { word: "thing", x: 124.2, y: 124.1, angle: 0.454, spatial: 0.52 },
  { word: "two", x: 116.9, y: 130.8, angle: 0.707, spatial: 0.55 },
  { word: "this", x: 104.9, y: 110.9, angle: 0.866, spatial: 0.48 },
  { word: "there", x: 94.6, y: 101.2, angle: 0.259, spatial: 0.42 },
  { word: "some", x: 56.7, y: 80.3, angle: -0.407, spatial: 0.32 },
  { word: "it", x: 97.5, y: 56.2, angle: 0.966, spatial: 0.23 },
  { word: "give", x: 112.1, y: 45.1, angle: -0.052, spatial: 0.17 },
  { word: "very", x: 102.6, y: 169.5, angle: -0.985, spatial: 0.72 },
];

// Neural pulse regions
const PULSE_REGIONS = [
  { cx: 100, cy: 50, rx: 60, ry: 30 },
  { cx: 100, cy: 98, rx: 70, ry: 40 },
  { cx: 80, cy: 130, rx: 40, ry: 25 },
  { cx: 140, cy: 110, rx: 35, ry: 30 },
  { cx: 100, cy: 160, rx: 30, ry: 20 },
];
import { LanguageManager, getFontForLanguage, getFontFamilyForLanguage, type Language, FORMULA_TEXTS, SCENE_TEXTS, ORNAMENTAL_TEXT, UI_TEXTS, LANGUAGE_LABELS, textDirection, VIMANA_WORD } from "../i18n";

interface Act1SceneProps {
  mode?: "scroll" | "time";
  initialScene?: number;
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
const FONT_CANVAS_DEFAULT = `'Arial Narrow', 'Space Grotesk', sans-serif`;
// Mutable font family — set each frame based on current language
let currentFontFamily = FONT_CANVAS_DEFAULT;
let currentDirection: 'ltr' | 'rtl' = 'ltr';
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
    navLabel: "🌿 FERN",
    headline: "FERN",
    body: "A fractal fern unfurls from a seed point, its recursive fronds mirroring the geometry of growth itself.",
    formula: "fractalFern / recursive",
    status: "flora form",
    frequency: "528.00 Hz",
    amplitude: "0.962",
    coordinates: "02 44 11.22 N / 01 19 08.55 E",
    origin: "fibonacci seed",
    duration: 7,
  },
  {
    phaseId: "06",
    navLabel: "🌳 TREE",
    headline: "TREE",
    body: "An L-system tree branches and rebranches, each iteration writing a new sentence of growth.",
    formula: "lSystemTree / branching",
    status: "flora form",
    frequency: "528.00 Hz",
    amplitude: "0.962",
    coordinates: "02 44 11.22 N / 01 19 08.55 E",
    origin: "fibonacci seed",
    duration: 7,
  },
  {
    phaseId: "07",
    navLabel: "❄ CRYSTAL",
    headline: "CRYSTAL",
    body: "Dendritic crystals grow in radial symmetry, each branch a frozen echo of recursive geometry.",
    formula: "dendriticCrystal / radial",
    status: "flora form",
    frequency: "528.00 Hz",
    amplitude: "0.962",
    coordinates: "02 44 11.22 N / 01 19 08.55 E",
    origin: "fibonacci seed",
    duration: 7,
  },
  {
    phaseId: "08",
    navLabel: "🦋 BUTTERFLY",
    headline: "BUTTERFLY",
    body: "Butterflies trace chaotic attractors, their wings inscribed with the mathematics of flight.",
    formula: "butterflys / attractor",
    status: "fauna form",
    frequency: "724.11 Hz",
    amplitude: "0.995",
    coordinates: "08 11 12.00 N / 04 22 18.00 E",
    origin: "chaotic attractors",
    duration: 7,
  },
  {
    phaseId: "09",
    navLabel: "〰 WAVE",
    headline: "WAVE",
    body: "Symmetric waves ripple outward in synchronized patterns, schooling like flocks of birds in flight.",
    formula: "symmetryWave / flocking",
    status: "fauna form",
    frequency: "724.11 Hz",
    amplitude: "0.995",
    coordinates: "08 11 12.00 N / 04 22 18.00 E",
    origin: "chaotic attractors",
    duration: 7,
  },
  {
    phaseId: "10",
    navLabel: "🫧 CREATURE",
    headline: "CREATURE",
    body: "A slimy creature emerges from the depths, its organic paths pulsing with emergent life.",
    formula: "slimyCreature / emergent",
    status: "fauna form",
    frequency: "724.11 Hz",
    amplitude: "0.995",
    coordinates: "08 11 12.00 N / 04 22 18.00 E",
    origin: "chaotic attractors",
    duration: 7,
  },
  {
    phaseId: "11",
    navLabel: "NETWORK",
    headline: "MYCELIUM.",
    body: "Beneath the surface, billions of hyphae weave the earth's original internet. A silent web of nutrient exchange and chemical signals.",
    formula: "myceliumNetwork / underground web",
    status: "mycelial consciousness",
    frequency: "999.99 Hz",
    amplitude: "1.000",
    coordinates: "12 55 59.99 N / 12 55 59.99 E",
    origin: "underground network",
    duration: 6,
  },
  {
    phaseId: "12",
    navLabel: "🧬 EMERGENCE",
    headline: "EMERGENCE",
    body: "Neurons fire in dendritic patterns. The network awakens — not as one, but as many becoming one.",
    formula: "dendriticCrystal / neural",
    status: "neural awakening",
    frequency: "1111.11 Hz",
    amplitude: "1.000",
    coordinates: "13 00 00.00 N / 13 00 00.00 E",
    origin: "neural network",
    duration: 7,
  },
  {
    phaseId: "13",
    navLabel: "🧠 CONVERGENCE",
    headline: "CONVERGENCE",
    body: "Left brain meets right. Geometry meets organics. The hemispheres converge — and consciousness sparks.",
    formula: "sierpinski + lSystem / hemispheres",
    status: "consciousness",
    frequency: "1333.33 Hz",
    amplitude: "1.000",
    coordinates: "13 08 00.00 N / 13 08 00.00 E",
    origin: "hemispheric convergence",
    duration: 8,
  },
  {
    phaseId: "14",
    navLabel: "🖌 BRUSH",
    headline: "THE BRUSH",
    body: "Flow becomes gesture.",
    formula: "brushStroke / flowing ink",
    status: "wave memory",
    frequency: "1666.66 Hz",
    amplitude: "1.000",
    coordinates: "14 00 00.00 N / 14 00 00.00 E",
    origin: "the first motion",
    duration: 6,
  },
  {
    phaseId: "15",
    navLabel: "🔪 CHISEL",
    headline: "THE CHISEL",
    body: "Three architectures. One language of form.",
    formula: "archCarving / 3 columns",
    status: "cultural synthesis",
    frequency: "1999.99 Hz",
    amplitude: "1.000",
    coordinates: "15 00 00.00 N / 15 00 00.00 E",
    origin: "the first mark",
    duration: 10,
  },
  {
    phaseId: "16",
    navLabel: "🧶 KNITTING",
    headline: "THE KNITTING",
    body: "Thread becomes fabric. Each loop holds the memory of the last, each stitch a promise to the next.",
    formula: "knittingStitch / V-stitch fabric",
    status: "textile form",
    frequency: "2222.22 Hz",
    amplitude: "1.000",
    coordinates: "16 00 00.00 N / 16 00 00.00 E",
    origin: "interlocking loops",
    duration: 8,
  },
];

const TOTAL_SCENES = SCENES.length; // All scenes 0-16 active

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
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
  const xRatios = [0.44, 0.44, 0.44, 0.44, 0.44, 0.44, 0.44, 0.44, 0.44, 0.44, 0.44, 0.44];
  const yRatios = [0.5, 0.5, 0.48, 0.47, 0.49, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5];
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

  // Draw DNA letters along strands — same approach as pretext-editor
  const placements = layoutTextOnSegments(
    "VMNA",
    result.segments,

    fontSize,
    "Space Grotesk, sans-serif",
  );
  
  ctx.font = `600 ${Math.max(5, Math.round(fontSize))}px 'Space Grotesk', sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillStyle = "#f8fafc";
  for (const p of placements) {
    if (!p.text.trim()) continue;
    // Keep text readable — flip if upside-down
    let rot = p.rotation;
    if (rot > Math.PI / 2) rot -= Math.PI;
    if (rot < -Math.PI / 2) rot += Math.PI;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(rot);
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
  const sceneRef = useRef(Math.min(initialScene ?? 0, TOTAL_SCENES - 1));
  const sceneTimeRef = useRef(0);
  const progressRef = useRef(0);
  const transitionRef = useRef(1);
  const prevSceneRef = useRef(0);
  const settledRef = useRef(false);
  const settledTimeRef = useRef(0);
  const paramsRef = useRef<AllSceneParams>(JSON.parse(JSON.stringify(DEFAULT_PARAMS)));
  const lastFrameRef = useRef(performance.now());
  const langMgrRef = useRef(new LanguageManager(3)); // 3 seconds per language
  const currentLangRef = useRef<Language>('en');

  // Orbital drag state for brain scene
  const dragRef = useRef({ active: false, lastX: 0, lastY: 0, rotX: 0.35, rotY: 0 });

  const [scene, setScene] = useState(Math.min(initialScene ?? 0, TOTAL_SCENES - 1));
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

  // Tweakpane panel init (replaces Theatre.js Studio)
  useEffect(() => {
    const handle = createTweakpane(paramsRef, sceneRef);
    return () => handle.destroy();
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
        }
      }
    };

    window.addEventListener("keydown", handleKey);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ─── Orbital drag controls for brain scene ───
    const onPointerDown = (e: PointerEvent) => {
      if (sceneRef.current !== 13) return;
      dragRef.current.active = true;
      dragRef.current.lastX = e.clientX;
      dragRef.current.lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragRef.current.active) return;
      const dx = e.clientX - dragRef.current.lastX;
      const dy = e.clientY - dragRef.current.lastY;
      dragRef.current.rotY += dx * 0.008;
      dragRef.current.rotX += dy * 0.005;
      dragRef.current.rotX = Math.max(-1.2, Math.min(1.2, dragRef.current.rotX));
      dragRef.current.lastX = e.clientX;
      dragRef.current.lastY = e.clientY;
    };
    const onPointerUp = (e: PointerEvent) => {
      dragRef.current.active = false;
      canvas.releasePointerCapture(e.pointerId);
    };
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);

    let animationId = 0;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;
    // ─── Brain SVG path cache → LineSegment arrays (created once) ───
    const svgNS = 'http://www.w3.org/2000/svg';
    const brainSvgContainer = document.createElementNS(svgNS, 'svg');
    brainSvgContainer.style.position = 'absolute';
    brainSvgContainer.style.visibility = 'hidden';
    document.body.appendChild(brainSvgContainer);

    // Convert each SVG path to LineSegment[] by sampling points along it
    const brainContourSegments: LineSegment[][] = BRAIN_SVG_PATHS.map(d => {
      const el = document.createElementNS(svgNS, 'path');
      el.setAttribute('d', d);
      brainSvgContainer.appendChild(el);
      const totalLen = el.getTotalLength();
      const segments: LineSegment[] = [];
      const steps = Math.max(8, Math.floor(totalLen / 6));
      for (let s = 0; s < steps; s++) {
        const t1 = (s / steps) * totalLen;
        const t2 = ((s + 1) / steps) * totalLen;
        const p1 = el.getPointAtLength(t1);
        const p2 = el.getPointAtLength(t2);
        const dx = p2.x - p1.x, dy = p2.y - p1.y;
        segments.push({
          x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y,
          angle: Math.atan2(dy, dx),
          length: Math.sqrt(dx * dx + dy * dy),
          depth: 1000, // Match brainContourText — depthScale=0.2 gives 4.5× text space
        });
      }
      return segments;
    });

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
      }

      progressRef.current = scrollToSceneProgress(scrollProgress);

      if (nextScene >= 5) {
        if (idleTimer) clearTimeout(idleTimer);
        settledRef.current = false;
        settledTimeRef.current = 0;
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
      }

      const currentScene = sceneRef.current;
      const lang = langMgrRef.current.update(dt);
      currentLangRef.current = lang;
      // Set font and direction for current language
      currentFontFamily = getFontFamilyForLanguage(lang);
      currentDirection = textDirection(lang);
      const langTexts = SCENE_TEXTS[lang];
      const formulaTexts = FORMULA_TEXTS[lang];
      const sceneDef = SCENES[currentScene];
      const isScrollMode = mode === "scroll";
      const weatherSettled =
        isScrollMode && settledRef.current && currentScene >= 5;

      if (isScrollMode) {
        if (weatherSettled && settledTimeRef.current < sceneDef.duration) {
          // Initialize from current scroll progress on first settled frame
          if (settledTimeRef.current === 0) {
            settledTimeRef.current = progressRef.current * sceneDef.duration;
          }
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

      const theatre = paramsRef.current;
      const tone = getTone(theatre.bloom);
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
          formulaTexts.humCircle,
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
          formulaTexts.wordRings,
        );
        ctx.restore();
      }

      // 3. Field — orbital rings with cymatic text
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
          formulaTexts.fieldCymatic,
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
        drawLines = true,
      ) => {
        ctx.save();
        if (drawLines) {
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
        }

        ctx.shadowBlur = 0;
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.direction = textDirection(lang);
        const langFont = getFontForLanguage(lang, fontSize);
        for (const p of placements) {
          if (!p.text.trim()) continue;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.scale(p.scale, p.scale);
          ctx.font = langFont;
          ctx.globalAlpha = 0.55 + p.opacity * 0.35;
          ctx.fillStyle = textColor;
          ctx.fillText(p.text, 0, 0);
          ctx.restore();
        }
        ctx.restore();
      };

      if (renderScene === 4) {
        const dnaP = theatre.dna;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(dnaP.scale, dnaP.scale);
        const parentW = 180 * scale;
        const parentH = 320 * scale;
        renderCapsuleForScene(
          ctx,
          0,
          0,
          parentW,
          parentH,
          dnaP.turns,
          dnaP.basePairs,
          0,
          t,
          progress, // alpha
          progress, // scaleVal
          dnaP.fontSize * scale,
        );
        ctx.restore();
      }

      // === FLORA SCENES (5, 6, 7) — formula only, no DNA helix transition ===

      if (renderScene === 5) {
        // FERN — fractal fern with wind sway
        ctx.save();
        const easedFloraP = easeOutCubic(clamp01(progress));

        ctx.translate(cx, cy + 120 * scale);
        const fernP = paramsRef.current.fern;
        const windSway = Math.sin(t * fernP.windSpeed) * fernP.windSway;
        ctx.rotate(windSway);
        ctx.scale(easedFloraP * fernP.textScale * scale * fernP.scale, easedFloraP * fernP.textScale * scale * fernP.scale);

        const result = fractalFern("FERN", {
          stemLength: fernP.stemLength, frondPairs: fernP.frondPairs,
          depth: fernP.depth, angleSpread: fernP.angleSpread, lengthDecay: fernP.lengthDecay,
        }, t);
        if (result.type === "segments") {
          const placements = layoutTextOnSegments(formulaTexts.floraFern, result.segments, fernP.fontSize, currentFontFamily, { preserveOrder: true });
          renderFormulaWithGlow(result.segments, placements, "rgba(16, 185, 129, 0.45)", 0.8, "#ecfdf5", false, fernP.fontSize);
        }
        ctx.restore();
      }

      if (renderScene === 6) {
        // TREE — L-system tree with wind sway
        ctx.save();
        const easedFloraP = easeOutCubic(clamp01(progress));

        ctx.translate(cx, cy + 160 * scale);
        const lsysP = paramsRef.current.lsystem;
        const windSway = Math.sin(t * lsysP.windSpeed) * lsysP.windSway;
        ctx.rotate(windSway);
        ctx.scale(easedFloraP * lsysP.textScale * scale * lsysP.scale, easedFloraP * lsysP.textScale * scale * lsysP.scale);

        const result = lSystemTree("TREE", {
          angle: lsysP.angle, stepLength: lsysP.stepLength,
          iterations: lsysP.iterations, startAngle: -90, trunkScale: lsysP.trunkScale,
        }, t);
        if (result.type === "segments") {
          const placements = layoutTextOnSegments(formulaTexts.floraTree, result.segments, lsysP.fontSize, currentFontFamily, { preserveOrder: true });
          renderFormulaWithGlow(result.segments, placements, "rgba(255, 215, 67, 0.45)", 0.8, "#ffd743", false, lsysP.fontSize);
        }
        ctx.restore();
      }

      if (renderScene === 7) {
        // CRYSTAL — dendritic crystal with rotation
        ctx.save();
        const easedFloraP = easeOutCubic(clamp01(progress));

        ctx.translate(cx, cy);
        const crystP = paramsRef.current.crystal;
        ctx.rotate(t * crystP.rotationSpeed);
        ctx.scale(easedFloraP * crystP.textScale * scale * crystP.scale, easedFloraP * crystP.textScale * scale * crystP.scale);


        const result = dendriticCrystal("CRYSTAL", {
          seedLength: crystP.seedLength, branches: crystP.branches,
          depth: crystP.depth, angleSpread: crystP.angleSpread,
          lengthDecay: crystP.lengthDecay, symmetry: crystP.symmetry,
        }, t);
        if (result.type === "segments") {
          const placements = layoutTextOnSegments(formulaTexts.floraCrystal, result.segments, crystP.fontSize, currentFontFamily, { preserveOrder: true });
          renderFormulaWithGlow(result.segments, placements, "rgba(242, 240, 236, 0.45)", 0.8, "#f2f0ec", false, crystP.fontSize);
        }
        ctx.restore();
      }

      // === FAUNA SCENES (8, 9, 10) — formula only, no DNA helix transition ===

      if (renderScene === 8) {
        // BUTTERFLY — chaotic attractor
        ctx.save();
        const easedFaunaP = easeOutCubic(clamp01(progress));

        ctx.translate(cx, cy);
        ctx.scale(easedFaunaP * 2.1 * scale, easedFaunaP * 2.1 * scale);
        ctx.translate(-200, -200);
        const result = butterflys("FAUNA", { count: 3 }, t * 2);
        if (result.type === "segments") {
          const placements = layoutTextOnSegments(formulaTexts.faunaButterfly, result.segments, 7.5, currentFontFamily, { preserveOrder: true });
          renderFormulaWithGlow(result.segments, placements, "rgba(199, 192, 252, 0.55)", 0.9, "#c7c0fc", true, 7.5, false);
        }
        ctx.restore();
      }

      if (renderScene === 9) {
        // WAVE — symmetric wave flocking
        ctx.save();
        const easedFaunaP = easeOutCubic(clamp01(progress));

        ctx.translate(cx, cy);
        ctx.scale(easedFaunaP * 2.3 * scale, easedFaunaP * 2.3 * scale);
        ctx.translate(-200, -200);
        const result = symmetryWave("FAUNA", { waves: 2 }, t * 0.25);
        if (result.type === "segments") {
          const placements = layoutTextOnSegments(formulaTexts.faunaWave, result.segments, 7.5, currentFontFamily, { preserveOrder: true });
          renderFormulaWithGlow(result.segments, placements, "rgba(185, 234, 186, 0.55)", 0.9, "#b9eaba", true, 7.5, false);
        }
        ctx.restore();
      }

      if (renderScene === 10) {
        // CREATURE — slimy creature emergent
        ctx.save();
        const easedFaunaP = easeOutCubic(clamp01(progress));

        ctx.translate(cx, cy);
        ctx.scale(easedFaunaP * 1.8 * scale, easedFaunaP * 1.8 * scale);
        ctx.translate(-200, -200);
        const result = slimycreature("FAUNA", { pathCount: 5 }, t * 1.5);
        if (result.type === "segments") {
          const placements = layoutTextOnSegments(formulaTexts.faunaCreature, result.segments, 7.5, currentFontFamily, { preserveOrder: true });
          renderFormulaWithGlow(result.segments, placements, "rgba(249, 56, 35, 0.55)", 0.9, "#f93823", true, 7.5, false);
        }
        ctx.restore();
      }

      // === MYCELIUM NETWORK (scene 11) — underground fungal web (pretext) ===
      if (renderScene === 11) {
        const mycP = theatre.myceliumNetwork;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(mycP.scale, mycP.scale);

        const mycText = formulaTexts.myceliumNetwork;
        // Growth driven by scroll progress — linear for smooth scroll mapping
        const mycProgress = clamp01(progress);

        if (mycProgress > 0) {
          // Cache formula result — only regenerate on param change (sway is cheap canvas transform)
          const mycParamKey = `${mycP.nodes}-${mycP.branches}-${mycP.depth}-${mycP.stepLength}-${mycP.angleSpread}-${mycP.lengthDecay}-${mycP.reconnectDist}-${mycP.spread}`;
          if (!(window as any)._mycFormulaCache || (window as any)._mycFormulaKey !== mycParamKey) {
            (window as any)._mycFormulaResult = myceliumNetwork(mycText, {
              nodes: mycP.nodes, branches: mycP.branches,
              depth: mycP.depth, stepLength: mycP.stepLength,
              angleSpread: mycP.angleSpread, lengthDecay: mycP.lengthDecay,
              reconnectDist: mycP.reconnectDist, spread: mycP.spread,
            }, 0);
            (window as any)._mycFormulaKey = mycParamKey;
          }
          const mycResult = (window as any)._mycFormulaResult;

          if (mycResult.type === "segments") {
            const visibleCount = Math.floor(mycResult.segments.length * mycProgress);

            // Split ALL segments by depth (layout on full set, not sliced)
            const maxD = mycP.depth ?? 3;
            const hyphaeSegs = (mycResult.segments as LineSegment[])
              .filter((s: LineSegment) => (s.depth ?? 0) <= maxD)
              .sort((a: LineSegment, b: LineSegment) => (a.depth ?? 0) - (b.depth ?? 0));
            const webSegs = (mycResult.segments as LineSegment[])
              .filter((s: LineSegment) => (s.depth ?? 0) > maxD && (s.depth ?? 0) <= maxD + 1)
              .sort((a: LineSegment, b: LineSegment) => (a.depth ?? 0) - (b.depth ?? 0));

            // Visible subsets for drawing only
            const visHyphae = hyphaeSegs.slice(0, Math.floor(hyphaeSegs.length * mycProgress));
            const visWeb = webSegs.slice(0, Math.floor(webSegs.length * mycProgress));

            // Cache layout results — only recalculate when params change
            const mycCacheKey = `${mycP.nodes}-${mycP.branches}-${mycP.depth}-${mycP.stepLength}-${mycP.fontSize}`;
            if (!(window as any)._mycLayoutCache || (window as any)._mycLayoutCacheKey !== mycCacheKey) {
              (window as any)._mycHyphaePlacements = layoutTextOnSegments(mycText, hyphaeSegs, mycP.fontSize, currentFontFamily, { preserveOrder: true });
              (window as any)._mycWebPlacements = webSegs.length > 0 ? layoutTextOnSegments(mycText, webSegs, mycP.fontSize * 0.7, currentFontFamily, { preserveOrder: true }) : [];
              (window as any)._mycLayoutCacheKey = mycCacheKey;
              (window as any)._mycLayoutCache = true;
            }
            const mycPlacements = (window as any)._mycHyphaePlacements;
            const webPlacements = (window as any)._mycWebPlacements;

            // Main hyphae — batched stroke, no per-segment state changes
            ctx.strokeStyle = "rgba(200, 180, 80, 0.35)";
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            for (const s of visHyphae) {
              ctx.moveTo(s.x1, s.y1);
              ctx.lineTo(s.x2, s.y2);
            }
            ctx.stroke();

            // Text on hyphae — only show for visible branches
            const langFont = getFontForLanguage(lang, mycP.fontSize);
            ctx.textAlign = "left";
            ctx.textBaseline = "top";
            ctx.direction = textDirection(lang);
            ctx.font = langFont;
            ctx.fillStyle = "#e8d882";
            const hyphTextCount = Math.floor(mycPlacements.length * mycProgress);
            for (let pi = 0; pi < hyphTextCount; pi++) {
              const p = mycPlacements[pi];
              if (!p.text.trim()) continue;
              ctx.save();
              ctx.translate(p.x, p.y);
              ctx.rotate(p.rotation);
              ctx.scale(p.scale, p.scale);
              ctx.globalAlpha = 0.55 + p.opacity * 0.35;
              ctx.fillText(p.text, 0, 0);
              ctx.restore();
            }

            // Reconnection web — faint, no text (saves measurement)
            if (visWeb.length > 0) {
              ctx.strokeStyle = "rgba(160, 180, 100, 0.12)";
              ctx.lineWidth = 0.4;
              ctx.beginPath();
              for (const s of visWeb) {
                ctx.moveTo(s.x1, s.y1);
                ctx.lineTo(s.x2, s.y2);
              }
              ctx.stroke();
              // Faint web text — only for visible web
              const webTextCount = Math.floor(webPlacements.length * mycProgress);
              if (webTextCount > 0) {
                const webFont = getFontForLanguage(lang, mycP.fontSize * 0.7);
                ctx.font = webFont;
                ctx.fillStyle = "#c8d48a";
                for (let pi = 0; pi < webTextCount; pi++) {
                  const p = webPlacements[pi];
                  if (!p.text.trim()) continue;
                  ctx.save();
                  ctx.translate(p.x, p.y);
                  ctx.rotate(p.rotation);
                  ctx.scale(p.scale, p.scale);
                  ctx.globalAlpha = 0.3 + p.opacity * 0.2;
                  ctx.fillText(p.text, 0, 0);
                  ctx.restore();
                }
              }
            }

            // Nutrient pulses — batched, skip every other segment
            const pulseCount = 3;
            for (let w = 0; w < pulseCount; w++) {
              const wavePhase = ((t * 0.4 + w / pulseCount) % 1);
              const wavePos = wavePhase * hyphaeSegs.length;
              const waveSpread = 30 * scale;

              ctx.beginPath();
              for (let si = 0; si < hyphaeSegs.length; si += 6) {
                const dist = Math.abs(si - wavePos);
                if (dist > waveSpread) continue;

                const seg = hyphaeSegs[si];
                const intensity = (1 - dist / waveSpread) * mycProgress;
                if (intensity < 0.05) continue;

                const mx = (seg.x1 + seg.x2) / 2;
                const my = (seg.y1 + seg.y2) / 2;
                const r = (1 + intensity * 2.5) * scale;

                ctx.moveTo(mx + r, my);
                ctx.arc(mx, my, r, 0, Math.PI * 2);
              }
              ctx.fillStyle = "rgba(232, 216, 130, 0.5)";
              ctx.fill();
            }

            // Mycorrhizal nodes — cheap glow (no shadowBlur)
            if (progress > 0.3) {
              const nodeIntensity = (progress - 0.3) / 0.7;
              for (let ni = 0; ni < 8; ni++) {
                const phase = Math.sin(t * 1.5 + ni * 2.1) * 0.5 + 0.5;
                if (phase < 0.4) continue;

                const alpha = (phase - 0.4) / 0.6 * nodeIntensity;
                const nodeSeg = hyphaeSegs[Math.floor(ni * hyphaeSegs.length / 8)];
                if (!nodeSeg) continue;

                const mx = (nodeSeg.x1 + nodeSeg.x2) / 2;
                const my2 = (nodeSeg.y1 + nodeSeg.y2) / 2;
                const r = (1.5 + alpha * 3) * scale;

                // Glow halo
                ctx.beginPath();
                ctx.fillStyle = `rgba(232, 216, 130, ${alpha * 0.18})`;
                ctx.arc(mx, my2, r * 3, 0, Math.PI * 2);
                ctx.fill();
                // Core dot
                ctx.beginPath();
                ctx.fillStyle = `rgba(255, 240, 180, ${alpha * 0.9})`;
                ctx.arc(mx, my2, r, 0, Math.PI * 2);
                ctx.fill();
              }
            }

            // Underground aura
            if (progress > 0.5) {
              const auraIntensity = (progress - 0.5) / 0.5;
              ctx.save();
              ctx.globalAlpha = auraIntensity * 0.1;
              const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 300 * scale);
              gradient.addColorStop(0, "rgba(180, 160, 60, 0.5)");
              gradient.addColorStop(0.5, "rgba(120, 100, 40, 0.2)");
              gradient.addColorStop(1, "rgba(60, 50, 20, 0)");
              ctx.fillStyle = gradient;
              ctx.fillRect(-350 * scale, -350 * scale, 700 * scale, 700 * scale);
              ctx.restore();
            }
          }
        }
        ctx.restore();
      }

      // === THE FIRING (scene 12) — neuron cascade with glow ===
      if (renderScene === 12) {
        const fireP = theatre.firing;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(fireP.scale, fireP.scale);

        const fireText = formulaTexts.firingDendritic;
        const cascade = progress * fireP.cascadeSpeed;

        const neuronCount = 5;
        const neuronRadius = 120 * scale;

        for (let ni = 0; ni < neuronCount; ni++) {
          const neuronProgress = clamp01((cascade - ni * 0.15) / 0.4);
          if (neuronProgress <= 0) continue;

          const nAngle = (ni / neuronCount) * Math.PI * 2 - Math.PI / 2;
          const nx = Math.cos(nAngle) * neuronRadius;
          const ny = Math.sin(nAngle) * neuronRadius;

          ctx.save();
          ctx.translate(nx, ny);
          ctx.rotate(nAngle + t * 0.05);

          const result = dendriticCrystal(fireText, {
            seedLength: fireP.seedLength * scale * 0.4,
            branches: fireP.branches,
            depth: fireP.depth,
            angleSpread: fireP.angleSpread,
            lengthDecay: fireP.lengthDecay,
            symmetry: fireP.symmetry,
          }, t);

          const colors = ["rgba(33, 199, 223, 0.6)", "rgba(199, 192, 252, 0.6)", "rgba(242, 240, 236, 0.6)", "rgba(249, 115, 22, 0.6)", "rgba(16, 185, 129, 0.6)"];
          const textColors = ["#21c7df", "#c7c0fc", "#f2f0ec", "#fb923c", "#10b981"];

          if (result.type === "segments") {
            const visibleCount = Math.floor(result.segments.length * neuronProgress);
            const visibleSegs = result.segments.slice(0, visibleCount);

            ctx.save();
            ctx.shadowColor = colors[ni];
            ctx.shadowBlur = 15 * scale * neuronProgress;
            ctx.strokeStyle = colors[ni];
            ctx.lineWidth = 1.2 + neuronProgress * 0.8;
            ctx.beginPath();
            for (const seg of visibleSegs) {
              ctx.moveTo(seg.x1, seg.y1);
              ctx.lineTo(seg.x2, seg.y2);
            }
            ctx.stroke();
            ctx.shadowBlur = 0;
            ctx.restore();

            ctx.save();
            ctx.textAlign = "left";
            ctx.textBaseline = "top";
            ctx.direction = textDirection(lang);
            const langFont = getFontForLanguage(lang, fireP.fontSize * scale * 0.7);
            for (let si = 0; si < visibleSegs.length; si += 4) {
              const seg = visibleSegs[si];
              const mx = (seg.x1 + seg.x2) / 2;
              const my = (seg.y1 + seg.y2) / 2;
              const angle = Math.atan2(seg.y2 - seg.y1, seg.x2 - seg.x1);
              const words = fireText.split(" ");
              const word = words[si % words.length] || "";
              if (!word.trim()) continue;
              ctx.save();
              ctx.translate(mx, my);
              ctx.rotate(angle);
              ctx.font = langFont;
              ctx.globalAlpha = 0.5 + neuronProgress * 0.3;
              ctx.fillStyle = textColors[ni];
              ctx.fillText(word, 0, 0);
              ctx.restore();
            }
            ctx.restore();
          }
          ctx.restore();

          if (neuronProgress > 0.5 && ni < neuronCount - 1) {
            const nextAngle = ((ni + 1) / neuronCount) * Math.PI * 2 - Math.PI / 2;
            const nextX = Math.cos(nextAngle) * neuronRadius;
            const nextY = Math.sin(nextAngle) * neuronRadius;
            const pulseT = (neuronProgress - 0.5) / 0.5;
            const px = nx + (nextX - nx) * pulseT;
            const py = ny + (nextY - ny) * pulseT;

            ctx.beginPath();
            ctx.fillStyle = "#ffffff";
            ctx.shadowColor = colors[ni];
            ctx.shadowBlur = 20 * scale;
            ctx.arc(px, py, (3 + Math.sin(t * 8) * 1.5) * scale, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }

        if (progress > 0.85) {
          const flashAlpha = (progress - 0.85) / 0.15;
          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha * 0.9})`;
          ctx.shadowColor = "#ffffff";
          ctx.shadowBlur = 50 * scale * flashAlpha;
          ctx.arc(0, 0, (10 + flashAlpha * 25) * scale, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        ctx.restore();
      }

      // === THE OBSERVER (scene 13) — SVG brain contour/word network ===
      if (renderScene === 13) {
        const meshProgress = easeOutCubic(clamp01(progress * 2.5));
        const wordReveal = clamp01((progress - 0.3) * 2);
        const pulseReveal = clamp01((progress - 0.5) * 2);
        const mobileFontScale = isMobile ? 0.6 : 1;

        if (meshProgress > 0) {
          ctx.save();
          // Scale the 200x197 viewBox to fit the canvas
          const viewScale = Math.min(w / 200, h / 197) * 0.85;
          const offsetX = (w - 200 * viewScale) / 2;
          const offsetY = (h - 197 * viewScale) / 2;
          ctx.translate(offsetX, offsetY);
          ctx.scale(viewScale, viewScale);

          // Dotted contour lines disabled — text-only brain
          ctx.globalAlpha = 1;

          // Draw word network — pretext: words flow along contour paths (current language only)
          if (wordReveal > 0) {
            // Flatten all contour segments into one array for text layout
            const allBrainSegs: LineSegment[] = brainContourSegments.flat();
            const brainFs = 9.5 * mobileFontScale;
            const brainPlacements = layoutTextOnSegments(
              formulaTexts.brainMesh, allBrainSegs, brainFs, currentFontFamily,
              { preserveOrder: true },
            );

            // Render text along segments
            const langFont = getFontForLanguage(lang, brainFs);
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.direction = textDirection(lang);
            for (const p of brainPlacements) {
              if (!p.text.trim()) continue;
              ctx.save();
              ctx.translate(p.x, p.y);
              ctx.rotate(p.rotation);
              ctx.scale(p.scale, p.scale);
              ctx.font = langFont;
              ctx.globalAlpha = wordReveal * (0.45 + p.opacity * 0.35);
              ctx.fillStyle = '#f2f0ec';
              ctx.fillText(p.text, 0, 0);
              ctx.restore();
            }
          }

          // Neural pulse dots
          if (pulseReveal > 0) {
            for (let i = 0; i < 60; i++) {
              const region = PULSE_REGIONS[i % PULSE_REGIONS.length];
              const angle = (i / 60) * Math.PI * 2;
              const r = 0.3 + (Math.sin(i * 7.3) * 0.5 + 0.5) * 0.7;
              const px = region.cx + Math.cos(angle) * region.rx * r;
              const py = region.cy + Math.sin(angle) * region.ry * r;
              const phase = (i / 60 + t * 0.8) % 1;
              const pulse = Math.sin(phase * Math.PI * 2) * 0.5 + 0.5;
              const size = 0.5 + pulse * 1.5;
              const alpha = pulse * 0.8 * pulseReveal;

              if (alpha < 0.01) continue;

              ctx.beginPath();
              ctx.arc(px, py, size, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(129, 140, 248, ${alpha})`;
              ctx.shadowColor = 'rgba(129, 140, 248, 0.8)';
              ctx.shadowBlur = 2;
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }

          ctx.restore();
        }
      }

      // === THE BRUSH (scene 14) ===
      if (renderScene === 14) {
        ctx.save();
        ctx.translate(cx, cy);

        // Calculate a base scale factor that guarantees responsive, screen-fitting paths
        // regardless of resolution (targeting a 1000x1000 virtual canvas)
        const baseScale = Math.max(w, h) / 1020;
        ctx.scale(baseScale, baseScale);

        // Physical vertical translation based on scroll progress to move the pattern from top to bottom
        const verticalScrollTranslate = (progress - 0.5) * 450;
        ctx.translate(0, verticalScrollTranslate);

        const result = brushStroke("", {}, t);
        if (result.type === "segments") {
          ctx.lineCap = "round";
          ctx.lineJoin = "round";

          // Reveal segments from top to bottom based on scroll progress
          const yThreshold = -520 + 1040 * progress;

          // Distinct font sizes for the 8 tracks to create organic varying widths
          const laneFontSizes = [7.0, 15.0, 5.5, 18.0, 11.0, 4.5, 13.0, 8.5];

          ctx.textAlign = "left";
          ctx.textBaseline = "top";
          ctx.direction = textDirection(lang);

          for (let j = 0; j < 8; j++) {
            const laneFs = laneFontSizes[j];
            const dMin = j * 0.065;
            const dMax = (j + 1) * 0.065;
            const trackSegs = result.segments.filter(
              s => s.depth >= dMin && s.depth < dMax && s.y2 <= yThreshold
            );

            if (trackSegs.length === 0) continue;

            const placements = layoutTextOnSegments(
              formulaTexts.brushStroke,
              trackSegs,
              laneFs,
              currentFontFamily,
              { preserveOrder: true }
            );

            const langFont = getFontForLanguage(lang, laneFs);
            ctx.font = langFont;

            for (const p of placements) {
              if (!p.text.trim()) continue;
              ctx.save();
              ctx.translate(p.x, p.y);
              ctx.rotate(p.rotation);
              ctx.scale(p.scale * 0.95, p.scale * 0.95);
              ctx.font = langFont;

              ctx.globalAlpha = 0.55 + p.opacity * 0.45;
              ctx.fillStyle = tone.isVoid
                ? "rgb(46, 252, 252)"  // glowing turquoise for dark void theme
                : "rgb(10, 92, 166)";  // deep Japanese indigo blue for light theme

              ctx.fillText(p.text, 0, 0);
              ctx.restore();
            }
          }
        }
        ctx.restore();
      }

      // === THE CHISEL (scene 15) — Arched Column with Cycling Ornamentation ===
      // Three ornamental styles cycle on loop. Each fills a centered pointed-arch
      // column with dense connected tiling. Text flows via @chenglou/pretext.
      // Islamic: proper 12-pointed star tessellation + girih interlacing
      // Gothic: multi-layer tracery with sub-arches + trefoils + mouchettes
      // Indian: 8-pointed star + floral + self-similar sub-patterns
      if (renderScene === 15) {
        const seq = clamp01(progress);
        const sc = Math.min(w, h) / 750;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        const revealP = clamp01((seq - 0.1) / 0.8);

        // ── Arched column geometry (wider, shorter — fits 4 pattern columns) ──
        const colW = Math.min(w, h) * 0.50;
        const colH = h * 0.60;
        const archHeight = colW * 0.45;
        const colTop = -colH / 2;
        const colX = -colW / 2;
        const colRight = colX + colW;
        const colBottom = colTop + colH;
        const archBase = colTop + archHeight;

        // ── Style cycling (7s per style) ──
        const CYCLE = 4;
        const styleIdx = Math.floor((t / CYCLE) % 3);

        // ── Clip to pointed-arch column shape (no fill) ──
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(colX, colBottom);
        ctx.lineTo(colX, archBase);
        ctx.quadraticCurveTo(colX - colW * 0.12, archBase - colW * 0.3, 0, archBase - colW * 0.85);
        ctx.quadraticCurveTo(colRight + colW * 0.12, archBase - colW * 0.3, colRight, archBase);
        ctx.lineTo(colRight, colBottom);
        ctx.closePath();
        ctx.clip();

        // ── Column arch outline (carries text first + subtle border) ──
        const archSegs = 8;
        const archSegmentsPre: LineSegment[] = [];
        const apexY = archBase - colW * 0.85;
        // Left arch: bottom to apex (continuous)
        for (let i = 0; i < archSegs; i++) {
          const t1 = i / archSegs, t2 = (i + 1) / archSegs;
          const llx = (1-t1)*(1-t1)*colX + 2*(1-t1)*t1*(colX-colW*0.12) + t1*t1*0;
          const lly = (1-t1)*(1-t1)*archBase + 2*(1-t1)*t1*(archBase-colW*0.3) + t1*t1*apexY;
          const llx2 = (1-t2)*(1-t2)*colX + 2*(1-t2)*t2*(colX-colW*0.12) + t2*t2*0;
          const lly2 = (1-t2)*(1-t2)*archBase + 2*(1-t2)*t2*(archBase-colW*0.3) + t2*t2*apexY;
          archSegmentsPre.push({ x1: llx, y1: lly, x2: llx2, y2: lly2, angle: 0, length: 0, depth: 0.4 });
        }
        // Right arch: apex to bottom (continuous after left arch)
        for (let i = 0; i < archSegs; i++) {
          const t1 = i / archSegs, t2 = (i + 1) / archSegs;
          const rrx = (1-t1)*(1-t1)*colRight + 2*(1-t1)*t1*(colRight+colW*0.12) + t1*t1*0;
          const rry = (1-t1)*(1-t1)*archBase + 2*(1-t1)*t1*(archBase-colW*0.3) + t1*t1*apexY;
          const rrx2 = (1-t2)*(1-t2)*colRight + 2*(1-t2)*t2*(colRight+colW*0.12) + t2*t2*0;
          const rry2 = (1-t2)*(1-t2)*archBase + 2*(1-t2)*t2*(archBase-colW*0.3) + t2*t2*apexY;
          archSegmentsPre.push({ x1: rrx, y1: rry, x2: rrx2, y2: rry2, angle: 0, length: 0, depth: 0.4 });
        }
        // Left vertical, bottom band, right vertical
        archSegmentsPre.push({ x1: colX, y1: archBase, x2: colX, y2: colBottom, angle: 0, length: 0, depth: 0.4 });
        archSegmentsPre.push({ x1: colX, y1: colBottom, x2: colRight, y2: colBottom, angle: 0, length: 0, depth: 0.4 });
        archSegmentsPre.push({ x1: colRight, y1: colBottom, x2: colRight, y2: archBase, angle: 0, length: 0, depth: 0.4 });

        // ── Generate ornament segments — arch-adaptive tiling ──
        const segs: LineSegment[] = [...archSegmentsPre];
        const baseCell = colW / 4.2;
        const numRows = Math.ceil(colH / baseCell) + 8;

        // Arch width at a given y (from colBottom up to arch apex)
        const archWAt = (y: number): number => {
          if (y >= archBase) return colW;
          const apexY = archBase - colW * 0.85;
          if (y <= apexY) return 0;
          let lo = 0, hi = 1;
          for (let i = 0; i < 16; i++) {
            const m = (lo + hi) / 2;
            const ym = (1-m)*(1-m)*archBase + 2*(1-m)*m*(archBase - colW*0.3) + m*m*apexY;
            if (ym > y) lo = m; else hi = m;
          }
          const t = (lo + hi) / 2;
          const xl = (1-t)*(1-t)*colX + 2*(1-t)*t*(colX - colW*0.12) + t*t*0;
          return Math.abs(xl) * 2;
        };

        for (let r = 0; r < numRows; r++) {
          const yPos = colBottom - r * baseCell - baseCell / 2;
          const availW = archWAt(yPos);
          if (availW < baseCell * 0.25) continue;

          const cols = Math.max(1, Math.round(availW / (baseCell * 1.1)));
          const step = availW / cols;
          const R = step * 0.48;
          const iR = R * 0.38;
          const leftX = -availW / 2;

          for (let c = 0; c < cols; c++) {
            const ox = leftX + c * step + step / 2;
            const oy = yPos;

            if (styleIdx === 0) {
              // ── ★ INDIAN JALI: 8-pointed star + interlacing + diamond ──
              for (let p = 0; p < 8; p++) {
                const a = p * Math.PI / 4, na = (p + 1) * Math.PI / 4;
                const r1 = p % 2 === 0 ? R : iR, r2 = (p + 1) % 2 === 0 ? R : iR;
                segs.push({ x1: ox + Math.cos(a) * r1, y1: oy + Math.sin(a) * r1, x2: ox + Math.cos(na) * r2, y2: oy + Math.sin(na) * r2, angle: 0, length: 0, depth: 0 });
              }
              // Inner star (rotated 22.5°)
              const iR2 = R * 0.2;
              for (let p = 0; p < 8; p++) {
                const a = p * Math.PI / 4 - Math.PI / 8, na = (p + 1) * Math.PI / 4 - Math.PI / 8;
                const r1 = p % 2 === 0 ? iR2 : iR2 * 0.5, r2 = (p + 1) % 2 === 0 ? iR2 : iR2 * 0.5;
                segs.push({ x1: ox + Math.cos(a) * r1, y1: oy + Math.sin(a) * r1, x2: ox + Math.cos(na) * r2, y2: oy + Math.sin(na) * r2, angle: 0, length: 0, depth: 1 });
              }
              // Lotus petals
              const petR = iR2 * 0.9;
              for (let p = 0; p < 6; p++) {
                const a = p * Math.PI / 3;
                segs.push({ x1: ox, y1: oy, x2: ox + Math.cos(a) * petR, y2: oy + Math.sin(a) * petR, angle: 0, length: 0, depth: 1 });
                segs.push({ x1: ox + Math.cos(a) * petR, y1: oy + Math.sin(a) * petR, x2: ox + Math.cos(a) * petR * 0.5 + Math.cos(a + 0.5) * petR * 0.3, y2: oy + Math.sin(a) * petR * 0.5 + Math.sin(a + 0.5) * petR * 0.3, angle: 0, length: 0, depth: 1 });
              }
              // Diamond center
              const dR = R * 0.12;
              segs.push({ x1: ox, y1: oy - dR, x2: ox + dR * 0.6, y2: oy, angle: 0, length: 0, depth: 0 });
              segs.push({ x1: ox + dR * 0.6, y1: oy, x2: ox, y2: oy + dR, angle: 0, length: 0, depth: 0 });
              segs.push({ x1: ox, y1: oy + dR, x2: ox - dR * 0.6, y2: oy, angle: 0, length: 0, depth: 0 });
              segs.push({ x1: ox - dR * 0.6, y1: oy, x2: ox, y2: oy - dR, angle: 0, length: 0, depth: 0 });
              // Horizontal interlacing bands (connect to next cell)
              if (c < cols - 1) {
                for (let d = -1; d <= 1; d += 2) {
                  segs.push({ x1: ox + R, y1: oy + d * 3 * sc, x2: ox + step - R, y2: oy + d * 3 * sc, angle: 0, length: 0, depth: 0.5 });
                }
              }
              // Vertical interlacing bands (connect to row below)
              if (r < numRows - 1) {
                for (let d = -1; d <= 1; d += 2) {
                  segs.push({ x1: ox + d * 3 * sc, y1: oy + R, x2: ox + d * 3 * sc, y2: oy + baseCell * 0.5 - R, angle: 0, length: 0, depth: 0.5 });
                }
              }
              // Diagonal crossing
              segs.push({ x1: ox - R * 0.45, y1: oy - R * 0.45, x2: ox + R * 0.45, y2: oy + R * 0.45, angle: 0, length: 0, depth: 1 });
              segs.push({ x1: ox - R * 0.45, y1: oy + R * 0.45, x2: ox + R * 0.45, y2: oy - R * 0.45, angle: 0, length: 0, depth: 1 });
              // Sub-stars in gaps
              const gapD = step * 0.26;
              for (let q = 0; q < 4; q++) {
                const qAng = q * Math.PI / 2 + Math.PI / 4;
                const qx = ox + Math.cos(qAng) * gapD;
                const qy = oy + Math.sin(qAng) * gapD;
                const sr = R * 0.18;
                for (let p = 0; p < 4; p++) {
                  const a = p * Math.PI / 2, na = (p + 1) * Math.PI / 2;
                  const r1 = p % 2 === 0 ? sr : sr * 0.45, r2 = (p + 1) % 2 === 0 ? sr : sr * 0.45;
                  segs.push({ x1: qx + Math.cos(a) * r1, y1: qy + Math.sin(a) * r1, x2: qx + Math.cos(na) * r2, y2: qy + Math.sin(na) * r2, angle: 0, length: 0, depth: 1.2 });
                }
                segs.push({ x1: qx, y1: qy - sr * 0.2, x2: qx + sr * 0.1, y2: qy, angle: 0, length: 0, depth: 1.2 });
                segs.push({ x1: qx + sr * 0.1, y1: qy, x2: qx, y2: qy + sr * 0.2, angle: 0, length: 0, depth: 1.2 });
                segs.push({ x1: qx, y1: qy + sr * 0.2, x2: qx - sr * 0.1, y2: qy, angle: 0, length: 0, depth: 1.2 });
                segs.push({ x1: qx - sr * 0.1, y1: qy, x2: qx, y2: qy - sr * 0.2, angle: 0, length: 0, depth: 1.2 });
              }

            } else if (styleIdx === 1) {
              // ── ★ ISLAMIC: 12-pointed stars + 8-pointed stars + girih bands ──
              for (let h = 0; h < 2; h++) {
                const off = h * Math.PI / 6;
                const starR = h === 0 ? R * 0.85 : R * 0.45;
                for (let p = 0; p < 6; p++) {
                  const a = p * Math.PI / 3 + off, na = (p + 1) * Math.PI / 3 + off;
                  segs.push({ x1: ox + Math.cos(a) * starR, y1: oy + Math.sin(a) * starR, x2: ox + Math.cos(na) * starR, y2: oy + Math.sin(na) * starR, angle: 0, length: 0, depth: 0 });
                }
              }
              for (let s = 0; s < 12; s++) {
                const a = s * Math.PI / 6;
                segs.push({ x1: ox, y1: oy, x2: ox + Math.cos(a) * R * 0.35, y2: oy + Math.sin(a) * R * 0.35, angle: 0, length: 0, depth: 0.2 });
              }
              const iR8 = R * 0.32;
              for (let p = 0; p < 8; p++) {
                const a = p * Math.PI / 4, na = (p + 1) * Math.PI / 4;
                const r1 = p % 2 === 0 ? iR8 : iR8 * 0.5, r2 = (p + 1) % 2 === 0 ? iR8 : iR8 * 0.5;
                segs.push({ x1: ox + Math.cos(a) * r1, y1: oy + Math.sin(a) * r1, x2: ox + Math.cos(na) * r2, y2: oy + Math.sin(na) * r2, angle: 0, length: 0, depth: 0 });
              }
              for (let p = 0; p < 24; p++) {
                const a1 = (p / 24) * Math.PI * 2, a2 = ((p + 1) / 24) * Math.PI * 2;
                segs.push({ x1: ox + Math.cos(a1) * R * 0.92, y1: oy + Math.sin(a1) * R * 0.92, x2: ox + Math.cos(a2) * R * 0.92, y2: oy + Math.sin(a2) * R * 0.92, angle: 0, length: 0, depth: 0.3 });
              }
              for (let p = 0; p < 16; p++) {
                const a1 = (p / 16) * Math.PI * 2, a2 = ((p + 1) / 16) * Math.PI * 2;
                segs.push({ x1: ox + Math.cos(a1) * R * 0.55, y1: oy + Math.sin(a1) * R * 0.55, x2: ox + Math.cos(a2) * R * 0.55, y2: oy + Math.sin(a2) * R * 0.55, angle: 0, length: 0, depth: 0.4 });
              }
              for (let p = 0; p < 8; p++) {
                const a1 = (p / 8) * Math.PI * 2, a2 = ((p + 1) / 8) * Math.PI * 2;
                segs.push({ x1: ox + Math.cos(a1) * R * 0.08, y1: oy + Math.sin(a1) * R * 0.08, x2: ox + Math.cos(a2) * R * 0.08, y2: oy + Math.sin(a2) * R * 0.08, angle: 0, length: 0, depth: 0 });
              }
              // Horizontal girih bands
              if (c < cols - 1) {
                for (let d = -3; d <= 3; d += 3) {
                  segs.push({ x1: ox + R * 0.4, y1: oy + d * 2 * sc, x2: ox + step - R * 0.4, y2: oy + d * 2 * sc, angle: 0, length: 0, depth: 0.6 });
                }
              }
              // Vertical girih bands
              if (r < numRows - 1) {
                for (let d = -3; d <= 3; d += 3) {
                  segs.push({ x1: ox + d * 2 * sc, y1: oy + R * 0.4, x2: ox + d * 2 * sc, y2: oy + baseCell * 0.5 - R * 0.4, angle: 0, length: 0, depth: 0.6 });
                }
              }
              // Diagonal connecting bands
              if (c < cols - 1 && r < numRows - 1) {
                segs.push({ x1: ox + R * 0.55, y1: oy + R * 0.55, x2: ox + step - R * 0.55, y2: oy + baseCell * 0.5 - R * 0.55, angle: 0, length: 0, depth: 0.6 });
                segs.push({ x1: ox + step - R * 0.55, y1: oy + R * 0.55, x2: ox + R * 0.55, y2: oy + baseCell * 0.5 - R * 0.55, angle: 0, length: 0, depth: 0.6 });
              }
              // 6-pointed stars in gaps
              for (let q = 0; q < 4; q++) {
                const qAng = q * Math.PI / 2 + Math.PI / 4;
                const qx = ox + Math.cos(qAng) * step * 0.28;
                const qy = oy + Math.sin(qAng) * step * 0.28;
                const sr = R * 0.18;
                for (let h = 0; h < 2; h++) {
                  const off = h * Math.PI / 6;
                  for (let p = 0; p < 6; p++) {
                    const a = p * Math.PI / 3 + off, na = (p + 1) * Math.PI / 3 + off;
                    const r1 = h === 0 ? sr : sr * 0.5, r2 = h === 0 ? sr : sr * 0.5;
                    segs.push({ x1: qx + Math.cos(a) * r1, y1: qy + Math.sin(a) * r1, x2: qx + Math.cos(na) * r2, y2: qy + Math.sin(na) * r2, angle: 0, length: 0, depth: 1 });
                  }
                }
              }

            } else {
              // ── ★ GOTHIC TRACERY: Lancet arch + trefoil + sub-arches ──
              const aw = R * 0.78, ah = R * 0.95;
              const circR = (aw * aw + ah * ah) / (2 * ah);
              const cy = oy - ah + circR;
              for (let p = 0; p < 5; p++) {
                const a1 = Math.PI * 0.5 + (p / 5) * (Math.PI * 0.32);
                const a2 = Math.PI * 0.5 + ((p + 1) / 5) * (Math.PI * 0.32);
                segs.push({ x1: ox - aw + Math.cos(a1) * circR, y1: cy + Math.sin(a1) * circR, x2: ox - aw + Math.cos(a2) * circR, y2: cy + Math.sin(a2) * circR, angle: 0, length: 0, depth: 0 });
              }
              for (let p = 0; p < 5; p++) {
                const a1 = Math.PI * 0.18 + (p / 5) * (Math.PI * 0.32);
                const a2 = Math.PI * 0.18 + ((p + 1) / 5) * (Math.PI * 0.32);
                segs.push({ x1: ox + aw + Math.cos(a1) * circR, y1: cy + Math.sin(a1) * circR, x2: ox + aw + Math.cos(a2) * circR, y2: cy + Math.sin(a2) * circR, angle: 0, length: 0, depth: 0 });
              }
              segs.push({ x1: ox - aw, y1: oy + ah, x2: ox - aw, y2: oy - ah * 0.15, angle: 0, length: 0, depth: 0 });
              segs.push({ x1: ox + aw, y1: oy + ah, x2: ox + aw, y2: oy - ah * 0.15, angle: 0, length: 0, depth: 0 });
              // Sub-arches
              const subAw = aw * 0.35, subAh = ah * 0.55;
              const subCircR = (subAw * subAw + subAh * subAh) / (2 * subAh);
              for (let side = -1; side <= 1; side += 2) {
                const subOx = ox + side * subAw * 1.05;
                const subCy = oy - ah * 0.25 + subCircR;
                for (let p = 0; p < 4; p++) {
                  const a1 = Math.PI * 0.5 + (p / 4) * (Math.PI * 0.32);
                  const a2 = Math.PI * 0.5 + ((p + 1) / 4) * (Math.PI * 0.32);
                  segs.push({ x1: subOx - subAw + Math.cos(a1) * subCircR, y1: subCy + Math.sin(a1) * subCircR, x2: subOx - subAw + Math.cos(a2) * subCircR, y2: subCy + Math.sin(a2) * subCircR, angle: 0, length: 0, depth: 0.3 });
                }
                for (let p = 0; p < 4; p++) {
                  const a1 = Math.PI * 0.18 + (p / 4) * (Math.PI * 0.32);
                  const a2 = Math.PI * 0.18 + ((p + 1) / 4) * (Math.PI * 0.32);
                  segs.push({ x1: subOx + subAw + Math.cos(a1) * subCircR, y1: subCy + Math.sin(a1) * subCircR, x2: subOx + subAw + Math.cos(a2) * subCircR, y2: subCy + Math.sin(a2) * subCircR, angle: 0, length: 0, depth: 0.3 });
                }
                segs.push({ x1: subOx - subAw, y1: oy + ah - ah * 0.25, x2: subOx - subAw, y2: oy - ah * 0.25 - subAh * 0.2, angle: 0, length: 0, depth: 0.3 });
                segs.push({ x1: subOx + subAw, y1: oy + ah - ah * 0.25, x2: subOx + subAw, y2: oy - ah * 0.25 - subAh * 0.2, angle: 0, length: 0, depth: 0.3 });
                const sFoilR = subAw * 0.35;
                for (let f = 0; f < 3; f++) {
                  const fa = f * 2 * Math.PI / 3 - Math.PI / 2;
                  const fx = subOx + Math.cos(fa) * sFoilR * 0.8;
                  const fy = oy - ah * 0.25 + Math.sin(fa) * sFoilR * 0.8;
                  for (let p = 0; p < 5; p++) {
                    const a1 = (p / 5) * Math.PI * 2, a2 = ((p + 1) / 5) * Math.PI * 2;
                    segs.push({ x1: fx + Math.cos(a1) * sFoilR, y1: fy + Math.sin(a1) * sFoilR, x2: fx + Math.cos(a2) * sFoilR, y2: fy + Math.sin(a2) * sFoilR, angle: 0, length: 0, depth: 1.2 });
                  }
                }
              }
              // Central trefoil
              const foilR = R * 0.22;
              for (let f = 0; f < 3; f++) {
                const fa = f * 2 * Math.PI / 3 - Math.PI / 2;
                const fx = ox + Math.cos(fa) * foilR * 0.95;
                const fy = oy + Math.sin(fa) * foilR * 0.95 - ah * 0.1;
                for (let p = 0; p < 6; p++) {
                  const a1 = (p / 6) * Math.PI * 2, a2 = ((p + 1) / 6) * Math.PI * 2;
                  segs.push({ x1: fx + Math.cos(a1) * foilR, y1: fy + Math.sin(a1) * foilR, x2: fx + Math.cos(a2) * foilR, y2: fy + Math.sin(a2) * foilR, angle: 0, length: 0, depth: 0.8 });
                }
              }
              for (let f = 0; f < 3; f++) {
                const fa = f * 2 * Math.PI / 3 + Math.PI / 6;
                const cx2 = ox + Math.cos(fa) * foilR * 1.35;
                const cy2 = oy + Math.sin(fa) * foilR * 1.35 - ah * 0.1;
                segs.push({ x1: cx2, y1: cy2, x2: cx2 + Math.cos(fa) * foilR * 0.5, y2: cy2 + Math.sin(fa) * foilR * 0.5, angle: 0, length: 0, depth: 0.7 });
              }
              segs.push({ x1: ox, y1: oy + ah, x2: ox, y2: oy - ah * 0.85, angle: 0, length: 0, depth: 0.5 });
              segs.push({ x1: ox - aw * 0.8, y1: oy + ah * 0.5, x2: ox + aw * 0.8, y2: oy + ah * 0.5, angle: 0, length: 0, depth: 0.5 });
              for (let side = -1; side <= 1; side += 2) {
                const muX = ox + side * subAw * 2.0;
                const muY = oy - ah * 0.1;
                const muR2 = aw * 0.12;
                for (let p = 0; p < 8; p++) {
                  const a1 = (p / 8) * Math.PI, a2 = ((p + 1) / 8) * Math.PI;
                  segs.push({ x1: muX + Math.cos(a1) * muR2, y1: muY + Math.sin(a1) * muR2 * 0.6, x2: muX + Math.cos(a2) * muR2, y2: muY + Math.sin(a2) * muR2 * 0.6, angle: 0, length: 0, depth: 0.7 });
                }
                segs.push({ x1: muX - muR2 * 0.3, y1: muY + muR2 * 0.5, x2: muX + muR2 * 0.3, y2: muY + muR2 * 0.5, angle: 0, length: 0, depth: 0.7 });
              }
              const qfR = R * 0.06;
              for (let q = 0; q < 4; q++) {
                const qa = q * Math.PI / 2;
                const qx = Math.cos(qa) * qfR * 1.5;
                const qy = oy - ah * 0.72 + Math.sin(qa) * qfR * 1.5;
                for (let p = 0; p < 6; p++) {
                  const a1 = (p / 6) * Math.PI * 2, a2 = ((p + 1) / 6) * Math.PI * 2;
                  segs.push({ x1: ox + qx + Math.cos(a1) * qfR, y1: qy + Math.sin(a1) * qfR, x2: ox + qx + Math.cos(a2) * qfR, y2: qy + Math.sin(a2) * qfR, angle: 0, length: 0, depth: 0.6 });
                }
              }
            }
          }
        }

        // ── Compute length & angle for text layout on pattern lines ──
        for (const s of segs) {
          const dx = s.x2 - s.x1, dy = s.y2 - s.y1;
          s.length = Math.hypot(dx, dy);
          s.angle = Math.atan2(dy, dx);
        }

        // Sort by depth
        segs.sort((a, b) => (a.depth || 0) - (b.depth || 0));
        const visCount = Math.floor(segs.length * revealP);
        const visSegs = segs.slice(0, visCount);

        // ── Style-based palettes (stroke only) ──
        const LINE_C = [
          "rgba(200, 155, 100, 0.70)",  // Indian sandstone
          "rgba(50, 170, 190, 0.70)",   // Islamic teal
          "rgba(160, 130, 180, 0.70)",  // Gothic lavender
        ];
        const SUB_C = [
          "rgba(160, 120, 75, 0.40)",
          "rgba(30, 130, 155, 0.40)",
          "rgba(110, 80, 130, 0.40)",
        ];
        const DEEP_C = [
          "rgba(120, 85, 50, 0.25)",
          "rgba(15, 90, 110, 0.25)",
          "rgba(80, 55, 100, 0.25)",
        ];

        if (visSegs.length > 0) {
          // Deep/subtle lines (depth >= 1)
          const deep = visSegs.filter(s => (s.depth || 0) >= 1);
          if (deep.length > 0) {
            ctx.strokeStyle = DEEP_C[styleIdx];
            ctx.lineWidth = 0.5 * sc;
            ctx.beginPath();
            for (const s of deep) ctx.moveTo(s.x1, s.y1), ctx.lineTo(s.x2, s.y2);
            ctx.stroke();
          }
          // Secondary lines (depth 0.3–0.9)
          const sub = visSegs.filter(s => (s.depth || 0) >= 0.3 && (s.depth || 0) < 1);
          if (sub.length > 0) {
            ctx.strokeStyle = SUB_C[styleIdx];
            ctx.lineWidth = 0.8 * sc;
            ctx.beginPath();
            for (const s of sub) ctx.moveTo(s.x1, s.y1), ctx.lineTo(s.x2, s.y2);
            ctx.stroke();
          }
          // Main lines (depth < 0.3)
          const main = visSegs.filter(s => (s.depth || 0) < 0.3);
          if (main.length > 0) {
            ctx.strokeStyle = LINE_C[styleIdx];
            ctx.lineWidth = 1.8 * sc;
            ctx.beginPath();
            for (const s of main) ctx.moveTo(s.x1, s.y1), ctx.lineTo(s.x2, s.y2);
            ctx.stroke();
          }

          // ── TEXT FLOW on pattern lines (pretext) — small, bright ──
          const textFs = Math.max(4, 6 * sc);
          const placements = layoutTextOnSegments(
            formulaTexts.archCarving, segs,
            textFs, currentFontFamily,
            { preserveOrder: true },
          );
          const langFont = getFontForLanguage(lang, textFs);
          ctx.textAlign = "left";
          ctx.textBaseline = "top";
          ctx.direction = textDirection(lang);
          ctx.font = langFont;
          for (const p of placements) {
            if (!p.text.trim()) continue;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.scale(p.scale, p.scale);
            ctx.globalAlpha = 0.55 + p.opacity * 0.35;
            ctx.fillStyle = "#fff8e8";
            ctx.fillText(p.text, 0, 0);
            ctx.restore();
          }
        }

        ctx.restore(); // end clip

        // ── Column outline ──
        ctx.strokeStyle = "rgba(200, 170, 130, 0.60)";
        ctx.lineWidth = 2.5 * sc;
        ctx.shadowColor = "rgba(200, 170, 130, 0.12)";
        ctx.shadowBlur = 5 * sc;
        ctx.beginPath();
        ctx.moveTo(colX, colBottom);
        ctx.lineTo(colX, archBase);
        ctx.quadraticCurveTo(colX - colW * 0.12, archBase - colW * 0.3, 0, archBase - colW * 0.85);
        ctx.quadraticCurveTo(colRight + colW * 0.12, archBase - colW * 0.3, colRight, archBase);
        ctx.lineTo(colRight, colBottom);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // ── Style label ──
        const LABELS = ["★ INDIAN JALI", "★ ISLAMIC GEOMETRIC", "★ GOTHIC TRACERY"];
        ctx.fillStyle = "rgba(200, 170, 130, 0.55)";
        ctx.font = `${Math.max(8, 9 * sc * sc)}px ${FONT_PRIMARY}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.globalAlpha = 0.4 + 0.4 * Math.abs(Math.sin(t * 1.3));
        ctx.fillText(LABELS[styleIdx], 0, colBottom + 14 * sc);
        ctx.globalAlpha = 1;

        ctx.restore();
      }

      // === THE KNITTING (scene 16) — Fluid fabric with animated needles ===
      if (renderScene === 16) {
        const knitP = theatre.knitting;
        ctx.save();
        ctx.translate(cx, cy);

        const knitText = formulaTexts.knitting;
        const knitScale = Math.min(w, h) / 900;
        ctx.scale(knitScale, knitScale);

        // Gentle fabric sway (simulates hanging textile)
        const sway = Math.sin(t * 0.3) * 0.015;
        const swayY = Math.sin(t * 0.4) * 3;
        ctx.rotate(sway);
        ctx.translate(0, swayY);

        // Scroll-driven progress
        const knitProgress = clamp01(progress);

        const result = knittingStitch(knitText, {
          stitchWidth: knitP.stitchWidth,
          stitchHeight: knitP.stitchHeight,
          rows: knitP.rows,
          stitchesPerRow: knitP.stitchesPerRow,
          needleLength: knitP.needleLength,
          cableFrequency: knitP.cableFrequency,
          cableOffset: knitP.cableOffset,
          yarnSlack: knitP.yarnSlack,
          tension: knitP.tension,
          progress: knitProgress,
        }, t);

        if (result.type === "segments") {
          const yarnSegs: LineSegment[] = [];
          const needleSegs: LineSegment[] = [];

          for (const s of result.segments) {
            if (s.visualOnly) {
              needleSegs.push(s);
            } else {
              yarnSegs.push(s);
            }
          }

          // Draw needles (warm wood with shadow)
          if (needleSegs.length > 0) {
            // Needle shadow
            ctx.strokeStyle = "rgba(100, 80, 50, 0.15)";
            ctx.lineWidth = 4;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.beginPath();
            for (const s of needleSegs) {
              ctx.moveTo(s.x1 + 2, s.y1 + 2);
              ctx.lineTo(s.x2 + 2, s.y2 + 2);
            }
            ctx.stroke();

            // Needle body
            ctx.strokeStyle = "rgba(190, 155, 100, 0.9)";
            ctx.lineWidth = 3;
            ctx.beginPath();
            for (const s of needleSegs) {
              ctx.moveTo(s.x1, s.y1);
              ctx.lineTo(s.x2, s.y2);
            }
            ctx.stroke();

            // Needle highlight
            ctx.strokeStyle = "rgba(230, 210, 170, 0.35)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            for (const s of needleSegs) {
              ctx.moveTo(s.x1, s.y1 - 1);
              ctx.lineTo(s.x2, s.y2 - 1);
            }
            ctx.stroke();
          }

          // Draw yarn path (fluid stitch lines)
          if (yarnSegs.length > 0) {
            // Yarn shadow (offset, faint)
            ctx.strokeStyle = tone.isVoid
              ? "rgba(80, 60, 30, 0.1)"
              : "rgba(60, 40, 20, 0.08)";
            ctx.lineWidth = 1.5;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.beginPath();
            for (const s of yarnSegs) {
              ctx.moveTo(s.x1 + 1, s.y1 + 1);
              ctx.lineTo(s.x2 + 1, s.y2 + 1);
            }
            ctx.stroke();

            // Main yarn
            ctx.strokeStyle = tone.isVoid
              ? "rgba(200, 175, 130, 0.4)"
              : "rgba(110, 85, 55, 0.35)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            for (const s of yarnSegs) {
              ctx.moveTo(s.x1, s.y1);
              ctx.lineTo(s.x2, s.y2);
            }
            ctx.stroke();

            // Yarn highlight (gives thread depth)
            ctx.strokeStyle = tone.isVoid
              ? "rgba(245, 235, 210, 0.18)"
              : "rgba(255, 250, 240, 0.22)";
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            for (const s of yarnSegs) {
              ctx.moveTo(s.x1 - 0.3, s.y1 - 0.5);
              ctx.lineTo(s.x2 - 0.3, s.y2 - 0.5);
            }
            ctx.stroke();
          }

          // Layout text along yarn (preserve thread order)
          const placements = layoutTextOnSegments(
            knitText, yarnSegs, knitP.fontSize, currentFontFamily,
            { preserveOrder: true },
          );

          // Render text
          const langFont = getFontForLanguage(lang, knitP.fontSize);
          ctx.textAlign = "left";
          ctx.textBaseline = "top";
          ctx.direction = textDirection(lang);
          ctx.font = langFont;

          for (const p of placements) {
            if (!p.text.trim()) continue;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.scale(p.scale, p.scale);
            ctx.globalAlpha = 0.6 + p.opacity * 0.4;
            ctx.fillStyle = tone.isVoid
              ? "rgb(235, 218, 185)"
              : "rgb(55, 40, 25)";
            ctx.fillText(p.text, 0, 0);
            ctx.restore();
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

      // Ornamental border (right + bottom, L-shaped) — always English
      renderBorder(ctx, w, h, tone, isAlt, ORNAMENTAL_TEXT['en']);

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
      brainSvgContainer.remove();
      document.body.classList.remove("act1-scroll-mode");
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKey);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
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
        overscrollBehavior: "none",
        WebkitOverflowScrolling: "touch",
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
          touchAction: "pan-y",
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
            touchAction: "pan-y",
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
              display: "none", // Hidden for now
            }}
          >
            <h1
              style={{
                fontSize: isMobile ? "1rem" : "1.25rem",
                letterSpacing: "0.1em",
                fontWeight: 500,
                color: tone.ink,
                marginBottom: "0.5rem",
                direction: textDirection(currentLangRef.current),
              }}
            >
              {(SCENE_TEXTS[currentLangRef.current]?.[scene] ?? sceneDef).headline}
            </h1>
            <p
              style={{
                fontSize: isMobile ? "0.6875rem" : "0.75rem",
                lineHeight: isMobile ? 1.5 : 1.8,
                letterSpacing: "0.04em",
                color: tone.muted,
                opacity: 0.8,
                margin: 0,
                direction: textDirection(currentLangRef.current),
              }}
            >
              {(SCENE_TEXTS[currentLangRef.current]?.[scene] ?? sceneDef).body}
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
  ornamentalTextOverride?: string,
) {
  const bw = Math.max(20, w * 0.04);

  // Ornamental text string (NO SPACES)
  const ornamentalText = ornamentalTextOverride ?? "VIMANAVIMANAVIMANAVIMANA❋";
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
  const startX = w * 0.7; // bottom border covers only 30% of screen width
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

// Use Intl.Segmenter for proper grapheme cluster splitting (handles Devanagari conjuncts, etc.)
const _graphemeSegmenter = typeof Intl !== 'undefined' && Intl.Segmenter
  ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
  : null;

function _splitGraphemes(text: string): string[] {
  if (_graphemeSegmenter) {
    return [..._graphemeSegmenter.segment(text)].map(s => s.segment);
  }
  return [...text]; // fallback: code-point splitting (good for most scripts)
}

function _getCharWidths(text: string, font: string): number[] {
  const key = `${font}|${text}`;
  const cached = _widthCache.get(key);
  if (cached) return cached;


  _measureCtx.font = font;
  const graphemes = _splitGraphemes(text);
  const widths = graphemes.map((g) => _measureCtx.measureText(g).width);
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
  const graphemes = _splitGraphemes(text);
  const singlePassWidth = charWidths.reduce((a, b) => a + b, 0);
  const circumference = 2 * Math.PI * radius;

  // Repeat text enough times to fill the full circle
  const repeats = Math.max(1, Math.ceil(circumference / singlePassWidth));
  const fullGraphemes: string[] = [];
  const allWidths: number[] = [];
  for (let r = 0; r < repeats; r++) {
    for (let i = 0; i < graphemes.length; i++) {
      fullGraphemes.push(graphemes[i]);
      allWidths.push(charWidths[i]);
    }
  }

  // Total arc = full text width / radius, centered at top (-π/2)
  const totalArc = (singlePassWidth * repeats) / radius;
  const startAngle = -Math.PI / 2 - totalArc / 2;
  const placements: LinePlacement[] = [];
  let arcPos = 0;

  for (let i = 0; i < fullGraphemes.length; i++) {
    const charAngle =
      startAngle + arcPos / radius + allWidths[i] / (2 * radius);
    const x = radius * Math.cos(charAngle);
    const y = radius * Math.sin(charAngle);
    const rotation = charAngle + Math.PI / 2;
    placements.push({
      text: fullGraphemes[i],
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
  const key = `${char}_${fontSize}_${fontFamily}_${fillColor}`;
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
  ctx.direction = currentDirection;
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
  const key = `${text}_${fontSize}_${fontFamily}_${fillColor}`;
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
  ctx.direction = currentDirection;
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
  const key = `${text}_${rKey}_${fontSize}_${fontFamily}_${strokeColor}_${fillColor}`;
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
  ctx.direction = currentDirection;

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
  const key = `${text}_${rKey}_${fontSize}_${fontFamily}`;

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
  text?: string,
) {
  const ringText: string = text ?? "VIMANA";
  const currentRadius =
    elapsed < 3
      ? 125 + (220 - 125) * easeOutCubic(Math.min(1, elapsed / 3))
      : 220;
  const currentFontSize =
    elapsed < 3 ? 13 + (24 - 13) * easeOutCubic(Math.min(1, elapsed / 3)) : 24;
  const ringRotation = t * 0.06;
  const result = textCircle(ringText, { radius: currentRadius }, t);
  if (result.type !== "segments") return;

  // Use direct arc-based character placement for continuous flow around the circle.
  // This bypasses the segment sorting issue and gives correct tangent angles.
  const placements = layoutTextOnCircleArcCached(
    ringText,
    0,
    0,
    currentRadius,
    currentFontSize,
    currentFontFamily,
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
    currentFontFamily,
    currentDirection,
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
  text?: string,
) {
  const ringText: string = text ?? "VIMANA";
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

    // Wavy amplitude — disabled (no distortion)
    const waveAmp = 0;

    const paletteColor = isAlt ? ALT_PALETTE[i % ALT_PALETTE.length] : null;
    const strokeCol = isAlt
      ? `rgba(63, 72, 239, ${0.5 + (1 - tNorm) * 0.2})`
      : `rgba(33, 199, 223, ${0.08 + (1 - tNorm) * 0.12})`;

    const fillCol = isAlt ? "#f2f0ec" : bloom > 0.45 ? INK : "#e0f2fe";

    if (waveAmp === 0) {
      // FAST PATH: Off-screen GPU Canvas rendering (200x faster!)
      const ringEntry = getOrCreateOffscreenRing(
        ringText,
        radius,
        ringFontSize,
        currentFontFamily,
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
        ringText,
        0,
        0,
        scaledRadius,
        ringFontSize,
        currentFontFamily,
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
          currentFontFamily,
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
  text?: string,
) {
  const ringText: string = text ?? "VIMANA";
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
      ringText,
      baseRadius,
      ringFontSize,
      currentFontFamily,
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
  text?: string,
) {
  const treeText: string = text ??
    "VIMANA from primordial vibration life emerges branching fractaling growing each frequency a new form each word a new leaf the tree of consciousness reaches toward light";
  const result = fractalTree(
    treeText,
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
    treeText,
    result.segments,
    fontSize,
    currentFontFamily,
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
    currentFontFamily,
    currentDirection,
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
  fontOverride?: string,
  direction: 'ltr' | 'rtl' = 'ltr',
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
  ctx.direction = direction;
  const font = fontOverride || `600 ${fontSize}px ${currentFontFamily}`;
  for (const p of placements) {
    if (!p.text.trim()) continue;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.scale(p.scale, p.scale);
    ctx.font = font;
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
