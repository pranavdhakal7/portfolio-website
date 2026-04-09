import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Float, PerspectiveCamera } from '@react-three/drei';

function Model({ url, onError, ...props }) {
  const { scene, error } = useGLTF(url);
  const meshRef = useRef();
  
  React.useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);
  
  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      
      // Smooth left-right motion
      meshRef.current.rotation.y = Math.sin(t * 1) * 0.6;
      
      // Subtle "coming out" pulsing effect
      meshRef.current.position.z = Math.sin(t * 2) * 0.6;
    }
  });

  React.useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
             child.material.envMapIntensity = 1.5;
          }
        }
      });
    }
  }, [scene]);

  if (error || !scene) return null;

  return (
    <group {...props}>
      <primitive ref={meshRef} object={scene} />
    </group>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 10, 5]} intensity={2} castShadow />
      <pointLight position={[-5, 5, -5]} intensity={1} color="#00eeff" />
      <pointLight position={[5, -5, 5]} intensity={0.5} color="#8000ff" />
    </>
  );
}

export default function Rabbit3DModel({ className = '', style = {} }) {
  const modelUrl = '/assets/images/educat/rabbit.glb';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  return (
    <div className={`rabbit-3d-model ${className}`} style={{
      ...style,
      width: '100%',
      height: '100%',
      transform: 'scale(1.0)' 
    }}>
      {error && (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff6b6b' }}>
          Failed to load 3D model
        </div>
      )}

      <Canvas
        shadows
        style={{ width: '100%', height: '100%', background: 'transparent', opacity: loading ? 0 : 1, transition: 'opacity 0.6s ease' }}
        onCreated={() => setLoading(false)}
        onError={(e) => setError(e)}
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={35} />
          <Float speed={5} rotationIntensity={0.2} floatIntensity={0.1}>
            <Model
              url={modelUrl}
              scale={2.65}
              position={[-0.0653, -1.5, 0.03]}
              onError={(e) => setError(e)}
            />
          </Float>
          <Lights />
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  );
}
