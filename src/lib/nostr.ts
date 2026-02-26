import { SimplePool, finalizeEvent, generateSecretKey, getPublicKey } from 'nostr-tools';
import type { Event, Filter } from 'nostr-tools';

// Public Nostr relays
const RELAYS = [
    'wss://relay.damus.io',
    'wss://nos.lol',
    'wss://relay.nostr.band',
];

// Adjective + Noun alias generator from pubkey
const ADJECTIVES = [
    'Swift', 'Brave', 'Iron', 'Shadow', 'Storm', 'Frost', 'Solar', 'Lunar',
    'Rapid', 'Noble', 'Silent', 'Fierce', 'Bright', 'Deep', 'Neon', 'Cyber',
];
const NOUNS = [
    'Falcon', 'Wolf', 'Phoenix', 'Raven', 'Tiger', 'Bear', 'Hawk', 'Fox',
    'Eagle', 'Lynx', 'Cobra', 'Shark', 'Viper', 'Crane', 'Orca', 'Puma',
];

export function aliasFromPubkey(pubkey: string): string {
    const hash = parseInt(pubkey.slice(0, 8), 16);
    const adj = ADJECTIVES[hash % ADJECTIVES.length];
    const noun = NOUNS[(hash >> 8) % NOUNS.length];
    const num = (hash >> 16) % 100;
    return `${adj}${noun}${num}`;
}

// Get or create an ephemeral keypair stored in localStorage
export function getKeyPair(): { sk: Uint8Array; pk: string } {
    if (typeof window === 'undefined') {
        const sk = generateSecretKey();
        return { sk, pk: getPublicKey(sk) };
    }

    const stored = localStorage.getItem('idcs_nostr_sk');
    if (stored) {
        const sk = new Uint8Array(JSON.parse(stored));
        return { sk, pk: getPublicKey(sk) };
    }

    const sk = generateSecretKey();
    localStorage.setItem('idcs_nostr_sk', JSON.stringify(Array.from(sk)));
    return { sk, pk: getPublicKey(sk) };
}

// Create a SimplePool (connection pool for multiple relays)
let pool: SimplePool | null = null;

export function getPool(): SimplePool {
    if (!pool) {
        pool = new SimplePool();
    }
    return pool;
}

export function getRelays(): string[] {
    return RELAYS;
}

// Channel tag format: idcs-<channelId>
function channelTag(channelId: string): string {
    return `idcs-${channelId}`;
}

// Publish a message to a channel
export async function publishMessage(
    channelId: string,
    content: string
): Promise<Event | null> {
    try {
        const { sk } = getKeyPair();

        const eventTemplate = {
            kind: 42, // NIP-28 channel message
            created_at: Math.floor(Date.now() / 1000),
            tags: [
                ['t', channelTag(channelId)],
            ],
            content,
        };

        const signedEvent = finalizeEvent(eventTemplate, sk);

        const p = getPool();
        await Promise.any(p.publish(RELAYS, signedEvent));

        return signedEvent;
    } catch (err) {
        console.error('Failed to publish:', err);
        return null;
    }
}

// Subscribe to a channel's messages
export function subscribeToChannel(
    channelId: string,
    onMessage: (event: Event) => void,
    since?: number
): { close: () => void } {
    const p = getPool();

    const filter: Filter = {
        kinds: [42],
        '#t': [channelTag(channelId)],
        since: since || Math.floor(Date.now() / 1000) - 86400, // last 24h
    };

    const sub = p.subscribeMany(RELAYS, [filter] as any, {
        onevent: onMessage,
        oneose: () => {
            // End of stored events
        },
    });

    return {
        close: () => sub.close(),
    };
}

// Geohash utilities
export function encodeGeohash(lat: number, lng: number, precision: number = 6): string {
    // Simple geohash encoder
    const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';
    let latRange = [-90.0, 90.0];
    let lngRange = [-180.0, 180.0];
    let isLng = true;
    let bit = 0;
    let ch = 0;
    let hash = '';

    while (hash.length < precision) {
        const range = isLng ? lngRange : latRange;
        const val = isLng ? lng : lat;
        const mid = (range[0] + range[1]) / 2;

        if (val >= mid) {
            ch = ch | (1 << (4 - bit));
            range[0] = mid;
        } else {
            range[1] = mid;
        }

        if (isLng) {
            lngRange = range;
        } else {
            latRange = range;
        }

        isLng = !isLng;
        bit++;

        if (bit === 5) {
            hash += BASE32[ch];
            bit = 0;
            ch = 0;
        }
    }

    return hash;
}

// Get location channels at different precision levels
export function getLocationChannels(lat: number, lng: number): { id: string; name: string; geohash: string }[] {
    return [
        { id: `loc-${encodeGeohash(lat, lng, 7)}`, name: `Block #${encodeGeohash(lat, lng, 7)}`, geohash: encodeGeohash(lat, lng, 7) },
        { id: `loc-${encodeGeohash(lat, lng, 5)}`, name: `City #${encodeGeohash(lat, lng, 5)}`, geohash: encodeGeohash(lat, lng, 5) },
        { id: `loc-${encodeGeohash(lat, lng, 3)}`, name: `Region #${encodeGeohash(lat, lng, 3)}`, geohash: encodeGeohash(lat, lng, 3) },
    ];
}
