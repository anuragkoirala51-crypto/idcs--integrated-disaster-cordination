'use client';

import { useAppStore } from '@/store/useAppStore';
import { Package, AlertTriangle, ArrowDown } from 'lucide-react';
import { getTranslation } from '@/lib/translations';

import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { MeshSyncButton } from '@/components/UI/MeshSyncButton';

export default function ResourcesPage() {
  const { resources, camps, consumeResource, language } = useAppStore();
  const t = (key: any) => getTranslation(language, key);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-white mb-2">{t('res_inventory')}</h2>
            <p className="text-neutral-400">{t('res_desc')}</p>
          </div>
          <MeshSyncButton />
        </div>

        <div className="glass-panel overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
            <h3 className="font-semibold flex items-center">
              <Package className="w-5 h-5 mr-2 text-powder" />
              {t('active_inv')}
            </h3>
            <span className="text-xs font-medium text-neutral-500">{resources.length} {t('items_tracked')}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-neutral-400 uppercase bg-navy-panel/80 sticky top-0 backdrop-blur-md">
                <tr>
                  <th className="px-6 py-4 font-semibold">{t('item_cat')}</th>
                  <th className="px-6 py-4 font-semibold">{t('location')}</th>
                  <th className="px-6 py-4 font-semibold text-right">{t('quantity')}</th>
                  <th className="px-6 py-4 font-semibold text-center">{t('status')}</th>
                  <th className="px-6 py-4 font-semibold text-right">{t('action_sim')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {resources.map(resource => {
                  const camp = camps.find(c => c.id === resource.campId);
                  const isCritical = resource.isCriticalShortage;

                  return (
                    <tr key={resource.id} className="hover:bg-neutral-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-white">{resource.name}</p>
                        <p className="text-xs text-neutral-500 mt-1">{resource.category}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-neutral-300">
                        {camp?.name || t('central_wh')}
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-base">
                        {resource.quantity} <span className="text-xs text-neutral-500">{resource.unit}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {isCritical ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-500 border border-red-500/20">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {t('critical')}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-sapphire/10 text-sapphire border border-sapphire/20">
                            {t('adequate')}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => consumeResource(resource.id, 5)}
                          disabled={resource.quantity === 0}
                          className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold neo-btn ${resource.quantity === 0
                            ? 'opacity-50 text-neutral-600 cursor-not-allowed'
                            : 'text-white hover:text-ice'
                            }`}
                          title={t('consume_sim_desc')}
                        >
                          <ArrowDown className="w-3 h-3 mr-1" />
                          {t('consume_5')}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
