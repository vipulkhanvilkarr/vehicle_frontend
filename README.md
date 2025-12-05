
# Vehicle Frontend

This is a React + TypeScript + Vite frontend for the Vehicle Management System.

## Features
- Role-based authentication (Super Admin, Admin, User)
- Dynamic dashboard and navigation tabs
- Protected routes for vehicles, user details, and admin pages
- API integration with Django backend



## Setup & Usage

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```



## Environment Variables & CORS

### Purpose
The `.env` file is used to store environment-specific variables (like your backend API URL) for local development. It keeps sensitive or environment-dependent data out of your codebase.

### How to create `.env`
1. In your project root, create a file named `.env` (no filename, just `.env`).
2. Add your variables, for example:
   ```env
   VITE_API_BASE=http://127.0.0.1:8000
   ```
3. Restart your dev server after making changes.

### Production
- For production (e.g. Vercel), set `VITE_API_BASE` in the Vercel dashboard under Project Settings → Environment Variables. Do not commit `.env` to git.

### CORS
- Your backend must allow CORS for both your local frontend (e.g. `http://localhost:5173`) and your production frontend domain (e.g. `https://your-vercel-app.vercel.app`).
- Example Django CORS settings:
   ```python
   CORS_ALLOWED_ORIGINS = [
         "http://localhost:5173",
         "https://your-vercel-app.vercel.app"
   ]
   ```

### Vercel Routing
- For React Router apps on Vercel, add a `vercel.json` file to your project root to handle client-side routing and prevent 404 errors on refresh:
   ```json
   {
      "rewrites": [
         { "source": "/(.*)", "destination": "/index.html" }
      ]
   }
   ```

This ensures your app works correctly in both local and production environments.

## Role-Based Access

- All users see the dashboard after login.
- Tabs and routes are shown/hidden based on user role using the `useRoleAccess` hook.

## API Endpoints

- Login: `POST /auth/login/`
- Logout: `POST /auth/logout/`
- Current user: `GET /current-user-details/`
- Vehicles: `GET /vehicles/`

## Contributing

Pull requests and issues are welcome!
