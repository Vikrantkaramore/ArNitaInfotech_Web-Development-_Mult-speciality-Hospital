# Project Tasks

## Remove Railway and Switch to Local Development

- [x] Update backend/db.js to use local MySQL defaults (host: localhost, user: root, password: '', database: hospital)
- [x] Update frontend components to use API_BASE instead of hardcoded Railway URLs:
  - [x] Login.js
  - [x] Home.js
  - [x] Dashboard.js
  - [x] BookedAppointmentsLeaderboard.js
- [x] Update TODO.md (this file) to reflect local development setup
- [ ] Set up local MySQL database: Install MySQL if not installed, create database 'hospital' (run: mysql -u root -p -e "CREATE DATABASE hospital;"), then run create_tables.sql if needed (mysql -u root -p hospital < create_tables.sql)
- [ ] Run backend server and check for issues
- [ ] Test frontend with local backend

## Local Development Setup

- Ensure MySQL is installed and running locally
- Database: hospital
- Backend runs on port 5001
- Frontend uses REACT_APP_API_BASE=http://localhost:5001 or default
