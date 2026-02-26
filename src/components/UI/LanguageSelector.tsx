'use client';

import { useState } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LANGUAGES, SupportedLanguage } from '@/lib/translations';
import { useAppStore } from '@/store/useAppStore';

export function LanguageSelector() {
    const [isOpen, setIsOpen] = useState(false);
    const { language, setLanguage } = useAppStore();

    const handleLanguageChange = (code: SupportedLanguage) => {
        setLanguage(code);
        setIsOpen(false);
    };

    const activeLang = LANGUAGES.find(l => l.code === language);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 p-2 neo-btn rounded-xl text-neutral-400 hover:text-white transition-all"
                title="Change Language"
            >
                <Globe className="w-5 h-5 text-sapphire" />
                <span className="hidden md:inline-block text-xs font-bold uppercase tracking-wider">
                    {activeLang?.code.toUpperCase()}
                </span>
                <ChevronDown className="w-3 h-3" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 mt-2 w-48 glass-panel rounded-2xl shadow-2xl p-2 z-50 border border-white/10"
                        >
                            <div className="px-3 py-2 border-b border-white/5 mb-2">
                                <span className="text-[10px] uppercase font-black tracking-widest text-sapphire">Select Language</span>
                            </div>

                            <div className="space-y-1">
                                {LANGUAGES.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => handleLanguageChange(lang.code)}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${language === lang.code
                                            ? 'bg-sapphire/20 text-powder font-bold'
                                            : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                                            }`}
                                    >
                                        <div className="flex flex-col items-start">
                                            <span>{lang.name}</span>
                                            <span className="text-[10px] text-neutral-500">{lang.native}</span>
                                        </div>
                                        {language === lang.code && <Check className="w-4 h-4 text-sapphire" />}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
