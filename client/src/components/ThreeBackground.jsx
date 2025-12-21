import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';

const Shape = ({ position, color, type, speed = 1, distort = 0.4 }) => {
    const mesh = useRef();

    useFrame((state) => {
        if (!mesh.current) return;
        const time = state.clock.getElapsedTime();
        mesh.current.rotation.x = Math.cos(time / 4) * 0.2;
        mesh.current.rotation.y = Math.sin(time / 4) * 0.2;
        mesh.current.position.y = position[1] + Math.sin(time / 2) * 0.1;
    });

    return (
        <Float speed={speed} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh position={position} ref={mesh}>
                {type === 'sphere' && <sphereGeometry args={[1, 64, 64]} />}
                {type === 'torus' && <torusGeometry args={[0.8, 0.3, 16, 100]} />}
                {type === 'octahedron' && <octahedronGeometry args={[1, 0]} />}
                <MeshDistortMaterial
                    color={color}
                    speed={speed * 2}
                    distort={distort}
                    radius={1}
                    metalness={0.6}
                    roughness={0.2}
                    opacity={0.4}
                    transparent
                />
            </mesh>
        </Float>
    );
};

const Scene = () => {
    const { viewport, mouse } = useThree();
    const group = useRef();

    useFrame(() => {
        if (group.current) {
            // Smooth parallax based on mouse
            group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, (mouse.x * Math.PI) / 10, 0.1);
            group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, (mouse.y * Math.PI) / -10, 0.1);
        }
    });

    const shapes = useMemo(() => [
        { type: 'torus', position: [4, 2, -5], color: '#6366f1', speed: 1, distort: 0.3 },
        { type: 'sphere', position: [-5, -2, -8], color: '#06b6d4', speed: 1.5, distort: 0.5 },
        { type: 'octahedron', position: [6, -3, -10], color: '#a855f7', speed: 0.8, distort: 0.2 },
        { type: 'torus', position: [-8, 4, -12], color: '#3b82f6', speed: 1.2, distort: 0.4 },
        { type: 'sphere', position: [0, 5, -15], color: '#2dd4bf', speed: 2, distort: 0.6 },
    ], []);

    return (
        <group ref={group}>
            {shapes.map((props, i) => (
                <Shape key={i} {...props} />
            ))}
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        </group>
    );
};

const ThreeBackground = () => {
    return (
        <div className="fixed inset-0 -z-10 bg-[#030014] overflow-hidden pointer-events-none">
            {/* Base Gradient Layer */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#030014_80%)] opacity-60" />

            <Canvas dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
                <React.Suspense fallback={null}>
                    <Scene />
                    {/* subtle environment for reflection */}
                    <Environment preset="night" />
                </React.Suspense>
            </Canvas>

            {/* Post-processing-like CSS overlay */}
            <div className="absolute inset-0 backdrop-blur-[1px] pointer-events-none" />
        </div>
    );
};

export default ThreeBackground;
