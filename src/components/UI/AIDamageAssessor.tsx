'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Scan, ShieldAlert, CheckCircle2 } from 'lucide-react';

export function AIDamageAssessor() {
  const [scanning, setScanning] = useState(true);
  const [integrity, setIntegrity] = useState(0);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!scanning) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 84) {
        progress = 84; // Mock final integrity score
        setScanning(false);
        clearInterval(interval);
      }
      setIntegrity(Math.floor(progress));
      setFrame(Math.floor(Math.random() * 9999));
    }, 400);

    // Reset loop for demo purposes
    const resetInterval = setInterval(() => {
      setScanning(true);
      setIntegrity(0);
      setFrame(0);
    }, 15000);

    return () => {
      clearInterval(interval);
      clearInterval(resetInterval);
    };
  }, [scanning]);

  return (
    <div className="glass-panel p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
      
      {/* Background Drone Feed Mock */}
      <div className="absolute inset-0 bg-navy z-0">
         <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1549421295-e2a14e9185a5?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center grayscale mix-blend-overlay"></div>
         <div className="absolute inset-0 scanline opacity-30 pointer-events-none"></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center bg-black/50 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
             <Camera className="w-3.5 h-3.5 mr-2" />
             UAV Visual Feed // Sector 4
           </h3>
           <div className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${scanning ? 'bg-ice/20 text-ice border border-ice/50 animate-pulse' : 'bg-sapphire/20 text-sapphire border border-sapphire/50'}`}>
             {scanning ? 'Analyzing Substructures...' : 'Analysis Complete'}
           </div>
        </div>

        <div className="flex flex-col items-center justify-center py-6 h-32 relative">
           
           <AnimatePresence mode="wait">
             {scanning ? (
               <motion.div 
                 key="scanning"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="flex flex-col items-center"
               >
                 <Scan className="w-12 h-12 text-powder animate-spin-slow mb-4" />
                 <p className="text-[10px] text-powder font-mono tracking-widest uppercase">Processing Neural Net Frame: {frame.toString().padStart(4, '0')}</p>
               </motion.div>
             ) : (
                <motion.div 
                 key="complete"
                 initial={{ scale: 0.8, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 className="flex flex-col items-center"
               >
                 <div className="flex items-baseline space-x-2">
                    <span className={`text-5xl font-black italic tracking-tighter ${integrity < 50 ? 'text-red-500' : integrity < 80 ? 'text-ice' : 'text-sapphire'}`}>
                      {integrity}%
                    </span>
                 </div>
                 <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] mt-2">Structural Integrity</p>
                 
                 <div className="mt-4 flex items-center space-x-2 bg-black/60 px-4 py-2 rounded-xl backdrop-blur-md">
                    {integrity < 50 ? (
                      <><ShieldAlert className="w-4 h-4 text-red-500" /><span className="text-xs font-bold text-red-300">EVACUATION MANDATED</span></>
                    ) : (
                      <><CheckCircle2 className="w-4 h-4 text-sapphire" /><span className="text-xs font-bold text-emerald-300">STRUCTURE STABLE</span></>
                    )}
                 </div>
               </motion.div>
             )}
           </AnimatePresence>

           {/* Scanning laser UI effect */}
           {scanning && (
             <motion.div 
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-70"
             />
           )}
        </div>
      </div>
    </div>
  );
}
