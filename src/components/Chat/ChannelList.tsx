'use client';

import { ChatChannel } from '@/lib/types';
import { Radio, MapPin, Tent, Zap } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { getTranslation } from '@/lib/translations';

interface ChannelListProps {
    channels: ChatChannel[];
    activeChannelId: string;
    onSelectChannel: (channelId: string) => void;
    isConnected: boolean;
}

export function ChannelList({ channels, activeChannelId, onSelectChannel, isConnected }: ChannelListProps) {
    const { language } = useAppStore();
    const t = (key: any) => getTranslation(language, key);
    const emergencyChannels = channels.filter(c => c.type === 'emergency');
    const locationChannels = channels.filter(c => c.type === 'location');
    const campChannels = channels.filter(c => c.type === 'camp');

    const iconForType = (type: ChatChannel['type']) => {
        switch (type) {
            case 'emergency': return <Zap className="w-3.5 h-3.5" />;
            case 'location': return <MapPin className="w-3.5 h-3.5" />;
            case 'camp': return <Tent className="w-3.5 h-3.5" />;
        }
    };

    const renderGroup = (title: string, items: ChatChannel[], color: string) => {
        if (items.length === 0) return null;
        return (
            <div className="mb-6">
                <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-3 px-2 ${color}`}>{title}</h3>
                <div className="space-y-1">
                    {items.map(ch => {
                        const isActive = ch.id === activeChannelId;
                        return (
                            <button
                                key={ch.id}
                                onClick={() => onSelectChannel(ch.id)}
                                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${isActive
                                    ? 'neo-inset text-powder'
                                    : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <span className={isActive ? 'text-powder' : 'text-neutral-500'}>
                                    {iconForType(ch.type)}
                                </span>
                                <span className="truncate">{ch.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full">
            {/* Connection Status */}
            <div className="px-4 py-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-powder" />
                    <span className="text-xs font-black text-white uppercase tracking-wider">{t('nav_chat')}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`} />
                    <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">
                        {isConnected ? t('nostr_connected') : t('connecting')}
                    </span>
                </div>
            </div>

            {/* Channels */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-2 py-4">
                {renderGroup(`🚨 ${t('emergency_lbl')}`, emergencyChannels, 'text-red-400')}
                {renderGroup(`📍 ${t('location_lbl')}`, locationChannels, 'text-powder')}
                {renderGroup(`🏕️ ${t('camps_lbl')}`, campChannels, 'text-neutral-400')}
            </div>
        </div>
    );
}
