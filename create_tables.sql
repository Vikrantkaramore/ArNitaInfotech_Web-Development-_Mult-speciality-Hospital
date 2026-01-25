-- SQL script to create tables for admin and doctor login
-- This script creates the necessary tables for the hospital management system

-- Create users table for admin and doctor login
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(10) NOT NULL
);

-- Insert default admin and doctor users
INSERT IGNORE INTO users (email, password, role) VALUES
  ('admin@hospital.com', 'admin123', 'admin'),
  ('doctor@hospital.com', 'doctor123', 'doctor');

-- Create doctors table for doctor information
CREATE TABLE IF NOT EXISTS doctors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  department VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL
);
