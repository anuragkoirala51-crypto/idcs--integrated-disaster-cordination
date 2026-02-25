'use client';

import { useAppStore } from '@/store/useAppStore';
import { Package, AlertTriangle, ArrowDown } from 'lucide-react';

import { DashboardLayout } from '@/components/Layout/DashboardLayout';

export default function ResourcesPage() {
  const { resources, camps, consumeResource } = useAppStore();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Resource Inventory</h2>
          <p className="text-neutral-400 mt-1">Track relief supplies across all camps and simulate consumption.</p>
        </div>

        <div className="glass-panel overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
            <h3 className="font-semibold flex items-center">
              <Package className="w-5 h-5 mr-2 text-powder" />
              Active Inventories
            </h3>
            <span className="text-xs font-medium text-neutral-500">{resources.length} Items Tracked</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-neutral-400 uppercase bg-navy-panel/80 sticky top-0 backdrop-blur-md">
                <tr>
                  <th className="px-6 py-4 font-semibold">Item & Category</th>
                  <th className="px-6 py-4 font-semibold">Location</th>
                  <th className="px-6 py-4 font-semibold text-right">Quantity</th>
                  <th className="px-6 py-4 font-semibold text-center">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Action (Simulate)</th>
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
                        {camp?.name || 'Central Warehouse'}
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-base">
                        {resource.quantity} <span className="text-xs text-neutral-500">{resource.unit}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {isCritical ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-500 border border-red-500/20">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Critical
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-sapphire/10 text-sapphire border border-sapphire/20">
                            Adequate
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
                          title="Simulate consuming 5 units"
                        >
                          <ArrowDown className="w-3 h-3 mr-1" />
                          Consume 5
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
