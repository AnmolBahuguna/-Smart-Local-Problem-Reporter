/**
 * auth.js — Authentication Logic
 * Handles register, login, logout, and session management.
 * Session stored in sessionStorage (cleared on tab close).
 */

const Auth = (() => {
  const SESSION_KEY = 'spr_session';

  // ── Session ───────────────────────────────────────────────
  function getSession() {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)); }
    catch { return null; }
  }
  function setSession(user) {
    // Strip password before storing in session
    const safe = { ...user };
    delete safe.password;
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(safe));
  }
  function clearSession() {
    sessionStorage.removeItem(SESSION_KEY);
  }

  // ── Public API ────────────────────────────────────────────
  function getCurrentUser() { return getSession(); }
  function isAuthenticated() { return !!getSession(); }
  function isAdmin() { const u = getSession(); return u && u.role === 'admin'; }

  function login(email, password) {
    const user = DB.Users.findByEmail(email);
    if (!user) return { ok: false, error: 'No account found with this email.' };
    if (user.password !== password) return { ok: false, error: 'Incorrect password.' };
    setSession(user);
    return { ok: true, user };
  }

  function register(name, email, password, phone, role) {
    if (DB.Users.findByEmail(email)) {
      return { ok: false, error: 'An account with this email already exists.' };
    }
    const user = DB.Users.create({ name, email, password, phone, role });
    setSession(user);
    return { ok: true, user };
  }

  function logout() {
    clearSession();
    window.location.href = 'auth.html';
  }

  // ── Route guards ──────────────────────────────────────────
  function requireAuth() {
    if (!isAuthenticated()) { window.location.href = 'auth.html'; return false; }
    return true;
  }
  function requireAdmin() {
    if (!isAuthenticated()) { window.location.href = 'auth.html'; return false; }
    if (!isAdmin()) { window.location.href = 'dashboard.html'; return false; }
    return true;
  }
  function redirectIfAuth() {
    if (isAuthenticated()) {
      window.location.href = isAdmin() ? 'admin.html' : 'dashboard.html';
    }
  }

  return { getCurrentUser, isAuthenticated, isAdmin, login, register, logout, requireAuth, requireAdmin, redirectIfAuth };
})();
