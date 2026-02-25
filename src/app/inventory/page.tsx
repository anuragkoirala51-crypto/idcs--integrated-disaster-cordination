'use client';

import { useState } from 'react';
import {
  Search,
  Map as MapIcon,
  Database,
  Filter,
  Download,
  ShieldCheck
} from 'lucide-react';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { motion } from 'framer-motion';

export default function InventoryQueryPage() {
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Form State
  const [query, setQuery] = useState({
    state: '',
    district: '',
    category: '',
    item: '',
    fromDate: '',
    toDate: '',
    deptType: '',
    deptName: ''
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setHasSearched(false);
    // Simulate network query
    setTimeout(() => {
      setIsSearching(false);
      setHasSearched(true);
    }, 1500);
  };

  const simulatedResults = [
    { id: 'RES-001', district: 'Kamrup Metro', category: 'Heavy Equipment', item: 'JCB Excavator', qty: 12, dept: 'PWD Assam', contact: '91-98765-XXXXX' },
    { id: 'RES-002', district: 'Kamrup Metro', category: 'Medical', item: 'Trauma Kits', qty: 250, dept: 'State Health Dept', contact: '91-99887-XXXXX' },
    { id: 'RES-003', district: 'Dispur', category: 'Manpower', item: 'NDRF Personnel', qty: 45, dept: 'Central Govt', contact: '91-11223-XXXXX' },
    { id: 'RES-004', district: 'Kamrup Metro', category: 'Equipment', item: 'High-Cap Generators', qty: 8, dept: 'Private/NGO', contact: 'Reliance Found.' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">

        {/* Header */}
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 px-3 py-1 bg-ice/10 rounded-full border border-ice/20 w-max">
              <ShieldCheck className="w-3.5 h-3.5 text-ice" />
              <span className="text-[10px] font-bold text-ice uppercase tracking-tighter">National Database Access</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">Resource Inventory Query</h1>
            <p className="text-neutral-400">Country Wide Query for Disaster Equipment and Manpower Matrix</p>
          </div>

          <button className="flex items-center px-4 py-2 neo-btn rounded-lg text-sm text-neutral-400 hover:text-white">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Query Form (Left 2 Columns) */}
          <div className="col-span-1 lg:col-span-2 space-y-6">
            <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
              {/* Visual Flair */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>

              <div className="flex items-center space-x-2 mb-6 border-b border-white/5 pb-4">
                <Filter className="w-5 h-5 text-ice" />
                <h2 className="text-xl font-bold flex-1 text-white">Search Parameters</h2>
                <span className="text-[10px] text-sapphire uppercase tracking-widest font-mono flex items-center">
                  <span className="w-2 h-2 bg-sapphire rounded-full animate-pulse mr-2"></span>
                  IDRN Sync: ONLINE
                </span>
              </div>

              <form onSubmit={handleSearch} className="space-y-6">
                {/* Grid 1: Location & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-wide">State *</label>
                    <select required className="w-full neo-inset rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500/50 focus:border-ice/50 transition-all">
                      <option value="">Select State</option>
                      <option value="assam">Assam</option>
                      <option value="maharashtra">Maharashtra</option>
                      <option value="delhi">Delhi</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-wide">District *</label>
                    <select disabled className="w-full neo-inset opacity-50 cursor-not-allowed rounded-xl px-4 py-3 text-white transition-all">
                      <option>Select District</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-wide">Resource Category *</label>
                    <select required className="w-full neo-inset rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500/50 transition-all">
                      <option value="">Select Category</option>
                      <option value="equipment">Heavy Equipment</option>
                      <option value="medical">Medical Supplies</option>
                      <option value="manpower">Specialized Manpower</option>
                      <option value="all">-- All Categories --</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-wide">Specific Item *</label>
                    <select className="w-full neo-inset opacity-50 cursor-not-allowed rounded-xl px-4 py-3 text-white transition-all">
                      <option>Select Item</option>
                    </select>
                  </div>

                  {/* Dates */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-wide">Available From</label>
                    <input type="date" className="w-full neo-inset rounded-xl px-4 py-3 text-neutral-400 focus:ring-2 focus:ring-amber-500/50 transition-all [color-scheme:dark]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-wide">Available To</label>
                    <input type="date" className="w-full neo-inset rounded-xl px-4 py-3 text-neutral-400 focus:ring-2 focus:ring-amber-500/50 transition-all [color-scheme:dark]" />
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-wide">Department Type</label>
                    <select className="w-full neo-inset rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500/50 transition-all">
                      <option value="">Select Dept Type</option>
                      <option value="state">State Govt</option>
                      <option value="central">Central Govt</option>
                      <option value="private">Private/NGO</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-wide">Department Name</label>
                    <input type="text" placeholder="e.g. PWD, NDRF" className="w-full neo-inset rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500/50 transition-all" />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-4 pt-6 mt-6 border-t border-white/5">
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="flex-1 neo-btn text-ice font-black py-4 rounded-xl flex items-center justify-center space-x-2"
                  >
                    {isSearching ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        <span>Execute Query</span>
                      </>
                    )}
                  </button>
                  <button type="reset" className="px-8 py-4 neo-btn rounded-xl text-white font-bold">
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Interactive Map Visual (Right Column) */}
          <div className="col-span-1">
            <div className="glass-panel rounded-2xl h-full min-h-[500px] flex flex-col relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-transparent"></div>
              <div className="p-6 border-b border-white/5 flex items-center justify-between z-10">
                <div className="flex items-center space-x-2">
                  <MapIcon className="w-5 h-5 text-powder" />
                  <h3 className="font-bold text-white">Geospatial Distribution</h3>
                </div>
              </div>

              {/* Map Implementation Placeholder */}
              <div className="flex-1 relative bg-black flex items-center justify-center p-8 overflow-hidden">
                <div className="absolute inset-0 scanline opacity-20 pointer-events-none"></div>

                {/* Simplified India Map implementation for the hackathon */}
                <div className="w-full h-full relative z-10 flex flex-col items-center justify-center">
                  {isSearching ? (
                    <div className="space-y-4 text-center animate-pulse">
                      <Database className="w-12 h-12 text-ice mx-auto" />
                      <p className="text-sm font-mono text-ice">Querying National DB...</p>
                    </div>
                  ) : (
                    <div className="space-y-4 text-center transition-all duration-500">
                      <MapIcon className={`w-16 h-16 mx-auto ${hasSearched ? 'text-sapphire' : 'text-neutral-800'}`} />
                      <p className={`text-sm font-mono ${hasSearched ? 'text-powder' : 'text-neutral-500'}`}>
                        {hasSearched ? 'State Selected: Assam' : 'Awaiting Query Parameters'}
                      </p>
                      {!hasSearched && (
                        <div className="w-full max-w-[200px] h-2 bg-navy-panel rounded-full mx-auto overflow-hidden">
                          <div className="w-1/3 h-full bg-sapphire/20 rounded-full animate-[ping_3s_infinite]"></div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Results Table */}
        {hasSearched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <h3 className="text-lg font-bold text-white flex items-center">
                <Database className="w-5 h-5 mr-3 text-powder" />
                Query Results Matrix
              </h3>
              <span className="text-xs font-mono text-powder bg-sapphire/10 px-3 py-1 rounded-full border border-sapphire/20">
                {simulatedResults.length} Records Found
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-neutral-400">
                <thead className="bg-[#0c0c0c] text-xs uppercase text-neutral-500 font-black border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4">Resource ID</th>
                    <th className="px-6 py-4">District</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Item Name</th>
                    <th className="px-6 py-4">Quantity</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Contact Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/50">
                  {simulatedResults.map((res) => (
                    <tr key={res.id} className="hover:bg-neutral-800/20 transition-colors">
                      <td className="px-6 py-4 font-mono text-powder">{res.id}</td>
                      <td className="px-6 py-4 text-white">{res.district}</td>
                      <td className="px-6 py-4">{res.category}</td>
                      <td className="px-6 py-4 font-bold text-ice">{res.item}</td>
                      <td className="px-6 py-4 text-white">{res.qty}</td>
                      <td className="px-6 py-4">{res.dept}</td>
                      <td className="px-6 py-4 font-mono text-xs">{res.contact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
