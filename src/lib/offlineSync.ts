// lib/offlineSync.ts
// Offline syncing specifically for inventory and related actions

const SYNC_DB_NAME = 'idcs_swarm_sync';
const SYNC_DB_VERSION = 1;
const SYNC_QUEUE_STORE = 'action_queue';

export interface QueuedAction {
    id?: number;
    type: 'CONSUME_RESOURCE';
    payload: any;
    timestamp: number;
}

// ── IndexedDB Setup ──────────────────────────────────────

function openSyncDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(SYNC_DB_NAME, SYNC_DB_VERSION);
        req.onupgradeneeded = () => {
            const db = req.result;
            if (!db.objectStoreNames.contains(SYNC_QUEUE_STORE)) {
                db.createObjectStore(SYNC_QUEUE_STORE, { keyPath: 'id', autoIncrement: true });
            }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

// ── Queue Operations ──────────────────────────────────

export async function queueAction(action: Omit<QueuedAction, 'id' | 'timestamp'>): Promise<void> {
    const db = await openSyncDB();
    const tx = db.transaction(SYNC_QUEUE_STORE, 'readwrite');
    tx.objectStore(SYNC_QUEUE_STORE).add({
        ...action,
        timestamp: Date.now(),
    });
    return new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

export async function getQueuedActions(): Promise<QueuedAction[]> {
    const db = await openSyncDB();
    const tx = db.transaction(SYNC_QUEUE_STORE, 'readonly');
    const req = tx.objectStore(SYNC_QUEUE_STORE).getAll();
    return new Promise((resolve, reject) => {
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

export async function clearActionQueue(): Promise<void> {
    const db = await openSyncDB();
    const tx = db.transaction(SYNC_QUEUE_STORE, 'readwrite');
    tx.objectStore(SYNC_QUEUE_STORE).clear();
    return new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}
