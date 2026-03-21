/**
 * 轻量级 IndexedDB 缓存工具
 */

const DB_NAME = 'redis-dict-animation-cache';
const STORE_NAME = 'kv-store';
const FALLBACK_PREFIX = 'idb-fallback:';

export interface CachedRecord<T> {
  value: T;
  updatedAt: number;
}

function hasIndexedDb(): boolean {
  return typeof window !== 'undefined' && 'indexedDB' in window;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, 1);

    request.onerror = () => reject(request.error);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
  });
}

function readFallback<T>(key: string): CachedRecord<T> | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(FALLBACK_PREFIX + key);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as CachedRecord<T>;
  } catch {
    return null;
  }
}

function writeFallback<T>(key: string, record: CachedRecord<T>): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(FALLBACK_PREFIX + key, JSON.stringify(record));
}

export async function getCachedValue<T>(key: string): Promise<CachedRecord<T> | null> {
  if (!hasIndexedDb()) {
    return readFallback<T>(key);
  }

  try {
    const db = await openDb();
    const value = await new Promise<CachedRecord<T> | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        resolve((request.result as CachedRecord<T> | undefined) ?? null);
      };
    });

    db.close();

    if (value) {
      writeFallback(key, value);
      return value;
    }

    return readFallback<T>(key);
  } catch {
    return readFallback<T>(key);
  }
}

export async function setCachedValue<T>(key: string, value: T): Promise<void> {
  const record: CachedRecord<T> = {
    value,
    updatedAt: Date.now(),
  };

  writeFallback(key, record);

  if (!hasIndexedDb()) return;

  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(record, key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
    db.close();
  } catch {
    // 已写入 fallback，无需额外处理
  }
}
