/**
 * Core types for the rendering pipeline
 */

import type { FormulaFn, FormulaParams, ColorGradient } from '../formulas/types';

/** A resolved font object for rendering */
export interface ResolvedFont {
  family: string;
  weight: number;
  size: number;
}

/** Instance configuration for a formula in a scene */
export interface FormulaInstanceConfig {
  formula: string | FormulaFn;
  params: FormulaParams;
  text: string;
  gradient?: ColorGradient;
  fontToken?: string;
  fontSize?: number;
  transform?: Transform2D;
  opacity?: number;
  blendMode?: GlobalCompositeOperation;
  zIndex?: number;
  paramAnimations?: ParamAnimation[];
}

/** 2D transform for rendering */
export interface Transform2D {
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
}

/** Parameter animation over time */
export interface ParamAnimation {
  paramKey: string;
  startValue: number;
  endValue: number;
  duration: number; // seconds
  loop: boolean;
}

/** Phase configuration */
export interface PhaseConfig {
  phase: number;
  name: string;
  duration: number;
  layers: FormulaInstanceConfig[];
  transitionIn?: TransitionConfig;
  transitionOut?: TransitionConfig;
  postProcessing?: PostProcessConfig;
}

/** Transition between phases */
export interface TransitionConfig {
  type: 'fade' | 'slide' | 'zoom' | 'none';
  duration: number; // seconds
}

/** Post-processing effects */
export interface PostProcessConfig {
  glow?: boolean;
  glowIntensity?: number;
  vignette?: boolean;
  vignetteIntensity?: number;
  grain?: boolean;
  grainIntensity?: number;
  chromaticAberration?: boolean;
  chromaticIntensity?: number;
}

/** Resolved placement for rendering */
export interface ResolvedPlacement {
  text: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  opacity: number;
  color: string;
  font: ResolvedFont;
  charIndex: number;
  segmentIndex?: number;
  pathProgress?: number;
}

/** Text segment with layout info */
export interface TextSegment {
  text: string;
  width: number; // measured width
  chars: CharLayout[];
}

export interface CharLayout {
  char: string;
  x: number; // center-x position relative to word start
  width: number;
  cumulativeX: number; // running total from left edge of word
}
