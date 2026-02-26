'use client';

import { useState, useEffect } from 'react';
import { Wifi, WifiOff, Smartphone, RefreshCw, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getQueuedActions, clearActionQueue, QueuedAction } from '@/lib/offlineSync';
import { useAppStore } from '@/store/useAppStore';
import { getTranslation } from '@/lib/translations';

export function MeshSyncButton() {
    const { language, syncOfflineActions } = useAppStore();
    const t = (key: any) => getTranslation(language, key);
    const [isOnline, setIsOnline] = useState(true);
    const [queuedActions, setQueuedActions] = useState<QueuedAction[]>([]);
    const [syncState, setSyncState] = useState<'idle' | 'scanning' | 'syncing' | 'complete'>('idle');

    // Check queues and network status periodically
    useEffect(() => {
        const checkStatus = async () => {
            setIsOnline(navigator.onLine);
            const actions = await getQueuedActions();
            setQueuedActions(actions);
        };

        checkStatus();
        const interval = setInterval(checkStatus, 2000); // Poll every 2s

        const handleOnline = () => {
            setIsOnline(true);
            checkStatus();
        };
        const handleOffline = () => {
            setIsOnline(false);
            checkStatus();
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            clearInterval(interval);
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const handleMeshSync = async () => {
        if (syncState !== 'idle' || queuedActions.length === 0) return;

        // Simulate Bluetooth/WebRTC Mesh Sync
        setSyncState('scanning');

        // Simulate finding a peer
        setTimeout(() => {
            setSyncState('syncing');

            // Simulate exchanging encrypted bundles
            setTimeout(async () => {
                // Apply actions to the central state
                syncOfflineActions(queuedActions);
                // Clear the offline queue
                await clearActionQueue();
                setQueuedActions([]);

                setSyncState('complete');

                // Reset state
                setTimeout(() => setSyncState('idle'), 3000);
            }, 2500); // 2.5s to sync

        }, 2000); // 2s to scan
    };

    const hasItems = queuedActions.length > 0;

    return (
        <div className="flex items-center gap-3">
            {/* Network Status Badge */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${isOnline
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                }`}>
                {isOnline ? (
                    <><Wifi className="w-3.5 h-3.5" /> {t('network_online')}</>
                ) : (
                    <><WifiOff className="w-3.5 h-3.5" /> {t('network_offline')}</>
                )}
            </div>

            {/* Swarm Sync Button */}
            <div className="relative">
                <button
                    onClick={handleMeshSync}
                    disabled={syncState !== 'idle' || !hasItems}
                    className={`relative overflow-hidden flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${hasItems && syncState === 'idle'
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]'
                        : syncState !== 'idle'
                            ? 'bg-indigo-900 text-indigo-200 cursor-wait'
                            : 'bg-white/5 text-neutral-500 border border-white/10 cursor-not-allowed'
                        }`}
                >
                    {/* Animated Background for Syncing */}
                    {syncState !== 'idle' && syncState !== 'complete' && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-[200%] animate-[shimmer_1.5s_infinite] -translate-x-full" />
                    )}

                    <AnimatePresence mode="wait">
                        {syncState === 'idle' && (
                            <motion.div
                                key="idle"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex items-center gap-2 relative z-10"
                            >
                                <Smartphone className="w-4 h-4" />
                                <span>{t('mesh_sync')}</span>
                                {hasItems && (
                                    <span className="bg-white text-indigo-900 px-1.5 py-0.5 rounded text-[10px] font-black leading-none ml-1">
                                        {queuedActions.length}
                                    </span>
                                )}
                            </motion.div>
                        )}

                        {syncState === 'scanning' && (
                            <motion.div
                                key="scanning"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex items-center gap-2 relative z-10"
                            >
                                <div className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                                </div>
                                <span>{t('scan_peers')}</span>
                            </motion.div>
                        )}

                        {syncState === 'syncing' && (
                            <motion.div
                                key="syncing"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex items-center gap-2 relative z-10"
                            >
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                <span>{t('exchanging_bundles')}</span>
                            </motion.div>
                        )}

                        {syncState === 'complete' && (
                            <motion.div
                                key="complete"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex items-center gap-2 text-emerald-400 relative z-10"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>{t('sync_complete')}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>

                {/* Pulse effect if idle and has items */}
                {hasItems && syncState === 'idle' && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                    </span>
                )}
            </div>
        </div>
    );
}
