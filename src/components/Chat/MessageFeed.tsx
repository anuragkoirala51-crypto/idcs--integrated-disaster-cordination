'use client';

import { ChatMessage } from '@/lib/types';
import { useEffect, useRef } from 'react';

interface MessageFeedProps {
    messages: ChatMessage[];
    myPubkey: string;
    isConnected: boolean;
}

export function MessageFeed({ messages, myPubkey, isConnected }: MessageFeedProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages.length]);

    if (!isConnected) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 rounded-full border-2 border-sapphire/30 border-t-indigo-500 animate-spin mx-auto mb-4" />
                    <p className="text-xs font-black text-powder uppercase tracking-[0.2em] animate-pulse">
                        Connecting to Nostr Relays...
                    </p>
                    <p className="text-[9px] text-neutral-500 mt-2 uppercase tracking-widest">
                        Establishing encrypted channels
                    </p>
                </div>
            </div>
        );
    }

    if (messages.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-sm font-bold text-neutral-500">No messages yet</p>
                    <p className="text-[10px] text-neutral-600 mt-1 uppercase tracking-widest">
                        Be the first to send a message in this channel
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4 space-y-3">
            {messages.map((msg) => {
                const isMe = msg.pubkey === myPubkey;

                return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] ${isMe ? 'order-1' : ''}`}>
                            {/* Alias + timestamp */}
                            <div className={`flex items-center gap-2 mb-1 ${isMe ? 'justify-end' : ''}`}>
                                <span className={`text-[10px] font-black uppercase tracking-wider ${isMe ? 'text-powder' : 'text-neutral-500'
                                    }`}>
                                    {isMe ? 'You' : msg.alias}
                                </span>
                                <span className="text-[8px] text-neutral-600 font-mono">
                                    {new Date(msg.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>

                            {/* Message bubble */}
                            <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isMe
                                    ? 'bg-indigo-600/80 text-white rounded-br-sm'
                                    : 'glass-card text-white rounded-bl-sm'
                                }`}>
                                {msg.content}
                            </div>
                        </div>
                    </div>
                );
            })}
            <div ref={bottomRef} />
        </div>
    );
}
