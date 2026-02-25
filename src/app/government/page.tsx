'use client';

import { useAppStore } from '@/store/useAppStore';
import {
   ShieldCheck,
   MapPin,
   Truck,
   AlertTriangle,
   Activity,
   Package,
   Clock,
   Navigation,
   Database
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ReliefMap } from '@/components/Map/ReliefMap';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';

export default function GovernmentFleetUI() {
   const { camps } = useAppStore();

   // Simulated Active Deployments
   const [deployments, setDeployments] = useState([
      { id: 'DP-0912', volunteer: 'Rohan Sharma', origin: 'AEC Hub', destination: 'Jalukbari Center', status: 'transit', eta: '5 mins', cargo: 'Water Purifiers', progress: 85 },
      { id: 'DP-0914', volunteer: 'Dr. Bishnu Borah', origin: 'GU Supply', destination: 'AEC Medical Tent', status: 'transit', eta: '12 mins', cargo: 'Trauma Kits', progress: 40 },
      { id: 'DP-0918', volunteer: 'Jiten Kalita', origin: 'City Outskirts', destination: 'GU Hub', status: 'traffic', eta: '25 mins', cargo: 'Generators', progress: 15 },
   ]);

   return (
      <DashboardLayout>
         <div className="h-[calc(100vh-8rem)] flex flex-col xl:flex-row gap-6">

            {/* Left Side: Fleet Map */}
            <div className="flex-1 glass-panel rounded-3xl overflow-hidden flex flex-col relative border border-white/5 shadow-2xl">
               <div className="px-6 py-4 bg-navy-panel/80 border-b border-white/5 flex justify-between items-center backdrop-blur-md z-10">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-powder flex items-center">
                     <Navigation className="w-4 h-4 mr-2" />
                     Live Fleet Telemetry Map
                  </h3>
                  <div className="flex space-x-4">
                     <div className="flex items-center space-x-2 text-[10px] font-bold text-neutral-400">
                        <span className="w-2 h-2 rounded-full bg-sapphire animate-pulse"></span>
                        <span>In Transit</span>
                     </div>
                     <div className="flex items-center space-x-2 text-[10px] font-bold text-neutral-400">
                        <span className="w-2 h-2 rounded-full bg-ice"></span>
                        <span>Delayed</span>
                     </div>
                  </div>
               </div>

               {/* Real Map Component */}
               <div className="flex-1 relative bg-navy overflow-hidden">
                  <ReliefMap />
               </div>
            </div>

            {/* Right Side: Data Panels */}
            <div className="w-full xl:w-[400px] flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2 pb-10 xl:pb-0">

               {/* Camp Inventory Progress Bars */}
               <div className="glass-panel rounded-3xl p-6 border border-white/5">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center">
                        <Package className="w-4 h-4 text-sapphire mr-2" />
                        Camp Inventory Levels
                     </h3>
                  </div>

                  <div className="space-y-6">
                     {camps.map(camp => {
                        // Calculate simulated percentages for the demo based on capacity/occupancy math
                        const waterPct = Math.max(10, Math.min(100, Math.floor((camp.supplies.water / camp.currentOccupancy) * 100)));
                        const foodPct = Math.max(10, Math.min(100, Math.floor((camp.supplies.food / camp.currentOccupancy) * 100)));
                        const medPct = Math.max(5, Math.min(100, Math.floor((camp.supplies.medical / (camp.currentOccupancy * 0.1)) * 100)));

                        return (
                           <div key={camp.id} className="bg-navy-panel/50 p-4 rounded-2xl border border-white/5">
                              <p className="text-xs font-bold text-white mb-4 uppercase tracking-wider">{camp.name}</p>
                              <div className="space-y-3">
                                 <ProgressBar label="Water" percentage={waterPct} />
                                 <ProgressBar label="Food" percentage={foodPct} />
                                 <ProgressBar label="Medical" percentage={medPct} />
                              </div>
                           </div>
                        );
                     })}
                  </div>
               </div>

               {/* Active Deployments */}
               <div className="glass-panel rounded-3xl p-6 border border-white/5 flex-1">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center">
                        <Truck className="w-4 h-4 text-sapphire mr-2" />
                        Active Deployments
                     </h3>
                     <span className="bg-sapphire/10 text-powder px-2 py-0.5 rounded text-[10px] font-black">{deployments.length}</span>
                  </div>

                  <div className="space-y-4">
                     {deployments.map(dep => (
                        <div key={dep.id} className="p-4 bg-navy-panel/50 hover:bg-neutral-800/80 transition-colors rounded-xl border border-white/5 border-l-4 border-l-blue-500 group cursor-pointer">
                           <div className="flex justify-between items-start mb-2">
                              <p className="text-sm font-bold text-white">{dep.volunteer}</p>
                              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${dep.status === 'transit' ? 'bg-sapphire/10 text-powder' : 'bg-ice/10 text-ice'}`}>
                                 {dep.eta}
                              </span>
                           </div>
                           <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-3">
                              {dep.origin} <span className="text-neutral-600 mx-1">→</span> {dep.destination}
                           </p>
                           <div className="flex justify-between items-center">
                              <p className="text-[10px] text-powder font-medium">{dep.cargo}</p>
                              <p className="text-[10px] font-mono text-neutral-500">{dep.progress}%</p>
                           </div>
                           {/* Mini progress bar */}
                           <div className="h-1 w-full bg-neutral-800 rounded-full mt-2 overflow-hidden">
                              <div className={`h-full ${dep.status === 'transit' ? 'bg-sapphire' : 'bg-ice'}`} style={{ width: `${dep.progress}%` }}></div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

            </div>
         </div>
      </DashboardLayout>
   );
}

function ProgressBar({ label, percentage }: { label: string, percentage: number }) {
   const isCritical = percentage < 20;

   return (
      <div>
         <div className="flex justify-between items-center mb-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isCritical ? 'text-red-500' : 'text-neutral-400'}`}>
               {label}
            </span>
            <span className={`text-[10px] font-mono ${isCritical ? 'text-red-500 animate-pulse' : 'text-neutral-500'}`}>
               {percentage}%
            </span>
         </div>
         <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden flex">
            <motion.div
               initial={{ width: 0 }}
               animate={{ width: `${percentage}%` }}
               transition={{ duration: 1, ease: "easeOut" }}
               className={`h-full ${isCritical ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-white/50'}`}
            />
         </div>
         {isCritical && (
            <p className="text-[8px] text-red-500 mt-1 uppercase tracking-widest font-bold flex items-center">
               <AlertTriangle className="w-3 h-3 mr-1" />
               Critical Shortage Alert
            </p>
         )}
      </div>
   );
}
