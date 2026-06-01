/**
 * Type definitions for the formula system
 */

export interface FormulaParams {
  [key: string]: number;
}

/** A line segment where text flows */
export interface LineSegment {
  x1: number; y1: number;  // start point (projected 2D screen space)
  x2: number; y2: number;  // end point (projected 2D screen space)
  angle: number;           // tangent angle
  length: number;
  depth: number;           // camera-space depth (z) for occlusion sorting
  visualOnly?: boolean;    // true = draw red line but skip text placement
  // 3D world-space position (for 3D formulas only)
  x1w?: number; y1w?: number; z1w?: number;
  x2w?: number; y2w?: number; z2w?: number;
}

/** Shape bounds for geometric fill */
export interface ShapeBounds {
  type: 'shape-fill';
  boundsFn: (y: number) => { left: number; right: number } | null;
  segments?: LineSegment[]; // outline segments for red-line visualization
}

/** Formula result: either segments or shape bounds */
export interface SegmentResult {
  type: 'segments';
  segments: LineSegment[];
}

export type FormulaResult = SegmentResult | ShapeBounds;
export type FormulaFn = (text: string, params: FormulaParams, time: number) => FormulaResult;

/** Template registry entry */
export interface Template {
  name: string;
  description: string;
  defaultParams: FormulaParams;
  formula: FormulaFn;
  sortSegments?: boolean; // If false, segments are used in their generated order
}


