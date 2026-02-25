'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { MessageSquarePlus, Send, MapPin, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { DashboardLayout } from '@/components/Layout/DashboardLayout';

export default function ReportPage() {
  const { addIncidentReport } = useAppStore();
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    reporterName: '',
    type: 'Medical' as 'Medical' | 'Food' | 'Infrastructure' | 'Water' | 'Other',
    description: '',
    lat: 26.1388,
    lng: 91.6625
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Assign rough intensity based on type for the heatmap
    let intensity = 0.5;
    if (formData.type === 'Medical') intensity = 0.9;
    if (formData.type === 'Infrastructure') intensity = 0.8;
    if (formData.type === 'Food' || formData.type === 'Water') intensity = 0.7;

    addIncidentReport({
      reporterName: formData.reporterName,
      type: formData.type,
      description: formData.description,
      location: { lat: formData.lat, lng: formData.lng },
      intensity
    });

    setSubmitted(true);
    setTimeout(() => {
      router.push('/');
    }, 2000);
  };

  if (submitted) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
          <div className="w-20 h-20 bg-sapphire/10 rounded-full flex items-center justify-center border border-sapphire/20">
            <CheckCircle2 className="w-10 h-10 text-sapphire" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Report Submitted Successfully</h2>
            <p className="text-neutral-400">Our authorities have been notified and will verify the report shortly.</p>
          </div>
          <p className="text-xs text-neutral-500 animate-pulse">Redirecting to Relief Hub...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto py-10 space-y-8">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-powder mb-1">
            <MessageSquarePlus className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-widest">Public Incident Reporting</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Citizen Need Report</h1>
          <p className="text-neutral-400">Identify an urgent need or a hazard? Reporting it helps authorities coordinate faster.</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel rounded-[32px] p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-neutral-300 mb-2">FullName / Organization</label>
              <input
                required
                type="text"
                placeholder="e.g., Rahul Sharma"
                value={formData.reporterName}
                onChange={e => setFormData(prev => ({ ...prev, reporterName: e.target.value }))}
                className="w-full neo-inset rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sapphire/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-300 mb-2">Type of Need</label>
              <select
                value={formData.type}
                onChange={e => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full neo-inset rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sapphire/50 transition-all"
              >
                <option value="Medical">Medical Support Required</option>
                <option value="Food">Food / Water Supplies</option>
                <option value="Infrastructure">Infrastructure Hazard (Power/Road)</option>
                <option value="Water">Water Inundation / Flood</option>
                <option value="Other">Other Urgent Assistance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-300 mb-2">Description</label>
              <textarea
                required
                rows={4}
                placeholder="Provide specific details about the situation..."
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full neo-inset rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sapphire/50 transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-neutral-300 mb-2">Latitude</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                  <input
                    type="number" step="any"
                    value={formData.lat}
                    onChange={e => setFormData(prev => ({ ...prev, lat: parseFloat(e.target.value) }))}
                    className="w-full neo-inset rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sapphire/50 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral-300 mb-2">Longitude</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                  <input
                    type="number" step="any"
                    value={formData.lng}
                    onChange={e => setFormData(prev => ({ ...prev, lng: parseFloat(e.target.value) }))}
                    className="w-full neo-inset rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sapphire/50 transition-all"
                  />
                </div>
              </div>
            </div>
            <p className="text-[10px] text-neutral-600 italic">Defaults to current campus center if location is unknown.</p>
          </div>

          <button
            type="submit"
            className="w-full neo-btn text-powder font-black py-4 rounded-xl flex items-center justify-center space-x-2"
          >
            <Send className="w-5 h-5" />
            <span>Submit Public Report</span>
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
