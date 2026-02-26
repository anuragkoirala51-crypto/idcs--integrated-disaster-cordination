'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Heart, HandCoins, TrendingUp, Users, PieChart as PieChartIcon,
  ArrowUpRight, Search, Plus, Calendar, ShieldCheck, Wallet,
  Banknote, IndianRupee, CreditCard, ChevronRight, CheckCircle2
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { useAppStore } from '@/store/useAppStore';
import { getTranslation } from '@/lib/translations';

// --- Interfaces ---
interface Donation {
  id: string;
  donorName: string;
  amount: number;
  purpose: string;
  date: string;
  category: 'Medical' | 'Food' | 'Shelter' | 'Logistics' | 'General';
  status: 'Completed' | 'Processing';
}

// --- Mock Initial Data ---
const INITIAL_MOCK_DATA: Donation[] = [
  { id: '1', donorName: 'Global Relief Foundation', amount: 500000, purpose: 'Emergency Medical Supplies', date: '2026-02-25T10:00:00Z', category: 'Medical', status: 'Completed' },
  { id: '2', donorName: 'TechCare Corp', amount: 250000, purpose: 'Temporary Shelter Construction', date: '2026-02-24T14:30:00Z', category: 'Shelter', status: 'Completed' },
  { id: '3', donorName: 'Rajesh Kumar', amount: 15000, purpose: 'Community Kitchen Support', date: '2026-02-25T16:45:00Z', category: 'Food', status: 'Completed' },
  { id: '4', donorName: 'Assam Logistics Group', amount: 120000, purpose: 'Last-mile delivery fuel', date: '2026-02-23T09:15:00Z', category: 'Logistics', status: 'Completed' },
  { id: '5', donorName: 'Anita Sharma', amount: 5000, purpose: 'General Relief Fund', date: '2026-02-26T08:20:00Z', category: 'General', status: 'Processing' },
  { id: '6', donorName: 'United Relief', amount: 300000, purpose: 'Water Purification Units', date: '2026-02-22T11:00:00Z', category: 'Medical', status: 'Completed' },
];

export default function DonationsPage() {
  const { language } = useAppStore();
  const t = (key: any) => getTranslation(language, key);
  const [activeDonations, setActiveDonations] = useState<Donation[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newDonation, setNewDonation] = useState({
    donorName: '',
    amount: '',
    purpose: '',
    category: 'General' as Donation['category']
  });

  // --- Persistence Logic ---
  useEffect(() => {
    const saved = localStorage.getItem('quantum_donations');
    if (saved) {
      setActiveDonations(JSON.parse(saved));
    } else {
      setActiveDonations(INITIAL_MOCK_DATA);
      localStorage.setItem('quantum_donations', JSON.stringify(INITIAL_MOCK_DATA));
    }
  }, []);

  const saveDonations = (data: Donation[]) => {
    setActiveDonations(data);
    localStorage.setItem('quantum_donations', JSON.stringify(data));
  };

  // --- Statistics & Calculations ---
  const stats = useMemo(() => {
    const total = activeDonations.reduce((sum, d) => sum + d.amount, 0);
    const donorCount = new Set(activeDonations.map(d => d.donorName)).size;
    const today = new Date().toISOString().split('T')[0];
    const todaysTotal = activeDonations
      .filter(d => d.date.startsWith(today))
      .reduce((sum, d) => sum + d.amount, 0);

    return { total, donorCount, todaysTotal };
  }, [activeDonations]);

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    activeDonations.forEach(d => {
      counts[d.category] = (counts[d.category] || 0) + d.amount;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [activeDonations]);

  const chartData = useMemo(() => {
    // Process last 7 days
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return days.map(day => ({
      date: day.split('-').slice(1).join('/'),
      amount: activeDonations
        .filter(d => d.date.startsWith(day))
        .reduce((sum, d) => sum + d.amount, 0)
    }));
  }, [activeDonations]);

  // --- Handlers ---
  const handleSubmitDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDonation.donorName || !newDonation.amount) return;

    const donation: Donation = {
      id: Math.random().toString(36).substr(2, 9),
      donorName: newDonation.donorName,
      amount: Number(newDonation.amount),
      purpose: newDonation.purpose || 'General Support',
      category: newDonation.category,
      date: new Date().toISOString(),
      status: 'Processing'
    };

    saveDonations([donation, ...activeDonations]);
    setIsModalOpen(false);
    setNewDonation({ donorName: '', amount: '', purpose: '', category: 'General' });
  };

  const filteredDonations = activeDonations.filter(d =>
    d.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const CATEGORY_COLORS: Record<string, string> = {
    Medical: '#818cf8',
    Food: '#fbbf24',
    Shelter: '#f472b6',
    Logistics: '#34d399',
    General: '#94a3b8'
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-10">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-powder">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">{t('verified_transparency')}</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">{t('relief_cap_dash')}</h1>
            <p className="text-neutral-500 max-w-xl">{t('donations_desc')}</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-4 neo-btn text-white font-black text-xs uppercase tracking-widest rounded-2xl flex items-center group hover:text-powder"
          >
            <HandCoins className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
            {t('init_donation')}
          </button>
        </div>

        {/* Global Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            label={t('total_liquidity')}
            value={`₹${stats.total.toLocaleString()}`}
            sub={t('consolidated_funds')}
            icon={IndianRupee}
            color="text-powder"
            bg="bg-powder/10"
          />
          <StatCard
            label={t('verified_benefactors')}
            value={stats.donorCount.toString()}
            sub={t('entities_desc')}
            icon={Users}
            color="text-powder"
            bg="bg-powder/10"
          />
          <StatCard
            label={t('today_velocity')}
            value={`₹${stats.todaysTotal.toLocaleString()}`}
            sub={t('inflow_24h')}
            icon={TrendingUp}
            color="text-ice"
            bg="bg-amber-400/10"
          />
        </div>

        {/* Tactical Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Trend Chart */}
          <div className="xl:col-span-2 glass-panel p-8 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-white font-black text-xs uppercase tracking-widest mb-1">{t('funding_velocity')}</h3>
                <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-tighter">{t('last_7_days')}</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-sapphire animate-ping"></div>
                <span className="text-[10px] font-black text-powder tracking-widest uppercase">{t('live_feed')}</span>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="#525252"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontWeight: 800 }}
                  />
                  <YAxis
                    stroke="#525252"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `₹${val < 1000 ? val : (val / 1000).toFixed(0) + 'k'}`}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '10px' }}
                    itemStyle={{ color: '#fff', fontWeight: 900 }}
                    cursor={{ stroke: '#ffffff10', strokeWidth: 1 }}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAmt)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Allocation Breakdown */}
          <div className="glass-panel p-8 flex flex-col">
            <h3 className="text-white font-black text-xs uppercase tracking-widest mb-6">{t('strategic_allocation')}</h3>
            <div className="h-[200px] w-full flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#6366f1'} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: 900 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-6">
              {categoryData.map(item => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[item.name] }}></div>
                    <span className="text-[10px] font-black text-neutral-400 tracking-widest uppercase">
                      {item.name === 'General' ? t('general_relief') :
                        item.name === 'Medical' ? t('medical_care') :
                          item.name === 'Food' ? t('food_nutrition') :
                            item.name === 'Shelter' ? t('emergency_housing') :
                              item.name === 'Logistics' ? t('supply_logistics') : item.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-white">₹{item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Ledger Table */}
        <div className="glass-panel overflow-hidden border-white/5 shadow-2xl">
          <div className="p-8 border-b border-white/5 bg-white/[0.02] flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 flex items-center justify-center border border-sapphire/30">
                <Wallet className="w-6 h-6 text-powder" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white tracking-tight uppercase">{t('contribution_ledger')}</h3>
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{t('public_chain')}</p>
              </div>
            </div>
            <div className="relative group/search">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within/search:text-sapphire transition-colors" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('search_donors')}
                className="pl-12 pr-6 py-3 bg-black/40 border border-white/10 rounded-2xl text-[10px] font-black tracking-widest text-white focus:outline-none focus:border-sapphire focus:ring-1 focus:ring-sapphire/20 w-[300px] transition-all uppercase placeholder:text-neutral-700"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/[0.01] border-b border-white/5">
                  <th className="px-8 py-5 text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">{t('timestamp')}</th>
                  <th className="px-8 py-5 text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">{t('donor_entity')}</th>
                  <th className="px-8 py-5 text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">{t('sector')}</th>
                  <th className="px-8 py-5 text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">{t('amount')}</th>
                  <th className="px-8 py-5 text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">{t('alloc_status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredDonations.map((donation, idx) => (
                  <motion.tr
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={donation.id}
                    className="hover:bg-white/[0.03] transition-colors group"
                  >
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-xs font-mono font-bold text-neutral-300">
                          {new Date(donation.date).toLocaleDateString('en-IN')}
                        </span>
                        <span className="text-[9px] font-black text-neutral-600 uppercase tracking-tighter">
                          {new Date(donation.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center border border-white/5 group-hover:border-sapphire/30 transition-colors">
                          <Users className="w-4 h-4 text-neutral-500" />
                        </div>
                        <span className="text-sm font-black text-white group-hover:text-indigo-300 transition-colors">{donation.donorName}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-white/[0.02] border border-white/10 rounded-full text-[9px] font-black text-neutral-400 uppercase tracking-widest">
                        {donation.category === 'General' ? t('general_relief') :
                          donation.category === 'Medical' ? t('medical_care') :
                            donation.category === 'Food' ? t('food_nutrition') :
                              donation.category === 'Shelter' ? t('emergency_housing') :
                                donation.category === 'Logistics' ? t('supply_logistics') : donation.category}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-1.5 text-powder font-mono font-black">
                        <Plus className="w-3 h-3" />
                        <span>₹{donation.amount.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${donation.status === 'Completed' ? 'bg-sapphire shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-ice animate-pulse'}`}></div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${donation.status === 'Completed' ? 'text-sapphire' : 'text-ice'}`}>
                          {donation.status === 'Completed' ? t('completed') : t('processing')}
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Donation Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="glass-panel w-full max-w-lg overflow-hidden shadow-[0_0_80px_rgba(99,102,241,0.2)] relative z-10"
              >
                <div className="p-8 space-y-8">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-black text-white tracking-tight uppercase">{t('init_contrib')}</h2>
                      <p className="text-[10px] font-bold text-neutral-500 tracking-[0.2em] uppercase mt-1">{t('auth_res_alloc')}</p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="text-neutral-500 hover:text-white">
                      <Plus className="w-6 h-6 rotate-45" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmitDonation} className="space-y-6">
                    <FormInput
                      label={t('benefactor_name')}
                      placeholder="Enter full name or organization..."
                      value={newDonation.donorName}
                      onChange={(v: string) => setNewDonation({ ...newDonation, donorName: v })}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormInput
                        label={t('amount_inr')}
                        type="number"
                        placeholder="5000"
                        value={newDonation.amount}
                        onChange={(v: string) => setNewDonation({ ...newDonation, amount: v })}
                      />
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{t('sector_alloc')}</label>
                        <select
                          value={newDonation.category}
                          onChange={(e) => setNewDonation({ ...newDonation, category: e.target.value as Donation['category'] })}
                          className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-sapphire"
                        >
                          <option value="General">{t('general_relief')}</option>
                          <option value="Medical">{t('medical_care')}</option>
                          <option value="Food">{t('food_nutrition')}</option>
                          <option value="Shelter">{t('emergency_housing')}</option>
                          <option value="Logistics">{t('supply_logistics')}</option>
                        </select>
                      </div>
                    </div>
                    <FormInput
                      label={t('purpose_memo')}
                      placeholder="Brief description of intent..."
                      value={newDonation.purpose}
                      onChange={(v) => setNewDonation({ ...newDonation, purpose: v })}
                    />

                    <button
                      type="submit"
                      className="w-full py-5 neo-btn text-powder font-black uppercase tracking-widest rounded-3xl flex items-center justify-center group"
                    >
                      {t('confirm_tx')}
                      <ArrowUpRight className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                  </form>
                </div>
                <div className="p-4 bg-sapphire/10 border-t border-sapphire/20 flex items-center justify-center space-x-2">
                  <CheckCircle2 className="w-3 h-3 text-sapphire" />
                  <span className="text-[9px] font-black text-sapphire uppercase tracking-widest italic text-center">{t('pipeline_active')}</span>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </DashboardLayout>
  );
}

// --- Subcomponents ---

function StatCard({ label, value, sub, icon: Icon, color, bg }: { label: string, value: string | number, sub: string, icon: any, color: string, bg: string }) {
  return (
    <div className="glass-card p-8 relative overflow-hidden group hover:border-white/20 transition-all">
      <div className={`absolute -right-4 -top-4 w-24 h-24 ${bg} rounded-full blur-3xl opacity-50 group-hover:scale-150 transition-transform duration-700`}></div>
      <div className="relative z-10 flex flex-col h-full">
        <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center mb-6 border border-white/5`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <h3 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-1">{label}</h3>
        <div className="text-3xl font-black text-white tracking-tight leading-none mb-3">{value}</div>
        <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-tighter mt-auto italic">{sub}</p>
      </div>
    </div>
  );
}

function FormInput({ label, type = "text", placeholder, value, onChange }: { label: string, type?: string, placeholder?: string, value: string | number, onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full neo-inset rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-sapphire focus:ring-1 focus:ring-sapphire/50 transition-all placeholder:text-neutral-700"
      />
    </div>
  );
}
