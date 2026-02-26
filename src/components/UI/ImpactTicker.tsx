'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Utensils, Users, Tent, Droplets, Heart, Truck, ShieldCheck } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { getTranslation, TranslationKey } from '@/lib/translations';

interface StatItem {
    label: TranslationKey;
    value: number;
    icon: React.ElementType;
    suffix?: string;
    color: string;
    increment: { min: number; max: number };
    interval: number; // ms between increments
}

const STATS: StatItem[] = [
    { label: 'meals', value: 12847, icon: Utensils, color: 'text-amber-400', increment: { min: 1, max: 5 }, interval: 3000 },
    { label: 'active_vols', value: 142, icon: Users, color: 'text-emerald-400', increment: { min: 0, max: 1 }, interval: 12000 },
    { label: 'sheltered', value: 3892, icon: Tent, color: 'text-sky-400', increment: { min: 1, max: 3 }, interval: 5000 },
    { label: 'water', value: 28450, icon: Droplets, color: 'text-blue-400', suffix: 'L', increment: { min: 5, max: 20 }, interval: 4000 },
    { label: 'donations_recv', value: 847, icon: Heart, color: 'text-rose-400', increment: { min: 0, max: 1 }, interval: 15000 },
    { label: 'supply_runs', value: 389, icon: Truck, color: 'text-orange-400', increment: { min: 0, max: 1 }, interval: 8000 },
    { label: 'camps_op', value: 12, icon: ShieldCheck, color: 'text-indigo-400', increment: { min: 0, max: 0 }, interval: 60000 },
];

function AnimatedCounter({ value }: { value: number }) {
    const [display, setDisplay] = useState(value);

    useEffect(() => {
        // Animate from current to new value
        const diff = value - display;
        if (diff === 0) return;

        const step = Math.ceil(diff / 10);
        const timer = setInterval(() => {
            setDisplay(prev => {
                const next = prev + step;
                if (next >= value) {
                    clearInterval(timer);
                    return value;
                }
                return next;
            });
        }, 30);

        return () => clearInterval(timer);
    }, [value]);

    return <span>{display.toLocaleString()}</span>;
}

export function ImpactTicker() {
    const { language } = useAppStore();
    const t = (key: any) => getTranslation(language, key);
    const [stats, setStats] = useState(STATS.map(s => s.value));

    // Simulate live increments
    useEffect(() => {
        const timers = STATS.map((stat, i) =>
            setInterval(() => {
                const inc = Math.floor(Math.random() * (stat.increment.max - stat.increment.min + 1)) + stat.increment.min;
                if (inc > 0) {
                    setStats(prev => {
                        const next = [...prev];
                        next[i] += inc;
                        return next;
                    });
                }
            }, stat.interval)
        );

        return () => timers.forEach(clearInterval);
    }, []);

    return (
        <div className="w-full overflow-hidden mb-6">
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
                <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">
                    {t('impact_dashboard')}
                </span>
                <span className="text-[8px] font-bold text-neutral-600 uppercase tracking-widest">
                    — {t('simulated_data')}
                </span>
            </div>

            {/* Scrolling ticker */}
            <div className="relative">
                <div className="overflow-hidden">
                    <motion.div
                        className="flex gap-4 w-max"
                        animate={{ x: ['0%', '-50%'] }}
                        transition={{
                            x: {
                                duration: 30,
                                repeat: Infinity,
                                ease: 'linear',
                            },
                        }}
                    >
                        {/* Duplicate stats for seamless loop */}
                        {[...STATS, ...STATS].map((stat, idx) => {
                            const value = stats[idx % STATS.length];
                            return (
                                <div
                                    key={idx}
                                    className="flex items-center gap-3 px-5 py-2.5 glass-card shrink-0 group hover:border-white/20 transition-colors"
                                >
                                    <stat.icon className={`w-4 h-4 ${stat.color} shrink-0`} />
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-lg font-black text-white tracking-tight tabular-nums">
                                            <AnimatedCounter value={value} />
                                            {stat.suffix && <span className="text-xs text-neutral-400 ml-0.5">{stat.suffix}</span>}
                                        </span>
                                        <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider whitespace-nowrap">
                                            {t(stat.label)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </motion.div>
                </div>

                {/* Fade edges */}
                <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[var(--bg-base)] to-transparent pointer-events-none z-10" />
                <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[var(--bg-base)] to-transparent pointer-events-none z-10" />
            </div>
        </div>
    );
}
