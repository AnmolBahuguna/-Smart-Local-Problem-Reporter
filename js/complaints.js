/**
 * complaints.js — Complaint Page Logic
 * Handles the My Complaints page: listing, filtering, expanding, feedback.
 */

const ComplaintsPage = (() => {

  let currentFilter = { status: 'all', category: 'all', search: '' };
  let expandedId = null;

  function init() {
    if (!Auth.requireAuth()) return;
    App.populateUserUI();
    App.initSidebar();
    App.fadeIn('.page-body');
    renderFilters();
    renderComplaints();
    bindFilters();
  }

  function renderFilters() {
    const cats = DB.Categories.all();
    const catSelect = document.getElementById('filter-category');
    if (!catSelect) return;
    catSelect.innerHTML = `<option value="all">All Categories</option>` +
      cats.map(c => `<option value="${c.id}">${c.icon} ${c.name}</option>`).join('');

    const statSelect = document.getElementById('filter-status');
    if (!statSelect) return;
    statSelect.innerHTML = `<option value="all">All Statuses</option>` +
      DB.Statuses.all().map(s => `<option value="${s.id}">${s.name}</option>`).join('');
  }

  function bindFilters() {
    document.getElementById('filter-category')?.addEventListener('change', e => {
      currentFilter.category = e.target.value;
      renderComplaints();
    });
    document.getElementById('filter-status')?.addEventListener('change', e => {
      currentFilter.status = e.target.value;
      renderComplaints();
    });
    document.getElementById('filter-search')?.addEventListener('input', e => {
      currentFilter.search = e.target.value.toLowerCase();
      renderComplaints();
    });
  }

  function renderComplaints() {
    const user = Auth.getCurrentUser();
    let complaints = DB.Complaints.byUser(user.id);

    // Apply filters
    if (currentFilter.status !== 'all') {
      complaints = complaints.filter(c => c.statusId === currentFilter.status);
    }
    if (currentFilter.category !== 'all') {
      complaints = complaints.filter(c => c.categoryId === currentFilter.category);
    }
    if (currentFilter.search) {
      complaints = complaints.filter(c =>
        c.title.toLowerCase().includes(currentFilter.search) ||
        c.description.toLowerCase().includes(currentFilter.search) ||
        c.location.toLowerCase().includes(currentFilter.search)
      );
    }

    const container = document.getElementById('complaints-list');
    if (!container) return;

    // Update count badge
    const countEl = document.getElementById('complaint-count');
    if (countEl) countEl.textContent = complaints.length;

    if (complaints.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📋</div>
          <h4>No complaints found</h4>
          <p>Try adjusting your filters, or <a href="report.html">report a new issue</a>.</p>
        </div>`;
      return;
    }

    container.innerHTML = complaints.map(c => renderComplaintCard(c)).join('');

    // Bind expand toggles
    container.querySelectorAll('.complaint-card-header').forEach(header => {
      header.addEventListener('click', () => {
        const id = header.dataset.id;
        const body = document.getElementById(`body-${id}`);
        if (!body) return;
        const isOpen = body.style.display === 'block';
        // Close all first
        container.querySelectorAll('.complaint-card-header .chevron').forEach(ch => ch.textContent = '▼');
        container.querySelectorAll('[id^="body-"]').forEach(b => b.style.display = 'none');
        if (!isOpen) {
          body.style.display = 'block';
          header.querySelector('.chevron').textContent = '▲';
        }
      });
    });

    // Bind feedback forms
    container.querySelectorAll('.feedback-form').forEach(form => {
      let selectedRating = 0;
      const complaintId = form.dataset.id;
      const stars = form.querySelectorAll('.star');
      stars.forEach(star => {
        star.addEventListener('click', () => {
          selectedRating = parseInt(star.dataset.val);
          stars.forEach((s, i) => s.classList.toggle('active', i < selectedRating));
        });
      });
      form.querySelector('.feedback-submit')?.addEventListener('click', () => {
        const text = form.querySelector('.feedback-text')?.value.trim();
        if (!selectedRating) { App.toast('warning', 'Rating required', 'Please select a star rating.'); return; }
        DB.Feedback.create({ complaintId, userId: user.id, text, rating: selectedRating });
        App.toast('success', 'Feedback submitted!', 'Thank you for your feedback.');
        form.innerHTML = `<div class="alert-box success" style="margin-top:12px;">✅ Feedback submitted. Thank you!</div>`;
      });
    });
  }

  function renderComplaintCard(c) {
    const cat = DB.Categories.findById(c.categoryId);
    const feedback = DB.Feedback.byComplaint(c.id);
    const hasFeedback = feedback.length > 0;
    const isResolved = c.statusId === 'st_3';
    const suggestion = Suggestions.getSuggestion(c.categoryId);

    const feedbackSection = isResolved && !hasFeedback ? `
      <div class="feedback-form" data-id="${c.id}" style="margin-top:16px;padding-top:16px;border-top:1px solid var(--c-border);">
        <h5 style="margin-bottom:10px;">📝 Rate your experience</h5>
        <div class="star-rating" style="margin-bottom:12px;">
          ${[1,2,3,4,5].map(v => `<span class="star" data-val="${v}">★</span>`).join('')}
        </div>
        <textarea class="form-control feedback-text" placeholder="Share your feedback (optional)" style="margin-bottom:10px;" rows="2"></textarea>
        <button class="btn btn-primary btn-sm feedback-submit">Submit Feedback</button>
      </div>
    ` : hasFeedback ? `
      <div class="alert-box success" style="margin-top:12px;">✅ Feedback submitted. Rating: ${'★'.repeat(feedback[0].rating)}</div>
    ` : '';

    const adminNote = c.adminNote ? `
      <div class="alert-box info" style="margin-bottom:12px;">
        <span>🏛️</span>
        <div><strong>Admin Note:</strong> ${App.esc(c.adminNote)}</div>
      </div>
    ` : '';

    const imageSection = c.image ? `
      <div style="margin-bottom:12px;border-radius:var(--r-md);overflow:hidden;max-height:200px;">
        <img src="${c.image}" alt="Complaint image" style="width:100%;object-fit:cover;">
      </div>
    ` : '';

    return `
      <div class="complaint-card" id="card-${c.id}">
        <div class="complaint-card-header" data-id="${c.id}" aria-expanded="false">
          <div style="flex:1;">
            <div class="complaint-meta" style="margin-bottom:6px;">
              ${App.statusBadge(c.statusId)}
              <span style="font-size:0.8rem;font-weight:600;color:var(--c-text-2);">${cat ? cat.icon + ' ' + cat.name : ''}</span>
              <span class="text-xs text-muted">${App.timeAgo(c.createdAt)}</span>
            </div>
            <div style="font-weight:600;font-size:0.95rem;color:var(--c-text);">${App.esc(c.title)}</div>
            <div class="complaint-id">ID: ${c.id.toUpperCase()}</div>
          </div>
          <span class="chevron" style="color:var(--c-text-3);font-size:0.8rem;margin-left:12px;">▼</span>
        </div>
        <div class="complaint-body" id="body-${c.id}" style="display:none;">
          ${adminNote}
          ${imageSection}
          <p class="complaint-desc">${App.esc(c.description)}</p>
          <div style="display:flex;gap:16px;flex-wrap:wrap;font-size:0.8125rem;color:var(--c-text-2);margin-bottom:16px;">
            <span>📍 ${App.esc(c.location)}${(c.lat != null && c.lng != null) ? ' <span style="font-size:0.72rem;color:var(--c-text-3);font-family:monospace;">(GPS pinned)</span>' : ''}</span>
            <span>📅 Submitted: ${App.formatDate(c.createdAt)}</span>
            <span>🔄 Updated: ${App.formatDate(c.updatedAt)}</span>
          </div>
          <div class="map-frame-wrap" style="margin-bottom:16px;">
            <iframe class="map-frame" style="height:190px;" title="Complaint location map" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen src="${App.mapsEmbedUrl(c)}"></iframe>
            <div class="map-meta">
              <span style="font-size:0.75rem;color:var(--c-text-3);">Issue location</span>
              <a href="${App.mapsSearchUrl(c)}" target="_blank" rel="noopener" style="font-size:0.78rem;font-weight:600;">🗺️ Open in Google Maps →</a>
            </div>
          </div>
          <details style="margin-bottom:12px;">
            <summary style="font-size:0.85rem;font-weight:600;color:var(--c-primary);cursor:pointer;user-select:none;padding:8px 0;">
              💡 View Auto-Suggestions for this issue
            </summary>
            <div style="margin-top:12px;">
              ${Suggestions.renderSuggestionPanel(c.categoryId)}
            </div>
          </details>
          ${feedbackSection}
        </div>
      </div>
    `;
  }

  return { init };
})();

window.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('complaints-list')) {
    ComplaintsPage.init();
  }
});
