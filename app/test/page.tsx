/* app/test/page.tsx */
"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { GLTFLoader } from "three-stdlib";
import { Center } from "@react-three/drei";
import type * as THREE from "three";

function Model() {
  const gltf = useLoader(GLTFLoader, "/obiwan.glb");
  const ref = useRef<THREE.Group>(null!);

  /* tweak these to taste */
  const bobAmp = 0.05; // amplitude  (units in meters)
  const bobFreq = 0.5; // cycles per second

  useFrame(({ pointer, clock }) => {
    /* -------- mouse tilt (unchanged) -------- */
    const boostY = pointer.y > 0 ? 0.8 : 0.5;
    const targetX = -pointer.y * boostY;
    const targetY = pointer.x * 0.5;

    ref.current.rotation.x += (targetX - ref.current.rotation.x) * 0.08;
    ref.current.rotation.y += (targetY - ref.current.rotation.y) * 0.08;

    /* -------- bobbing motion  ⚡ -------- */
    const t = clock.getElapsedTime(); // seconds since start
    ref.current.position.y = Math.sin(t * bobFreq * Math.PI * 2) * bobAmp;
  });

  return (
    <Center>
      <primitive object={gltf.scene} ref={ref} />
    </Center>
  );
}

export default function TestPage() {
  return (
    <div className="h-full bg-neutral-900 flex items-center justify-center">
      <Canvas
        camera={{ position: [0, 1.2, 3], fov: 45 }}
        dpr={[1, 2]}
        style={{ height: "100vh" }}
      >
        <hemisphereLight args={["#ffffff", "#222222", 1]} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <Suspense fallback={null}>
          <Model />
        </Suspense>
      </Canvas>
    </div>
  );
}
