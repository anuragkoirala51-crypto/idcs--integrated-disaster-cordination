'use client';

import { motion } from 'framer-motion';
import {
    BookOpen,
    FileText,
    Download,
    PlayCircle,
    GraduationCap,
    Waves,
    Search,
    Stethoscope,
    Zap,
    Users,
    ExternalLink,
    ChevronRight,
    ShieldCheck
} from 'lucide-react';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';

const trainingMaterials = [
    {
        category: 'Aquatic & Water Rescue',
        icon: Waves,
        color: 'text-powder',
        borderColor: 'border-blue-400/20',
        bgColor: 'bg-blue-400/5',
        items: [
            { name: 'Aquatic Disaster Response Course (ADRC) Precis', link: 'https://ndrf.gov.in/sites/default/files/Aquatic%20Disaster%20Response%20Course%20%28ADRC%29%20Precis.pdf', type: 'PDF Precis', size: '4.2 MB' },
            { name: 'Training of Trainers Precis', link: 'https://ndrf.gov.in/sites/default/files/Training%20of%20Trainers%20Precis.pdf', type: 'Instructor Manual', size: '2.8 MB' }
        ]
    },
    {
        category: 'Collapsed Structures & Search',
        icon: Search,
        color: 'text-ice',
        borderColor: 'border-amber-400/20',
        bgColor: 'bg-amber-400/5',
        items: [
            { name: 'CSSR Instructor\'s Guide', link: 'https://ndrf.gov.in/en/collapsed-structure-search-rescue-cssr-instructors-guide', type: 'Official Guide', size: 'External' },
            { name: 'CSSR Participant\'s Work Book', link: 'https://ndrf.gov.in/en/collapsed-structure-search-rescue-cssr-participants-work-book', type: 'Workbook', size: 'External' },
            { name: 'Borewell Rescue Precis', link: 'https://ndrf.gov.in/sites/default/files/Borewell%20Rescue%20Precis.pdf', type: 'Specialized Precis', size: '1.5 MB' }
        ]
    },
    {
        category: 'Medical First Response',
        icon: Stethoscope,
        color: 'text-rose-400',
        borderColor: 'border-rose-400/20',
        bgColor: 'bg-rose-400/5',
        items: [
            { name: 'MFR Instructor\'s Guide', link: 'https://ndrf.gov.in/en/medical-first-responder-mfr-instructors-guide', type: 'Medical SOP', size: 'External' },
            { name: 'MFR Participant\'s Work Book', link: 'https://ndrf.gov.in/en/mfr-participants-workbook', type: 'Training Kit', size: 'External' }
        ]
    },
    {
        category: 'Specialized Rescue',
        icon: Zap,
        color: 'text-violet-400',
        borderColor: 'border-violet-400/20',
        bgColor: 'bg-violet-400/5',
        items: [
            { name: 'Rope Rescue Precis', link: 'https://ndrf.gov.in/sites/default/files/Rope%20Rescue%20Precis.pdf', type: 'Technical Manual', size: '3.1 MB' },
            { name: 'Forest Fire Safety', link: 'https://www.ndrf.gov.in/sites/default/files/Forset%20Fire.pdf', type: 'Hazard Guide', size: '0.9 MB' },
            { name: 'Community Action for Disaster Response', link: 'https://ndrf.gov.in/sites/default/files/Community%20Action%20for%20Disaster%20Response%20-%20Instructors%20Guide.pdf', type: 'Vol. Handbook', size: '5.4 MB' }
        ]
    }
];

export default function TrainingHubPage() {
    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">

                {/* Academy Header */}
                <div className="relative overflow-hidden glass-panel p-10 md:p-16 group">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-sapphire/5 blur-[120px] rounded-full"></div>
                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-600/5 blur-[120px] rounded-full"></div>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
                        <div className="max-w-2xl space-y-6">
                            <div className="flex items-center space-x-3 text-powder">
                                <GraduationCap className="w-6 h-6" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Volunteer Academy Hub</span>
                            </div>
                            <h1 className="text-6xl font-black text-white leading-none tracking-tighter">
                                SKILL <br />
                                <span className="text-neutral-500 italic">ASCENSION</span>
                            </h1>
                            <p className="text-neutral-400 text-sm font-medium leading-relaxed">
                                Access official NDRF training protocols and certifications.
                                Master the technical procedures for aquatic rescue, structure stability, and medical first response.
                            </p>
                            <div className="flex items-center space-x-6 pt-4">
                                <div className="flex items-center space-x-2 text-white/40">
                                    <ShieldCheck className="w-4 h-4 text-sapphire" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Verified NDRF Content</span>
                                </div>
                                <div className="flex items-center space-x-2 text-white/40">
                                    <FileText className="w-4 h-4 text-sapphire" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">10+ Critical Modules</span>
                                </div>
                            </div>
                        </div>

                        <div className="hidden lg:block">
                            <div className="w-48 h-48 rounded-[32px] bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-white/5 flex items-center justify-center relative group-hover:scale-105 transition-transform duration-500">
                                <BookOpen className="w-20 h-20 text-white/20 group-hover:text-white/40 transition-colors" />
                                <div className="absolute inset-0 bg-sapphire/10 animate-pulse rounded-[32px]"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {trainingMaterials.map((category, catIdx) => (
                        <motion.div
                            key={category.category}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: catIdx * 0.1 }}
                            className={`glass-panel p-8 rounded-[32px] border ${category.borderColor} ${category.bgColor} flex flex-col`}
                        >
                            <div className="flex items-center space-x-4 mb-8">
                                <div className={`p-4 rounded-2xl bg-black/40 border ${category.borderColor}`}>
                                    <category.icon className={`w-8 h-8 ${category.color}`} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-white tracking-tight uppercase leading-none">{category.category}</h2>
                                    <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mt-1">Training Modules</p>
                                </div>
                            </div>

                            <div className="space-y-4 flex-1">
                                {category.items.map((item, itemIdx) => (
                                    <a
                                        key={item.name}
                                        href={item.link}
                                        target="_blank"
                                        className="flex items-center justify-between p-5 bg-black/40 border border-white/5 rounded-2xl hover:bg-black/60 hover:border-white/20 transition-all group"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 rounded-xl bg-navy-panel flex items-center justify-center border border-white/5 group-hover:border-sapphire/50 transition-colors">
                                                <FileText className="w-5 h-5 text-neutral-500 group-hover:text-powder transition-colors" />
                                            </div>
                                            <div>
                                                <h4 className="text-[12px] font-black text-white uppercase tracking-tight group-hover:text-powder transition-colors">{item.name}</h4>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <span className="text-[10px] font-medium text-neutral-500 uppercase tracking-tighter">{item.type}</span>
                                                    <span className="w-1 h-1 rounded-full bg-neutral-700"></span>
                                                    <span className="text-[10px] font-medium text-neutral-500 uppercase tracking-tighter">{item.size}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-2 rounded-lg bg-navy-panel border border-white/5 group-hover:bg-sapphire/10 group-hover:border-sapphire/30 transition-all">
                                            <ExternalLink className="w-4 h-4 text-neutral-500 group-hover:text-powder" />
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Global Resources CTA */}
                <div className="flex flex-col md:flex-row items-center justify-between p-10 bg-gradient-to-r from-navy-panel/40 via-navy-panel to-indigo-900/40 border border-white/5 rounded-[40px] text-center md:text-left gap-8">
                    <div className="space-y-2">
                        <h3 className="text-3xl font-black text-white tracking-tighter uppercase leading-none italic">Need Live Support?</h3>
                        <p className="text-neutral-400 text-sm font-medium">Join our global training sessions and interactive rescue drills.</p>
                    </div>
                    <button className="px-8 py-4 bg-white text-black font-black text-sm uppercase tracking-widest rounded-full hover:bg-powder transition-colors shadow-2xl shadow-white/5 flex items-center">
                        Check Drill Schedule
                        <ChevronRight className="w-4 h-4 ml-2" />
                    </button>
                </div>

            </div>
        </DashboardLayout>
    );
}
