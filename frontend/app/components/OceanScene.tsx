"use client";

import { useRef, useMemo, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ═══════════════════════════════════════════
   God Rays — Warm volumetric light shafts
   Japanese underwater atmosphere (bright + serene)
   ═══════════════════════════════════════════ */
function GodRays() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame(({ clock }) => {
    if (mat.current) mat.current.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <mesh position={[0, 10, -6]} rotation={[0.35, 0, 0]}>
      <planeGeometry args={[35, 25, 1, 1]} />
      <shaderMaterial
        ref={mat}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
        `}
        fragmentShader={`
          uniform float uTime;
          varying vec2 vUv;

          float ray(vec2 uv, float offset, float speed, float width) {
            float x = uv.x + offset + sin(uTime * speed + uv.y * 2.5) * 0.06;
            return smoothstep(width, 0.0, abs(x - 0.5)) * smoothstep(0.0, 0.45, uv.y);
          }

          void main() {
            float r = 0.0;
            r += ray(vUv, 0.0, 0.25, 0.12) * 0.55;
            r += ray(vUv, -0.22, 0.18, 0.09) * 0.45;
            r += ray(vUv, 0.17, 0.22, 0.10) * 0.50;
            r += ray(vUv, -0.38, 0.12, 0.08) * 0.35;
            r += ray(vUv, 0.32, 0.30, 0.13) * 0.40;
            r += ray(vUv, 0.07, 0.15, 0.06) * 0.30;

            // Ecco-style deep blue → ethereal teal rays
            vec3 deepBlue = vec3(0.10, 0.35, 0.75);
            vec3 teal = vec3(0.20, 0.80, 0.70);
            vec3 color = mix(deepBlue, teal, r * 0.35 + vUv.y * 0.08);

            float fade = smoothstep(0.0, 0.2, vUv.x) * smoothstep(1.0, 0.8, vUv.x);
            float alpha = r * 0.30 * (1.0 - vUv.y * 0.25) * fade;

            gl_FragColor = vec4(color, alpha);
          }
        `}
      />
    </mesh>
  );
}

/* ═══════════════════════════════════════════
   Caustics — Dappled light on the ocean floor
   ═══════════════════════════════════════════ */
function Caustics() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  useFrame(({ clock }) => { if (mat.current) mat.current.uniforms.uTime.value = clock.getElapsedTime(); });

  return (
    <mesh position={[0, -5, -4]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[50, 50, 1, 1]} />
      <shaderMaterial
        ref={mat} transparent depthWrite={false} uniforms={uniforms}
        vertexShader={`varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`}
        fragmentShader={`
          uniform float uTime;
          varying vec2 vUv;

          float caustic(vec2 uv, float t) {
            vec2 p = uv * 6.0;
            float a = sin(p.x * 1.5 + t * 0.7) * sin(p.y * 1.2 + t * 0.5);
            float b = sin(p.x * 0.9 - t * 0.45) * sin(p.y * 1.7 + t * 0.35);
            float c = sin(p.x * 2.0 + t * 0.6) * sin(p.y * 0.8 - t * 0.8);
            return (a + b + c) * 0.33;
          }

          void main() {
            float c = caustic(vUv, uTime * 0.5);
            c = smoothstep(0.05, 0.45, c);
            // Ecco caustics — blue-teal with purple hints
            vec3 color = mix(vec3(0.06, 0.30, 0.65), vec3(0.20, 0.75, 0.70), c);
            gl_FragColor = vec4(color, c * 0.14);
          }
        `}
      />
    </mesh>
  );
}

/* ═══════════════════════════════════════════
   Sparkle Particles — Bioluminescent dust
   ═══════════════════════════════════════════ */
function Sparkles({ count = 120 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const { positions, speeds, offsets } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const offsets = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 28;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16 - 3;
      speeds[i] = 0.08 + Math.random() * 0.35;
      offsets[i] = Math.random() * Math.PI * 2;
    }
    return { positions, speeds, offsets };
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    const t = clock.getElapsedTime();
    for (let i = 0; i < count; i++) {
      pos[i * 3] += Math.sin(t * speeds[i] + offsets[i]) * 0.002;
      pos[i * 3 + 1] += speeds[i] * 0.003;
      pos[i * 3 + 2] += Math.cos(t * speeds[i] * 0.4 + offsets[i]) * 0.001;
      if (pos[i * 3 + 1] > 9) pos[i * 3 + 1] = -9;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        {/* @ts-ignore - R3F bufferAttribute typing quirk */}
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#77ccff"
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ═══════════════════════════════════════════
   Kelp Forest — Organic, flowing strands
   ═══════════════════════════════════════════ */
function KelpStrand({ position, height = 4, color = "#22dd66" }: {
  position: [number, number, number]; height?: number; color?: string;
}) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(color) },
    uHeight: { value: height },
  }), [color, height]);

  useFrame(({ clock }) => { if (mat.current) mat.current.uniforms.uTime.value = clock.getElapsedTime(); });

  return (
    <mesh position={position}>
      <planeGeometry args={[0.45, height, 1, 12]} />
      <shaderMaterial
        ref={mat} transparent side={THREE.DoubleSide} depthWrite={false} uniforms={uniforms}
        vertexShader={`
          uniform float uTime; uniform float uHeight; varying vec2 vUv; varying float vY;
          void main() {
            vUv = uv; vY = position.y / uHeight + 0.5;
            vec3 pos = position;
            // Organic multi-frequency sway
            float sway = sin(uTime * 0.8 + position.y * 1.0) * vY * vY * 0.7;
            sway += sin(uTime * 1.3 + position.y * 0.5 + 1.5) * vY * 0.35;
            sway += sin(uTime * 0.4 + position.y * 2.0) * vY * vY * 0.15;
            pos.x += sway;
            pos.z += cos(uTime * 0.6 + position.y * 0.8) * vY * 0.18;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uColor; varying vec2 vUv; varying float vY;
          void main() {
            float edge = smoothstep(0.0, 0.3, vUv.x) * smoothstep(1.0, 0.7, vUv.x);
            float tip = smoothstep(1.0, 0.55, vY);
            float alpha = edge * tip * 0.75;
            // Rich gradient — deep at base, luminous at tips
            vec3 col = mix(uColor * 0.5, uColor * 1.5, vY);
            // Add subtle bioluminescent glow at tips
            col += vec3(0.1, 0.3, 0.15) * vY * vY;
            gl_FragColor = vec4(col, alpha);
          }
        `}
      />
    </mesh>
  );
}

function KelpForest() {
  const strands = useMemo(() => {
    const s: { pos: [number, number, number]; h: number; color: string }[] = [];
    // Ecco-style kelp: the ocean green Zac loves — slightly more teal than pure green
    const colors = ["#1ecf6a", "#30e08a", "#22c870", "#3adf95", "#1cc465", "#45e5a0", "#18b85a"];
    for (let i = 0; i < 16; i++) {
      const x = (Math.random() - 0.5) * 26;
      const z = -2 - Math.random() * 12;
      const h = 2 + Math.random() * 5.5;
      s.push({ pos: [x, -5 + h / 2, z], h, color: colors[Math.floor(Math.random() * colors.length)] });
    }
    return s;
  }, []);

  return <>{strands.map((s, i) => <KelpStrand key={i} position={s.pos} height={s.h} color={s.color} />)}</>;
}

/* ═══════════════════════════════════════════
   Bubbles — Glass-like rising orbs
   ═══════════════════════════════════════════ */
function Bubbles({ count = 22 }: { count?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const data = useMemo(() => Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * 22,
    y: -6 + Math.random() * 14,
    z: -1 - Math.random() * 10,
    speed: 0.25 + Math.random() * 0.55,
    scale: 0.03 + Math.random() * 0.1,
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: 0.3 + Math.random() * 0.7,
  })), [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    data.forEach((b, i) => {
      b.y += b.speed * 0.02;
      if (b.y > 11) b.y = -6;
      dummy.position.set(
        b.x + Math.sin(t * b.wobbleSpeed + b.wobble) * 0.4,
        b.y,
        b.z + Math.cos(t * b.wobbleSpeed * 0.6 + b.wobble) * 0.2
      );
      dummy.scale.setScalar(b.scale);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 6]} />
      <meshPhysicalMaterial
        color="#88ccff"
        transparent
        opacity={0.2}
        roughness={0}
        metalness={0.05}
        transmission={0.85}
        thickness={0.4}
        envMapIntensity={0.3}
      />
    </instancedMesh>
  );
}

/* ═══════════════════════════════════════════
   Deep Water Haze — Depth fog layer
   ═══════════════════════════════════════════ */
function DeepHaze() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  useFrame(({ clock }) => { if (mat.current) mat.current.uniforms.uTime.value = clock.getElapsedTime(); });

  return (
    <mesh position={[0, -3, -12]}>
      <planeGeometry args={[60, 30, 1, 1]} />
      <shaderMaterial
        ref={mat} transparent depthWrite={false} uniforms={uniforms}
        vertexShader={`varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`}
        fragmentShader={`
          uniform float uTime;
          varying vec2 vUv;
          void main() {
            float wave = sin(vUv.x * 3.0 + uTime * 0.15) * 0.02 + sin(vUv.x * 7.0 - uTime * 0.1) * 0.01;
            float y = vUv.y + wave;
            float fog = smoothstep(0.7, 0.0, y) * 0.12;
            // Ecco deep haze — inky blue with purple undertones
            vec3 color = mix(vec3(0.02, 0.05, 0.16), vec3(0.06, 0.10, 0.22), y);
            gl_FragColor = vec4(color, fog);
          }
        `}
      />
    </mesh>
  );
}

/* ═══════════════════════════════════════════
   Atmosphere
   ═══════════════════════════════════════════ */
function OceanFog() {
  const { scene } = useThree();
  useEffect(() => {
    // Ecco deep ocean — inky blue-black, not green-black
    scene.fog = new THREE.FogExp2("#040a1a", 0.028);
    scene.background = new THREE.Color("#040a1a");
  }, [scene]);
  return null;
}

function CameraDrift() {
  const { camera } = useThree();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    camera.position.x = Math.sin(t * 0.06) * 0.5;
    camera.position.y = Math.sin(t * 0.04) * 0.35 + 0.5;
    camera.lookAt(0, 0, -5);
  });
  return null;
}

/* ═══════════════════════════════════════════
   Scene Composition
   ═══════════════════════════════════════════ */
function Scene({ isMobile = false }: { isMobile?: boolean }) {
  return (
    <>
      <OceanFog />
      <CameraDrift />

      {/* Lighting — Ecco style: cool blue + ethereal purple + teal accents */}
      <ambientLight intensity={0.18} color="#4488bb" />
      <directionalLight position={[3, 12, 4]} intensity={0.4} color="#aaddff" />
      <pointLight position={[5, 7, -2]} intensity={0.5} color="#33bbcc" distance={22} decay={2} />
      <pointLight position={[-6, 4, -5]} intensity={0.35} color="#6644aa" distance={20} decay={2} />
      {!isMobile && <pointLight position={[0, -3, -1]} intensity={0.2} color="#55aadd" distance={14} decay={2} />}
      {!isMobile && <pointLight position={[2, -6, -3]} intensity={0.12} color="#8855cc" distance={15} decay={2} />}

      <GodRays />
      <Caustics />
      {!isMobile && <DeepHaze />}
      <Sparkles count={isMobile ? 50 : 120} />
      <KelpForest />
      <Bubbles count={isMobile ? 10 : 22} />
    </>
  );
}

/* ═══════════════════════════════════════════
   Loading
   ═══════════════════════════════════════════ */
function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-0 flex items-center justify-center" style={{ background: '#040a1a' }}>
      <div className="text-5xl" style={{ animation: 'float-gentle 3s ease-in-out infinite' }}>🌿</div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Export
   ═══════════════════════════════════════════ */
export default function OceanScene() {
  // Detect mobile / low-power for adaptive quality
  const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || navigator.hardwareConcurrency <= 4);

  return (
    <div className="fixed inset-0 z-0 fixed-scene">
      <Suspense fallback={<LoadingScreen />}>
        <Canvas
          camera={{ position: [0, 0.5, 5], fov: 58, near: 0.1, far: 50 }}
          dpr={isMobile ? 1 : [1, Math.min(window.devicePixelRatio, 1.5)]}
          gl={{
            antialias: false,
            alpha: false,
            powerPreference: "high-performance",
            stencil: false,
            depth: true,
            failIfMajorPerformanceCaveat: true,
          }}
          style={{ background: "#040a1a" }}
          frameloop="always"
          flat // disable tone mapping for perf
        >
          <Scene isMobile={isMobile} />
        </Canvas>
      </Suspense>
    </div>
  );
}
