// Phase identifiers for Scene 1 (0-3)
export type Scene1Phase = 0 | 1 | 2 | 3;

// Per-instance data layout for the single InstancedMesh
export interface InstanceData {
  restPosition: [number, number, number]; // target x,y,z
  phaseOffset: number; // time offset per instance
  frequencyBin: number; // which audio freq bin drives this instance
  ghostWordIndex: number; // 0=VIMANA, 1=SHIVA, 2=AUM, 3=NADA
  ghostBlend: number; // 0..1 fade for ghost letter effect
  charIndex: number; // index within the word
}

// Audio pipeline config
export interface AudioConfig {
  fundamentalHz: number;
  overtoneHz: number;
  omHz: number;
  fftSize: number;
  frequencyBins: number;
}

// Cymatic wave source for Phase 0
export interface WaveSource {
  amplitude: number;
  frequency: number;
  phase: number;
}

// Scene 1 state slice
export interface Scene1State {
  phaseProgress: number; // 0..1 within current phase
  transitionProgress: number; // 0..1 for cross-fade between phases
  mouseX: number; // normalized -1..1
  mouseY: number; // normalized -1..1
  mouseLagX: number; // smoothed with 200ms lag
  mouseLagY: number;
  birthTriggered: boolean; // click/tap in Phase 0
  audioFrequencyData: Float32Array; // 32 bins from analyser
  diskExpansionProgress: number; // 0..1 for Phase 0 disk fill
  lobeCount: number; // Current standing wave mode (2..8)
  fragmentAssignments: number[]; // Pre-computed fragment index per character
}