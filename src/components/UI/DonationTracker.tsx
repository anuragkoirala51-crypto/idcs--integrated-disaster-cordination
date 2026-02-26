'use client';

import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle2, Factory, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { getTranslation } from '@/lib/translations';

interface TrackingProps {
  trackingId: string;
  itemName: string;
  quantity: number;
}

export function DonationTracker({ trackingId, itemName, quantity }: TrackingProps) {
  const { language } = useAppStore();
  const t = (key: any) => getTranslation(language, key);

  const steps = [
    { title: 'rec_hub', icon: Factory, completed: true },
    { title: 'sort_pack', icon: Package, completed: true },
    { title: 'in_transit', icon: Truck, completed: true, active: true },
    { title: 'arr_camp', icon: CheckCircle2, completed: false }
  ];

  return (
    <div className="bg-navy-panel border border-neutral-800 rounded-xl p-8 shadow-lg relative overflow-hidden">
      {/* Background glow for current status */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-sapphire/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 relative z-10">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{t('live_shipment')}</h3>
          <p className="text-neutral-400 font-mono text-sm leading-relaxed">
            <span className="text-powder font-bold">{trackingId}</span> &bull; {quantity}x {itemName}
          </p>
        </div>
        <div className="mt-4 md:mt-0 px-4 py-2 bg-sapphire/10 border border-sapphire/20 rounded-full flex items-center shadow-sm">
          <Truck className="w-4 h-4 text-powder mr-2" />
          <span className="text-xs font-bold text-powder uppercase tracking-widest">{t('out_delivery')}</span>
        </div>
      </div>

      <div className="relative z-10">
        {/* Progress Line */}
        <div className="absolute top-5 left-8 right-8 h-1 bg-neutral-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '66%' }} // Hardcoded for 'In Transit'
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute top-0 left-0 h-full bg-sapphire"
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.2 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10 transition-colors ${step.completed
                      ? 'bg-sapphire text-navy shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                      : 'bg-neutral-800 text-neutral-500'
                    } ${step.active ? 'ring-4 ring-sapphire/20' : ''}`}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>
                <div className="mt-4 text-center">
                  <p className={`text-xs font-bold uppercase tracking-wider ${step.completed ? 'text-white' : 'text-neutral-500'}`}>
                    {t(step.title as any)}
                  </p>
                  {step.active && (
                    <p className="text-[10px] text-powder mt-1 font-mono">{t('est_time')}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
