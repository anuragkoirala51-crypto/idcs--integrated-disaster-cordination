'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/UI/Skeleton';

// Because React-Leaflet requires the window object (which isn't available during SSR),
// we dynamically import the Map component and disable SSR.
const MapClient = dynamic(() => import('./MapClient'), {
  ssr: false,
  loading: () => (
    <div className="glass-panel w-full h-full animate-pulse flex items-center justify-center">
      <p className="text-neutral-500 font-medium">Loading geospatial data...</p>
    </div>
  )
});

export function ReliefMap() {
  return (
    <div className="glass-panel w-full h-full relative overflow-hidden">
      <MapClient />
    </div>
  );
}
