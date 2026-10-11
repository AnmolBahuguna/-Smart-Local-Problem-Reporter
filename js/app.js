/**
 * app.js — Core Application Utilities
 * Toast notifications, modals, sidebar, and shared helpers.
 */

const App = (() => {

  // ── Toast Notifications ───────────────────────────────────
  function toast(type, title, message, duration = 3000) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `
      <span class="toast-icon">${icons[type] || icons.info}</span>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        ${message ? `<div class="toast-msg">${message}</div>` : ''}
      </div>
      <button onclick="this.parentElement.remove()" style="background:none;border:none;font-size:1rem;cursor:pointer;color:var(--c-text-3);padding:0 0 0 8px;">✕</button>
    `;
    container.appendChild(t);

    setTimeout(() => {
      t.classList.add('out');
      t.addEventListener('animationend', () => t.remove(), { once: true });
    }, duration);
  }

  // ── Modal ─────────────────────────────────────────────────
  function openModal(id) {
    const el = document.getElementById(id);
    if (el) { el.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
  }
  function closeModal(id) {
    const el = document.getElementById(id);
    if (el) { el.style.display = 'none'; document.body.style.overflow = ''; }
  }
  function modal(title, bodyHtml, footerHtml = '') {
    const existing = document.getElementById('dynamic-modal');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'dynamic-modal';
    overlay.style.display = 'flex';
    overlay.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="dyn-modal-title">
        <div class="modal-header">
          <h4 id="dyn-modal-title">${title}</h4>
          <button class="btn btn-ghost btn-icon" onclick="document.getElementById('dynamic-modal').remove();document.body.style.overflow='';" aria-label="Close">✕</button>
        </div>
        <div class="modal-body">${bodyHtml}</div>
        ${footerHtml ? `<div class="modal-footer">${footerHtml}</div>` : ''}
      </div>
    `;
    overlay.addEventListener('click', e => {
      if (e.target === overlay) { overlay.remove(); document.body.style.overflow = ''; }
    });
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
  }

  // ── Sidebar Toggle ────────────────────────────────────────
  function initSidebar() {
    const toggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('app-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (!toggle || !sidebar) return;

    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      if (overlay) overlay.classList.toggle('visible');
    });
    if (overlay) {
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('visible');
      });
    }
  }

  // ── Format date ───────────────────────────────────────────
  function formatDate(isoStr) {
    if (!isoStr) return '—';
    const d = new Date(isoStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }
  function formatDateTime(isoStr) {
    if (!isoStr) return '—';
    const d = new Date(isoStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
         + ' • ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }
  function timeAgo(isoStr) {
    const diff = Date.now() - new Date(isoStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1)  return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)  return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7)  return `${days}d ago`;
    return formatDate(isoStr);
  }

  // ── Status badge HTML ─────────────────────────────────────
  function statusBadge(statusId) {
    const s = DB.Statuses.findById(statusId);
    if (!s) return '';
    return `<span class="badge ${s.badge}">${s.name}</span>`;
  }

  // ── Category pill ─────────────────────────────────────────
  function categoryPill(categoryId) {
    const c = DB.Categories.findById(categoryId);
    if (!c) return '';
    return `<span style="font-size:0.78rem;font-weight:600;color:var(--c-text-2);">${c.icon} ${c.name}</span>`;
  }

  // ── Google Maps helpers ───────────────────────────────────
  function mapsQuery(c) {
    return (c.lat != null && c.lng != null) ? `${c.lat},${c.lng}` : encodeURIComponent(c.location || '');
  }
  function mapsSearchUrl(c) {
    return `https://www.google.com/maps/search/?api=1&query=${mapsQuery(c)}`;
  }
  function mapsEmbedUrl(c, zoom = 16) {
    return `https://maps.google.com/maps?q=${mapsQuery(c)}&z=${zoom}&output=embed`;
  }

  // ── Escape HTML ───────────────────────────────────────────
  function esc(str) {
    if (!str) return '';
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ── Populate user UI elements ─────────────────────────────
  function populateUserUI() {
    const user = Auth.getCurrentUser();
    if (!user) return;

    const avatarEls = document.querySelectorAll('.js-user-avatar');
    avatarEls.forEach(el => { el.textContent = user.avatar || user.name.slice(0,2).toUpperCase(); });

    const nameEls = document.querySelectorAll('.js-user-name');
    nameEls.forEach(el => { el.textContent = user.name; });

    const emailEls = document.querySelectorAll('.js-user-email');
    emailEls.forEach(el => { el.textContent = user.email; });

    const logoutBtns = document.querySelectorAll('.js-logout');
    logoutBtns.forEach(btn => btn.addEventListener('click', () => Auth.logout()));
  }

  // ── Page fade-in ──────────────────────────────────────────
  function fadeIn(selector = 'main, .page-body') {
    const el = document.querySelector(selector);
    if (el) el.classList.add('page-fade');
  }

  // ── Confirm dialog ────────────────────────────────────────
  function confirm(message, onConfirm, confirmText = 'Confirm', danger = false) {
    modal(
      'Confirm Action',
      `<p>${message}</p>`,
      `<button class="btn btn-ghost" onclick="document.getElementById('dynamic-modal').remove();document.body.style.overflow='';">Cancel</button>
       <button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" id="confirm-action-btn">${confirmText}</button>`
    );
    setTimeout(() => {
      const btn = document.getElementById('confirm-action-btn');
      if (btn) btn.addEventListener('click', () => {
        document.getElementById('dynamic-modal')?.remove();
        document.body.style.overflow = '';
        onConfirm();
      });
    }, 50);
  }

  return { toast, openModal, closeModal, modal, initSidebar, formatDate, formatDateTime, timeAgo, statusBadge, categoryPill, esc, populateUserUI, fadeIn, confirm, mapsQuery, mapsSearchUrl, mapsEmbedUrl };
})();
