import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSyncExternalStore } from "react";

import type { AppLocale } from "../i18n";

type ThemeOverride = "dark" | "light" | null;

interface StoredAppPreferences {
  localeOverride: AppLocale | null;
  themeOverride: ThemeOverride;
}

const storageKey = "@jacky-dev/mobile-preferences";
const subscribers = new Set<() => void>();
let hasLocalChanges = false;
let snapshot: StoredAppPreferences = {
  localeOverride: null,
  themeOverride: null,
};

function notifySubscribers() {
  subscribers.forEach((subscriber) => subscriber());
}

function subscribe(subscriber: () => void) {
  subscribers.add(subscriber);

  return () => subscribers.delete(subscriber);
}

function getSnapshot() {
  return snapshot;
}

function isAppLocale(value: unknown): value is AppLocale {
  return value === "en" || value === "zh-TW";
}

function isThemeOverride(value: unknown): value is ThemeOverride {
  return value === "dark" || value === "light" || value === null;
}

async function hydratePreferences() {
  try {
    const storedValue = await AsyncStorage.getItem(storageKey);

    if (!storedValue || hasLocalChanges) return;

    const parsedValue: unknown = JSON.parse(storedValue);
    if (!parsedValue || typeof parsedValue !== "object") return;

    const storedPreferences = parsedValue as Partial<StoredAppPreferences>;
    snapshot = {
      localeOverride: isAppLocale(storedPreferences.localeOverride)
        ? storedPreferences.localeOverride
        : null,
      themeOverride: isThemeOverride(storedPreferences.themeOverride)
        ? storedPreferences.themeOverride
        : null,
    };
    notifySubscribers();
  } catch {
    // 儲存空間無法使用時，改為在本次啟動期間保存偏好。
  }
}

void hydratePreferences();

export function updateAppPreferences(updates: Partial<StoredAppPreferences>) {
  hasLocalChanges = true;
  snapshot = { ...snapshot, ...updates };
  notifySubscribers();
  void AsyncStorage.setItem(storageKey, JSON.stringify(snapshot)).catch(() => {
    // 儲存失敗不應阻斷使用者切換當前偏好。
  });
}

export function useStoredAppPreferences(): StoredAppPreferences {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
