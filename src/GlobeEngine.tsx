import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three/webgpu';
import {
  MeshPhysicalNodeMaterial,
  MeshBasicNodeMaterial,
  Color,
  CanvasTexture,
  DoubleSide
} from 'three/webgpu';
import {
  Fn,
  texture,
  uv,
  uniform,
  vec2,
  vec3,
  vec4,
  positionLocal,
  time,
  oscSine,
  sin,
  cos,
  mix,
  oneMinus,
  float,
  normalize,
  cameraPosition,
  positionWorld,
  normalWorld,
  pow
} from 'three/tsl';
import { useGenesisStore } from './store';
import gsap from 'gsap';
import { Pane } from 'tweakpane';
import { ADNAInsideBubble } from './ADNAEngine';

const DEFAULT_GLOBE_CONTROLS = {
  textureFlipY: true,
  textureOffsetX: 0,
  textureOffsetY: 0.14,
  textureRepeatX: 1,
  textureRepeatY: 0.72,
  textureRotation: 0,
  innerScale: 0.94,
  globeTiltX: -0.25,
  globeTiltY: 0,
  globeTiltZ: Math.PI,
  autoRotate: false,
  autoRotateSpeed: 0.002,
};

const MULTIPLIED_BUBBLES = [
  { position: [-5.8, 1.4, -1.2], scale: 0.34, rotation: [0.2, -0.6, 0.1], drift: 0.0 },
  { position: [-2.6, -1.5, 1.0], scale: 0.28, rotation: [-0.3, 0.8, -0.1], drift: 1.4 },
  { position: [0.0, 1.1, -0.4], scale: 0.38, rotation: [0.1, 0.2, 0.25], drift: 2.8 },
  { position: [2.9, -1.0, 0.8], scale: 0.3, rotation: [-0.2, -0.7, 0.15], drift: 4.2 },
  { position: [5.6, 1.6, -1.4], scale: 0.32, rotation: [0.35, 0.5, -0.2], drift: 5.6 },
  { position: [1.1, 3.2, -2.2], scale: 0.24, rotation: [-0.4, 1.0, 0.3], drift: 7.0 },
];

// Spherical Mapping TSL Function
const sphericalMapping = Fn(() => {
  const pos = positionLocal;
  const x = pos.x;
  const y = pos.y;

  const theta = x.div(4).add(1).mul(Math.PI);
  const phi = y.div(4).add(1).mul(Math.PI / 2);

  return vec3(
    sin(phi).mul(cos(theta)).mul(4),
    cos(phi).mul(4),
    sin(phi).mul(sin(theta)).mul(4)
  );
});

function StormBubble({
  glassMaterial,
  innerMaterial,
  innerScale,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  dnaDelay = 0,
  showDna = false,
}: {
  glassMaterial: THREE.Material;
  innerMaterial: THREE.Material;
  innerScale: number;
  position?: number[];
  rotation?: number[];
  scale?: number;
  dnaDelay?: number;
  showDna?: boolean;
}) {
  const inverseRotation = [-rotation[0], -rotation[1], -rotation[2]] as [number, number, number];

  return (
    <group position={position as [number, number, number]} rotation={rotation as [number, number, number]} scale={scale}>
      <mesh material={glassMaterial}>
        <planeGeometry args={[8, 8, 128, 128]} />
      </mesh>
      <mesh material={innerMaterial} scale={innerScale}>
        <planeGeometry args={[8, 8, 128, 128]} />
      </mesh>
      <group rotation={inverseRotation}>
        <ADNAInsideBubble delay={dnaDelay} visible={showDna} />
      </group>
    </group>
  );
}

export function GlobeEngine() {
  const phase = useGenesisStore(s => s.phase);
  const environmentCanvas = useGenesisStore(s => s.environmentCanvas);
  const sphereRef = useRef<any>(null);
  const innerRef = useRef<any>(null);
  const groupRef = useRef<any>(null);
  const clusterRef = useRef<any>(null);
  const controlsRef = useRef({ ...DEFAULT_GLOBE_CONTROLS });
  const { camera } = useThree();
  const projectionUniforms = useMemo(() => ({
    offsetX: uniform(DEFAULT_GLOBE_CONTROLS.textureOffsetX),
    offsetY: uniform(DEFAULT_GLOBE_CONTROLS.textureOffsetY),
    repeatX: uniform(DEFAULT_GLOBE_CONTROLS.textureRepeatX),
    repeatY: uniform(DEFAULT_GLOBE_CONTROLS.textureRepeatY),
    rotation: uniform(DEFAULT_GLOBE_CONTROLS.textureRotation),
    flipY: uniform(DEFAULT_GLOBE_CONTROLS.textureFlipY ? -1 : 1),
    rainOpacity: uniform(1),
  }), []);

  // Create CanvasTexture from the EnvironmentEngine's canvas
  const canvasTexture = useMemo(() => {
    if (!environmentCanvas) return null;
    const tex = new CanvasTexture(environmentCanvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.center.set(0.5, 0.5);
    return tex;
  }, [environmentCanvas]);

  // Update texture every frame
  useFrame(() => {
    const controls = controlsRef.current;

    if (canvasTexture) {
      projectionUniforms.offsetX.value = controls.textureOffsetX;
      projectionUniforms.offsetY.value = controls.textureOffsetY;
      projectionUniforms.repeatX.value = controls.textureRepeatX;
      projectionUniforms.repeatY.value = controls.textureRepeatY;
      projectionUniforms.rotation.value = controls.textureRotation;
      projectionUniforms.flipY.value = controls.textureFlipY ? -1 : 1;
      projectionUniforms.rainOpacity.value += ((phase === 10 ? 0.03 : 1) - projectionUniforms.rainOpacity.value) * (phase === 10 ? 0.12 : 0.04);
      canvasTexture.needsUpdate = true;
    }

    if (groupRef.current) {
      groupRef.current.rotation.set(controls.globeTiltX, controls.globeTiltY, controls.globeTiltZ);
    }

    if (innerRef.current) {
      innerRef.current.scale.setScalar(controls.innerScale);
    }

    if (phase >= 8) {
      if (controls.autoRotate && groupRef.current) {
        controls.globeTiltY += controls.autoRotateSpeed;
      }
    }

    if ((phase === 9 || phase === 10) && clusterRef.current) {
      const elapsed = performance.now() * 0.001;
      clusterRef.current.children.forEach((bubble: any, index: number) => {
        const config = MULTIPLIED_BUBBLES[index];
        if (!config) return;

        bubble.position.y = config.position[1] + Math.sin(elapsed * 0.8 + config.drift) * 0.35;
        bubble.rotation.x += 0.0015 + index * 0.00015;
        bubble.rotation.y += 0.0025 + index * 0.0002;
      });
    }
  });

  useEffect(() => {
    if (phase !== 8 && phase !== 9 && phase !== 10) return;

    const pane: any = new Pane({ title: 'Globe Projection' });
    pane.element.style.position = 'absolute';
    pane.element.style.right = '16px';
    pane.element.style.top = '16px';
    pane.element.style.zIndex = '1000';

    const textureFolder = pane.addFolder({ title: 'Canvas texture' });
    textureFolder.addBinding(controlsRef.current, 'textureFlipY', { label: 'flip Y' });
    textureFolder.addBinding(controlsRef.current, 'textureOffsetX', { min: -1, max: 1, step: 0.001, label: 'offset X' });
    textureFolder.addBinding(controlsRef.current, 'textureOffsetY', { min: -1, max: 1, step: 0.001, label: 'offset Y' });
    textureFolder.addBinding(controlsRef.current, 'textureRepeatX', { min: 0.25, max: 2, step: 0.001, label: 'repeat X' });
    textureFolder.addBinding(controlsRef.current, 'textureRepeatY', { min: 0.25, max: 2, step: 0.001, label: 'repeat Y' });
    textureFolder.addBinding(controlsRef.current, 'textureRotation', { min: -Math.PI, max: Math.PI, step: 0.001, label: 'rotation' });

    const globeFolder = pane.addFolder({ title: 'Globe' });
    globeFolder.addBinding(controlsRef.current, 'innerScale', { min: 0.7, max: 1.05, step: 0.001, label: 'inner scale' });
    globeFolder.addBinding(controlsRef.current, 'globeTiltX', { min: -Math.PI, max: Math.PI, step: 0.001, label: 'tilt X' });
    globeFolder.addBinding(controlsRef.current, 'globeTiltY', { min: -Math.PI, max: Math.PI, step: 0.001, label: 'tilt Y' });
    globeFolder.addBinding(controlsRef.current, 'globeTiltZ', { min: -Math.PI, max: Math.PI, step: 0.001, label: 'tilt Z' });
    globeFolder.addBinding(controlsRef.current, 'autoRotate', { label: 'auto rotate' });
    globeFolder.addBinding(controlsRef.current, 'autoRotateSpeed', { min: -0.02, max: 0.02, step: 0.0001, label: 'spin speed' });

    pane.addButton({ title: 'Reset projection' }).on('click', () => {
      Object.assign(controlsRef.current, DEFAULT_GLOBE_CONTROLS);
      pane.refresh();
    });

    return () => pane.dispose();
  }, [phase]);

  // Transition: Zooming out from the "inside" to the Globe view
  const transitionStarted = useRef(false);
  const multiplicationStarted = useRef(false);
  useEffect(() => {
    console.log(`GlobeEngine Effect - Phase: ${phase}, Camera: ${camera.type}`);

    if (phase === 8 && !transitionStarted.current) {
      // Check if we have the right camera
      if (!(camera as any).isPerspectiveCamera) {
        console.log("Waiting for PerspectiveCamera...");
        return;
      }

      console.log("Initiating GSAP Zoom Out");
      transitionStarted.current = true;

      // Start slightly further out
      camera.position.set(0, 0, 1.0);
      camera.lookAt(0, 0, 0);

      const tl = gsap.timeline();

      tl.to(camera.position, {
        z: 15,
        duration: 8,
        ease: "power2.inOut",
        onStart: () => console.log("GSAP Started"),
        onUpdate: () => camera.lookAt(0, 0, 0),
        onComplete: () => console.log("GSAP Finished")
      });

      // Animate the globe scaling up from "nothing" or "inside out"
      if (sphereRef.current) {
        gsap.fromTo(sphereRef.current.scale,
          { x: 0.1, y: 0.1, z: 0.1 },
          { x: 1, y: 1, z: 1, duration: 4, ease: "expo.out" }
        );
      }
    }

    if (phase < 8) {
      transitionStarted.current = false;
    }

    if ((phase === 9 || phase === 10) && !multiplicationStarted.current) {
      if (!(camera as any).isPerspectiveCamera) return;

      multiplicationStarted.current = true;
      gsap.to(camera.position, {
        x: 0,
        y: 0.8,
        z: 19,
        duration: 2.4,
        ease: "power2.out",
        onUpdate: () => camera.lookAt(0, 0, 0),
      });

      if (clusterRef.current) {
        clusterRef.current.children.forEach((bubble: any, index: number) => {
          const targetScale = MULTIPLIED_BUBBLES[index]?.scale ?? 0.3;
          gsap.fromTo(
            bubble.scale,
            { x: 0.02, y: 0.02, z: 0.02 },
            {
              x: targetScale,
              y: targetScale,
              z: targetScale,
              duration: 1.2,
              delay: index * 0.08,
              ease: "back.out(1.8)",
            }
          );
        });
      }
    }

    if (phase < 9) {
      multiplicationStarted.current = false;
    }
  }, [phase, camera]);

  // Glass Material (WebGPU/TSL)
  const glassMaterial = useMemo(() => {
    const mat = new MeshPhysicalNodeMaterial({
      color: new Color('#ffffff'),
      transmission: 0.8, // Slightly less transmission for better refraction visibility
      thickness: 1.5,
      ior: 1.5,
      roughness: 0.1,
      metalness: 0,
      transparent: true,
      side: DoubleSide,
    });

    mat.iridescenceNode = float(0.8);
    mat.iridescenceThicknessNode = float(400);
    mat.positionNode = sphericalMapping();
    mat.normalNode = normalize(positionWorld);

    mat.colorNode = Fn(() => {
      const viewDir = normalize(cameraPosition.sub(positionWorld));
      const NdotV = normalWorld.dot(viewDir).abs();
      const fres = pow(oneMinus(NdotV), float(2.0));
      const baseColor = vec3(0.9, 0.95, 1.0);

      const shimmer = oscSine(time.mul(0.5)).mul(0.05).add(1.0);

      return vec4(mix(baseColor.mul(shimmer), vec3(1.0), fres), mix(float(0.05), float(0.4), fres));
    })();

    return mat;
  }, []);

  // Inner Material (The Rain Texture)
  const innerMaterial = useMemo(() => {
    const mat = new MeshBasicNodeMaterial({
      side: DoubleSide,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending // Stick to Additive for glow without background conflict
    });

    if (canvasTexture) {
      mat.positionNode = sphericalMapping().mul(0.97);
      mat.normalNode = normalize(positionWorld);
      mat.colorNode = Fn(() => {
        const baseUv = uv().sub(vec2(0.5, 0.5));
        const c = cos(projectionUniforms.rotation);
        const s = sin(projectionUniforms.rotation);
        const rotatedUv = vec2(
          baseUv.x.mul(c).sub(baseUv.y.mul(s)),
          baseUv.x.mul(s).add(baseUv.y.mul(c))
        );
        const projectedUv = vec2(
          rotatedUv.x.mul(projectionUniforms.repeatX).add(0.5).add(projectionUniforms.offsetX),
          rotatedUv.y.mul(projectionUniforms.repeatY).mul(projectionUniforms.flipY).add(0.5).add(projectionUniforms.offsetY)
        );
        const texColor = texture(canvasTexture, projectedUv);

        // Hyper-intensity for internal rain projection to punch through reflections
        const brightness = float(35.0);
        return vec4(texColor.rgb.mul(brightness), texColor.a.mul(4.0).mul(projectionUniforms.rainOpacity));
      })();
    }

    return mat;
  }, [canvasTexture, projectionUniforms]);

  if (phase !== 8 && phase !== 9 && phase !== 10) return null;

  const innerScale = controlsRef.current.innerScale;

  return (
    <group ref={groupRef}>
      {phase === 8 && (
        <>
          {/* The Glass Outer Shell */}
          <mesh ref={sphereRef} material={glassMaterial}>
            <planeGeometry args={[8, 8, 128, 128]} />
          </mesh>

          {/* The Internal Rain Simulation Environment */}
          <mesh ref={innerRef} material={innerMaterial}>
            <planeGeometry args={[8, 8, 128, 128]} />
          </mesh>
        </>
      )}

      {(phase === 9 || phase === 10) && (
        <group ref={clusterRef}>
          {MULTIPLIED_BUBBLES.map((bubble, index) => (
            <StormBubble
              key={`${bubble.position.join(',')}-${bubble.drift}`}
              glassMaterial={glassMaterial}
              innerMaterial={innerMaterial}
              innerScale={innerScale}
              position={bubble.position}
              rotation={bubble.rotation}
              scale={bubble.scale}
              dnaDelay={index * 0.08}
              showDna={phase === 10}
            />
          ))}
        </group>
      )}
    </group>
  );
}
