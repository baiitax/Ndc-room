"use client";
import { useSyncExternalStore } from "react";

/** Nonessential device preference, synchronized without an effect or hydration mismatch. */
export function useLocalPreference(key: string, fallback: string, allowed: readonly string[]) {
  const subscribe = (callback: () => void) => {
    const onStorage = (event: StorageEvent) => { if (event.key === key || event.key === null) callback(); };
    window.addEventListener("storage", onStorage);
    window.addEventListener("kemsr-preference", onStorage as EventListener);
    return () => { window.removeEventListener("storage", onStorage); window.removeEventListener("kemsr-preference", onStorage as EventListener); };
  };
  const getSnapshot = () => { try { const value = localStorage.getItem(key); return value && allowed.includes(value) ? value : fallback; } catch { return fallback; } };
  const value = useSyncExternalStore(subscribe, getSnapshot, () => fallback);
  const setValue = (next: string) => { try { localStorage.setItem(key, next); } catch { /* Preference persistence is optional. */ } window.dispatchEvent(new Event("kemsr-preference")); };
  return [value, setValue] as const;
}
