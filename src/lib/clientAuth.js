/**
 * Client-side helper to verify if the current user has a valid, active admin session.
 * If the token in localStorage is invalid, expired, or tampered with, it automatically cleans it up.
 * 
 * @returns {Promise<boolean>} true if admin is authenticated and verified by the server
 */
export async function checkIsAdmin() {
  if (typeof window === 'undefined') return false;

  const token = localStorage.getItem('admin_token');
  if (!token) return false;

  try {
    const res = await fetch('/api/auth/verify', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.valid) {
        return true;
      }
    }

    // If verification failed (401/403 or invalid), clean up stale session immediately
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
    window.dispatchEvent(new Event('admin_auth_changed'));
    return false;
  } catch (err) {
    console.error('Error verifying admin session:', err);
    return false;
  }
}

/**
 * Logs out the current admin user and dispatches an event to notify all components.
 */
export function logoutAdmin() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_email');
  window.dispatchEvent(new Event('admin_auth_changed'));
}
