'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageCircle, X, Send, Bot, User, Zap,
    Mic, MicOff, Volume2, VolumeX, Loader2, Sparkles,
    Square, Globe, Navigation, Heart, ShieldAlert, FileText, LayoutDashboard
} from 'lucide-react';
import { getChatCompletion } from '@/actions/chatbot';
import Link from 'next/link';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

type Language = 'English' | 'Hindi' | 'Assamese';

export function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [language, setLanguage] = useState<Language>('English');
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: "Systems online. I'm PyroBot, your Llama-powered disaster response unit. How can I assist you today?", sender: 'bot', timestamp: new Date() }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, transcript]);

    // Voice Recognition Setup (STT)
    useEffect(() => {
        if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;

            const langCodes = {
                'English': 'en-US',
                'Hindi': 'hi-IN',
                'Assamese': 'as-IN' // Note: Support varies by browser
            };

            recognitionRef.current.lang = langCodes[language];

            recognitionRef.current.onresult = (event: any) => {
                let interimTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        handleSend(event.results[i][0].transcript);
                        stopListening();
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
                setTranscript(interimTranscript);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error);
                stopListening();
            };
        }

        return () => {
            if (recognitionRef.current) recognitionRef.current.stop();
        };
    }, [language]);

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            setTranscript('');
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
            setTranscript('');
        }
    };

    const stopSpeaking = () => {
        if (typeof window !== 'undefined') {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    const speak = async (text: string) => {
        if (!isVoiceEnabled || typeof window === 'undefined') return;

        stopSpeaking();

        const segments = text.split(/([.!?;]|\.\.\.)/g).reduce((acc: string[], val, i, arr) => {
            if (i % 2 === 0) {
                const separator = arr[i + 1] || "";
                if (val.trim() || separator.trim()) {
                    acc.push(val.trim() + separator);
                }
            }
            return acc;
        }, []);

        for (const segment of segments) {
            if (!isVoiceEnabled || !isOpen) break;

            await new Promise<void>((resolve) => {
                const utterance = new SpeechSynthesisUtterance(segment);
                utterance.rate = 0.95;
                utterance.pitch = 1.0;
                utterance.volume = 1.0;

                // Try to find a voice matching the language
                const voices = window.speechSynthesis.getVoices();
                const langCode = language === 'Hindi' ? 'hi' : language === 'Assamese' ? 'as' : 'en';
                const matchingVoice = voices.find(v => v.lang.startsWith(langCode));
                if (matchingVoice) utterance.voice = matchingVoice;

                utterance.onstart = () => setIsSpeaking(true);
                utterance.onend = () => {
                    setTimeout(resolve, segment.length > 20 ? 400 : 250);
                };
                utterance.onerror = () => {
                    setIsSpeaking(false);
                    resolve();
                };

                window.speechSynthesis.speak(utterance);
            });
        }
        setIsSpeaking(false);
    };

    const handleSend = async (text: string) => {
        const trimmedText = text.trim();
        if (!trimmedText || isLoading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: trimmedText,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        const history = messages.slice(-5).map(m => ({
            role: (m.sender === 'user' ? 'user' : 'assistant') as 'user' | 'assistant' | 'system',
            content: m.text
        }));
        history.push({ role: 'user' as const, content: trimmedText });

        const result = await getChatCompletion(history, language);

        if (result.success) {
            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: result.data || '',
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMsg]);
            speak(result.data || '');
        } else {
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: `Error: ${result.error}`,
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        }
        setIsLoading(false);
    };

    const navItems = [
        { label: 'Relief Map', icon: Navigation, href: '/', color: 'text-powder' },
        { label: 'Find Camps', icon: LayoutDashboard, href: '/camps', color: 'text-powder' },
        { label: 'Donation', icon: Heart, href: '/donations', color: 'text-pink-400' },
        { label: 'Protocols', icon: ShieldAlert, href: '/protocols', color: 'text-ice' },
        { label: 'Report', icon: FileText, href: '/report', color: 'text-powder' },
    ];

    return (
        <div className="fixed bottom-6 right-6 z-[9999]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="mb-4 w-[400px] h-[650px] bg-navy-panel/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden ring-1 ring-white/5"
                    >
                        {/* Header */}
                        <div className="p-5 bg-gradient-to-r from-indigo-600 to-violet-600 flex justify-between items-center relative overflow-hidden">
                            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                            <div className="flex items-center space-x-3 relative z-10">
                                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
                                    <Bot className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <div className="flex items-center space-x-1.5">
                                        <h3 className="text-xs font-black text-white uppercase tracking-wider">PyroBot Pro</h3>
                                        <div className="px-1.5 py-0.5 bg-sapphire rounded text-[8px] font-black text-white animate-pulse">LIVE</div>
                                    </div>
                                    {/* Language Selector */}
                                    <div className="flex items-center space-x-2 mt-1">
                                        <Globe className="w-3 h-3 text-white/50" />
                                        <select
                                            value={language}
                                            onChange={(e) => setLanguage(e.target.value as Language)}
                                            className="bg-transparent text-[9px] font-black text-white/80 uppercase tracking-widest focus:outline-none cursor-pointer"
                                        >
                                            <option value="English" className="bg-navy-panel">English</option>
                                            <option value="Hindi" className="bg-navy-panel">Hindi</option>
                                            <option value="Assamese" className="bg-navy-panel">Assamese</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 relative z-10">
                                {isSpeaking && (
                                    <motion.button
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        onClick={stopSpeaking}
                                        className="p-2 neo-btn rounded-xl group"
                                    >
                                        <Square className="w-4 h-4 text-red-500 fill-current" />
                                    </motion.button>
                                )}
                                <button
                                    onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                                    className="p-2 neo-btn rounded-xl"
                                >
                                    {isVoiceEnabled ? <Volume2 className="w-5 h-5 text-white" /> : <VolumeX className="w-5 h-5 text-white/50" />}
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 neo-btn rounded-xl group hover:text-red-400"
                                >
                                    <X className="w-5 h-5 text-neutral-400 group-hover:text-red-400 transition-colors" />
                                </button>
                            </div>
                        </div>

                        {/* Navigation Shortcuts */}
                        <div className="px-4 py-3 bg-navy/50 border-b border-white/5 overflow-x-auto custom-scrollbar flex items-center space-x-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="flex-shrink-0 flex flex-col items-center space-y-1 px-3 py-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all group"
                                >
                                    <item.icon className={`w-4 h-4 ${item.color} group-hover:scale-110 transition-transform`} />
                                    <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-tighter whitespace-nowrap">{item.label}</span>
                                </Link>
                            ))}
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar relative">
                            <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-navy-panel to-transparent pointer-events-none z-10"></div>

                            {messages.map((msg) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] p-4 rounded-2xl relative ${msg.sender === 'user'
                                        ? 'bg-indigo-600 text-white rounded-br-none shadow-lg shadow-indigo-600/20'
                                        : 'bg-neutral-800/50 text-neutral-200 rounded-bl-none border border-white/5 backdrop-blur-sm'
                                        }`}>
                                        <div className="flex items-center space-x-2 mb-1 opacity-50">
                                            {msg.sender === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3 text-powder" />}
                                            <span className="text-[8px] font-bold uppercase tracking-widest">{msg.sender === 'user' ? 'You' : 'PyroBot'}</span>
                                        </div>
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                    </div>
                                </motion.div>
                            ))}

                            {isListening && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-end pr-2"
                                >
                                    <div className="inline-flex items-center space-x-3 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-full backdrop-blur-md">
                                        <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                                        <span className="text-xs font-bold text-red-500 italic">
                                            {transcript || 'Listening...'}
                                        </span>
                                    </div>
                                </motion.div>
                            )}

                            {isLoading && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                    <div className="bg-neutral-800/50 p-4 rounded-2xl rounded-bl-none border border-white/5 flex items-center space-x-3">
                                        <Loader2 className="w-4 h-4 text-sapphire animate-spin" />
                                        <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Processing Intelligence...</span>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Bar */}
                        <div className="p-5 bg-navy/50 border-t border-white/5 backdrop-blur-xl">
                            <div className="flex items-center space-x-3">
                                <div className="flex-1 relative group">
                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                        <Sparkles className="w-4 h-4 text-sapphire group-focus-within:text-sapphire transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
                                        placeholder={language === 'Hindi' ? 'विशेषज्ञ आपातकालीन मार्गदर्शन...' : language === 'Assamese' ? 'বিশেষজ্ঞ জৰুৰীকালীন নিৰ্দেশনা...' : 'Expert emergency guidance...'}
                                        className="w-full bg-navy-panel border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-sapphire focus:ring-1 focus:ring-sapphire/50 transition-all placeholder:text-neutral-600"
                                    />
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={isListening ? stopListening : startListening}
                                    className={`p-3 rounded-2xl border transition-all ${isListening
                                        ? 'bg-red-500/20 border-red-500/50 text-red-500'
                                        : 'bg-navy-panel border-white/10 text-neutral-400 hover:text-white hover:border-sapphire/50'
                                        }`}
                                >
                                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleSend(input)}
                                    disabled={isLoading || !input.trim()}
                                    className="p-3 bg-indigo-600 hover:bg-sapphire disabled:opacity-50 disabled:grayscale rounded-2xl transition-all shadow-xl shadow-indigo-600/30"
                                >
                                    <Send className="w-5 h-5 text-white" />
                                </motion.button>
                            </div>
                            <p className="mt-3 text-[9px] text-center text-neutral-600 font-bold uppercase tracking-[0.2em]">Real-time encrypted AI channel</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Open Chat"
                className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-600/40 border border-white/20 group relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-sapphire rounded-full flex items-center justify-center border-4 border-navy z-10">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                </div>
                <MessageCircle className="w-8 h-8 text-white relative z-10" />
            </motion.button>
        </div>
    );
}
