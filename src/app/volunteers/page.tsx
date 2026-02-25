'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Navigation2,
  CheckCircle,
  Package,
  Truck,
  ArrowRight,
  X,
  Shield,
  Zap,
  Stethoscope,
  Search,
  Waves,
  Clock,
  Navigation
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Task, Skill } from '@/lib/types';

const SKILL_ICONS: Record<Skill | string, any> = {
  'Medical': Stethoscope,
  'Search & Rescue': Search,
  'Water Rescue': Waves,
  'Logistics': Truck,
  'Electrical & Comm': Zap,
  'Communication': Navigation2,
  'Construction': Shield,
  'Food Services': Package
};

export default function VolunteerDashboard() {
  const { volunteers, tasks, userRole, matchTasksForVolunteer, assignVolunteerToTask } = useAppStore();
  const [isOnline, setIsOnline] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [matchedTasks, setMatchedTasks] = useState<(Task & { distance: number })[]>([]);
  const [deliveryStatus, setDeliveryStatus] = useState<'picking_up' | 'in_transit' | 'delivered'>('picking_up');

  // Get the current volunteer from the store (assuming the last one for demo purposes)
  const currentVolunteer = volunteers[volunteers.length - 1];

  useEffect(() => {
    if (isOnline && currentVolunteer) {
      const matches = matchTasksForVolunteer(currentVolunteer.id);
      setMatchedTasks(matches);
    } else {
      setMatchedTasks([]);
    }
  }, [isOnline, tasks, volunteers, currentVolunteer, matchTasksForVolunteer]);

  const activeTask = tasks.find(t => t.id === activeTaskId);

  const acceptTask = (taskId: string) => {
    assignVolunteerToTask(currentVolunteer!.id, taskId);
    setActiveTaskId(taskId);
    setMatchedTasks([]);
    setDeliveryStatus('picking_up');
  };

  const advanceDelivery = () => {
    if (deliveryStatus === 'picking_up') setDeliveryStatus('in_transit');
    else if (deliveryStatus === 'in_transit') {
      setDeliveryStatus('delivered');
      setTimeout(() => {
        setActiveTaskId(null);
        setDeliveryStatus('picking_up');
      }, 3000);
    }
  };

  if (!currentVolunteer) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
          <div className="w-20 h-20 bg-navy-panel rounded-full flex items-center justify-center border-4 border-white/5">
            <Shield className="w-8 h-8 text-neutral-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Access Denied</h2>
            <p className="text-neutral-500 max-w-xs text-sm">You must register as a volunteer to access the deployment grid.</p>
          </div>
          <button
            onClick={() => window.location.href = '/volunteers/register'}
            className="px-8 py-4 bg-sapphire hover:bg-sapphire text-white font-black uppercase tracking-widest rounded-2xl transition-all"
          >
            Go to Registration
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto h-[calc(100vh-8rem)] relative overflow-hidden glass-panel flex flex-col">

        {/* Map Background (Simulated) */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://maps.wikimedia.org/osm-intl/13/6122/3516.png')] opacity-20 grayscale contrast-150 mix-blend-screen scale-150 animate-pulse transition-all duration-10000 ease-linear"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-transparent"></div>
        </div>

        {/* Tactical Header */}
        <div className="relative z-10 pt-8 pb-4 px-6 flex justify-between items-center bg-gradient-to-b from-navy to-transparent">
          <div className="flex flex-col">
            <div className="flex items-center space-x-2 text-white mb-1">
              <div className="w-2 h-2 rounded-full bg-sapphire animate-pulse"></div>
              <span className="text-[10px] font-bold uppercase tracking-widest">{currentVolunteer.name}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {currentVolunteer.skills.map(skill => (
                <span key={skill} className="px-2 py-0.5 bg-white/10 rounded-full text-[8px] font-black text-white/60 uppercase border border-white/5">{skill}</span>
              ))}
            </div>
          </div>

          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`relative w-24 h-12 rounded-full transition-all duration-500 flex items-center px-1 neo-inset hover:border-sapphire/30 ${isOnline ? 'border-sapphire/50' : ''}`}
          >
            <motion.div
              animate={{ x: isOnline ? 48 : 0 }}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
            >
              <div className={`w-3 h-3 rounded-full transition-colors ${isOnline ? 'bg-sapphire' : 'bg-neutral-500'}`}></div>
            </motion.div>
            <span className={`absolute font-black text-[10px] uppercase tracking-widest ${isOnline ? 'left-3 text-white' : 'right-3 text-neutral-500'}`}>
              {isOnline ? 'On' : 'Off'}
            </span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 relative z-10 flex flex-col justify-end p-4 pb-8 overflow-y-auto no-scrollbar">

          {/* Offline State */}
          {!isOnline && !activeTaskId && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center pb-20">
              <div className="w-20 h-20 bg-navy-panel rounded-full mx-auto flex items-center justify-center mb-6 border-4 border-neutral-800">
                <Navigation2 className="w-8 h-8 text-neutral-600" />
              </div>
              <h2 className="text-2xl font-black text-white">Grid Standby</h2>
              <p className="text-neutral-500 mt-2 font-medium text-xs px-10">Toggle mission status to begin intelligent task matching.</p>
            </motion.div>
          )}

          {/* Finding Tasks State */}
          {isOnline && matchedTasks.length === 0 && !activeTaskId && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center pb-20">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-sapphire/20 rounded-full animate-ping"></div>
                <div className="absolute inset-2 border-4 border-sapphire/40 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                <div className="absolute inset-0 bg-sapphire/10 rounded-full flex items-center justify-center backdrop-blur-md">
                  <Search className="w-8 h-8 text-sapphire animate-pulse" />
                </div>
              </div>
              <h2 className="text-2xl font-black text-white">Scanning Grid</h2>
              <p className="text-powder mt-2 font-medium animate-pulse text-xs">Matching skills to nearby incidents...</p>
            </motion.div>
          )}

          {/* Intelligent Task Pings */}
          <AnimatePresence>
            {isOnline && matchedTasks.length > 0 && !activeTaskId && (
              <div className="space-y-4 mb-4">
                <div className="flex items-center justify-between px-2">
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Intelligent Matches ({matchedTasks.length})</span>
                </div>
                {matchedTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    className="glass-card p-5 relative overflow-hidden group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <div className="p-1.5 bg-sapphire/20 rounded-lg">
                            {task.requiredSkills.map(s => {
                              const Icon = SKILL_ICONS[s] || Shield;
                              return <Icon key={s} className="w-3.5 h-3.5 text-powder" />
                            })}
                          </div>
                          <span className="text-[10px] font-black text-powder uppercase tracking-widest">Active Dispatch</span>
                        </div>
                        <h3 className="text-xl font-black text-white tracking-tight leading-none pt-1">{task.title}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-white">{task.distance.toFixed(1)} <span className="text-[10px] text-neutral-500">KM</span></p>
                        <p className="text-[9px] font-bold text-neutral-500 uppercase">Proximity</p>
                      </div>
                    </div>

                    <p className="text-[11px] text-neutral-400 font-medium mb-6 line-clamp-2">{task.description}</p>

                    <div className="flex space-x-2">
                      <button className="flex-1 py-4 rounded-2xl neo-btn text-powder hover:text-white font-black text-xs tracking-widest" onClick={() => acceptTask(task.id)}>
                        ACCEPT MISSION
                      </button>
                      <button className="w-14 rounded-2xl neo-btn flex items-center justify-center text-neutral-500 hover:text-red-400" onClick={() => setMatchedTasks(prev => prev.filter(t => t.id !== task.id))}>
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* Active Task HUD */}
          <AnimatePresence>
            {activeTask && (
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                className="glass-panel p-6 shadow-2xl w-full"
              >
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-sapphire uppercase tracking-[0.2em] mb-1 block">Mission in Progress</span>
                    <h3 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">{activeTask.title}</h3>
                  </div>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${deliveryStatus === 'picking_up' ? 'bg-sapphire/10 border-sapphire/20 text-powder' : 'bg-sapphire/10 border-sapphire/20 text-powder'}`}>
                    {deliveryStatus === 'picking_up' ? <Package className="w-6 h-6" /> : <Navigation className="w-6 h-6" />}
                  </div>
                </div>

                <div className="relative pl-8 space-y-10 mb-10 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-neutral-800">
                  <div className="relative">
                    <span className={`absolute -left-[32px] top-1 w-4 h-4 rounded-full border-2 border-navy z-10 ${deliveryStatus === 'picking_up' ? 'bg-sapphire shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-neutral-700'}`}></span>
                    <p className={`text-[12px] font-black uppercase ${deliveryStatus === 'picking_up' ? 'text-white' : 'text-neutral-500'}`}>Operations Depot</p>
                    <p className="text-[10px] text-neutral-500 font-bold">In-processing Point</p>
                  </div>
                  <div className="relative">
                    <span className={`absolute -left-[32px] top-1 w-4 h-4 rounded-full border-2 border-navy z-10 ${deliveryStatus === 'in_transit' ? 'bg-sapphire shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-neutral-700'}`}></span>
                    <p className={`text-[12px] font-black uppercase ${deliveryStatus === 'in_transit' ? 'text-white' : 'text-neutral-500'}`}>Relief Hub Terminal</p>
                    <p className="text-[10px] text-neutral-500 font-bold">Deployment Destination</p>
                  </div>
                </div>

                {deliveryStatus !== 'delivered' ? (
                  <button
                    onClick={advanceDelivery}
                    className={`w-full h-16 rounded-2xl flex items-center justify-center font-black text-white text-[12px] uppercase tracking-[0.2em] relative overflow-hidden transition-all shadow-xl ${deliveryStatus === 'picking_up' ? 'bg-sapphire hover:bg-sapphire' : 'bg-sapphire hover:bg-sapphire'
                      }`}
                  >
                    <div className="absolute left-1 bottom-1 top-1 w-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <ArrowRight className="w-6 h-6" />
                    </div>
                    <span className="pl-6">{deliveryStatus === 'picking_up' ? 'Confirm In-Processing' : 'Finalize Deployment'}</span>
                  </button>
                ) : (
                  <div className="w-full h-16 bg-sapphire/10 rounded-2xl flex items-center justify-center space-x-3 text-powder font-black tracking-widest text-[12px] border border-sapphire/20">
                    <CheckCircle className="w-6 h-6 animate-bounce" />
                    <span>MISSION SUCCESSFUL</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </DashboardLayout>
  );
}
