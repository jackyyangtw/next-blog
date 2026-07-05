export const ANALYTICS_CONSENT_STORAGE_KEY = "analytics-consent:v1";

export const ANALYTICS_CONSENT_GRANTED = "granted";
export const ANALYTICS_CONSENT_DENIED = "denied";
export const ANALYTICS_CONSENT_PENDING = "pending";

export type AnalyticsConsent =
  | typeof ANALYTICS_CONSENT_GRANTED
  | typeof ANALYTICS_CONSENT_DENIED;

export type AnalyticsConsentSnapshot =
  | AnalyticsConsent
  | typeof ANALYTICS_CONSENT_PENDING
  | null;
