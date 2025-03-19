/* eslint-disable @typescript-eslint/no-unnecessary-type-parameters */
/* eslint-disable @typescript-eslint/no-dynamic-delete */

import { AchievementSettings } from '../components/types';

const CACHE_KEY = 'steamhunters_cache';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
const DEFAULT_SETTINGS_KEY = 'steamhunter_default_settings';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export interface AppCache {
  groups?: CacheEntry<unknown>;
  achievements?: CacheEntry<unknown>;
  gameInfo?: CacheEntry<unknown>;
  updates?: CacheEntry<unknown>;
}

type CacheStore = Record<string, AppCache>;

function getStore(): CacheStore {
  const storeData = localStorage.getItem(CACHE_KEY);

  return storeData !== null ? JSON.parse(storeData) as CacheStore : {};
}

function setStore(store: CacheStore): void {
  localStorage.setItem(CACHE_KEY, JSON.stringify(store));
}

export function getCachedData<T>(appId: string, type: keyof AppCache): T | null {
  try {
    const store = getStore();
    const appCache = store[appId];
    if (!appCache) {
      return null;
    }

    const entry = appCache[type] as CacheEntry<T> | undefined;
    if (!entry) {
      return null;
    }

    // Check if cache is expired
    if (Date.now() - entry.timestamp > CACHE_DURATION) {
      delete appCache[type];
      if (Object.keys(appCache).length === 0) {
        delete store[appId];
      }
      setStore(store);

      return null;
    }

    return entry.data;
  } catch (error) {
    console.error('Error reading from cache:', error);

    return null;
  }
}

export function setCachedData(appId: string, type: keyof AppCache, data: unknown): void {
  try {
    const store = getStore();
    if (!store[appId]) {
      store[appId] = {};
    }

    store[appId][type] = {
      data,
      timestamp: Date.now(),
    };
    setStore(store);
  } catch (error) {
    console.error('Error writing to cache:', error);
  }
}

export function clearAppCache(appId: string): void {
  try {
    const store = getStore();
    delete store[appId];
    setStore(store);
  } catch (error) {
    console.error('Error clearing app cache:', error);
  }
}

export function getCacheDate(appId: string, type: keyof AppCache = 'achievements'): Date | null {
  try {
    const store = getStore();
    const appCache = store[appId];
    if (!appCache) {
      return null;
    }

    const entry = appCache[type];
    if (!entry) {
      return null;
    }

    return new Date(entry.timestamp);
  } catch (error) {
    console.error('Error reading from cache:', error);

    return null;
  }
}

export function saveDefaultSettings(settings: AchievementSettings): void {
  localStorage.setItem(DEFAULT_SETTINGS_KEY, JSON.stringify(settings));
}

export function getDefaultSettings(): AchievementSettings | null {
  const settings = localStorage.getItem(DEFAULT_SETTINGS_KEY);

  return settings !== null ? JSON.parse(settings) as AchievementSettings : null;
}

export function clearDefaultSettings(): void {
  localStorage.removeItem(DEFAULT_SETTINGS_KEY);
}
