-- ============================================================
-- Smart Local Problem Reporter & Auto-Solution Suggestion System
-- MySQL Database Schema — v1.0
-- ============================================================

-- Create and select database
CREATE DATABASE IF NOT EXISTS smart_problem_reporter
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE smart_problem_reporter;

-- ── Categories ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  category_id   INT           NOT NULL AUTO_INCREMENT,
  category_name VARCHAR(100)  NOT NULL,
  icon          VARCHAR(10)   DEFAULT NULL,
  color         VARCHAR(10)   DEFAULT NULL,
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (category_id),
  UNIQUE KEY uq_category_name (category_name)
) ENGINE=InnoDB;

-- ── Statuses ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS statuses (
  status_id   INT          NOT NULL AUTO_INCREMENT,
  status_name VARCHAR(50)  NOT NULL,
  PRIMARY KEY (status_id),
  UNIQUE KEY uq_status_name (status_name)
) ENGINE=InnoDB;

-- ── Users ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  user_id       INT           NOT NULL AUTO_INCREMENT,
  name          VARCHAR(100)  NOT NULL,
  email         VARCHAR(150)  NOT NULL,
  password_hash VARCHAR(255)  NOT NULL COMMENT 'BCrypt hashed password',
  phone         VARCHAR(20)   DEFAULT NULL,
  role          ENUM('user','admin') NOT NULL DEFAULT 'user',
  avatar        VARCHAR(5)    DEFAULT NULL COMMENT '2-char initials',
  is_active     TINYINT(1)    NOT NULL DEFAULT 1,
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id),
  UNIQUE KEY uq_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB;

-- ── Complaints ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS complaints (
  complaint_id  INT            NOT NULL AUTO_INCREMENT,
  user_id       INT            NOT NULL,
  category_id   INT            NOT NULL,
  status_id     INT            NOT NULL DEFAULT 1 COMMENT 'Default: Pending',
  title         VARCHAR(255)   NOT NULL,
  description   TEXT           NOT NULL,
  location      VARCHAR(500)   NOT NULL,
  image_path    VARCHAR(500)   DEFAULT NULL COMMENT 'Relative path to uploaded image',
  admin_note    TEXT           DEFAULT NULL,
  created_at    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (complaint_id),
  CONSTRAINT fk_complaint_user     FOREIGN KEY (user_id)     REFERENCES users(user_id)           ON DELETE CASCADE,
  CONSTRAINT fk_complaint_category FOREIGN KEY (category_id) REFERENCES categories(category_id)  ON DELETE RESTRICT,
  CONSTRAINT fk_complaint_status   FOREIGN KEY (status_id)   REFERENCES statuses(status_id)      ON DELETE RESTRICT,
  INDEX idx_user_id     (user_id),
  INDEX idx_category_id (category_id),
  INDEX idx_status_id   (status_id),
  INDEX idx_created_at  (created_at)
) ENGINE=InnoDB;

-- ── Feedback ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS feedback (
  feedback_id    INT          NOT NULL AUTO_INCREMENT,
  complaint_id   INT          NOT NULL,
  user_id        INT          NOT NULL,
  feedback_text  TEXT         DEFAULT NULL,
  rating         TINYINT      NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (feedback_id),
  CONSTRAINT fk_feedback_complaint FOREIGN KEY (complaint_id) REFERENCES complaints(complaint_id) ON DELETE CASCADE,
  CONSTRAINT fk_feedback_user      FOREIGN KEY (user_id)      REFERENCES users(user_id)           ON DELETE CASCADE,
  UNIQUE KEY uq_feedback_once (complaint_id, user_id) COMMENT 'One feedback per user per complaint',
  INDEX idx_complaint_id (complaint_id)
) ENGINE=InnoDB;

-- ── Suggestions (cached rule-based) ──────────────────────────
CREATE TABLE IF NOT EXISTS suggestions (
  suggestion_id  INT           NOT NULL AUTO_INCREMENT,
  category_id    INT           NOT NULL,
  step_number    TINYINT       NOT NULL,
  step_text      TEXT          NOT NULL,
  authority      VARCHAR(200)  DEFAULT NULL,
  contact_info   VARCHAR(200)  DEFAULT NULL,
  PRIMARY KEY (suggestion_id),
  CONSTRAINT fk_suggestion_category FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE,
  INDEX idx_category (category_id)
) ENGINE=InnoDB;

-- ── Triggers ─────────────────────────────────────────────────
-- Auto-update updated_at on complaints when status changes
DELIMITER $$
CREATE TRIGGER tr_complaint_status_update
  BEFORE UPDATE ON complaints
  FOR EACH ROW
BEGIN
  IF OLD.status_id <> NEW.status_id THEN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
  END IF;
END$$
DELIMITER ;

-- ── Views ─────────────────────────────────────────────────────
-- Complaint summary view for admin dashboard
CREATE OR REPLACE VIEW v_complaint_summary AS
SELECT
  c.complaint_id,
  c.title,
  c.description,
  c.location,
  c.image_path,
  c.admin_note,
  c.created_at,
  c.updated_at,
  u.user_id,
  u.name         AS user_name,
  u.email        AS user_email,
  u.phone        AS user_phone,
  cat.category_id,
  cat.category_name,
  cat.icon       AS category_icon,
  st.status_id,
  st.status_name
FROM complaints c
JOIN users      u   ON c.user_id     = u.user_id
JOIN categories cat ON c.category_id = cat.category_id
JOIN statuses   st  ON c.status_id   = st.status_id;

-- Stats view
CREATE OR REPLACE VIEW v_complaint_stats AS
SELECT
  COUNT(*)                                    AS total_complaints,
  SUM(status_id = 1)                          AS pending,
  SUM(status_id = 2)                          AS in_progress,
  SUM(status_id = 3)                          AS resolved,
  SUM(status_id = 4)                          AS rejected,
  ROUND(SUM(status_id = 3) / COUNT(*) * 100, 1) AS resolution_rate_pct
FROM complaints;
