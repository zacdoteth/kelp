"use client";

import { useRef, useMemo, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ─── God Rays (volumetric light shafts from surface) ───
function GodRays() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  );

  useFrame(({ clock }) => {
    if (mat.current) mat.current.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <mesh ref={meshRef} position={[0, 8, -5]} rotation={[0.3, 0, 0]}>
      <planeGeometry args={[30, 20, 1, 1]} />
      <shaderMaterial
        ref={mat}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          varying vec2 vUv;
          
          float ray(vec2 uv, float offset, float speed, float width) {
            float x = uv.x + offset + sin(uTime * speed + uv.y * 3.0) * 0.05;
            return smoothstep(width, 0.0, abs(x - 0.5)) * smoothstep(0.0, 0.3, uv.y);
          }
          
          void main() {
            float r = 0.0;
            r += ray(vUv, 0.0, 0.3, 0.08) * 0.5;
            r += ray(vUv, -0.2, 0.2, 0.06) * 0.35;
            r += ray(vUv, 0.15, 0.25, 0.07) * 0.4;
            r += ray(vUv, -0.35, 0.15, 0.05) * 0.25;
            r += ray(vUv, 0.3, 0.35, 0.09) * 0.3;
            r += ray(vUv, -0.1, 0.4, 0.04) * 0.2;
            
            vec3 color = mix(vec3(0.0, 0.6, 0.5), vec3(0.0, 1.0, 0.85), r);
            float alpha = r * 0.25 * (1.0 - vUv.y * 0.5);
            gl_FragColor = vec4(color, alpha);
          }
        `}
      />
    </mesh>
  );
}

// ─── Caustic light patterns on the floor ───
function Caustics() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  );

  useFrame(({ clock }) => {
    if (mat.current) mat.current.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <mesh ref={meshRef} position={[0, -4, -3]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[40, 40, 1, 1]} />
      <shaderMaterial
        ref={mat}
        transparent
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          varying vec2 vUv;
          
          float caustic(vec2 uv, float t) {
            vec2 p = uv * 6.0;
            float a = sin(p.x * 1.5 + t * 0.7) * sin(p.y * 1.2 + t * 0.5);
            float b = sin(p.x * 0.8 - t * 0.4) * sin(p.y * 1.8 + t * 0.3);
            float c = sin(p.x * 2.1 + t * 0.6) * sin(p.y * 0.7 - t * 0.8);
            return (a + b + c) * 0.33;
          }
          
          void main() {
            float c = caustic(vUv, uTime * 0.5);
            c = smoothstep(0.1, 0.6, c);
            vec3 color = vec3(0.0, 0.9, 0.7) * c;
            gl_FragColor = vec4(color, c * 0.12);
          }
        `}
      />
    </mesh>
  );
}

// ─── Floating Particles (plankton/sediment) ───
function Particles({ count = 80 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const { positions, speeds, offsets } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const offsets = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
      speeds[i] = 0.1 + Math.random() * 0.3;
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
      pos[i * 3 + 2] += Math.cos(t * speeds[i] * 0.5 + offsets[i]) * 0.001;
      if (pos[i * 3 + 1] > 10) pos[i * 3 + 1] = -10;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#00ffd5"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── 3D Kelp Strands (vertex shader animated) ───
function KelpStrand({ position, height = 4, color = "#16a34a" }: {
  position: [number, number, number];
  height?: number;
  color?: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uHeight: { value: height },
    }),
    [color, height]
  );

  useFrame(({ clock }) => {
    if (mat.current) mat.current.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[0.3, height, 1, 16]} />
      <shaderMaterial
        ref={mat}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={`
          uniform float uTime;
          uniform float uHeight;
          varying vec2 vUv;
          varying float vY;
          
          void main() {
            vUv = uv;
            vY = position.y / uHeight + 0.5;
            
            vec3 pos = position;
            float sway = sin(uTime * 0.8 + position.y * 1.5) * vY * vY * 0.6;
            sway += sin(uTime * 1.2 + position.y * 0.8) * vY * 0.3;
            pos.x += sway;
            pos.z += cos(uTime * 0.6 + position.y * 1.2) * vY * 0.15;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          varying vec2 vUv;
          varying float vY;
          
          void main() {
            float edge = smoothstep(0.0, 0.3, vUv.x) * smoothstep(1.0, 0.7, vUv.x);
            float tip = smoothstep(1.0, 0.7, vY);
            float alpha = edge * tip * 0.7;
            
            vec3 col = mix(uColor * 0.5, uColor * 1.5, vY);
            col += vec3(0.0, 0.3, 0.2) * (1.0 - vY);
            
            gl_FragColor = vec4(col, alpha);
          }
        `}
      />
    </mesh>
  );
}

// ─── Kelp Forest (multiple strands) ───
function KelpForest() {
  const strands = useMemo(() => {
    const s: { pos: [number, number, number]; h: number; color: string }[] = [];
    const colors = ["#16a34a", "#22c55e", "#15803d", "#0d9448", "#1a8a50"];
    for (let i = 0; i < 10; i++) {
      const x = (Math.random() - 0.5) * 24;
      const z = -3 - Math.random() * 12;
      const h = 2 + Math.random() * 5;
      s.push({
        pos: [x, -4 + h / 2, z],
        h,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    return s;
  }, []);

  return (
    <>
      {strands.map((s, i) => (
        <KelpStrand key={i} position={s.pos} height={s.h} color={s.color} />
      ))}
    </>
  );
}

// ─── Bubbles (3D spheres rising) ───
function Bubbles3D({ count = 15 }: { count?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const data = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 20,
      y: -5 + Math.random() * 15,
      z: -2 - Math.random() * 10,
      speed: 0.2 + Math.random() * 0.5,
      scale: 0.02 + Math.random() * 0.08,
      wobble: Math.random() * Math.PI * 2,
    }));
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    data.forEach((b, i) => {
      b.y += b.speed * 0.02;
      if (b.y > 10) b.y = -5;
      dummy.position.set(
        b.x + Math.sin(t * 0.5 + b.wobble) * 0.3,
        b.y,
        b.z
      );
      dummy.scale.setScalar(b.scale);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshPhysicalMaterial
        color="#00ffd5"
        transparent
        opacity={0.15}
        roughness={0}
        metalness={0}
        transmission={0.9}
        thickness={0.5}
      />
    </instancedMesh>
  );
}

// ─── Depth Fog / Atmosphere ───
function OceanFog() {
  const { scene } = useThree();
  useEffect(() => {
    scene.fog = new THREE.FogExp2("#040d0a", 0.04);
    scene.background = new THREE.Color("#040d0a");
  }, [scene]);
  return null;
}

// ─── Camera gentle drift ───
function CameraDrift() {
  const { camera } = useThree();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    camera.position.x = Math.sin(t * 0.1) * 0.5;
    camera.position.y = Math.sin(t * 0.08) * 0.3;
    camera.lookAt(0, 0, -5);
  });
  return null;
}

// ─── Main Scene ───
function Scene() {
  return (
    <>
      <OceanFog />
      <CameraDrift />

      {/* Ambient deep ocean light */}
      <ambientLight intensity={0.15} color="#00ffd5" />

      {/* Surface light from above */}
      <directionalLight position={[0, 10, 0]} intensity={0.3} color="#00e5a0" />
      <pointLight position={[3, 6, -2]} intensity={0.5} color="#00ffd5" distance={20} decay={2} />
      <pointLight position={[-4, 4, -5]} intensity={0.3} color="#22c55e" distance={15} decay={2} />

      <GodRays />
      <Caustics />
      <Particles count={80} />
      <KelpForest />
      <Bubbles3D count={15} />
    </>
  );
}

// ─── Loading Screen ───
function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-0 bg-[#040d0a] flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-3 animate-bounce">🌿</div>
        <div className="text-[#00ffd5]/40 text-sm font-mono">diving deeper...</div>
      </div>
    </div>
  );
}

// ─── Exported Component ───
export default function OceanScene() {
  return (
    <div className="fixed inset-0 z-0">
      <Suspense fallback={<LoadingScreen />}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 60, near: 0.1, far: 100 }}
          dpr={[1, typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 1.5]}
          gl={{
            antialias: false,
            alpha: false,
            powerPreference: "high-performance",
            stencil: false,
            depth: true,
          }}
          style={{ background: "#040d0a" }}
          frameloop="always"
        >
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  );
}
