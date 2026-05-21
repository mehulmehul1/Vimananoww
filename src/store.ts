import { create } from 'zustand';

interface GenesisState {
  phase: number;
  // 0: Void
  // 1: Growth
  // 2: Manifest
  // 3: Ring
  // 4: Fracture
  // 5: Multiply (String)
  // 6: Condense
  // 7: Environment (Weather)
  // 8: Globe (Zoom Out)
  // 9: Globe Multiplication
  // 10: A-DNA Formation
  
  environmentCanvas: HTMLCanvasElement | null;
  phaseTime: number;
  audioActive: boolean;
  params: {
    cloudOpacity: number;
    cloudDriftSpeed: number;
    cloudSpawnChance: number;
    rainSpawnRate: number;
    rainMinSpeed: number;
    rainMaxSpeed: number;
    poolOpacity: number;
  };
  
  setPhase: (phase: number) => void;
  setEnvironmentCanvas: (canvas: HTMLCanvasElement | null) => void;
  advanceTime: (delta: number) => void;
  startAudio: () => void;
}

export const useGenesisStore = create<GenesisState>((set) => ({
  phase: 0,
  environmentCanvas: null,
  phaseTime: 0,
  audioActive: false,
  params: {
    cloudOpacity: 0.8,
    cloudDriftSpeed: 0.6,
    cloudSpawnChance: 0.003,
    rainSpawnRate: 0.5,
    rainMinSpeed: 2.0,
    rainMaxSpeed: 5.5,
    poolOpacity: 0.9,
  },
  
  setPhase: (phase) => set((state) => {
    if (state.phase === phase) return state; // Prevent redundant transitions
    console.log(`Phase transitioning to: ${phase}`);
    if (phase === 7 && state.phase === 8) {
      console.trace("WARNING: Transitioning back from 8 to 7!");
    }
    return { phase, phaseTime: 0 };
  }),
  setEnvironmentCanvas: (environmentCanvas) => set({ environmentCanvas }),
  advanceTime: (delta) => set((state) => ({ phaseTime: state.phaseTime + delta })),
  startAudio: () => set({ audioActive: true, phase: 1 }),
}));
