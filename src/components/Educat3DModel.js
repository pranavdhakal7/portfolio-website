import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

function Model({ url, onError, ...props }) {
  const { scene, error } = useGLTF(url);
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  React.useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);
  
  // Add subtle rotation animation
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.rotation.y += 0.002;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      
      // Scale up slightly on hover
      if (hovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.1, 1.1, 1.1), 0.1);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  // Traverse and improve material
  React.useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          
          // Enhance material appearance
          if (child.material) {
            child.material.metalness = 0.2;
            child.material.roughness = 0.5;
            child.material.envMapIntensity = 1;
          }
        }
      });
    }
  }, [scene]);

  if (error) {
    console.error('Failed to load 3D model:', error);
    return null;
  }

  if (!scene) return null;

  return (
    <primitive
      ref={meshRef}
      object={scene}
      {...props}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    />
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#4f46e5" />
      <pointLight position={[5, -5, 5]} intensity={0.3} color="#10b981" />
    </>
  );
}

export default function Educat3DModel({ className = '', style = {} }) {
  const modelUrl = '/assets/images/educat/37.glb';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  return (
    <div className={`educat-3d-model ${className}`} style={style}>
      {error && (
        <div className="model-error" style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ff6b6b',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '50%',
          fontSize: '14px',
          textAlign: 'center',
          padding: '20px'
        }}>
          Failed to load 3D model
        </div>
      )}
      <Canvas
        shadows
        camera={{ position: [0, 0, 4], fov: 45 }}
        style={{ width: '100%', height: '100%', background: 'transparent', opacity: loading ? 0 : 1, transition: 'opacity 0.5s' }}
        onCreated={() => setLoading(false)}
        onError={(e) => {
          console.error('Canvas error:', e);
          setError(e);
        }}
      >
        <Suspense fallback={null}>
          <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
            <Model
              url={modelUrl}
              scale={4.2}
              position={[0, -0.4, 0]}
              onError={(e) => setError(e)}
            />
          </Float>
          <Lights />
          <Environment preset="studio" />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={true}
            autoRotate={true}
            autoRotateSpeed={0.3}
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>
      {loading && !error && (
        <div className="model-loading" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.5)',
          borderRadius: '50%',
          color: '#00eeff',
          fontSize: '14px'
        }}>
          Loading 3D model...
        </div>
      )}
    </div>
  );
}