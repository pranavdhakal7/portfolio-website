import React, { Suspense, useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment, Float, PerspectiveCamera, Html } from '@react-three/drei';
import * as THREE from 'three';

function MobileFallback({ className, style }) {
  return (
    <div className={className} style={{
      ...style,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle, rgba(0,238,255,0.08) 0%, rgba(128,0,255,0.04) 50%, transparent 70%)',
        border: '2px solid rgba(0,238,255,0.25)',
        boxShadow: '0 0 40px rgba(0,238,255,0.2), 0 0 80px rgba(128,0,255,0.15), inset 0 0 30px rgba(0,238,255,0.1)',
        position: 'relative',
      }}>
        <img
          src="/assets/images/hero.gif"
          alt="Rabbit 3D Model"
          draggable="false"
          style={{
            width: '110%',
            height: '110%',
            objectFit: 'cover',
            borderRadius: '50%',
            filter: 'brightness(1.05) contrast(1.05)',
          }}
        />
      </div>
    </div>
  );
}

// Preload the model to improve perceived performance
const preloadModel = (url) => {
  return useGLTF.preload(url);
};

function Model({ url, onError, ...props }) {
  const { scene, error } = useGLTF(url, true); // Use Draco compression if available
  const meshRef = useRef();
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
    if (scene) {
      setIsLoaded(true);
    }
  }, [error, onError, scene]);
  
  useFrame((state) => {
    if (meshRef.current && isLoaded) {
      const t = state.clock.getElapsedTime();
      
      // Smooth left-right motion - reduced complexity
      meshRef.current.rotation.y = Math.sin(t * 2.8) * 0.4;
      
      // Subtle "coming out" pulsing effect - reduced intensity
      meshRef.current.position.z = Math.sin(t * 2.49) * 0.455;
    }
  });

  useEffect(() => {
    if (scene) {
      let processedCount = 0;
      scene.traverse((child) => {
        if (child.isMesh) {
          // Only enable shadows for important meshes
          child.castShadow = processedCount < 10; // Limit shadow casting
          child.receiveShadow = processedCount < 5; // Limit shadow receiving
          
          // Simplify materials
          if (child.material) {
            child.material.envMapIntensity = 1.2;
            // Reduce material complexity
            if (child.material instanceof THREE.MeshStandardMaterial) {
              child.material.roughness = 0.7;
              child.material.metalness = 0.1;
            }
          }
          
          // Simplify geometry if possible
          if (child.geometry && child.geometry.attributes.position &&
              child.geometry.attributes.position.count > 5000) {
            // Note: In a real scenario, we'd decimate the geometry
            // For now, we just flag it for optimization
          }
          processedCount++;
        }
      });
      
      // Dispose of unused resources when component unmounts
      return () => {
        // GLTF loader will handle disposal automatically
      };
    }
  }, [scene]);

  if (error) {
    console.error('Failed to load 3D model:', error);
    return null;
  }

  if (!scene || !isLoaded) {
    return (
      <Html center>
        <div className="model-loading-spinner" style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(0, 238, 255, 0.3)',
          borderTop: '3px solid #00eeff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </Html>
    );
  }

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

function Rabbit3DModelInner({ className = '', style = {} }) {
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
              scale={2.4}
              position={[-0.0053, -1.4, 0.02]}
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

export default function Rabbit3DModel({ className = '', style = {} }) {
  const [isMobile, setIsMobile] = useState(null);
  
  useEffect(() => {
    setIsMobile(window.innerWidth <= 900);
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  if (isMobile === null) return null;
  
  if (isMobile) {
    return <MobileFallback className={`rabbit-3d-model ${className}`} style={style} />;
  }
  
  return <Rabbit3DModelInner className={className} style={style} />;
}

