import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Float, Html, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function Model({ url, onError, ...props }) {
  const { scene, error } = useGLTF(url, true); // Enable Draco compression
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
    if (scene) {
      scene.scale.set(6, 6, 6); // THIS actually enlarges the model
      setIsLoaded(true);
    }
  }, [error, onError, scene]);
  
  // Add subtle rotation animation - reduced intensity for performance
  useFrame((state) => {
    if (meshRef.current && isLoaded) {
      // Gentle floating animation - slower for performance
      meshRef.current.rotation.y += 0.0015;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.03;
      
      // Scale up slightly on hover - simplified interpolation
      if (hovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.05, 1.05, 1.05), 0.05);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.05);
      }
    }
  });

  // Traverse and optimize material
  useEffect(() => {
    if (scene) {
      let meshCount = 0;
      scene.traverse((child) => {
        if (child.isMesh) {
          // Limit shadow casting to first few meshes for performance
          child.castShadow = meshCount < 8;
          child.receiveShadow = meshCount < 4;
          
          // Optimize material appearance
          if (child.material) {
            child.material.metalness = 0.15;
            child.material.roughness = 0.6;
            child.material.envMapIntensity = 0.8;
            
            // Simplify materials for performance
            if (child.material instanceof THREE.MeshStandardMaterial) {
              child.material.dithering = false;
            }
          }
          
          // Consider simplifying geometry if too complex
          if (child.geometry && child.geometry.attributes.position &&
              child.geometry.attributes.position.count > 10000) {
            // Flag for optimization - in production you might decimate here
          }
          meshCount++;
        }
      });
      
      return () => {
        // Cleanup handled by GLTF loader
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
          width: '30px',
          height: '30px',
          border: '2px solid rgba(79, 70, 229, 0.3)',
          borderTop: '2px solid #4f46e5',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </Html>
    );
  }

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
  const [isVisible, setIsVisible] = useState(false);
  
  // Use Intersection Observer to lazy load the 3D model
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );
    
    const element = document.querySelector('.educat-3d-model');
    if (element) {
      observer.observe(element);
    }
    
    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);
  
  // Preload the model when component becomes visible
  useEffect(() => {
    if (isVisible) {
      import('@react-three/drei').then(({ useGLTF }) => {
        useGLTF.preload(modelUrl);
      });
    }
  }, [isVisible, modelUrl]);
  
  return (
    <div className={`educat-3d-model ${className}`} style={{
      ...style,
      position: 'relative',
      minHeight: '250px' // Ensure space for loading
    }}>
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
      
      {!isVisible ? (
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.1)',
          borderRadius: '50%'
        }}>
          <div className="model-loading-spinner" style={{
            width: '30px',
            height: '30px',
            border: '2px solid rgba(79, 70, 229, 0.3)',
            borderTop: '2px solid #4f46e5',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
      ) : (
        <>
          <Canvas
            shadows
            dpr={[1, 1.5]} // Lower DPR for performance
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: 'high-performance',
              stencil: false,
              depth: true
            }}
            style={{ width: '100%', height: '100%', background: 'transparent', opacity: loading ? 0 : 1, transition: 'opacity 0.5s' }}
            onCreated={({ gl }) => {
              setLoading(false);
              // Performance optimizations
              gl.setClearColor(0x000000, 0);
              gl.shadowMap.enabled = true;
              gl.shadowMap.type = THREE.PCFSoftShadowMap;
              gl.shadowMap.autoUpdate = false; // Manual shadow updates for performance
              gl.shadowMap.needsUpdate = true;
            }}
            onError={(e) => {
              console.error('Canvas error:', e);
              setError(e);
            }}
          >
            <Suspense fallback={
              <Html center>
                <div className="model-loading-spinner" style={{
                  width: '30px',
                  height: '30px',
                  border: '2px solid rgba(79, 70, 229, 0.3)',
                  borderTop: '2px solid #4f46e5',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
              </Html>
            }>
              <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={45} />
              <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.3}>
                <Model
                  url={modelUrl}
                  scale={4.2}
                  position={[0, -0.4, 0]}
                  onError={(e) => setError(e)}
                />
              </Float>
              <Lights />
              <Environment preset="city" /> {/* Lighter than studio */}
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                enableRotate={true}
                autoRotate={true}
                autoRotateSpeed={0.2} // Slower for performance
                dampingFactor={0.1}
                maxPolarAngle={Math.PI / 1.5}
                minPolarAngle={Math.PI / 3}
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
        </>
      )}
    </div>
  );
}