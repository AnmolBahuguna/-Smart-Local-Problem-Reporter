/**
 * admin.js — Admin Dashboard Logic
 * Statistics, complaint management, status updates, Chart.js charts.
 */

const AdminPage = (() => {

  let charts = {};
  let allComplaints = [];
  let currentFilter = { status: 'all', category: 'all', search: '' };

  function init() {
    if (!Auth.requireAdmin()) return;
    App.populateUserUI();
    App.initSidebar();
    App.fadeIn('.page-body');
    allComplaints = DB.Complaints.all();
    renderStats();
    renderCharts();
    renderFilters();
    renderTable(allComplaints);
    bindFilters();
  }

  function renderStats() {
    const stats = DB.Complaints.stats();
    document.getElementById('stat-total')?.textContent    !== undefined && (document.getElementById('stat-total').textContent    = stats.total);
    document.getElementById('stat-pending')?.textContent  !== undefined && (document.getElementById('stat-pending').textContent  = stats.pending);
    document.getElementById('stat-progress')?.textContent !== undefined && (document.getElementById('stat-progress').textContent = stats.progress);
    document.getElementById('stat-resolved')?.textContent !== undefined && (document.getElementById('stat-resolved').textContent = stats.resolved);
    document.getElementById('stat-users')?.textContent    !== undefined && (document.getElementById('stat-users').textContent    = DB.Users.count());

    // Resolution rate
    const rate = stats.total ? Math.round((stats.resolved / stats.total) * 100) : 0;
    const rateEl = document.getElementById('stat-rate');
    if (rateEl) rateEl.textContent = rate + '%';
  }

  function renderCharts() {
    const byCat  = DB.Complaints.byCategory();
    const byDays = DB.Complaints.last7Days();
    const stats  = DB.Complaints.stats();

    // Donut — by category
    const catCtx = document.getElementById('chart-category')?.getContext('2d');
    if (catCtx) {
      if (charts.cat) charts.cat.destroy();
      charts.cat = new Chart(catCtx, {
        type: 'doughnut',
        data: {
          labels: byCat.map(c => c.name),
          datasets: [{
            data: byCat.map(c => c.count),
            backgroundColor: byCat.map(c => c.color + 'cc'),
            borderColor: byCat.map(c => c.color),
            borderWidth: 2,
          }],
        },
        options: {
          responsive: true, maintainAspectRatio: true,
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 }, padding: 12 } },
            tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw} complaints` } },
          },
          cutout: '62%',
        },
      });
    }

    // Bar — by status
    const statusCtx = document.getElementById('chart-status')?.getContext('2d');
    if (statusCtx) {
      if (charts.status) charts.status.destroy();
      charts.status = new Chart(statusCtx, {
        type: 'bar',
        data: {
          labels: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
          datasets: [{
            label: 'Complaints',
            data: [stats.pending, stats.progress, stats.resolved, stats.rejected],
            backgroundColor: [
              'hsla(38,92%,50%,.7)',
              'hsla(220,72%,45%,.7)',
              'hsla(142,60%,38%,.7)',
              'hsla(4,72%,52%,.7)',
            ],
            borderColor: [
              'hsl(38,92%,45%)',
              'hsl(220,72%,40%)',
              'hsl(142,60%,33%)',
              'hsl(4,72%,47%)',
            ],
            borderWidth: 2,
            borderRadius: 8,
          }],
        },
        options: {
          responsive: true, maintainAspectRatio: true,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: 'hsla(0,0%,0%,.05)' } },
            x: { grid: { display: false } },
          },
        },
      });
    }

    // Line — last 7 days
    const lineCtx = document.getElementById('chart-trend')?.getContext('2d');
    if (lineCtx) {
      if (charts.line) charts.line.destroy();
      charts.line = new Chart(lineCtx, {
        type: 'line',
        data: {
          labels: byDays.map(d => d.label),
          datasets: [{
            label: 'Complaints Filed',
            data: byDays.map(d => d.count),
            borderColor: 'hsl(220,72%,45%)',
            backgroundColor: 'hsla(220,72%,45%,.08)',
            borderWidth: 2.5,
            pointBackgroundColor: 'hsl(220,72%,45%)',
            pointRadius: 4,
            fill: true,
            tension: 0.35,
          }],
        },
        options: {
          responsive: true, maintainAspectRatio: true,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: 'hsla(0,0%,0%,.05)' } },
            x: { grid: { display: false } },
          },
        },
      });
    }
  }

  function renderFilters() {
    const cats = DB.Categories.all();
    const catSelect = document.getElementById('admin-filter-category');
    if (catSelect) {
      catSelect.innerHTML = `<option value="all">All Categories</option>` +
        cats.map(c => `<option value="${c.id}">${c.icon} ${c.name}</option>`).join('');
    }
    const statSelect = document.getElementById('admin-filter-status');
    if (statSelect) {
      statSelect.innerHTML = `<option value="all">All Statuses</option>` +
        DB.Statuses.all().map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    }
  }

  function bindFilters() {
    document.getElementById('admin-filter-category')?.addEventListener('change', e => {
      currentFilter.category = e.target.value;
      applyFilters();
    });
    document.getElementById('admin-filter-status')?.addEventListener('change', e => {
      currentFilter.status = e.target.value;
      applyFilters();
    });
    document.getElementById('admin-search')?.addEventListener('input', e => {
      currentFilter.search = e.target.value.toLowerCase();
      applyFilters();
    });
  }

  function applyFilters() {
    let filtered = DB.Complaints.all();
    if (currentFilter.status !== 'all') filtered = filtered.filter(c => c.statusId === currentFilter.status);
    if (currentFilter.category !== 'all') filtered = filtered.filter(c => c.categoryId === currentFilter.category);
    if (currentFilter.search) filtered = filtered.filter(c =>
      c.title.toLowerCase().includes(currentFilter.search) ||
      c.userName.toLowerCase().includes(currentFilter.search) ||
      c.location.toLowerCase().includes(currentFilter.search)
    );
    renderTable(filtered);
  }

  function renderTable(complaints) {
    const tbody = document.getElementById('admin-table-body');
    if (!tbody) return;

    const countEl = document.getElementById('admin-count');
    if (countEl) countEl.textContent = complaints.length;

    if (complaints.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--c-text-3);">No complaints match your filters.</td></tr>`;
      return;
    }

    tbody.innerHTML = complaints.map(c => {
      const cat = DB.Categories.findById(c.categoryId);
      const statuses = DB.Statuses.all();
      const statusOptions = statuses.map(s => `<option value="${s.id}" ${s.id === c.statusId ? 'selected' : ''}>${s.name}</option>`).join('');

      return `
        <tr>
          <td><code style="font-size:0.72rem;color:var(--c-text-3);">${c.id.toUpperCase()}</code></td>
          <td>
            <div style="font-weight:600;font-size:0.875rem;max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${App.esc(c.title)}</div>
            <div style="font-size:0.75rem;color:var(--c-text-3);">👤 ${App.esc(c.userName)}</div>
          </td>
          <td><span style="font-size:0.8rem;">${cat ? cat.icon + ' ' + cat.name : '—'}</span></td>
          <td><span style="font-size:0.78rem;max-width:180px;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">📍 ${App.esc(c.location)}</span></td>
          <td>${App.statusBadge(c.statusId)}</td>
          <td style="white-space:nowrap;">${App.formatDate(c.createdAt)}</td>
          <td>
            <div style="display:flex;gap:8px;align-items:center;">
              <select class="form-control status-select" style="width:140px;font-size:0.8rem;padding:6px 10px;" data-id="${c.id}">${statusOptions}</select>
              <button class="btn btn-primary btn-sm view-btn" data-id="${c.id}" title="View details">👁️</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Bind status change
    tbody.querySelectorAll('.status-select').forEach(sel => {
      sel.addEventListener('change', e => {
        const id = e.target.dataset.id;
        const newStatusId = e.target.value;
        DB.Complaints.updateStatus(id, newStatusId);
        renderStats();
        renderCharts();
        App.toast('success', 'Status updated', 'Complaint status has been saved.');
      });
    });

    // Bind view button
    tbody.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', () => viewComplaint(btn.dataset.id));
    });
  }

  function viewComplaint(id) {
    const c = DB.Complaints.findById(id);
    if (!c) return;
    const cat = DB.Categories.findById(c.categoryId);
    const statusOpts = DB.Statuses.all().map(s =>
      `<option value="${s.id}" ${s.id === c.statusId ? 'selected' : ''}>${s.name}</option>`
    ).join('');

    const imgHtml = c.image ? `<img src="${c.image}" style="width:100%;border-radius:var(--r-md);margin-bottom:16px;max-height:200px;object-fit:cover;">` : '';

    App.modal(
      `Complaint: ${c.id.toUpperCase()}`,
      `
        ${imgHtml}
        <div style="display:grid;gap:12px;">
          <div><strong>Title:</strong><br>${App.esc(c.title)}</div>
          <div><strong>Submitted by:</strong> ${App.esc(c.userName)}</div>
          <div><strong>Category:</strong> ${cat ? cat.icon + ' ' + cat.name : '—'}</div>
          <div><strong>Location:</strong> 📍 ${App.esc(c.location)}${(c.lat != null && c.lng != null) ? ` <span style="font-size:0.72rem;color:var(--c-text-3);font-family:monospace;">(${c.lat.toFixed(5)}, ${c.lng.toFixed(5)})</span>` : ''}</div>
          <div class="map-frame-wrap">
            <iframe class="map-frame" style="height:190px;" title="Complaint location map" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen src="${App.mapsEmbedUrl(c)}"></iframe>
            <div class="map-meta">
              <span style="font-size:0.75rem;color:var(--c-text-3);">Issue location</span>
              <a href="${App.mapsSearchUrl(c)}" target="_blank" rel="noopener" style="font-size:0.78rem;font-weight:600;">🗺️ Open in Google Maps →</a>
            </div>
          </div>
          <div><strong>Description:</strong><br><p style="margin:4px 0 0;">${App.esc(c.description)}</p></div>
          <div><strong>Submitted:</strong> ${App.formatDateTime(c.createdAt)}</div>
          <div><strong>Last Updated:</strong> ${App.formatDateTime(c.updatedAt)}</div>
          <div class="form-group">
            <label class="form-label" for="modal-status">Update Status</label>
            <select class="form-control" id="modal-status">${statusOpts}</select>
          </div>
          <div class="form-group">
            <label class="form-label" for="modal-note">Admin Note</label>
            <textarea class="form-control" id="modal-note" rows="3" placeholder="Add a note for the citizen...">${App.esc(c.adminNote)}</textarea>
          </div>
          <div style="padding-top:8px;">
            ${Suggestions.renderSuggestionPanel(c.categoryId)}
          </div>
        </div>
      `,
      `<button class="btn btn-ghost" onclick="document.getElementById('dynamic-modal').remove();document.body.style.overflow='';">Cancel</button>
       <button class="btn btn-primary" id="save-complaint-btn" data-id="${c.id}">💾 Save Changes</button>`
    );

    setTimeout(() => {
      document.getElementById('save-complaint-btn')?.addEventListener('click', () => {
        const statusId = document.getElementById('modal-status').value;
        const note     = document.getElementById('modal-note').value;
        DB.Complaints.updateStatus(c.id, statusId, note);
        document.getElementById('dynamic-modal')?.remove();
        document.body.style.overflow = '';
        App.toast('success', 'Complaint updated', 'Status and note have been saved.');
        renderStats();
        renderCharts();
        applyFilters();
      });
    }, 50);
  }

  return { init };
})();

window.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('admin-table-body')) {
    AdminPage.init();
  }
});
