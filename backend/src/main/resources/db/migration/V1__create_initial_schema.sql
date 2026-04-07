-- V1__create_initial_schema.sql
-- Initial database schema for Habit Tracker

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(100)        NOT NULL,
    email       VARCHAR(150)        NOT NULL UNIQUE,
    password    VARCHAR(255)        NOT NULL,
    created_at  TIMESTAMP           NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP           NOT NULL DEFAULT NOW()
);

-- Habits table
CREATE TABLE habits (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID                NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title       VARCHAR(100)        NOT NULL,
    created_at  TIMESTAMP           NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP           NOT NULL DEFAULT NOW()
);

-- Habit recurrence days (0 = Sunday ... 6 = Saturday)
CREATE TABLE habit_week_days (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    habit_id    UUID                NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
    week_day    INTEGER             NOT NULL CHECK (week_day BETWEEN 0 AND 6),
    UNIQUE (habit_id, week_day)
);

-- Day summary per user
CREATE TABLE days (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID                NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date        DATE                NOT NULL,
    UNIQUE (user_id, date)
);

-- Which habits were completed on a given day
CREATE TABLE day_habits (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    day_id      UUID                NOT NULL REFERENCES days(id) ON DELETE CASCADE,
    habit_id    UUID                NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
    UNIQUE (day_id, habit_id)
);

-- Indexes for performance
CREATE INDEX idx_habits_user_id         ON habits(user_id);
CREATE INDEX idx_habit_week_days_habit  ON habit_week_days(habit_id);
CREATE INDEX idx_days_user_date         ON days(user_id, date);
CREATE INDEX idx_day_habits_day         ON day_habits(day_id);
CREATE INDEX idx_day_habits_habit       ON day_habits(habit_id);
