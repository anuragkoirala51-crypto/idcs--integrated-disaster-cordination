'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UserPlus,
    MapPin,
    Shield,
    Stethoscope,
    Search,
    Waves,
    Zap,
    Truck,
    CheckCircle,
    ChevronRight,
    ArrowLeft,
    Info
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Volunteer, Skill } from '@/lib/types';

const SKILLS: { id: Skill; label: string; icon: any; description: string }[] = [
    { id: 'Medical', label: 'Medical / First Aid', icon: Stethoscope, description: 'Triage, BLS, and emergency medical support' },
    { id: 'Search & Rescue', label: 'Search & Rescue', icon: Search, description: 'CSSR, rope rescue, and field search' },
    { id: 'Water Rescue', label: 'Water Rescue', icon: Waves, description: 'Flood and aquatic disaster response' },
    { id: 'Logistics', label: 'Logistics / Supply', icon: Truck, description: 'Asset transport and hub management' },
    { id: 'Electrical & Comm', label: 'Electrical / Comm', icon: Zap, description: 'Grid repair and satellite communication' }
];

export default function VolunteerRegistration() {
    const router = useRouter();
    const { setRole, addVolunteer } = useAppStore();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        skills: [] as Skill[],
        location: null as { lat: number; lng: number } | null,
        locationName: ''
    });

    const [isLocating, setIsLocating] = useState(false);

    const toggleSkill = (skillId: Skill) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.includes(skillId)
                ? prev.skills.filter(id => id !== skillId)
                : [...prev.skills, skillId]
        }));
    };

    const captureLocation = () => {
        setIsLocating(true);
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                setFormData(prev => ({
                    ...prev,
                    location: { lat: position.coords.latitude, lng: position.coords.longitude },
                    locationName: 'Verified Presence Detected'
                }));
                setIsLocating(false);
            }, (error) => {
                console.error('Error capturing location:', error);
                setIsLocating(false);
                // Fallback or alert
                setFormData(prev => ({
                    ...prev,
                    location: { lat: 26.1132, lng: 91.7582 }, // Default to Guwahati center
                    locationName: 'Manual Entry: North East Focal Point'
                }));
            });
        }
    };

    const handleRegister = () => {
        const newVolunteer: Volunteer = {
            id: `vol-${Date.now()}`,
            name: formData.name,
            skills: formData.skills,
            status: 'Available',
            location: formData.location || { lat: 26.1132, lng: 91.7582 },
            assignedCampId: undefined
        };

        // Add to store (which should handle localStorage in the next step)
        addVolunteer(newVolunteer);

        // Switch role to volunteer
        setRole('volunteer');

        // Redirect to dashboard
        router.push('/volunteers');
    };

    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto py-12 px-6">
                <div className="space-y-12">

                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center space-x-2 text-sapphire bg-sapphire/10 px-4 py-1.5 rounded-full border border-sapphire/20">
                            <UserPlus className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Deployment Enlistment</span>
                        </div>
                        <h1 className="text-5xl font-black text-white leading-none tracking-tighter uppercase">Volunteer <br /> <span className="text-neutral-500 italic">Registration</span></h1>
                        <p className="text-neutral-500 text-sm font-medium">Join of the frontlines of disaster response. Verified skills save lives.</p>
                    </div>

                    {/* Stepper HUD */}
                    <div className="flex items-center justify-between px-10 relative">
                        <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-neutral-800 -translate-y-1/2 z-0"></div>
                        {[1, 2, 3].map(s => (
                            <div key={s} className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-black text-xs transition-colors border-2 ${step >= s ? 'bg-sapphire border-blue-400 text-white' : 'bg-navy-panel border-neutral-800 text-neutral-600'}`}>
                                {s === 1 && <Shield className="w-4 h-4" />}
                                {s === 2 && <Zap className="w-4 h-4" />}
                                {s === 3 && <CheckCircle className="w-4 h-4" />}
                            </div>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="glass-panel p-8 rounded-[32px] border border-white/5 space-y-6"
                            >
                                <div className="space-y-4">
                                    <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-widest pl-2">Full Identity</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. ARJUN SHARMA"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full neo-inset rounded-2xl p-4 text-white font-bold outline-none focus:border-sapphire/50 transition-all"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-4">
                                        <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-widest pl-2">Comm Uplink (Email)</label>
                                        <input
                                            type="email"
                                            placeholder="name@domain.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full neo-inset rounded-2xl p-4 text-white font-bold outline-none focus:border-sapphire/50 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-widest pl-2">Tactical Signal (Phone)</label>
                                        <input
                                            type="tel"
                                            placeholder="+91 XXXXX XXXXX"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full neo-inset rounded-2xl p-4 text-white font-bold outline-none focus:border-sapphire/50 transition-all"
                                        />
                                    </div>
                                </div>
                                <button
                                    disabled={!formData.name || !formData.email}
                                    onClick={() => setStep(2)}
                                    className="w-full py-4 neo-btn disabled:opacity-50 text-powder disabled:text-neutral-600 font-black uppercase tracking-widest rounded-2xl flex items-center justify-center"
                                >
                                    Proceed to Skill Selection
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="grid grid-cols-1 gap-4">
                                    {SKILLS.map(skill => (
                                        <button
                                            key={skill.id}
                                            onClick={() => toggleSkill(skill.id)}
                                            className={`flex items-center p-6 rounded-[24px] border transition-all text-left group ${formData.skills.includes(skill.id) ? 'bg-sapphire/10 border-sapphire/50 ring-2 ring-blue-500/20' : 'glass-card hover:border-white/20'}`}
                                        >
                                            <div className={`p-4 rounded-xl mr-6 transition-colors ${formData.skills.includes(skill.id) ? 'bg-sapphire text-white' : 'bg-neutral-800 text-neutral-500'}`}>
                                                <skill.icon className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className={`text-sm font-black uppercase tracking-tight ${formData.skills.includes(skill.id) ? 'text-white' : 'text-neutral-300'}`}>{skill.label}</h4>
                                                <p className="text-[11px] text-neutral-500 font-medium leading-tight mt-1">{skill.description}</p>
                                            </div>
                                            {formData.skills.includes(skill.id) && <CheckCircle className="w-5 h-5 text-sapphire" />}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex space-x-4">
                                    <button onClick={() => setStep(1)} className="p-4 neo-btn rounded-2xl text-neutral-500 hover:text-white">
                                        <ArrowLeft className="w-6 h-6" />
                                    </button>
                                    <button
                                        disabled={formData.skills.length === 0}
                                        onClick={() => setStep(3)}
                                        className="flex-1 py-4 neo-btn disabled:opacity-50 text-powder font-black uppercase tracking-widest rounded-2xl"
                                    >
                                        Finalize Deployment
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="glass-panel p-8 rounded-[32px] border border-white/5 space-y-10"
                            >
                                <div className="text-center space-y-6">
                                    <div className="w-20 h-20 bg-sapphire/10 rounded-full mx-auto flex items-center justify-center border-4 border-sapphire/20">
                                        <MapPin className="w-8 h-8 text-sapphire animate-bounce" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black text-white uppercase tracking-tight">Geographic Verification</h3>
                                        <p className="text-neutral-500 text-[11px] font-medium max-w-xs mx-auto">We use your precise coordinates for intelligent task matching. Ensure you are at your operational base.</p>
                                    </div>

                                    <div className="p-6 neo-inset rounded-2xl relative overflow-hidden group">
                                        {isLocating && <div className="absolute inset-0 bg-sapphire/20 backdrop-blur-sm z-10 flex items-center justify-center"><div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div></div>}
                                        <div className="flex items-center justify-between text-left">
                                            <div>
                                                <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest mb-1">Current Precision Signal</p>
                                                <p className="text-sm font-bold text-white uppercase">{formData.locationName || 'Locked / Waiting Signal'}</p>
                                            </div>
                                            {!formData.location && (
                                                <button
                                                    onClick={captureLocation}
                                                    className="px-6 py-2 neo-btn text-powder text-[10px] font-black uppercase tracking-widest rounded-full"
                                                >
                                                    Transmit GPS
                                                </button>
                                            )}
                                            {formData.location && <CheckCircle className="w-6 h-6 text-sapphire" />}
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3 bg-white/[0.02] border border-white/5 p-4 rounded-xl text-left">
                                        <Info className="w-8 h-8 text-neutral-600 flex-shrink-0" />
                                        <p className="text-[10px] text-neutral-500 font-medium leading-relaxed">By enlisting, you agree to comply with NDRF protocols and community safety standards during active deployment.</p>
                                    </div>
                                </div>

                                <div className="flex space-x-4 pt-4">
                                    <button onClick={() => setStep(2)} className="p-4 neo-btn rounded-2xl text-neutral-500 hover:text-white">
                                        <ArrowLeft className="w-6 h-6" />
                                    </button>
                                    <button
                                        disabled={!formData.location}
                                        onClick={handleRegister}
                                        className="flex-1 py-4 neo-btn disabled:opacity-50 text-powder font-black uppercase tracking-widest rounded-2xl"
                                    >
                                        Complete Enlistment
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </div>
        </DashboardLayout>
    );
}
