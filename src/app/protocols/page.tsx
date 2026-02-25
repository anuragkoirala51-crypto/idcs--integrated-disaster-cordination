'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Activity,
  Droplets,
  Wind,
  Waves,
  ShieldAlert,
  ChevronRight,
  Flame,
  Mountain,
  Biohazard,
  PhoneCall,
  ThermometerSun,
  Zap,
  CheckSquare,
  AlertTriangle,
  LifeBuoy,
  HeartPulse,
  Syringe,
  Search,
  Snowflake,
  ExternalLink
} from 'lucide-react';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';

const protocols = [
  {
    id: 'eq',
    icon: Activity,
    title: 'Earthquakes',
    color: 'text-ice',
    bgColor: 'bg-ice/10',
    borderColor: 'border-ice/20',
    dos: [
      { label: 'Drop, Cover, Hold On', content: 'Drop to the floor, take cover under a sturdy desk/table, and hold on until shaking stops.' },
      { label: 'Structural Safety', content: 'Use earthquake-resistant construction codes and anchor heavy objects to walls.' },
      { label: 'Exit Strategy', content: 'If outdoors, move to an open area away from buildings, trees, and power lines.' },
      { label: 'Gas Isolation', content: 'If you smell gas, open windows and leave immediately. Do not use matches or switches.' }
    ],
    donts: [
      { label: 'Vertical Transit', content: 'Strictly Prohibited: Do not use elevators during or after the quake.' },
      { label: 'Window Proximity', content: 'Do not stay near glass windows, mirrors, or heavy hanging objects.' },
      { label: 'Panic Run', content: 'Do not attempt to run out of a building while the earth is still shaking.' }
    ],
    advancedGuide: {
      sequence: [
        { env: 'Indoors', action: 'Stay inside. Move away from glass. Drop and Cover.' },
        { env: 'Driving', action: 'Stop in a clear area. Stay inside the vehicle away from bridges.' }
      ],
      emergencyKit: [
        { item: 'First Aid Kit', spec: 'Standard NDMA trauma kit requirements.' },
        { item: 'Flashlight', spec: 'High-intensity LED with extra batteries.' }
      ]
    }
  },
  {
    id: 'fl',
    icon: Droplets,
    title: 'Floods (Monsoon)',
    color: 'text-sapphire',
    bgColor: 'bg-sapphire/10',
    borderColor: 'border-sapphire/20',
    dos: [
      { label: 'Vertical Relocation', content: 'Move critical assets and chemicals to highest possible ground.' },
      { label: 'Utility Shutoff', content: 'Disconnect main circuit breaker and gas lines to prevent fires/electrocution.' },
      { label: 'Intelligence', content: 'Listen to official weather warnings on radio/TV and follow evacuation orders.' }
    ],
    donts: [
      { label: 'Active Current', content: 'Do not walk or drive through moving water. 6 inches can knock you down.' },
      { label: 'Grid Contact', content: 'Avoid any contact with electrical switches if you are wet or standing in water.' }
    ]
  },
  {
    id: 'ts',
    icon: Waves,
    title: 'Tsunami',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-400/10',
    borderColor: 'border-cyan-400/20',
    dos: [
      { label: 'Natural Signals', content: 'Notice rapid rise or fall of coastal waters. Move to high ground immediately.' },
      { label: 'Inland Transit', content: 'Move at least 2 miles inland or 100 feet above sea level.' },
      { label: 'Official Alerts', content: 'Monitor NOAA/CWC alerts. If you feel a strong quake at the coast, do not wait for a warning.' }
    ],
    donts: [
      { label: 'Shoreline Watch', content: "Never go to the shore to watch a tsunami. If you can see it, you're too close." },
      { label: 'Wave Sequence', content: "Do not return after the first wave. Tsunamis are a series of waves, often hours apart." }
    ],
    advancedGuide: {
      sequence: [
        { env: 'At Beach', action: 'Move inland immediately. Do not wait for siren.' },
        { env: 'On Boat', action: 'Move to deep water (100 fathoms+) if time permits.' }
      ]
    }
  },
  {
    id: 'cy',
    icon: Wind,
    title: 'Cyclones',
    color: 'text-teal-400',
    bgColor: 'bg-teal-400/10',
    borderColor: 'border-teal-400/20',
    dos: [
      { label: 'Aperture Sealing', content: 'Board up glass windows and secure all loose tiles and outdoor items.' },
      { label: 'Communication', content: 'Keep a battery-operated radio and lantern handy. Monitor hourly updates.' },
      { label: 'Early Evacuation', content: 'Leave early if your house is in a low-lying zone or is structurally weak.' }
    ],
    donts: [
      { label: 'The Eye Error', content: "Do not venture out when winds calm down; you may be in the eye of the storm." },
      { label: 'Grid Hazard', content: "Stay away from broken electric poles and loose wires after the storm." }
    ]
  },
  {
    id: 'tl',
    icon: Zap,
    title: 'Thunder & Lightning',
    color: 'text-powder',
    bgColor: 'bg-powder/10',
    borderColor: 'border-powder/20',
    dos: [
      { label: '30/30 Rule', content: 'Go indoors if you count less than 30s between lightning and thunder.' },
      { label: 'Indoor Shelter', content: 'Stay inside for 30 minutes after the last clap of thunder.' },
      { label: 'Isolate Electronics', content: 'Unplug all electrical appliances to prevent surge damage.' }
    ],
    donts: [
      { label: 'Water Path', content: "Avoid bathing, washing, or any contact with running water during the storm." },
      { label: 'Tall Assets', content: "Do not take shelter under trees or near metal fences/tall structures." },
      { label: 'Surface Contact', content: "Do not lie on concrete floors or lean against concrete walls." }
    ]
  },
  {
    id: 'hw',
    icon: ThermometerSun,
    title: 'Heat Wave',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
    dos: [
      { label: 'Metabolic Hydration', content: 'Drink sufficient water even if not thirsty. Use ORS and lassi.' },
      { label: 'Lightweight Wear', content: 'Wear light-colored, loose cotton clothes and use head protection.' },
      { label: 'Ventilation', content: 'Keep your home cool with curtains, fans, and cross-ventilation.' }
    ],
    donts: [
      { label: 'Solar Peak', content: "Avoid going out between 12:00 PM and 3:00 PM." },
      { label: 'Dehydrators', content: "Avoid alcohol, tea, coffee, and carbonated soft drinks." }
    ]
  },
  {
    id: 'cw',
    icon: Snowflake,
    title: 'Cold Waves',
    color: 'text-sky-300',
    bgColor: 'bg-sky-300/10',
    borderColor: 'border-sky-300/20',
    dos: [
      { label: 'Layering', content: 'Wear multiple layers of loose-fitting, warm cotton/wool clothing.' },
      { label: 'Nutrition', content: 'Consume hot fluids and energy-rich foods to maintain body heat.' },
      { label: 'Medical Watch', content: 'Monitor for signs of frostbite (numbness) and hypothermia.' }
    ],
    donts: [
      { label: 'Alcohol Myth', content: "Do not consume alcohol. It decreases body temperature despite the warming sensation." },
      { label: 'Massage Error', content: "Do not massage frostbitten areas; it can cause severe tissue damage." }
    ]
  },
  {
    id: 'fa',
    icon: HeartPulse,
    title: 'First Aid (BLS)',
    color: 'text-rose-500',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/20',
    dos: [
      { label: 'ABC Protocol', content: 'Airway (Clear), Breathing (Check), Circulation (Monitor/Compress).' },
      { label: 'Bleeding Control', content: 'Apply direct pressure to wounds until bleeding stops.' },
      { label: 'Recovery Position', content: 'Keep unconscious patients on their side to maintain open airway.' }
    ],
    donts: [
      { label: 'Untrained Action', content: "Do not attempt medical procedures beyond your training level." },
      { label: 'Call Delay', content: "Do not delay calling 112/102 while attempting first aid." }
    ],
    advancedGuide: {
      sequence: [
        { env: 'Choking', action: 'Perform Heimlich maneuver or back slaps.' },
        { env: 'Cardiac Arrest', action: 'Initiate CPR (30 compressions : 2 breaths) immediately.' }
      ]
    }
  },
  {
    id: 'sb',
    icon: Syringe,
    title: 'Snake Bites',
    color: 'text-powder',
    bgColor: 'bg-powder/10',
    borderColor: 'border-powder/20',
    dos: [
      { label: 'Immobilize', content: 'Keep the bitten limb completely still using a splint. Do not tie too tightly.' },
      { label: 'Asset Removal', content: 'Remove rings/jewelry before swelling begins.' },
      { label: 'Immediate Transit', content: 'Transport to hospital immediately. Reassure the victim to keep heart rate low.' }
    ],
    donts: [
      { label: 'Traditional Myths', content: "Do not cut the wound, suck venom, or use traditional stones/herbs." },
      { label: 'Cryo-Hazard', content: "Do not apply ice or cold packs to the bite area." }
    ]
  },
  {
    id: 'sr',
    icon: Search,
    title: 'Search & Rescue',
    color: 'text-violet-400',
    bgColor: 'bg-violet-400/10',
    borderColor: 'border-violet-400/20',
    dos: [
      { label: 'Scene Assessment', content: 'Evaluate hazards (gas, fire, glass) before entering any zone.' },
      { label: 'Buddy System', content: 'Never enter a disaster zone alone. Maintain visual contact with team.' },
      { label: 'Victim Triage', content: 'Locate, stabilize, and extricate victims based on medical priority.' }
    ],
    donts: [
      { label: 'Self-Danger', content: "Do not become a victim yourself. Ensure personal safety before SAR." },
      { label: 'Structural Risk', content: "Do not enter collapsed structures without official stabilization clearance." }
    ]
  },
  {
    id: 'ce',
    icon: Biohazard,
    title: 'CBRN Emergency',
    color: 'text-lime-500',
    bgColor: 'bg-lime-500/10',
    borderColor: 'border-lime-500/20',
    dos: [
      { label: 'Upwind Vector', content: 'Always move upwind and uphill from the source of chemical release.' },
      { label: 'Respiratory Shield', content: 'Use masks or damp cloth to filter aerosols and particulates.' },
      { label: 'Rapid Decon', content: 'Flush skin and eyes with high-volume water if exposed.' }
    ],
    donts: [
      { label: 'Direct Check', content: "Do not attempt to identify chemicals by smell or taste." },
      { label: 'Cloud Contact', content: "Avoid any contact with visible vapor clouds or suspicious liquid pools." }
    ]
  }
];

const helplines = [
  { label: 'Emergency Response', number: '112', description: 'Universal Emergency Number' },
  { label: 'Police', number: '100', description: 'Immediate Law Enforcement' },
  { label: 'Fire Dept', number: '101', description: 'Fire & Rescue Services' },
  { label: 'Ambulance', number: '102', description: 'Medical Emergencies' },
  { label: 'Disaster MGMT', number: '108', description: 'NDMA/State Helpline' },
  { label: 'NDRF Control', number: '011-24367330', description: 'National Disaster Response' },
];

export default function ProtocolsPage() {
  const [activeProtoId, setActiveProtoId] = useState(protocols[0].id);

  const activeProto = protocols.find(p => p.id === activeProtoId) || protocols[0];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">

        {/* Improved Header */}
        <div className="relative overflow-hidden glass-panel p-8 md:p-12 group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[100px] rounded-full"></div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center space-x-3 text-red-500">
              <ShieldAlert className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Official NDRF/NDMA E-Content</span>
            </div>
            <h1 className="text-5xl font-black text-white leading-none tracking-tighter">SURVIVAL <br /> <span className="text-neutral-500 italic">GATEWAY</span></h1>
            <p className="text-neutral-400 max-w-2xl text-sm font-medium leading-relaxed">
              Integrated disaster awareness protocols sourced directly from the National Disaster Response Force.
              Providing high-fidelity safety instructions for citizen-led emergency response.
            </p>
            <div className="pt-4 flex items-center space-x-4">
              <a href="https://www.ndrf.gov.in/en/disaster-awareness-e-content" target="_blank" className="flex items-center text-[10px] font-black text-neutral-500 hover:text-white transition-colors uppercase tracking-widest">
                <ExternalLink className="w-3 h-3 mr-2" />
                Official NDRF Source
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar selector with scrolling to handle long list */}
          <div className="col-span-1 space-y-3 h-max max-h-[700px] overflow-y-auto pr-2 no-scrollbar scroll-smooth">
            <div className="px-4 pb-2 sticky top-0 bg-navy/20 backdrop-blur-sm z-20">
              <span className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Active SOP Matrix</span>
            </div>
            {protocols.map((proto) => {
              const isActive = activeProtoId === proto.id;
              return (
                <button
                  key={proto.id}
                  onClick={() => setActiveProtoId(proto.id)}
                  className={`w-full flex items-center justify-between p-4 transition-all duration-300 ${isActive
                    ? `glass-panel border ${proto.borderColor} scale-[1.02] z-10`
                    : 'glass-card text-neutral-400 hover:text-white'
                    }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-xl ${isActive ? 'bg-transparent' : 'bg-transparent'}`}>
                      <proto.icon className={`w-5 h-5 ${isActive ? proto.color : 'text-neutral-500'}`} />
                    </div>
                    <span className={`text-[12px] font-black uppercase tracking-tight ${isActive ? 'text-white' : ''}`}>{proto.title}</span>
                  </div>
                  {isActive && <div className={`w-1.5 h-1.5 rounded-full ${proto.color.replace('text', 'bg')} animate-pulse`}></div>}
                </button>
              );
            })}
          </div>

          {/* Protocol Details Panel */}
          <div className="col-span-1 lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProto.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="glass-panel rounded-[32px] border border-white/5 relative overflow-hidden h-full"
              >
                <div className="absolute inset-0 scanline opacity-30 pointer-events-none"></div>

                <div className="p-8 md:p-12 relative z-10 space-y-12 h-full overflow-y-auto no-scrollbar">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
                    <div className="flex items-center space-x-6">
                      <div className={`p-6 glass-panel border ${activeProto.borderColor}`}>
                        <activeProto.icon className={`w-12 h-12 ${activeProto.color}`} />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <AlertTriangle className="w-3 h-3 text-red-500" />
                          <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">NDRF-CERT-GUIDELINE</span>
                        </div>
                        <h2 className="text-4xl font-black text-white tracking-tight uppercase leading-none">{activeProto.title}</h2>
                      </div>
                    </div>
                    <div className="hidden md:block text-right space-y-1">
                      <div className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Protocol Index</div>
                      <div className="text-xl font-mono font-black text-white">#{activeProto.id.toUpperCase()}-01</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Do's Section */}
                    <div className="space-y-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-sapphire/20 flex items-center justify-center border border-sapphire/30">
                          <CheckSquare className="w-4 h-4 text-sapphire" />
                        </div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter">Essential Actions</h3>
                      </div>
                      <div className="space-y-4">
                        {activeProto.dos.map((item, idx) => (
                          <div key={idx} className="group p-5 bg-white/[0.02] hover:bg-white/[0.05] rounded-[20px] border border-white/5 hover:border-sapphire/20 transition-all">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="font-mono text-sapphire text-xs font-black">[{idx + 1}]</span>
                              <span className="text-[12px] font-black text-white uppercase tracking-widest">{item.label}</span>
                            </div>
                            <p className="text-[11px] text-neutral-400 font-medium leading-relaxed">
                              {item.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Don'ts Section */}
                    <div className="space-y-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
                          <ShieldAlert className="w-4 h-4 text-red-500" />
                        </div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter">Critical Hazards</h3>
                      </div>
                      <div className="space-y-4">
                        {activeProto.donts.map((item, idx) => (
                          <div key={idx} className="group p-5 bg-white/[0.02] hover:bg-white/[0.05] rounded-[20px] border border-white/5 hover:border-red-500/20 transition-all">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="font-mono text-red-500 text-xs font-black">[X]</span>
                              <span className="text-[12px] font-black text-white uppercase tracking-widest">{item.label}</span>
                            </div>
                            <p className="text-[11px] text-neutral-400 font-medium leading-relaxed">
                              {item.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Advanced Survival Guide Section */}
                  {activeProto.advancedGuide && (
                    <div className="border-t border-white/5 pt-12 space-y-10">
                      <div className="flex items-center space-x-4">
                        <BookOpen className={`w-8 h-8 ${activeProto.color}`} />
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Tactical Response Nodes</h3>
                      </div>

                      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* Environmental Logic */}
                        {(activeProto.advancedGuide as any).sequence && (
                          <div className="xl:col-span-2 space-y-6">
                            <h4 className="text-[10px] font-black text-neutral-500 uppercase tracking-widest border-l-4 border-current pl-4 mb-4" style={{ color: activeProto.color.split('-')[1] }}>Environmental Context</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {(activeProto.advancedGuide as any).sequence.map((seq: any, idx: number) => (
                                <div key={idx} className="p-6 bg-white/[0.01] border border-white/5 rounded-2xl hover:bg-white/[0.03] transition-colors">
                                  <div className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-3">{seq.env}</div>
                                  <p className="text-[12px] font-bold text-neutral-200 leading-relaxed italic">"{seq.action}"</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Survival Payload */}
                        <div className="space-y-6">
                          <h4 className="text-[10px] font-black text-neutral-500 uppercase tracking-widest border-l-4 border-current pl-4 mb-4" style={{ color: activeProto.color.split('-')[1] }}>Critical Logistics</h4>
                          <div className="grid grid-cols-1 gap-3">
                            {(activeProto.advancedGuide as any).emergencyKit?.map((kit: any, idx: number) => (
                              <div key={idx} className="p-4 bg-black/40 border border-white/5 rounded-xl group hover:border-white/20 transition-all">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-[10px] font-black text-white uppercase tracking-widest">{kit.item}</span>
                                  <LifeBuoy className="w-3.5 h-3.5 text-neutral-600 group-hover:text-sapphire transition-colors" />
                                </div>
                                <div className="text-[9px] font-bold text-neutral-500 uppercase tracking-tighter leading-tight">{kit.spec}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* Tactical Helpline Section */}
        <div className="space-y-8 pt-20 border-t border-white/5">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sapphire">
                <PhoneCall className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Official Response Uplink</span>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Emergency Matrix</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {helplines.map((hp) => (
              <div key={hp.number} className="glass-panel p-6 rounded-[28px] border border-white/5 hover:border-sapphire/30 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-sapphire/5 blur-2xl"></div>
                <p className="text-[9px] font-black text-neutral-600 uppercase tracking-widest mb-3">{hp.label}</p>
                <p className="text-3xl font-black text-white tracking-tighter mb-2 leading-none">{hp.number}</p>
                <p className="text-[9px] font-black text-neutral-500 leading-tight uppercase tracking-tighter">{hp.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
