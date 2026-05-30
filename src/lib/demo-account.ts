export const DEMO_EMAIL_DOMAIN = "try.botion.app";

export function isDemoAccountEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.trim().toLowerCase().endsWith(`@${DEMO_EMAIL_DOMAIN}`);
}
