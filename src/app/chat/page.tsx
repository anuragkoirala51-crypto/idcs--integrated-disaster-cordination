'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { ChannelList } from '@/components/Chat/ChannelList';
import { MessageFeed } from '@/components/Chat/MessageFeed';
import { MessageInput } from '@/components/Chat/MessageInput';
import { ChatChannel, ChatMessage } from '@/lib/types';
import {
    getKeyPair,
    aliasFromPubkey,
    publishMessage,
    subscribeToChannel,
    getLocationChannels,
} from '@/lib/nostr';
import {
    saveMessage,
    getMessagesForChannel,
    queueMessage,
    getQueuedMessages,
    clearQueue,
    broadcastMessage,
    onBroadcastMessage,
    isOnline,
    onConnectivityChange,
} from '@/lib/offlineChat';
import { Menu, X, Wifi, WifiOff, CloudOff } from 'lucide-react';
import { getTranslation } from '@/lib/translations';

export default function ChatPage() {
    const { camps, language } = useAppStore();
    const t = (key: any) => getTranslation(language, key);
    const [channels, setChannels] = useState<ChatChannel[]>([]);
    const [activeChannelId, setActiveChannelId] = useState('emergency-broadcast');
    const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
    const [isConnected, setIsConnected] = useState(false);
    const [online, setOnline] = useState(true);
    const [showSidebar, setShowSidebar] = useState(false);
    const [queueCount, setQueueCount] = useState(0);
    const subRef = useRef<{ close: () => void } | null>(null);
    const { pk: myPubkey } = typeof window !== 'undefined' ? getKeyPair() : { pk: '' };

    // Track online/offline status
    useEffect(() => {
        setOnline(isOnline());
        const cleanup = onConnectivityChange((status) => {
            setOnline(status);
            if (status) {
                // Back online — flush the queue
                flushQueue();
            }
        });
        return cleanup;
    }, []);

    // Listen for BroadcastChannel messages (same-device, works offline)
    useEffect(() => {
        const cleanup = onBroadcastMessage((msg) => {
            addMessageToState(msg);
        });
        return cleanup;
    }, []);

    // Load cached messages from IndexedDB when switching channels
    useEffect(() => {
        if (!activeChannelId) return;
        getMessagesForChannel(activeChannelId).then((cached) => {
            if (cached.length > 0) {
                setMessages(prev => ({
                    ...prev,
                    [activeChannelId]: cached,
                }));
            }
        });
    }, [activeChannelId]);

    // Build channel list
    useEffect(() => {
        const builtChannels: ChatChannel[] = [
            {
                id: 'emergency-broadcast',
                name: t('emergency_broadcast'),
                type: 'emergency',
                description: t('emergency_desc'),
            },
        ];

        camps.forEach(camp => {
            builtChannels.push({
                id: `camp-${camp.id}`,
                name: camp.name,
                type: 'camp',
                campId: camp.id,
                description: camp.purpose,
            });
        });

        if (typeof navigator !== 'undefined' && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const locChannels = getLocationChannels(pos.coords.latitude, pos.coords.longitude);
                    locChannels.forEach(lc => {
                        builtChannels.push({
                            id: lc.id,
                            name: lc.name,
                            type: 'location',
                            geohash: lc.geohash,
                        });
                    });
                    setChannels([...builtChannels]);
                },
                () => {
                    const locChannels = getLocationChannels(26.1388, 91.6625);
                    locChannels.forEach(lc => {
                        builtChannels.push({
                            id: lc.id,
                            name: lc.name,
                            type: 'location',
                            geohash: lc.geohash,
                        });
                    });
                    setChannels([...builtChannels]);
                },
                { timeout: 5000 }
            );
        }

        setChannels(builtChannels);
    }, [camps]);

    // Subscribe to active channel (only when online)
    useEffect(() => {
        if (!activeChannelId) return;

        if (subRef.current) {
            subRef.current.close();
        }

        if (!online) {
            setIsConnected(false);
            return;
        }

        setIsConnected(false);

        const timer = setTimeout(() => {
            try {
                const sub = subscribeToChannel(activeChannelId, (event) => {
                    const newMsg: ChatMessage = {
                        id: event.id,
                        pubkey: event.pubkey,
                        content: event.content,
                        timestamp: event.created_at,
                        channelId: activeChannelId,
                        alias: aliasFromPubkey(event.pubkey),
                    };

                    addMessageToState(newMsg);
                    saveMessage(newMsg); // Persist to IndexedDB
                    setIsConnected(true);
                });

                subRef.current = sub;
                setTimeout(() => setIsConnected(true), 2000);
            } catch (err) {
                console.error('Subscription error:', err);
            }
        }, 500);

        return () => {
            clearTimeout(timer);
            if (subRef.current) {
                subRef.current.close();
            }
        };
    }, [activeChannelId, online]);

    // Helper to add message to state without duplicates
    const addMessageToState = useCallback((msg: ChatMessage) => {
        setMessages(prev => {
            const channelMsgs = prev[msg.channelId] || [];
            if (channelMsgs.some(m => m.id === msg.id)) return prev;
            return {
                ...prev,
                [msg.channelId]: [...channelMsgs, msg].sort((a, b) => a.timestamp - b.timestamp),
            };
        });
    }, []);

    // Flush queued messages when back online
    const flushQueue = useCallback(async () => {
        const queued = await getQueuedMessages();
        if (queued.length === 0) return;

        for (const q of queued) {
            await publishMessage(q.channelId, q.content);
        }
        await clearQueue();
        setQueueCount(0);
    }, []);

    // Send message handler
    const handleSendMessage = useCallback(async (content: string) => {
        const { pk } = getKeyPair();
        const timestamp = Math.floor(Date.now() / 1000);

        if (!online) {
            // Offline: queue the message and create a local-only entry
            await queueMessage(activeChannelId, content);
            setQueueCount(prev => prev + 1);

            const offlineMsg: ChatMessage = {
                id: `offline-${Date.now()}`,
                pubkey: pk,
                content,
                timestamp,
                channelId: activeChannelId,
                alias: aliasFromPubkey(pk),
            };

            addMessageToState(offlineMsg);
            saveMessage(offlineMsg);
            broadcastMessage(offlineMsg); // Send to other tabs
            return;
        }

        // Online: publish via Nostr
        const event = await publishMessage(activeChannelId, content);
        if (event) {
            const newMsg: ChatMessage = {
                id: event.id,
                pubkey: pk,
                content: event.content,
                timestamp: event.created_at,
                channelId: activeChannelId,
                alias: aliasFromPubkey(pk),
            };

            addMessageToState(newMsg);
            saveMessage(newMsg);
            broadcastMessage(newMsg);
        }
    }, [activeChannelId, online, addMessageToState]);

    const activeChannel = channels.find(c => c.id === activeChannelId);
    const currentMessages = messages[activeChannelId] || [];

    return (
        <DashboardLayout>
            <div className="h-[calc(100vh-8rem)] flex rounded-3xl overflow-hidden glass-panel">

                {/* Mobile sidebar toggle */}
                <button
                    onClick={() => setShowSidebar(!showSidebar)}
                    className="lg:hidden absolute top-2 left-2 z-50 p-2 neo-btn rounded-xl text-neutral-400"
                >
                    {showSidebar ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </button>

                {/* Channel Sidebar */}
                <div className={`${showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    } absolute lg:relative z-40 w-64 h-full bg-[var(--bg-panel)] border-r border-white/5 transition-transform duration-300 shrink-0`}>
                    <ChannelList
                        channels={channels}
                        activeChannelId={activeChannelId}
                        onSelectChannel={(id) => {
                            setActiveChannelId(id);
                            setShowSidebar(false);
                        }}
                        isConnected={isConnected}
                    />
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col min-w-0">

                    {/* Channel Header */}
                    <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between shrink-0">
                        <div>
                            <h2 className="text-sm font-black text-white uppercase tracking-wider">
                                {activeChannel?.name || t('select_channel')}
                            </h2>
                            {activeChannel?.description && (
                                <p className="text-[9px] text-neutral-500 uppercase tracking-widest mt-0.5">
                                    {activeChannel.description}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Offline indicator */}
                            {!online && (
                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
                                    <CloudOff className="w-3 h-3 text-amber-500" />
                                    <span className="text-[8px] font-black text-amber-500 uppercase tracking-wider">
                                        {t('offline_count')} {queueCount > 0 ? `• ${queueCount} ${t('queued')}` : ''}
                                    </span>
                                </div>
                            )}
                            {online && (
                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                    <Wifi className="w-3 h-3 text-emerald-400" />
                                    <span className="text-[8px] font-black text-emerald-400 uppercase tracking-wider">
                                        {t('live')}
                                    </span>
                                </div>
                            )}
                            <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest">
                                {currentMessages.length} {t('msgs_count')}
                            </span>
                        </div>
                    </div>

                    {/* Messages */}
                    <MessageFeed
                        messages={currentMessages}
                        myPubkey={myPubkey}
                        isConnected={isConnected || !online}
                    />

                    {/* Input — always enabled so users can type when offline */}
                    <MessageInput
                        onSend={handleSendMessage}
                        isConnected={true}
                        channelName={activeChannel?.name || ''}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
}
