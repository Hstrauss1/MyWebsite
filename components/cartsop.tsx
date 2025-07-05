"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { GLTFLoader } from "three-stdlib";
import * as THREE from "three";

function Model({ src, xOffset = 0 }: { src: string; xOffset?: number }) {
  const gltf = useLoader(GLTFLoader, src);
  const ref = useRef<THREE.Group>(null!);
  const baseY = useRef(-1.5); // original height

  const bobAmp = 0.05; // vertical bob amplitude
  const bobFreq = 0.5; // bobbing frequency
  const spinSpeed = 0.2; // radians per second

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Bobbing motion around base Y
    ref.current.position.y =
      baseY.current + Math.sin(t * bobFreq * Math.PI * 2) * bobAmp;

    // Smooth spin
    ref.current.rotation.y += spinSpeed * 0.01;
  });

  return (
    <group
      position={[xOffset, baseY.current, 0]}
      scale={[1.5, 1.5, 1.5]}
      ref={ref}
    >
      <primitive object={gltf.scene} />
    </group>
  );
}

export default function TestPage2() {
  return (
    <div className="fullscreen-canvas-container">
      <Canvas
        camera={{ position: [0, 1.2, 4], fov: 45 }}
        dpr={[1, 2]}
        gl={{ alpha: true }}
        style={{ width: "100vw", height: "100vh" }}
      >
        <hemisphereLight args={["#ffffff", "#222222", 1]} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <Suspense fallback={null}>
          <Model src="/cart.glb" xOffset={-1.1} />
          <Model src="/sop.glb" xOffset={+1.1} />
        </Suspense>
      </Canvas>
    </div>
  );
}
