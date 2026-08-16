'use client';

import { useEffect, useSyncExternalStore } from 'react';

const DRAFT_TTL_MS = 1000 * 60 * 60 * 24;

interface DraftEnvelope<T> {
  savedAt: number;
  values: T;
}

const draftCache = new Map<string, unknown>();

const readDraft = <T>(key: string): T | null => {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;

    const parsed: DraftEnvelope<T> = JSON.parse(raw);

    if (Date.now() - parsed.savedAt > DRAFT_TTL_MS) {
      window.localStorage.removeItem(key);
      return null;
    }

    return parsed.values;
  } catch {
    return null;
  }
};

const getCachedDraft = <T>(key: string): T | null => {
  if (!draftCache.has(key)) {
    draftCache.set(key, readDraft<T>(key));
  }
  return draftCache.get(key) as T | null;
};

export const clearFormDraft = (key: string) => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(key);
  draftCache.delete(key);
};

const emptySubscribe = () => () => {};

export const useFormDraftValue = <T>(key: string): T | null => {
  return useSyncExternalStore(
    emptySubscribe,
    () => getCachedDraft<T>(key),
    () => null
  );
};

interface UseFormDraftOptions<T> {
  key: string;
  values: T;
  enabled?: boolean;
}

export const useFormDraft = <T>({ key, values, enabled = true }: UseFormDraftOptions<T>) => {
  useEffect(() => {
    if (!enabled) return;

    const timer = setTimeout(() => {
      const envelope: DraftEnvelope<T> = { savedAt: Date.now(), values };
      try {
        window.localStorage.setItem(key, JSON.stringify(envelope));
      } catch {}
    }, 400);

    return () => clearTimeout(timer);
  }, [key, enabled, values]);
};
