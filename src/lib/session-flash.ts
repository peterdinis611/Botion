const SESSION_EXPIRED_KEY = "botion_session_expired";
const LOGIN_GRACE_KEY = "botion_login_at";
const LOGIN_GRACE_MS = 15_000;

export function markSessionExpiredFlash() {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_EXPIRED_KEY, "1");
}

export function consumeSessionExpiredFlash(): boolean {
  if (typeof window === "undefined") return false;
  const value = sessionStorage.getItem(SESSION_EXPIRED_KEY);
  if (!value) return false;
  sessionStorage.removeItem(SESSION_EXPIRED_KEY);
  return true;
}

export function markJustLoggedIn() {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(LOGIN_GRACE_KEY, String(Date.now()));
}

export function isWithinLoginGracePeriod(): boolean {
  if (typeof window === "undefined") return false;
  const raw = sessionStorage.getItem(LOGIN_GRACE_KEY);
  if (!raw) return false;
  return Date.now() - Number(raw) < LOGIN_GRACE_MS;
}

export function clearLoginGracePeriod() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(LOGIN_GRACE_KEY);
}
