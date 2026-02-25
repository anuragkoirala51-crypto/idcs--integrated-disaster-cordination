'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import Globe from 'react-globe.gl';
import { useAppStore } from '@/store/useAppStore';
import * as THREE from 'three';

export default function GlobeClient({ onEngage }: { onEngage?: () => void }) {
  const globeRef = useRef<any>(null);
  const incidentReports = useAppStore(state => state.incidentReports);
  const camps = useAppStore(state => state.camps);
  
  // Custom AEC Guwahati Focus
  const AEC_COORDS = { lat: 26.1388, lng: 91.6625 };

  const [realIncidents, setRealIncidents] = useState<any[]>([]);

  useEffect(() => {
    fetch('/datasets/parsed_disasters.json')
      .then(res => res.json())
      .then(data => setRealIncidents(data))
      .catch(console.error);
  }, []);

  // Professional Satellite View initialization - No data overlays as per user request
  
  useEffect(() => {
    if (globeRef.current) {
      // Auto-rotate
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.5;
      
      // Zoom into AEC Guwahati initially
      globeRef.current.pointOfView({ ...AEC_COORDS, altitude: 2.0 }, 2000);
    }
  }, []);

  const handleGlobeClick = () => {
    if (globeRef.current && onEngage) {
      // Pause auto-rotation for the dive
      globeRef.current.controls().autoRotate = false;
      
      // Google-Earth style deep plunge: 3 seconds, very low altitude
      globeRef.current.pointOfView({ 
        lat: AEC_COORDS.lat, 
        lng: AEC_COORDS.lng, 
        altitude: 0.02 
      }, 3000);

      // Trigger the tactical map switch just as the camera hits the surface
      setTimeout(() => {
        onEngage();
      }, 2900);
    }
  };

  return (
    <div className="relative w-full h-full cursor-pointer group flex items-center justify-center overflow-hidden bg-black" onDoubleClick={handleGlobeClick}>
      <Globe
        ref={globeRef}
        // Premium Google Earth style textures
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        
        onGlobeReady={() => {
          // Add Cloud Layer directly to the scene
          const cloudMesh = new THREE.Mesh(
            new THREE.SphereGeometry(100 * (1 + 0.005), 75, 75),
            new THREE.MeshPhongMaterial({
              map: new THREE.TextureLoader().load('//unpkg.com/three-globe/example/img/earth-clouds.png'),
              transparent: true,
              opacity: 0.4
            })
          );
          globeRef.current.scene().add(cloudMesh);

          // Animate rotation in the main loop if possible, 
          // or just via a simple interval/raf here since it's a single mesh
          const rotateClouds = () => {
             cloudMesh.rotation.y += 0.0005;
             requestAnimationFrame(rotateClouds);
          };
          rotateClouds();
        }}

        // Pure Cinematic Globe - Data removed as per user request
        
        ringsData={[{ lat: AEC_COORDS.lat, lng: AEC_COORDS.lng }]}
        ringColor={() => '#6366f1'}
        ringMaxRadius={5}
        ringPropagationSpeed={3}
        ringRepeatPeriod={1000}

        // Atmosphere and visuals
        atmosphereColor="#93c5fd"
        atmosphereAltitude={0.25}
        
        onGlobeClick={handleGlobeClick}
      />

      {/* Cloud Overlay Enhancement via Three.js */}
      <style jsx global>{`
        .scene-container canvas {
          filter: contrast(1.1) brightness(1.1);
        }
      `}</style>
      
      {/* Cinematic Overlays */}
      <div className="absolute inset-x-0 bottom-10 flex justify-center pointer-events-none">
        <div className="bg-black/80 backdrop-blur-xl border border-white/10 px-8 py-4 rounded-full flex flex-col items-center space-y-1 animate-pulse shadow-[0_0_30px_rgba(99,102,241,0.2)]">
            <span className="text-[10px] font-black text-powder uppercase tracking-[0.3em]">Deep Space Surveillance Active</span>
            <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Double Click to Engage Deep Scan</span>
        </div>
      </div>
    </div>
  );
}
