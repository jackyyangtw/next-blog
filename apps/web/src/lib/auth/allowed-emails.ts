// src/lib/auth/allowed-emails.ts

// 解析以逗號分隔的 email 白名單，統一轉小寫並去除空白
export function parseAllowedEmails(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

// 白名單為空時一律拒絕，避免漏設環境變數時對所有人開放登入
export function isEmailAllowed(
  email: string | null | undefined,
  allowedEmails: string[],
): boolean {
  if (!email) return false;
  return allowedEmails.includes(email.trim().toLowerCase());
}
