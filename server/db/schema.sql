-- server/src/db/schema.sql
-- Drop database if it exists (be careful with this in production!)
DROP DATABASE IF EXISTS kanban_db;

-- Create database
CREATE DATABASE kanban_db;

-- Connect to database
\c kanban_db;

-- Enable UUID extension if needed
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables if not using Sequelize sync
-- CREATE TABLE users (
--   id SERIAL PRIMARY KEY,
--   username VARCHAR(255) NOT NULL UNIQUE,
--   password VARCHAR(255) NOT NULL,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE tickets (
--   id SERIAL PRIMARY KEY,
--   name VARCHAR(255) NOT NULL,
--   description TEXT,
--   status VARCHAR(50) NOT NULL,
--   assigned_user_id INTEGER REFERENCES users(id),
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );