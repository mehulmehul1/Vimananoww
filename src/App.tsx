import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { WebGPURenderer } from 'three/webgpu';
import { PerspectiveCamera, OrthographicCamera, OrbitControls, Environment } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useGenesisStore } from './store';
import { CosmicEngine } from './CosmicEngine';
import { EnvironmentEngine } from './EnvironmentEngine';
import { GlobeEngine } from './GlobeEngine';
import { Act1Scene } from './scene1/Act1Scene';
import { DesignReview } from './layouts/DesignReview';
import { AssetGenerator } from './pretext-editor/AssetGenerator';

function Orchestrator() {
  const phase = useGenesisStore(s => s.phase);
  const setPhase = useGenesisStore(s => s.setPhase);
  const phaseTime = useGenesisStore(s => s.phaseTime);
  const advanceTime = useGenesisStore(s => s.advanceTime);

  useFrame((_, delta) => {
    // Single source of truth for time-based transitions
    if (phase >= 1 && phase <= 6) {
      advanceTime(delta);
    }

    // Defensive transition logic
    switch(phase) {
      case 1: if (phaseTime > 2.0) setPhase(2); break;
      case 2: if (phaseTime > 2.5) setPhase(3); break;
      case 3: if (phaseTime > 4.0) setPhase(4); break;
      case 4: if (phaseTime > 2.0) setPhase(5); break;
      case 5: if (phaseTime > 3.0) setPhase(6); break;
      case 6: if (phaseTime > 6.0) {
        console.log("Orchestrator: Phase 6 complete, moving to 7");
        setPhase(7);
      } break;
    }
  });

  return null;
}

function WebGPUCanvas({ children }: { children: React.ReactNode }) {
  const phase = useGenesisStore(s => s.phase);

  return (
    <Canvas
      gl={async (props) => {
        const renderer = new WebGPURenderer({
          ...props,
          antialias: true,
          alpha: true,
          forceWebGL: false,
        } as any);

        renderer.setClearColor(0xffffff, 1);
        await renderer.init();
        return renderer;
      }}
      dpr={window.devicePixelRatio}
      style={{ position: 'absolute', inset: 0, pointerEvents: phase >= 8 || phase === 0 ? 'auto' : 'none' }}
    >
      <color attach="background" args={['#ffffff']} />
      <Environment preset="city" />
      {children}
    </Canvas>
  );
}

function AppInner({ hash }: { hash: string }) {
  const mode = hash === '#scroll' ? 'scroll' : 'time';
  return <Act1Scene mode={mode} />;
}

export default function App() {
  const [hash, setHash] = useState(window.location.hash || '#time');

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash || '#time');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // #/editor → Asset Generator (pretext editor)
  if (hash === '#/editor') {
    return <AssetGenerator />;
  }

  if (hash === '#/design-review') {
    return <DesignReview />;
  }

  // #/act2 → Act 2: Start directly from Scene index 5 (Genetic frame)
  if (hash === '#/act2') {
    return <Act1Scene mode="scroll" initialScene={5} />;
  }

  return <AppInner hash={hash} />;
}
