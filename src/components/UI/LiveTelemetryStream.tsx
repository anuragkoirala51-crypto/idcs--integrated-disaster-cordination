'use client';

import { useState, useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';

export function LiveTelemetryStream() {
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rawDataStreams = [
      '[SYS] HEARTBEAT_SYNC: NODE_ALPHA_01 OK',
      '[SENSOR] AEC_GRID_TEMP_DROP: -2.4C/hr ALARM_THRESH_NOT_MET',
      '[UAV_FEED] OVERWATCH_DRONE_07: SECTOR_4_SCAN COMPLETED',
      '[NET] LATENCY_SPIKE DETECTED JORHAT_RELAY: 142ms',
      '[LOG] RESOURCE_ALLOCATION_MATRIX: OPTIMAL',
      '[SYS] DATA_INGESTION_RATE: 4.2MB/s',
      '[UAV_FEED] THERMAL_ANOMALY DETECTED: LAT 26.1388 LNG 91.6625',
      '[SENSOR] WATER_LEVEL_MONITOR: BHARALU_RIVER +0.4m',
      '[AI] CORRELATION_ENGINE: SEISMIC_ACTIVITY_NORMAL',
      '[NET] ENCRYPTION_ROTATION: SUCCESS 256-AEGIS'
    ];

    let intervalId: NodeJS.Timeout;

    const streamData = () => {
      const newLine = `${new Date().toISOString().split('T')[1].slice(0, 8)} ${rawDataStreams[Math.floor(Math.random() * rawDataStreams.length)]}`;
      
      setLogs(prev => {
        const next = [...prev, newLine];
        if (next.length > 20) return next.slice(-20);
        return next;
      });

      // Randomize interval between 500ms and 2500ms for a "live" feel
      intervalId = setTimeout(streamData, Math.random() * 2000 + 500);
    };

    streamData();

    return () => clearTimeout(intervalId);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="glass-panel p-6 rounded-3xl border-l-4 border-sapphire/40 font-mono flex flex-col h-64">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h3 className="text-[10px] font-black text-sapphire uppercase tracking-[0.2em] flex items-center">
          <Terminal className="w-4 h-4 mr-2" />
          Raw Telemetry Stream
        </h3>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-powder opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-sapphire"></span>
        </span>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scrollbar text-[10px] text-powder/70 space-y-1.5"
      >
        {logs.map((log, i) => (
          <div key={i} className="whitespace-nowrap opacity-80 hover:opacity-100 hover:text-white transition-colors">
            <span className="text-neutral-500 mr-2">{'>'}</span>{log}
          </div>
        ))}
      </div>
    </div>
  );
}
