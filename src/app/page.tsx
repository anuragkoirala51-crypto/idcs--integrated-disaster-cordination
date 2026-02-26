'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { StrategicGlobe } from '@/components/Globe/StrategicGlobe';
import { ReliefMap } from '@/components/Map/ReliefMap';
import {
  ShieldAlert,
  MapPin,
  Heart,
  Users,
  MessageSquarePlus,
  Navigation,
  Activity,
  Zap,
  ChevronRight,
  Maximize2,
  Minimize2,
  Bot,
  Package
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

import { DonationTracker } from '@/components/UI/DonationTracker';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { ImpactTicker } from '@/components/UI/ImpactTicker';
import { getTranslation } from '@/lib/translations';

export default function CinematicHome() {
  const { camps, alerts, language } = useAppStore();
  const [viewMode, setViewMode] = useState<'globe' | 'map'>('globe');

  const [isFullscreen, setIsFullscreen] = useState(false);

  const t = (key: any) => getTranslation(language, key);

  const criticalAlerts = alerts.filter(a => a.type === 'Critical');

  return (
    <DashboardLayout>
      <div className="relative min-h-[calc(100vh-8rem)] space-y-10">
        {/* Background Cinematic scanlines handled by layout/globals */}

        {/* Live Public Impact Ticker */}
        <ImpactTicker />

        {/* Hero Section with Live 3D/2D Toggle */}
        <section className={`relative z-10 grid grid-cols-1 xl:grid-cols-4 gap-8 ${isFullscreen ? '' : 'xl:h-[calc(100vh-12rem)]'}`}>

          {/* Cinematic Map Container */}
          <div className={`
            ${isFullscreen
              ? 'fixed inset-0 z-[10000] rounded-0'
              : 'xl:col-span-3 h-[500px] xl:h-full relative rounded-3xl overflow-hidden glass-panel group shadow-xl'
            } transition-all duration-500 ease-in-out`}>

            {/* Fullscreen Toggle Button */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="absolute top-6 right-20 z-[1001] p-3 neo-btn text-white rounded-xl hover:text-powder"
              title={isFullscreen ? t('exit_fullscreen') : t('enter_fullscreen')}
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>

            <AnimatePresence mode="wait">
              {viewMode === 'globe' ? (
                <motion.div
                  key="globe"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 2, filter: 'blur(10px)' }}
                  transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
                  className="w-full h-full"
                >
                  <StrategicGlobe onEngage={() => setViewMode('map')} />

                  {/* Globe HUD Overlay */}
                  <div className="absolute top-8 right-8 space-y-4 pointer-events-none text-right">
                    <HUDIndicator label={t('satellite_sync')} value={t('encrypted')} />
                    <HUDIndicator label={t('orbital_alt')} value="450KM" />
                  </div>


                </motion.div>
              ) : (
                <motion.div
                  key="map"
                  initial={{ opacity: 0, scale: 0.7, filter: 'blur(20px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
                  className="w-full h-full relative"
                >
                  <ReliefMap />
                  <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(99,102,241,0.2)]"></div>
                  <button
                    onClick={() => setViewMode('globe')}
                    className="absolute top-6 left-6 z-[1000] px-4 py-2 bg-navy-panel/80 backdrop-blur-md border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-white hover:text-black transition-all"
                  >
                    ← {t('return_orbit')}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Public Interface Sidebar */}
          <div className="space-y-6 xl:h-full xl:overflow-y-auto custom-scrollbar pr-2 pb-10 xl:pb-0 flex flex-col justify-start xl:pt-4">

            {/* Amazon-Style Donation Tracker */}
            <DonationTracker
              trackingId="#DR-8832"
              itemName="Medical First Aid Kits"
              quantity={50}
            />

            {/* Current Critical Needs Feed */}
            <div className="glass-card p-6 border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.05)] mt-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center">
                  <Zap className="w-3.5 h-3.5 mr-2" />
                  {t('critical_needs')}
                </h3>
                <span className="text-[10px] text-neutral-400 font-bold">{t('live_update')}</span>
              </div>

              <div className="space-y-4">
                {/* Need Item 1 */}
                <div className="glass-card p-4 flex justify-between items-center group hover:border-red-500/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                      <Heart className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">O-Negative Blood Supply</p>
                      <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider mt-0.5">AEC Main Shelter</p>
                    </div>
                  </div>
                  <Link href="/donations" className="px-3 py-1.5 neo-btn text-red-400 hover:text-white text-[10px] font-bold uppercase rounded-lg text-center transition-colors">
                    {t('fulfill')}
                  </Link>
                </div>

                {/* Need Item 2 */}
                <div className="glass-card p-4 flex justify-between items-center group hover:border-ice/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-ice/10 rounded-lg flex items-center justify-center text-ice group-hover:bg-ice group-hover:text-white transition-colors">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">Diesel Fuel (Generators)</p>
                      <p className="text-[10px] text-ice font-bold uppercase tracking-wider mt-0.5">Jalukbari Center</p>
                    </div>
                  </div>
                  <Link href="/donations" className="px-3 py-1.5 neo-btn text-ice hover:text-white text-[10px] font-bold uppercase rounded-lg text-center transition-colors">
                    {t('fulfill')}
                  </Link>
                </div>

                {/* Need Item 3 */}
                <div className="glass-card p-4 flex justify-between items-center group hover:border-sapphire/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-sapphire/10 rounded-lg flex items-center justify-center text-sapphire group-hover:bg-sapphire group-hover:text-white transition-colors">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">Heavy Duty Tarpaulins</p>
                      <p className="text-[10px] text-powder font-bold uppercase tracking-wider mt-0.5">GU Hub</p>
                    </div>
                  </div>
                  <Link href="/donations" className="px-3 py-1.5 neo-btn text-powder hover:text-white text-[10px] font-bold uppercase rounded-lg text-center transition-colors">
                    {t('fulfill')}
                  </Link>
                </div>
              </div>
            </div>

            {/* Public Actions */}
            <div className="space-y-4 mt-6">
              <Link href="/volunteers/register" className="glass-card block p-5 group hover:border-sapphire/50 transition-all transform origin-top hover:scale-[1.02]">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-black text-sm uppercase text-powder tracking-tight group-hover:text-blue-300">{t('join_frontlines')}</h4>
                  <Users className="w-5 h-5 text-powder group-hover:text-blue-300" />
                </div>
                <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest leading-relaxed">{t('expert_deployment')}</p>
              </Link>

              <Link href="/report" className="glass-card block p-5 group hover:border-neutral-400 transition-all transform origin-top hover:scale-[1.02]">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-black text-sm uppercase text-white tracking-tight">{t('report_status')}</h4>
                  <MessageSquarePlus className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />
                </div>
                <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest leading-relaxed mt-1">{t('contribute_data')}</p>
              </Link>
            </div>
          </div>
        </section>

        {/* Strategic Info Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 pb-20">
          <FeatureCard
            title={t('feat_bot_title')}
            desc={t('feat_bot_desc')}
            icon={Bot}
            href="#"
            onClick={() => {
              const btn = document.querySelector('button[aria-label="Open Chat"]') as HTMLButtonElement;
              if (btn) btn.click();
            }}
            highlight
          />
          <FeatureCard
            title={t('feat_hub_title')}
            desc={t('feat_hub_desc')}
            icon={Navigation}
            href="/camps"
          />
          <FeatureCard
            title={t('feat_ledger_title')}
            desc={t('feat_ledger_desc')}
            icon={Heart}
            href="/donations"
          />
          <FeatureCard
            title={t('feat_vols_title')}
            desc={t('feat_vols_desc')}
            icon={Users}
            href="/volunteers/register"
            highlight
          />
          <FeatureCard
            title={t('feat_inventory_title')}
            desc={t('feat_inventory_desc')}
            icon={Package}
            href="/resources"
          />
        </section>
      </div>
    </DashboardLayout>
  );
}

function HUDIndicator({ label, value }: { label: string, value: string }) {
  return (
    <div className="bg-black/60 backdrop-blur-md border border-white/5 p-3 rounded-xl min-w-[120px]">
      <p className="text-[8px] font-black text-neutral-500 uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-xs font-black text-white italic tracking-tighter">{value}</p>
    </div>
  );
}

function MiniStats({ label, value, trend, color = "text-white" }: { label: string, value: string, trend: string, color?: string }) {
  return (
    <div className="flex items-end justify-between border-l-2 border-sapphire/20 pl-4">
      <div>
        <p className="text-[9px] font-black text-neutral-500 uppercase tracking-widest mb-1">{label}</p>
        <p className={`text-xl font-black ${color} tracking-tighter`}>{value}</p>
      </div>
      <span className="text-[9px] font-bold text-neutral-400 opacity-60 italic">{trend}</span>
    </div>
  );
}

function FeatureCard({ title, desc, icon: Icon, href, onClick, highlight = false }: {
  title: string,
  desc: string,
  icon: any,
  href: string,
  onClick?: () => void,
  highlight?: boolean
}) {
  const content = (
    <div className={`glass-panel p-8 rounded-3xl hover:border-sapphire/30 group transition-all h-full ${highlight ? 'bg-indigo-600/5 border-sapphire/40 shadow-[0_0_30px_rgba(99,102,241,0.1)]' : ''
      }`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all mb-6 ${highlight
        ? 'bg-indigo-600 border-powder shadow-lg shadow-indigo-600/20'
        : 'bg-navy-panel border-white/5 group-hover:border-sapphire/30 group-hover:bg-sapphire/5'
        }`}>
        <Icon className={`w-6 h-6 transition-all ${highlight ? 'text-white' : 'text-neutral-400 group-hover:text-powder'
          }`} />
      </div>
      <h3 className={`text-xl font-black mb-3 transition-colors uppercase tracking-tight ${highlight ? 'text-white' : 'text-white group-hover:text-indigo-300'
        }`}>{title}</h3>
      <p className="text-sm text-neutral-500 leading-relaxed group-hover:text-neutral-400 transition-colors">{desc}</p>
    </div>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="text-left cursor-pointer focus:outline-none">
        {content}
      </button>
    );
  }

  return (
    <Link href={href}>
      {content}
    </Link>
  );
}
