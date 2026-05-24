const REMEMBER_EMAIL_KEY = "surpass-remember-email";

export function getRememberedEmail(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REMEMBER_EMAIL_KEY);
}

export function saveRememberedEmail(email: string) {
  localStorage.setItem(REMEMBER_EMAIL_KEY, email);
}

export function clearRememberedEmail() {
  localStorage.removeItem(REMEMBER_EMAIL_KEY);
}

/** Duración de sesión local cuando "recordar" está activo (30 días). */
export const REMEMBER_SESSION_MAX_AGE = 60 * 60 * 24 * 30;

/** Duración de sesión local sin recordar (1 día). */
export const DEFAULT_SESSION_MAX_AGE = 60 * 60 * 24;
