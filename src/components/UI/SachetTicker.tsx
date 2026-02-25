'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Radio, X } from 'lucide-react';

const mockAlerts = [
  { id: 1, type: 'IMD ALERT', message: 'SEVERE CYCLONIC STORM EXPECTED NEAR GUWAHATI HUB WITHIN 48HRS', severity: 'critical' },
  { id: 2, type: 'SACHET', message: 'FLASH FLOOD WARNING ISSUED FOR KAMRUP METRO DISTRICT', severity: 'high' },
  { id: 3, type: 'NDRF UPDATE', message: 'HEAVY EQUIPMENT DEPLOYED TO AEC CAMPUS SECTOR 4', severity: 'info' }
];

export function SachetTicker() {
  const [isVisible, setIsVisible] = useState(true);
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    
    // Rotate alerts every 8 seconds
    const interval = setInterval(() => {
      setCurrentAlertIndex((prev) => (prev + 1) % mockAlerts.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  const alert = mockAlerts[currentAlertIndex];
  
  const severityColors = {
    critical: 'bg-red-600 border-red-500 text-white',
    high: 'bg-amber-600 border-ice text-white',
    info: 'bg-indigo-600 border-sapphire text-white'
  };

  const currentColors = severityColors[alert.severity as keyof typeof severityColors];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className={`fixed bottom-0 left-0 w-full z-[9999] flex items-center justify-center border-t ${currentColors} shadow-[0_-4px_30px_rgba(0,0,0,0.5)]`}
      >
        <div className="absolute inset-0 scanline opacity-20 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 h-10 flex items-center justify-between z-10">
          <div className="flex items-center space-x-4 overflow-hidden">
            <div className="flex items-center space-x-2 shrink-0">
               <Radio className="w-4 h-4 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-widest border-r border-white/20 pr-4">{alert.type}</span>
            </div>
            
            <motion.div 
               key={alert.id}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               transition={{ duration: 0.5 }}
               className="flex items-center space-x-2 truncate"
            >
               <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
               <span className="text-xs font-bold tracking-wider truncate">{alert.message}</span>
            </motion.div>
          </div>

          <button 
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-white/20 rounded-full transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
