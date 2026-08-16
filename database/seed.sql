-- ============================================================
-- Smart Problem Reporter — Seed Data
-- Run AFTER schema.sql
-- ============================================================

USE smart_problem_reporter;

-- ── Categories ────────────────────────────────────────────────
INSERT INTO categories (category_name, icon, color) VALUES
  ('Pothole / Road Damage',    '🕳️',  '#dc2626'),
  ('Street Light',             '💡',  '#d97706'),
  ('Water Supply',             '💧',  '#2563eb'),
  ('Garbage Collection',       '🗑️',  '#16a34a'),
  ('Sewage / Drainage',        '🚰',  '#7c3aed'),
  ('Noise Pollution',          '📢',  '#db2777'),
  ('Stray Animals',            '🐕',  '#b45309'),
  ('Illegal Construction',     '🏗️',  '#0891b2'),
  ('Park / Public Space',      '🌳',  '#15803d'),
  ('Traffic / Signage',        '🚦',  '#1d4ed8'),
  ('Electricity / Power Cut',  '⚡',  '#ca8a04'),
  ('Other',                    '📋',  '#6b7280');

-- ── Statuses ──────────────────────────────────────────────────
INSERT INTO statuses (status_name) VALUES
  ('Pending'),
  ('In Progress'),
  ('Resolved'),
  ('Rejected');

-- ── Users (password = BCrypt of 'Admin@123' and 'User@123') ──
-- IMPORTANT: In production, use BCrypt. Here we use placeholder hashes.
-- Generate real hashes using: BCryptPasswordEncoder().encode("password")
INSERT INTO users (name, email, password_hash, phone, role, avatar) VALUES
  ('City Admin',   'admin@city.gov',       '$2a$12$ADMIN_PLACEHOLDER_HASH',  '1800-000-1234', 'admin', 'CA'),
  ('Ravi Kumar',   'ravi@example.com',     '$2a$12$USER1_PLACEHOLDER_HASH',  '9876543210',    'user',  'RK'),
  ('Priya Singh',  'priya@example.com',    '$2a$12$USER2_PLACEHOLDER_HASH',  '9876500000',    'user',  'PS'),
  ('Amit Sharma',  'amit@example.com',     '$2a$12$USER3_PLACEHOLDER_HASH',  '9876511111',    'user',  'AS'),
  ('Deepa Nair',   'deepa@example.com',    '$2a$12$USER4_PLACEHOLDER_HASH',  '9876522222',    'user',  'DN');

-- ── Sample Complaints ─────────────────────────────────────────
INSERT INTO complaints (user_id, category_id, status_id, title, description, location, admin_note) VALUES
  (2, 1, 3, 'Large pothole on MG Road near bus stop',
   'There is a very large and dangerous pothole near the main bus stop on MG Road. Two-wheelers have already met with accidents. Immediate repair needed.',
   'MG Road, Near Bus Stop No. 12, Bangalore - 560001',
   'Repair team dispatched. Work completed on 18th July.'),

  (2, 2, 2, 'Street light not working for 2 weeks',
   'The street light at the end of 5th Cross, JP Nagar has not been working for over two weeks. The area is very dark at night and unsafe for residents.',
   '5th Cross, JP Nagar, Bangalore - 560078',
   'Electrician assigned. Parts ordered.'),

  (2, 4, 1, 'Garbage not collected for 5 days',
   'Garbage collection vehicle has not visited our street for 5 days. Garbage is piling up and causing health hazards. Stray animals are spreading garbage.',
   '3rd Block, Jayanagar, Bangalore - 560011',
   NULL),

  (3, 3, 2, 'No water supply for 3 days',
   'Our area has been experiencing no water supply for the past 3 days. We are relying on water tankers which are also irregular.',
   'Koramangala 4th Block, Bangalore - 560034',
   'Pipeline repair in progress.'),

  (3, 8, 1, 'Illegal construction blocking footpath',
   'A builder is constructing a building and has completely blocked the footpath. Pedestrians are forced to walk on the road, which is dangerous.',
   'Indiranagar 100 Feet Road, Bangalore - 560038',
   NULL),

  (4, 5, 3, 'Sewage overflow on main road',
   'Sewage water is overflowing onto the main road near the school. It has been like this for 3 days. Children going to school are at risk.',
   'Rajajinagar 3rd Block, Near Government School, Bangalore - 560010',
   'Drain cleaning unit sent. Blockage cleared on 10th Aug.'),

  (4, 11, 2, 'Power cut every evening for 4 hours',
   'Our area has been experiencing power cuts from 6 PM to 10 PM every day for the past week. No prior notice was given by BESCOM.',
   'Whitefield Main Road, Bangalore - 560066',
   'Load shedding schedule being revised. Temporary fix applied.'),

  (5, 6, 1, 'Loud music from wedding venue till 2 AM',
   'A wedding venue nearby plays extremely loud music every weekend till 2 AM. Residents cannot sleep and children are disturbed.',
   'BTM Layout 1st Stage, Bangalore - 560029',
   NULL),

  (5, 7, 3, 'Pack of aggressive stray dogs near school',
   'A pack of 8-10 aggressive stray dogs near the primary school entrance is threatening children. Two children were chased last week.',
   'Banashankari 2nd Stage, Near PM School, Bangalore - 560070',
   'Animal squad visited. Dogs sterilized and relocated.'),

  (3, 10, 2, 'Traffic signal broken at busy junction',
   'The traffic signal at the busy Silk Board junction has been non-functional for 4 days. Traffic police are not managing the junction leading to severe jams.',
   'Silk Board Junction, Hosur Road, Bangalore - 560068',
   'Signal repair team deployed. ETA 2 days.');

-- ── Sample Feedback ───────────────────────────────────────────
INSERT INTO feedback (complaint_id, user_id, feedback_text, rating) VALUES
  (1, 2, 'Great service! The pothole was fixed quickly and the road is smooth now. Thank you!', 5),
  (6, 4, 'Issue was resolved but took a bit longer than expected. Response was professional.', 4),
  (9, 5, 'Excellent work by the animal welfare team. They were very prompt and professional.', 5);

-- ── Suggestion Steps (for DB reference) ──────────────────────
INSERT INTO suggestions (category_id, step_number, step_text, authority, contact_info) VALUES
  (1, 1, 'Barricade the area — Place rocks or branches around the pothole to warn two-wheelers', 'Public Works Department (PWD)', '1800-425-1520'),
  (1, 2, 'File PWD complaint at pwd.karnataka.gov.in/grievance', 'PWD Online Portal', 'pwd.karnataka.gov.in'),
  (1, 3, 'Document evidence with photos showing the pothole size (coin for scale)', 'Self-help', NULL),
  (1, 4, 'Alert neighbours via WhatsApp groups for multiple reports', 'Community', NULL),
  (1, 5, 'Escalate to ward councillor if no action in 7 days', 'Ward Office / pgportal.gov.in', 'pgportal.gov.in'),

  (2, 1, 'Call BESCOM helpline 1912 with pole number and exact location', 'BESCOM', '1912'),
  (2, 2, 'File online complaint at bescom.org → Consumer Services → Lodge Complaint', 'BESCOM Online', 'bescom.org'),
  (2, 3, 'Note the pole number printed on the streetlight pole for faster dispatch', 'Self-help', NULL),
  (2, 4, 'Request temporary lighting from ward office if area is accident-prone', 'Ward Office', NULL),
  (2, 5, 'Escalate after 48 hours to BESCOM Superintending Engineer', 'BESCOM SE Office', '@BESCOMofficial'),

  (3, 1, 'Call BWSSB helpline 1916 — 24/7 water emergency line', 'BWSSB', '1916'),
  (3, 2, 'Request emergency water tanker through BWSSB or apartment association', 'BWSSB', '1916'),
  (3, 3, 'File online complaint at bwssb.gov.in → Online Complaint', 'BWSSB Portal', 'bwssb.gov.in'),
  (3, 4, 'Check BWSSB social media for scheduled maintenance notices', 'BWSSB Social', NULL),
  (3, 5, 'Conserve water; collect during late-night/early-morning when pressure is better', 'Self-help', NULL);

COMMIT;
