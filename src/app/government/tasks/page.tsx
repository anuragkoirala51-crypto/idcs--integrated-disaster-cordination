'use client';

import { useAppStore } from '@/store/useAppStore';
import { Bot, CheckCircle, Clock, Users, Shield, Zap, Search, Waves, Stethoscope, Navigation } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Skill } from '@/lib/types';

const SKILL_ICONS: Record<Skill | string, any> = {
  'Medical': Stethoscope,
  'Search & Rescue': Search,
  'Water Rescue': Waves,
  'Logistics': Zap,
  'Electrical & Comm': Shield,
  'Communication': Navigation,
};

export default function VolunteersPage() {
  const { volunteers, tasks, assignVolunteerToTask } = useAppStore();
  const [matchingStatus, setMatchingStatus] = useState<Record<string, 'idle' | 'matching' | 'matched'>>({});

  const openTasks = tasks.filter(t => t.status === 'Open');
  const availableVols = volunteers.filter(v => v.status === 'Available');
  const deployedVols = volunteers.filter(v => v.status === 'Deployed');

  const stats = [
    { label: 'Total Enlisted', value: volunteers.length, icon: Users, color: 'text-powder' },
    { label: 'Operational (Live)', value: availableVols.length, icon: Zap, color: 'text-powder' },
    { label: 'Deployed (Field)', value: deployedVols.length, icon: Navigation, color: 'text-powder' },
    { label: 'Pending Missions', value: openTasks.length, icon: Clock, color: 'text-ice' },
  ];

  const handleAutoMatch = (taskId: string, requiredSkills: string[]) => {
    setMatchingStatus(prev => ({ ...prev, [taskId]: 'matching' }));

    setTimeout(() => {
      const match = availableVols.find(v =>
        v.skills.some(skill => requiredSkills.includes(skill))
      );

      if (match) {
        assignVolunteerToTask(match.id, taskId);
        setMatchingStatus(prev => ({ ...prev, [taskId]: 'matched' }));
      } else {
        alert("No available volunteers with the required skills found.");
        setMatchingStatus(prev => ({ ...prev, [taskId]: 'idle' }));
      }
    }, 1200);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-10 pb-20">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-powder mb-1">
              <Shield className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Fleet Command Center</span>
            </div>
            <h1 className="text-5xl font-black text-white leading-none tracking-tighter uppercase italic">Mission <br /> <span className="text-neutral-500 not-italic">Allocation</span></h1>
            <p className="text-neutral-500 text-sm font-medium">Coordinate field personnel and orchestrate intelligent asset deployment.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map(stat => (
              <div key={stat.label} className="glass-panel p-4 rounded-2xl border border-white/5 min-w-[140px]">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">Live</span>
                </div>
                <p className="text-2xl font-black text-white leading-none">{stat.value}</p>
                <p className="text-[9px] font-bold text-neutral-500 uppercase mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Mission Hub (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-panel overflow-hidden shadow-2xl">
              <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center">
                  <Clock className="w-5 h-5 mr-3 text-ice" />
                  Tactical Dispatch Grid
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-sapphire animate-pulse"></span>
                  <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Real-time Feed</span>
                </div>
              </div>

              <div className="p-8 space-y-4 max-h-[600px] overflow-y-auto no-scrollbar">
                {openTasks.length === 0 ? (
                  <div className="text-center py-20 bg-black/20 rounded-3xl border border-white/5 border-dashed">
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 text-sapphire/20" />
                    <h4 className="text-xl font-black text-white/40 uppercase italic tracking-tighter">No Active Incursions</h4>
                    <p className="text-neutral-600 text-[10px] font-bold uppercase tracking-widest mt-1">All personnel currently optimal</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {openTasks.map(task => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-6 bg-navy/50 rounded-3xl border border-white/5 hover:border-sapphire/30 transition-all group"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="space-y-1">
                            <h4 className="font-black text-xl text-white uppercase tracking-tight leading-none italic group-hover:text-powder transition-colors">{task.title}</h4>
                            <div className="flex gap-2 pt-1">
                              {task.requiredSkills.map(skill => (
                                <span key={skill} className="px-2 py-0.5 bg-navy-panel text-powder text-[8px] rounded-full uppercase font-black border border-sapphire/20">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest leading-none">Status</p>
                            <p className="text-xs font-black text-ice uppercase italic">Awaiting Response</p>
                          </div>
                        </div>

                        <p className="text-xs text-neutral-500 font-medium mb-6 leading-relaxed line-clamp-2">{task.description}</p>

                        <button
                          onClick={() => handleAutoMatch(task.id, task.requiredSkills)}
                          disabled={matchingStatus[task.id] === 'matching'}
                          className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center neo-btn ${matchingStatus[task.id] === 'matching'
                            ? 'opacity-50 text-neutral-600 cursor-not-allowed'
                            : matchingStatus[task.id] === 'matched'
                              ? 'text-powder'
                              : 'text-powder hover:text-white'
                            }`}
                        >
                          {matchingStatus[task.id] === 'matching' ? 'Analyzing Fleet for Optimal Carrier...' : matchingStatus[task.id] === 'matched' ? 'Deployment Successful' : 'Execute AI Auto-Match'}
                          {matchingStatus[task.id] === 'idle' && <Bot className="w-4 h-4 ml-3" />}
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </div>
          </div>

          {/* Fleet Directory (1/3 width) */}
          <div className="space-y-6">
            <div className="glass-panel overflow-hidden shadow-2xl h-full flex flex-col">
              <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center">
                  Registry
                </h3>
                <span className="text-[10px] font-black text-sapphire uppercase tracking-widest bg-sapphire/10 px-2 py-1 rounded-lg">LIVE FLEET</span>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-3">
                {volunteers.map(vol => (
                  <div key={vol.id} className="p-5 bg-navy/40 rounded-2xl border border-white/5 hover:border-white/10 transition-all flex items-center space-x-4 group">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${vol.status === 'Available' ? 'bg-sapphire/10 border-sapphire/20 text-sapphire group-hover:bg-sapphire group-hover:text-white' :
                      vol.status === 'Deployed' ? 'bg-sapphire/10 border-sapphire/20 text-sapphire group-hover:bg-sapphire group-hover:text-white' :
                        'bg-neutral-800 border-neutral-700 text-neutral-500'
                      }`}>
                      {vol.skills.length > 0 ? (
                        (() => {
                          const Icon = SKILL_ICONS[vol.skills[0]] || Users;
                          return <Icon className="w-5 h-5" />;
                        })()
                      ) : <Users className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-[12px] font-black text-white uppercase truncate tracking-tight">{vol.name}</h5>
                      <div className="flex items-center space-x-2 mt-0.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${vol.status === 'Available' ? 'bg-sapphire' : vol.status === 'Deployed' ? 'bg-sapphire' : 'bg-neutral-600'}`}></span>
                        <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-tighter">{vol.status}</span>
                      </div>
                    </div>
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {vol.skills.slice(0, 3).map((s, i) => (
                        <div key={s} className="w-6 h-6 rounded-full bg-navy-panel border border-neutral-800 flex items-center justify-center" title={s}>
                          {(() => {
                            const Icon = SKILL_ICONS[s] || Shield;
                            return <Icon className="w-3 h-3 text-neutral-600" />;
                          })()}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 border-t border-white/5">
                <button className="w-full py-3 neo-btn rounded-xl text-[10px] font-black text-neutral-400 uppercase tracking-widest hover:text-powder">
                  Synchronize Fleet Data
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
