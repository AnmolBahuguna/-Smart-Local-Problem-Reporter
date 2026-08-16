/**
 * data.js — localStorage Data Layer
 * All data stored under 'spr_*' keys.
 * Provides a simple in-memory + persistent store for users,
 * complaints, categories, statuses, and feedback.
 */

const DB = (() => {
  const PREFIX = 'spr_';

  // ── Helpers ──────────────────────────────────────────────
  function load(key) {
    try { return JSON.parse(localStorage.getItem(PREFIX + key)) || null; }
    catch { return null; }
  }
  function save(key, val) {
    localStorage.setItem(PREFIX + key, JSON.stringify(val));
  }
  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }
  function now() { return new Date().toISOString(); }

  // ── Seed Data ─────────────────────────────────────────────
  const CATEGORIES = [
    { id: 'cat_1', name: 'Pothole / Road Damage',    icon: '🕳️',  color: '#dc2626' },
    { id: 'cat_2', name: 'Street Light',             icon: '💡',  color: '#d97706' },
    { id: 'cat_3', name: 'Water Supply',             icon: '💧',  color: '#2563eb' },
    { id: 'cat_4', name: 'Garbage Collection',       icon: '🗑️',  color: '#16a34a' },
    { id: 'cat_5', name: 'Sewage / Drainage',        icon: '🚰',  color: '#7c3aed' },
    { id: 'cat_6', name: 'Noise Pollution',          icon: '📢',  color: '#db2777' },
    { id: 'cat_7', name: 'Stray Animals',            icon: '🐕',  color: '#b45309' },
    { id: 'cat_8', name: 'Illegal Construction',     icon: '🏗️',  color: '#0891b2' },
    { id: 'cat_9', name: 'Park / Public Space',      icon: '🌳',  color: '#15803d' },
    { id: 'cat_10', name: 'Traffic / Signage',       icon: '🚦',  color: '#1d4ed8' },
    { id: 'cat_11', name: 'Electricity / Power Cut', icon: '⚡',  color: '#ca8a04' },
    { id: 'cat_12', name: 'Other',                   icon: '📋',  color: '#6b7280' },
  ];

  const STATUSES = [
    { id: 'st_1', name: 'Pending',     badge: 'badge-pending' },
    { id: 'st_2', name: 'In Progress', badge: 'badge-progress' },
    { id: 'st_3', name: 'Resolved',    badge: 'badge-resolved' },
    { id: 'st_4', name: 'Rejected',    badge: 'badge-rejected' },
  ];

  const ADMIN_USER = {
    id: 'usr_admin',
    name: 'City Admin',
    email: 'admin@city.gov',
    password: 'Admin@123',   // stored plain for demo; in real app: hashed
    phone: '1800-000-1234',
    role: 'admin',
    createdAt: '2025-01-01T00:00:00.000Z',
    avatar: 'CA',
  };

  const SAMPLE_COMPLAINTS = [
    {
      id: 'cmp_001',
      userId: 'usr_demo',
      userName: 'Ravi Kumar',
      categoryId: 'cat_1',
      statusId: 'st_3',
      title: 'Large pothole on MG Road near bus stop',
      description: 'There is a very large and dangerous pothole near the main bus stop on MG Road. Two-wheelers have already met with accidents. Immediate repair needed.',
      location: 'MG Road, Near Bus Stop No. 12, Bangalore - 560001',
      image: null,
      createdAt: '2026-07-10T08:30:00.000Z',
      updatedAt: '2026-07-18T14:00:00.000Z',
      adminNote: 'Repair team dispatched. Work completed on 18th July.',
    },
    {
      id: 'cmp_002',
      userId: 'usr_demo',
      userName: 'Ravi Kumar',
      categoryId: 'cat_2',
      statusId: 'st_2',
      title: 'Street light not working for 2 weeks',
      description: 'The street light at the end of 5th Cross, JP Nagar has not been working for over two weeks. The area is very dark at night and unsafe for residents.',
      location: '5th Cross, JP Nagar, Bangalore - 560078',
      image: null,
      createdAt: '2026-07-28T19:00:00.000Z',
      updatedAt: '2026-08-01T10:00:00.000Z',
      adminNote: 'Electrician assigned. Parts ordered.',
    },
    {
      id: 'cmp_003',
      userId: 'usr_demo',
      userName: 'Ravi Kumar',
      categoryId: 'cat_4',
      statusId: 'st_1',
      title: 'Garbage not collected for 5 days',
      description: 'Garbage collection vehicle has not visited our street for 5 days. Garbage is piling up and causing health hazards. Stray animals are spreading garbage.',
      location: '3rd Block, Jayanagar, Bangalore - 560011',
      image: null,
      createdAt: '2026-08-14T07:00:00.000Z',
      updatedAt: '2026-08-14T07:00:00.000Z',
      adminNote: '',
    },
    {
      id: 'cmp_004',
      userId: 'usr_demo2',
      userName: 'Priya Singh',
      categoryId: 'cat_3',
      statusId: 'st_2',
      title: 'No water supply for 3 days',
      description: 'Our area has been experiencing no water supply for the past 3 days. We are relying on water tankers which are also irregular.',
      location: 'Koramangala 4th Block, Bangalore - 560034',
      image: null,
      createdAt: '2026-08-12T09:00:00.000Z',
      updatedAt: '2026-08-13T11:00:00.000Z',
      adminNote: 'Pipeline repair in progress.',
    },
    {
      id: 'cmp_005',
      userId: 'usr_demo2',
      userName: 'Priya Singh',
      categoryId: 'cat_8',
      statusId: 'st_1',
      title: 'Illegal construction blocking footpath',
      description: 'A builder is constructing a building and has completely blocked the footpath. Pedestrians are forced to walk on the road, which is dangerous.',
      location: 'Indiranagar 100 Feet Road, Bangalore - 560038',
      image: null,
      createdAt: '2026-08-15T14:00:00.000Z',
      updatedAt: '2026-08-15T14:00:00.000Z',
      adminNote: '',
    },
  ];

  // ── Init ──────────────────────────────────────────────────
  function init() {
    // Seed categories & statuses (always)
    save('categories', CATEGORIES);
    save('statuses', STATUSES);

    // Seed users if not present
    if (!load('users')) {
      const demoUser1 = {
        id: 'usr_demo',
        name: 'Ravi Kumar',
        email: 'ravi@example.com',
        password: 'User@123',
        phone: '9876543210',
        role: 'user',
        createdAt: '2026-01-15T00:00:00.000Z',
        avatar: 'RK',
      };
      const demoUser2 = {
        id: 'usr_demo2',
        name: 'Priya Singh',
        email: 'priya@example.com',
        password: 'User@123',
        phone: '9876500000',
        role: 'user',
        createdAt: '2026-03-10T00:00:00.000Z',
        avatar: 'PS',
      };
      save('users', [ADMIN_USER, demoUser1, demoUser2]);
    } else {
      // Ensure admin always exists
      const users = load('users');
      if (!users.find(u => u.id === 'usr_admin')) {
        users.unshift(ADMIN_USER);
        save('users', users);
      }
    }

    // Seed complaints if not present
    if (!load('complaints')) {
      save('complaints', SAMPLE_COMPLAINTS);
    }

    // Seed feedback if not present
    if (!load('feedback')) {
      save('feedback', [
        { id: 'fb_001', complaintId: 'cmp_001', userId: 'usr_demo', text: 'Great service! Issue was resolved quickly.', rating: 5, createdAt: '2026-07-20T10:00:00.000Z' },
      ]);
    }
  }

  // ── Users ─────────────────────────────────────────────────
  const Users = {
    all() { return load('users') || []; },
    findById(id) { return this.all().find(u => u.id === id) || null; },
    findByEmail(email) { return this.all().find(u => u.email.toLowerCase() === email.toLowerCase()) || null; },
    create(data) {
      const users = this.all();
      const newUser = {
        id: 'usr_' + uid(),
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone || '',
        role: data.role || 'user',
        createdAt: now(),
        avatar: data.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
      };
      users.push(newUser);
      save('users', users);
      return newUser;
    },
    count() { return this.all().filter(u => u.role === 'user').length; },
  };

  // ── Complaints ────────────────────────────────────────────
  const Complaints = {
    all() { return load('complaints') || []; },
    findById(id) { return this.all().find(c => c.id === id) || null; },
    byUser(userId) { return this.all().filter(c => c.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); },

    create(data) {
      const complaints = this.all();
      const newC = {
        id: 'cmp_' + uid(),
        userId: data.userId,
        userName: data.userName,
        categoryId: data.categoryId,
        statusId: 'st_1',   // Pending
        title: data.title,
        description: data.description,
        location: data.location,
        image: data.image || null,
        createdAt: now(),
        updatedAt: now(),
        adminNote: '',
      };
      complaints.unshift(newC);
      save('complaints', complaints);
      return newC;
    },

    updateStatus(id, statusId, adminNote) {
      const complaints = this.all();
      const idx = complaints.findIndex(c => c.id === id);
      if (idx === -1) return null;
      complaints[idx].statusId = statusId;
      complaints[idx].adminNote = adminNote || complaints[idx].adminNote;
      complaints[idx].updatedAt = now();
      save('complaints', complaints);
      return complaints[idx];
    },

    stats() {
      const all = this.all();
      return {
        total:    all.length,
        pending:  all.filter(c => c.statusId === 'st_1').length,
        progress: all.filter(c => c.statusId === 'st_2').length,
        resolved: all.filter(c => c.statusId === 'st_3').length,
        rejected: all.filter(c => c.statusId === 'st_4').length,
      };
    },

    statsByUser(userId) {
      const all = this.byUser(userId);
      return {
        total:    all.length,
        pending:  all.filter(c => c.statusId === 'st_1').length,
        progress: all.filter(c => c.statusId === 'st_2').length,
        resolved: all.filter(c => c.statusId === 'st_3').length,
      };
    },

    // Returns complaint counts grouped by category for charts
    byCategory() {
      const all = this.all();
      const cats = Categories.all();
      return cats.map(cat => ({
        ...cat,
        count: all.filter(c => c.categoryId === cat.id).length,
      })).filter(c => c.count > 0);
    },

    // Last 7 days count
    last7Days() {
      const all = this.all();
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        const label = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
        const count = all.filter(c => {
          const cd = new Date(c.createdAt);
          return cd.toDateString() === d.toDateString();
        }).length;
        days.push({ label, count });
      }
      return days;
    },
  };

  // ── Categories ────────────────────────────────────────────
  const Categories = {
    all() { return load('categories') || CATEGORIES; },
    findById(id) { return this.all().find(c => c.id === id) || null; },
  };

  // ── Statuses ──────────────────────────────────────────────
  const Statuses = {
    all() { return load('statuses') || STATUSES; },
    findById(id) { return this.all().find(s => s.id === id) || null; },
  };

  // ── Feedback ──────────────────────────────────────────────
  const Feedback = {
    all() { return load('feedback') || []; },
    byComplaint(complaintId) { return this.all().filter(f => f.complaintId === complaintId); },
    create(data) {
      const all = this.all();
      const newF = {
        id: 'fb_' + uid(),
        complaintId: data.complaintId,
        userId: data.userId,
        text: data.text,
        rating: data.rating,
        createdAt: now(),
      };
      all.push(newF);
      save('feedback', all);
      return newF;
    },
  };

  return { init, Users, Complaints, Categories, Statuses, Feedback };
})();
