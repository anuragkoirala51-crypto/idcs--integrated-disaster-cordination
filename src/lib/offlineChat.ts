// Offline support for Relief Chat
// 1. IndexedDB message persistence
// 2. Offline message queue (auto-sync when reconnected)
// 3. BroadcastChannel for same-device tab-to-tab messaging (works fully offline)

import { ChatMessage } from './types';

const DB_NAME = 'idcs_chat';
const DB_VERSION = 1;
const MESSAGES_STORE = 'messages';
const QUEUE_STORE = 'outbox';

// ── IndexedDB Setup ──────────────────────────────────────

function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = () => {
            const db = req.result;
            if (!db.objectStoreNames.contains(MESSAGES_STORE)) {
                const store = db.createObjectStore(MESSAGES_STORE, { keyPath: 'id' });
                store.createIndex('channelId', 'channelId', { unique: false });
                store.createIndex('timestamp', 'timestamp', { unique: false });
            }
            if (!db.objectStoreNames.contains(QUEUE_STORE)) {
                db.createObjectStore(QUEUE_STORE, { keyPath: 'id', autoIncrement: true });
            }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

// ── Message Persistence ──────────────────────────────────

export async function saveMessage(msg: ChatMessage): Promise<void> {
    const db = await openDB();
    const tx = db.transaction(MESSAGES_STORE, 'readwrite');
    tx.objectStore(MESSAGES_STORE).put(msg);
    return new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

export async function saveMessages(msgs: ChatMessage[]): Promise<void> {
    const db = await openDB();
    const tx = db.transaction(MESSAGES_STORE, 'readwrite');
    const store = tx.objectStore(MESSAGES_STORE);
    msgs.forEach(m => store.put(m));
    return new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

export async function getMessagesForChannel(channelId: string): Promise<ChatMessage[]> {
    const db = await openDB();
    const tx = db.transaction(MESSAGES_STORE, 'readonly');
    const index = tx.objectStore(MESSAGES_STORE).index('channelId');
    const req = index.getAll(channelId);
    return new Promise((resolve, reject) => {
        req.onsuccess = () => resolve(req.result.sort((a: ChatMessage, b: ChatMessage) => a.timestamp - b.timestamp));
        req.onerror = () => reject(req.error);
    });
}

// ── Offline Message Queue ────────────────────────────────

export interface QueuedMessage {
    id?: number;
    channelId: string;
    content: string;
    timestamp: number;
}

export async function queueMessage(channelId: string, content: string): Promise<void> {
    const db = await openDB();
    const tx = db.transaction(QUEUE_STORE, 'readwrite');
    tx.objectStore(QUEUE_STORE).add({
        channelId,
        content,
        timestamp: Math.floor(Date.now() / 1000),
    });
    return new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

export async function getQueuedMessages(): Promise<QueuedMessage[]> {
    const db = await openDB();
    const tx = db.transaction(QUEUE_STORE, 'readonly');
    const req = tx.objectStore(QUEUE_STORE).getAll();
    return new Promise((resolve, reject) => {
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

export async function clearQueue(): Promise<void> {
    const db = await openDB();
    const tx = db.transaction(QUEUE_STORE, 'readwrite');
    tx.objectStore(QUEUE_STORE).clear();
    return new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

// ── BroadcastChannel (Tab-to-Tab, fully offline) ─────────

let broadcastChannel: BroadcastChannel | null = null;

export function getBroadcastChannel(): BroadcastChannel {
    if (!broadcastChannel) {
        broadcastChannel = new BroadcastChannel('idcs-relief-chat');
    }
    return broadcastChannel;
}

export function broadcastMessage(msg: ChatMessage): void {
    try {
        getBroadcastChannel().postMessage({ type: 'chat_message', payload: msg });
    } catch {
        // BroadcastChannel not supported
    }
}

export function onBroadcastMessage(handler: (msg: ChatMessage) => void): () => void {
    const bc = getBroadcastChannel();
    const listener = (event: MessageEvent) => {
        if (event.data?.type === 'chat_message') {
            handler(event.data.payload);
        }
    };
    bc.addEventListener('message', listener);
    return () => bc.removeEventListener('message', listener);
}

// ── Online/Offline Detection ─────────────────────────────

export function isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

export function onConnectivityChange(handler: (online: boolean) => void): () => void {
    const onOnline = () => handler(true);
    const onOffline = () => handler(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
        window.removeEventListener('online', onOnline);
        window.removeEventListener('offline', onOffline);
    };
}
