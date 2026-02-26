'use client';

import { useState, KeyboardEvent } from 'react';
import { Send, Wifi, WifiOff } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { getTranslation } from '@/lib/translations';

interface MessageInputProps {
    onSend: (content: string) => void;
    isConnected: boolean;
    channelName: string;
}

export function MessageInput({ onSend, isConnected, channelName }: MessageInputProps) {
    const { language } = useAppStore();
    const t = (key: any) => getTranslation(language, key);
    const [text, setText] = useState('');

    const handleSend = () => {
        const trimmed = text.trim();
        if (!trimmed || !isConnected) return;
        onSend(trimmed);
        setText('');
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="px-4 py-4 border-t border-white/5">
            <div className="flex items-center gap-3">
                {/* Connection indicator */}
                <div className="shrink-0">
                    {isConnected ? (
                        <Wifi className="w-4 h-4 text-emerald-400" />
                    ) : (
                        <WifiOff className="w-4 h-4 text-red-500" />
                    )}
                </div>

                {/* Input */}
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={!isConnected}
                    placeholder={isConnected ? `${t('type_message')} (${channelName})` : t('connecting')}
                    className="flex-1 bg-transparent border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-sapphire/50 focus:ring-1 focus:ring-sapphire/30 transition-all disabled:opacity-40"
                />

                {/* Send button */}
                <button
                    onClick={handleSend}
                    disabled={!isConnected || !text.trim()}
                    className={`shrink-0 p-2.5 rounded-xl transition-all ${isConnected && text.trim()
                        ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20'
                        : 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
                        }`}
                >
                    <Send className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
