'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '../UI/Skeleton';

const GlobeClient = dynamic(() => import('./GlobeClient'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black">
      <div className="w-32 h-32 rounded-full border-2 border-sapphire/20 border-t-indigo-500 animate-spin mb-4" />
      <p className="text-xs font-black text-powder uppercase tracking-[0.3em] animate-pulse">Initializing Orbit...</p>
    </div>
  )
});

export function StrategicGlobe({ onEngage }: { onEngage?: () => void }) {
  return (
    <div className="w-full h-full relative overflow-hidden rounded-2xl border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
      <GlobeClient onEngage={onEngage} />
      
      {/* Decorative Overlays */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-grid"></div>
      <div className="absolute top-6 left-6 z-10">
         <div className="bg-black/60 backdrop-blur-md border border-sapphire/30 px-4 py-2 rounded-lg">
            <h4 className="text-[10px] font-black text-powder uppercase tracking-widest mb-1">Satellite Uplink</h4>
            <div className="flex items-center space-x-2">
               <div className="w-1.5 h-1.5 rounded-full bg-sapphire animate-pulse"></div>
               <span className="text-[9px] font-bold text-white uppercase tracking-tighter">Guwahati Sector 7G</span>
            </div>
         </div>
      </div>
    </div>
  );
}
