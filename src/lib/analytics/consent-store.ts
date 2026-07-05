import {
  ANALYTICS_CONSENT_DENIED,
  ANALYTICS_CONSENT_GRANTED,
  ANALYTICS_CONSENT_PENDING,
  ANALYTICS_CONSENT_STORAGE_KEY,
  type AnalyticsConsent,
  type AnalyticsConsentSnapshot,
} from "./consent";

type Listener = () => void;
type GoogleTag = (...args: unknown[]) => void;

const listeners = new Set<Listener>();
let currentConsent: AnalyticsConsent | null = null;
let hasReadStorage = false;

function normalizeConsent(value: string | null): AnalyticsConsent | null {
  return value === ANALYTICS_CONSENT_GRANTED ||
    value === ANALYTICS_CONSENT_DENIED
    ? value
    : null;
}

function readStoredConsent(): AnalyticsConsent | null {
  try {
    return normalizeConsent(
      window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY),
    );
  } catch {
    return null;
  }
}

function emitChange() {
  listeners.forEach((listener) => listener());
}

function updateGoogleConsent(consent: AnalyticsConsent) {
  const gtag = (window as Window & { gtag?: GoogleTag }).gtag;

  gtag?.("consent", "update", {
    ad_personalization: ANALYTICS_CONSENT_DENIED,
    ad_storage: ANALYTICS_CONSENT_DENIED,
    ad_user_data: ANALYTICS_CONSENT_DENIED,
    analytics_storage: consent,
  });
}

export function getAnalyticsConsentSnapshot(): AnalyticsConsentSnapshot {
  if (!hasReadStorage) {
    currentConsent = readStoredConsent();
    hasReadStorage = true;
  }

  return currentConsent;
}

export function getServerAnalyticsConsentSnapshot(): AnalyticsConsentSnapshot {
  return ANALYTICS_CONSENT_PENDING;
}

export function subscribeToAnalyticsConsent(listener: Listener) {
  function handleStorage(event: StorageEvent) {
    if (event.key !== ANALYTICS_CONSENT_STORAGE_KEY) {
      return;
    }

    currentConsent = normalizeConsent(event.newValue);
    hasReadStorage = true;
    listener();
  }

  listeners.add(listener);
  window.addEventListener("storage", handleStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

export function setAnalyticsConsent(consent: AnalyticsConsent) {
  currentConsent = consent;
  hasReadStorage = true;

  try {
    window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, consent);
  } catch {
    // Keep the in-memory choice when browser storage is unavailable.
  }

  updateGoogleConsent(consent);
  emitChange();
}

export function resetAnalyticsConsent() {
  currentConsent = null;
  hasReadStorage = true;

  try {
    window.localStorage.removeItem(ANALYTICS_CONSENT_STORAGE_KEY);
  } catch {
    // The in-memory consent state is still reset.
  }

  updateGoogleConsent(ANALYTICS_CONSENT_DENIED);
  emitChange();
}
