const AUTH_HINT_COOKIE = 'hasSession';
const THIRTY_DAYS = 60 * 60 * 24 * 30;

export const setAuthHintCookie = () => {
  if (typeof document === 'undefined') return;
  document.cookie = `${AUTH_HINT_COOKIE}=1; path=/; max-age=${THIRTY_DAYS}; samesite=lax`;
};

export const clearAuthHintCookie = () => {
  if (typeof document === 'undefined') return;
  document.cookie = `${AUTH_HINT_COOKIE}=; path=/; max-age=0`;
};

export const hasAuthHint = () => {
  if (typeof document === 'undefined') return false;

  return document.cookie.split('; ').some(cookie => cookie.startsWith(`${AUTH_HINT_COOKIE}=1`));
};
