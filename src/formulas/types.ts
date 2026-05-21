/**
 * Core types for the formulas system
 * Moved from pretext-editor/FormulaTemplates.ts
 */

export interface FormulaParams {
  [key: string]: number;
}

/** A line segment where text flows */
export interface LineSegment {
  x1: number; y1: number; // start point
  x2: number; y2: number; // end point
  angle: number;           // tangent angle
  length: number;
  depth: number;           // for scale variation
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

/** Color gradient configuration */
export interface ColorStop {
  offset: number;
  color: string;
}

export interface ColorGradient {
  id: string;
  stops: ColorStop[];
  mapping: 'path' | 'radial' | 'angular';
}

/** Blend mode for Canvas 2D compositing */
export type BlendMode = GlobalCompositeOperation;
