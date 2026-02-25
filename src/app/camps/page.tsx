'use client';

import { useAppStore } from '@/store/useAppStore';
import {
  Tent, Phone, MapPin, Users, AlertCircle,
  Info, ShieldCheck, Waves, Mountain, CloudRain,
  Activity, ArrowUpRight, Compass, HelpCircle,
  ExternalLink, Navigation
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';

export default function CampsPage() {
  const camps = useAppStore(state => state.camps);

  return (
    <DashboardLayout>
      <div className="space-y-10 pb-20">

        {/* North East Themed Header */}
        <div className="glass-panel relative overflow-hidden bg-gradient-to-br from-navy-panel/40 via-navy/20 to-navy p-10 group">
          {/* Background Decorative Patterns (Subtle Tribal Motif feel) */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-sapphire/5 blur-[100px] rounded-full group-hover:bg-sapphire/10 transition-colors duration-700"></div>
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-teal-500/5 blur-[120px] rounded-full group-hover:bg-teal-500/10 transition-colors duration-700"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-4">
              <div className="flex items-center space-x-3 text-powder">
                <Compass className="w-5 h-5 animate-spin-slow" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Seven Sisters Regional Network</span>
              </div>
              <h1 className="text-5xl font-black text-white leading-none tracking-tighter">
                NORTH EAST <br />
                <span className="text-sapphire italic">RELIEF GRID</span>
              </h1>
              <p className="text-neutral-400 text-sm font-medium leading-relaxed">
                Precision monitoring of 10 strategic hubs across Assam, Sikkim, Meghalaya, and the hill states.
                Coordinating survival infrastructure for annual floods, landslides, and cloudbursts.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <SummaryStat label="Active Hubs" value="10" icon={Activity} />
              <SummaryStat label="Total Cap." value="15,500+" icon={Users} />
            </div>
          </div>
        </div>

        {/* Camp Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {camps.map((camp, idx) => {
            const isOverCapacity = camp.status === 'Over Capacity' || camp.status === 'Critical';
            const capacityPercentage = Math.round((camp.currentOccupancy / camp.capacity) * 100);

            return (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={camp.id}
                className={`group relative glass-panel overflow-hidden transition-all duration-500 hover:shadow-2xl ${isOverCapacity
                  ? 'border-red-500/30 hover:border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.1)]'
                  : 'hover:border-sapphire/30 shadow-[0_0_30px_rgba(16,185,129,0.05)]'
                  }`}
              >
                {/* Visual Identity Strip */}
                <div className={`h-2 w-full ${camp.disasterType?.includes('Flood') ? 'bg-sapphire' :
                  camp.disasterType?.includes('Landslide') ? 'bg-amber-600' :
                    camp.disasterType?.includes('Earthquake') ? 'bg-rose-600' : 'bg-sapphire'
                  }`}></div>

                <div className="p-8">
                  {/* Header: Name & Type */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 bg-white/5 rounded-md text-[9px] font-black text-white/50 uppercase tracking-widest border border-white/5">
                          {camp.disasterType || 'Relief Hub'}
                        </span>
                        {isOverCapacity && (
                          <span className="px-2 py-0.5 bg-red-500/20 text-red-500 rounded-md text-[9px] font-black uppercase tracking-widest border border-red-500/30">
                            Critically High
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-black text-white tracking-tight group-hover:text-powder transition-colors uppercase leading-tight">
                        {camp.name}
                      </h3>
                      <div className="flex items-center text-xs text-neutral-500 font-bold italic">
                        <MapPin className="w-3 h-3 mr-1 text-sapphire" />
                        {camp.address}
                      </div>
                    </div>
                    <div className={`p-4 rounded-2xl ${isOverCapacity ? 'bg-red-500/10 text-red-500' : 'bg-sapphire/10 text-sapphire'} border border-current/10`}>
                      <Tent className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Info Section */}
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-black text-neutral-500 uppercase tracking-widest flex items-center">
                          <ShieldCheck className="w-3 h-3 mr-2 text-powder" />
                          Operational Purpose
                        </h4>
                        <p className="text-xs text-neutral-300 font-medium leading-relaxed italic">
                          "{camp.purpose}"
                        </p>
                      </div>

                      <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2">
                        <h4 className="text-[10px] font-black text-neutral-500 uppercase tracking-widest flex items-center">
                          <HelpCircle className="w-3 h-3 mr-2 text-powder" />
                          Mission Spectrum
                        </h4>
                        <p className="text-[11px] text-neutral-400 font-medium leading-snug">
                          {camp.helpInfo}
                        </p>
                      </div>
                    </div>

                    {/* Status Section */}
                    <div className="space-y-6">
                      <div className="glass-card p-5 space-y-4">
                        <div className="flex justify-between items-end">
                          <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Hydrated Analytics</span>
                          <span className={`text-lg font-black font-mono ${isOverCapacity ? 'text-red-400' : 'text-powder'}`}>
                            {capacityPercentage}%
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                            <span>Capacity Utilization</span>
                            <span>{camp.currentOccupancy} / {camp.capacity}</span>
                          </div>
                          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className={`h-full rounded-full ${isOverCapacity ? 'bg-red-500' :
                                capacityPercentage > 80 ? 'bg-ice' : 'bg-sapphire'
                                } shadow-[0_0_10px_rgba(16,185,129,0.3)]`}
                            ></motion.div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <a
                          href={`tel:${camp.contactPhone}`}
                          className="flex-1 py-3 neo-btn rounded-xl flex items-center justify-center space-x-2 group/call"
                        >
                          <Phone className="w-4 h-4 text-powder group-hover/call:rotate-12 transition-transform" />
                          <span className="text-[10px] font-black text-white uppercase tracking-widest">{camp.contactPhone}</span>
                        </a>
                        <button className="p-3 neo-btn text-powder rounded-xl">
                          <Navigation className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Footer: Critical Needs */}
                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-4 overflow-x-auto no-scrollbar">
                    <span className="text-[9px] font-black text-neutral-600 uppercase tracking-widest shrink-0">LOGISTICS SHORTFALLS:</span>
                    <div className="flex gap-2">
                      {camp.criticalNeeds && camp.criticalNeeds.length > 0 ? (
                        camp.criticalNeeds.map(need => (
                          <span key={need} className="px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[9px] font-black uppercase tracking-wider rounded-md shrink-0">
                            {need}
                          </span>
                        ))
                      ) : (
                        <span className="text-[9px] font-black text-sapphire uppercase tracking-widest italic opacity-50">All resources nominal</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}

function SummaryStat({ label, value, icon: Icon }: any) {
  return (
    <div className="glass-card p-4 flex items-center space-x-4 min-w-[140px]">
      <div className="w-10 h-10 rounded-xl bg-sapphire/20 flex items-center justify-center border border-sapphire/30">
        <Icon className="w-5 h-5 text-powder" />
      </div>
      <div>
        <div className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">{label}</div>
        <div className="text-xl font-black text-white">{value}</div>
      </div>
    </div>
  );
}
