# 🏛️ Smart Local Problem Reporter & Auto-Solution Suggestion System

A full-stack civic issue reporting platform where citizens submit local complaints and receive **instant rule-based suggestions**, while admins manage and resolve them through a dedicated dashboard.

---

## 🚀 Quick Start (Browser — No Installation Required)

1. Open `index.html` in any modern browser
2. Register a new account — or use the demo credentials below
3. Start reporting issues!

### Demo Credentials
| Role  | Email                | Password   |
|-------|----------------------|------------|
| User  | ravi@example.com     | User@123   |
| User  | priya@example.com    | User@123   |
| Admin | admin@city.gov       | Admin@123  |

> All data is stored in your browser's `localStorage`. No server needed.

---

## 📁 Project Structure

```
smart-problem-reporter/
├── index.html          — Landing page
├── auth.html           — Login / Register
├── dashboard.html      — User dashboard
├── report.html         — Multi-step complaint form
├── complaints.html     — My complaints (with filters)
├── admin.html          — Admin dashboard (charts + management)
│
├── css/
│   └── style.css       — Full design system (HSL tokens, components)
│
├── js/
│   ├── data.js         — localStorage data layer (DB)
│   ├── auth.js         — Authentication (login, register, guards)
│   ├── app.js          — Core utilities (toast, modals, sidebar)
│   ├── suggestions.js  — Rule-based suggestion engine
│   ├── complaints.js   — My Complaints page logic
│   └── admin.js        — Admin dashboard logic + Chart.js charts
│
├── database/
│   ├── schema.sql      — MySQL DDL (tables, FKs, views, triggers)
│   └── seed.sql        — Sample data for MySQL
│
└── backend/            — Java Spring Boot reference implementation
    ├── pom.xml
    └── src/main/
        ├── java/com/civicreport/
        │   ├── model/         — JPA Entities (User, Complaint, etc.)
        │   ├── controller/    — REST Controllers (Auth, Complaint)
        │   └── service/       — Business Logic (UserService)
        └── resources/
            └── application.properties
```

---

## ✨ Features

### Citizen Features
- **Multi-step Complaint Form** — 3-step wizard: Category → Details → Review
- **12 Issue Categories** — Pothole, Street Light, Water, Garbage, Sewage, Noise, Stray Animals, Illegal Construction, Parks, Traffic, Power Cut, Other
- **Rule-Based Suggestions** — Instant, detailed action steps on category selection (authority contacts, escalation paths)
- **Real-Time Status Tracking** — Pending → In Progress → Resolved
- **Image Upload** — Attach photos to complaints (stored as base64)
- **Feedback System** — 5-star rating + comments for resolved complaints
- **Complaint History** — Filterable list with expand-to-view details

### Admin Features
- **Admin Dashboard** — Overview stats, resolution rate
- **3 Chart Types** — Doughnut (by category), Bar (by status), Line (7-day trend)
- **Full Complaint Table** — Search, filter by status/category, inline status update
- **Complaint Detail Modal** — Full view with admin note editor
- **Suggestion Preview** — Admins see the same suggestions as citizens

### Design
- Premium HSL design system with civic blue palette
- Fully responsive (mobile-first, collapsible sidebar)
- Micro-animations and smooth transitions
- Toast notifications for all user actions
- Star rating, image upload with preview, wizard steps

---

## 🗺️ Suggestion Engine Coverage

| Category | Authority | Contact |
|---|---|---|
| Pothole / Road Damage | Public Works Dept (PWD) | 1800-425-1520 |
| Street Light | BESCOM | 1912 |
| Water Supply | BWSSB | 1916 |
| Garbage Collection | BBMP Sahaaya | 1533 |
| Sewage / Drainage | BWSSB Sewerage | 1916 |
| Noise Pollution | Police / KSPCB | 100 |
| Stray Animals | BBMP / CUPA | 080-22975555 |
| Illegal Construction | BBMP Town Planning | 1533 |
| Park / Public Space | BBMP Parks | 1533 |
| Traffic / Signage | Bangalore Traffic Police | 080-22868444 |
| Electricity / Power Cut | BESCOM | 1912 |
| Other | BBMP / pgportal.gov.in | 1533 |

---

## 🗄️ Java/MySQL Backend (Reference)

The `backend/` folder contains a full Spring Boot 3 reference implementation:

### Setup
```bash
# 1. Install Java 17+ and MySQL 8+
# 2. Create database
mysql -u root -p < database/schema.sql
mysql -u root -p smart_problem_reporter < database/seed.sql

# 3. Update application.properties with your DB credentials
# 4. Run
cd backend
mvn spring-boot:run
```

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/complaints` | My complaints |
| POST | `/api/complaints` | Submit complaint (+ multipart image) |
| GET | `/api/complaints/{id}` | Single complaint |
| PUT | `/api/complaints/{id}/status` | Update status (admin) |
| POST | `/api/complaints/{id}/feedback` | Submit feedback |
| GET | `/api/admin/complaints` | All complaints (admin) |
| GET | `/api/admin/stats` | Dashboard statistics (admin) |

---

## 🔐 Security Notes (Production Checklist)
- [ ] Replace plain-text passwords in demo with BCrypt hashing
- [ ] Replace `localStorage` auth with JWT tokens (backend)
- [ ] Implement HTTPS in production
- [ ] Sanitize all user inputs server-side
- [ ] Configure CORS for your actual domain
- [ ] Enable SQL prepared statements (already in Spring Data JPA)
- [ ] Set strong `app.jwt.secret` in application.properties

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML5, CSS3 (Custom Design System), Vanilla JS |
| Charts | Chart.js 4.4 |
| Fonts | Google Fonts — Inter |
| Backend (ref) | Java 17, Spring Boot 3.2, Spring Data JPA, Spring Security |
| Database | MySQL 8+ |
| Data (demo) | Browser localStorage |

---

*Built for the Smart Civic Reporting Project — 2026*
