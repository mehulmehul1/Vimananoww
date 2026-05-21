import type { Scene1Phase, AudioConfig } from './types';

export const PHASE_DURATIONS: Record<Scene1Phase, number> = {
  0: 5000,  // 5s — Seed/Disk (unchanged)
  1: 3500,  // 3.5s — Ring formation (was 3000, +500ms for morph)
  2: 4000,  // 4s — Standing wave (unchanged)
  3: 5500,  // 5.5s — Fragmentation (was 5000, +500ms for separation)
} as const;

export const CYMATIC_CONFIG = {
  DISK_MAX_RINGS: 18,            // Max concentric rings in Phase 0
  DISK_RING_SPACING: 18,         // Pixels between rings
  DISK_EXPANSION_DURATION: 2000, // ms for disk to fully expand
  RING_RADIUS: 160,              // Ring radius for Phase 1 (moved from engineState)
  RING_MORPH_DURATION: 2000,     // ms for disk→ring morph
  LOBE_MODE_START: 2,            // Initial lobe count
  LOBE_MODE_END: 8,              // Final lobe count
  LOBE_AMPLITUDE_MAX: 80,        // Max lobe displacement in pixels
  FRAGMENT_COUNT: 8,             // Number of fragments in Phase 3
  FRAGMENT_DRIFT: 40,            // Pixels of outward drift
  FRAGMENT_LOCAL_ORBIT: 15,      // Local orbit radius within fragment
} as const;

export const FONT_FAMILY = 'Space Grotesk';
export const FONT_SIZE_PX = 48;
export const FONT_WEIGHT = 700;
export const FONT_STRING = `${FONT_WEIGHT} ${FONT_SIZE_PX}px '${FONT_FAMILY}', sans-serif`;

export const GHOST_WORDS = ['VIMANA', 'SHIVA', 'AUM', 'NADA'] as const;

export const VOID_COLOR = '#fafcfd';
export const EMISSIVE_COLOR = '#00D4FF';
export const GHOST_COLOR = '#5E5E5E';

export const AUDIO_CONFIG: AudioConfig = {
  fundamentalHz: 40,
  overtoneHz: 80,
  omHz: 136.1,
  fftSize: 64,
  frequencyBins: 32,
} as const;

export const MAX_INSTANCES = 256;
export const INSTANCE_STRIDE = 8; // floats per instance