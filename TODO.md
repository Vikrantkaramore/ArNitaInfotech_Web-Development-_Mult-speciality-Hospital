# Deployment Tasks

## Backend Deployment to Railway
- [ ] Create a Railway account at https://railway.app
- [ ] Create a new project in Railway
- [ ] Connect your GitHub repository to Railway
- [ ] Add a MySQL database service in Railway
- [ ] Set environment variables in Railway:
  - DB_HOST: (provided by Railway MySQL service)
  - DB_USER: (provided by Railway MySQL service)
  - DB_PASSWORD: (provided by Railway MySQL service)
  - DB_NAME: (provided by Railway MySQL service)
  - DB_PORT: 3306
  - PORT: 5001
- [ ] Deploy the backend service
- [ ] Note the backend URL provided by Railway (e.g., https://your-app.railway.app)

## Frontend Update on Netlify
- [ ] In Netlify dashboard, go to your site settings
- [ ] Add environment variable: REACT_APP_API_BASE = https://your-backend-url.railway.app
- [ ] Redeploy the frontend

## Database Setup
- [ ] Run the create_tables.sql script in the Railway MySQL database to create tables
- [ ] Verify the backend is running and can connect to the database

## Testing
- [ ] Test login functionality
- [ ] Test appointment booking
- [ ] Test dashboard operations
- [ ] Ensure all API calls work with the new backend URL
