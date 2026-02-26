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
    <div className="w-full h-full relative">
      {/* Globe with overflow-hidden for proper rendering */}
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

      {/* Cinematic Overlay — outside overflow-hidden so it renders cleanly at the bottom */}
      <div className="absolute inset-x-0 bottom-4 flex justify-center z-20 pointer-events-none">
        <div className="bg-black/80 backdrop-blur-xl border border-white/10 px-8 py-4 rounded-2xl flex flex-col items-center gap-2 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
          <span className="text-[10px] font-black text-powder uppercase tracking-[0.3em] animate-pulse">Deep Space Surveillance Active</span>
          <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Double Click Globe to Engage Deep Scan</span>
          {onEngage && (
            <button
              onClick={onEngage}
              className="pointer-events-auto mt-1 px-6 py-2 bg-indigo-600/80 hover:bg-indigo-600 border border-indigo-400/30 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-full flex items-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" /></svg>
              Engage Tactical Map
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

