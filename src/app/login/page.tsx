'use client';

import { motion } from 'framer-motion';
import { ShieldAlert, Users, Shield, HeartHandshake, ArrowRight, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';

export default function LoginPage() {
  const router = useRouter();
  const setRole = useAppStore(state => state.setRole);

  const handleSelectRole = (role: 'public' | 'volunteer' | 'government', path: string) => {
    setRole(role);
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-navy flex flex-col items-center justify-center p-6 relative overflow-hidden">

      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-navy to-navy"></div>
        <div className="absolute inset-0 scanline opacity-20 pointer-events-none"></div>
      </div>

      {/* Critical Banner */}
      <div className="absolute top-0 w-full bg-red-600 text-white py-2 px-4 shadow-[0_0_20px_rgba(220,38,38,0.5)] z-50 flex items-center justify-center space-x-3 backdrop-blur-md">
        <AlertTriangle className="w-5 h-5 animate-pulse" />
        <p className="text-sm font-black tracking-widest uppercase">PROTOTYPE/DEMO ONLY: Not connected to real emergency services.</p>
        <AlertTriangle className="w-5 h-5 animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-4xl space-y-12 mt-12">

        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center p-4 rounded-3xl neo-inset mb-4"
          >
            <ShieldAlert className="w-12 h-12 text-sapphire" />
          </motion.div>
          <h1 className="text-5xl font-black text-white tracking-tighter">Unified Disaster Relief</h1>
          <p className="text-lg text-neutral-400 font-medium">Select your operational access level to proceed.</p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Public Role */}
          <motion.button
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelectRole('public', '/')}
            className="flex flex-col text-left p-8 glass-card hover:border-sapphire/50 group"
          >
            <div className="w-14 h-14 rounded-2xl bg-sapphire/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7 text-sapphire" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Public Portal</h2>
            <p className="text-sm text-neutral-400 mb-6 flex-1">Track donations, report incidents, and view current critical needs in your area. Open to all citizens.</p>
            <div className="flex items-center text-sapphire font-bold text-sm uppercase tracking-wider">
              Continue as Public <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.button>

          {/* Volunteer Role */}
          <motion.button
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelectRole('volunteer', '/volunteers')}
            className="flex flex-col text-left p-8 glass-card hover:border-sapphire/50 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-14 h-14 rounded-2xl bg-sapphire/10 flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform">
              <HeartHandshake className="w-7 h-7 text-sapphire" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 relative z-10">Volunteer Login</h2>
            <p className="text-sm text-neutral-400 mb-6 flex-1 relative z-10">Access your deployment dashboard. Receive and accept active delivery tasks and operational mandates.</p>
            <div className="flex items-center text-sapphire font-bold text-sm uppercase tracking-wider relative z-10">
              Access Dashboard <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.button>

          {/* Government Role */}
          <motion.button
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelectRole('government', '/government')}
            className="flex flex-col text-left p-8 glass-card hover:border-sapphire/50 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-14 h-14 rounded-2xl bg-sapphire/10 flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform">
              <Shield className="w-7 h-7 text-sapphire" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 relative z-10">Authority Login</h2>
            <p className="text-sm text-neutral-400 mb-6 flex-1 relative z-10">Strategic fleet management, AI task allocation, and live structural damage assessment via UAV feeds.</p>
            <div className="flex items-center text-sapphire font-bold text-sm uppercase tracking-wider relative z-10">
              Enter Command Center <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.button>

        </div>
      </div>
    </div>
  );
}
