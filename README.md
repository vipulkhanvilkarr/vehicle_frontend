
# Vehicle Frontend

This is a React + TypeScript + Vite frontend for the Vehicle Management System.

## Features
- Role-based authentication (Super Admin, Admin, User)
- Dynamic dashboard and navigation tabs
- Protected routes for vehicles, user details, and admin pages
- API integration with Django backend

## Project Structure

```
src/
  api/           # API logic (userApi, vehicleApi, etc.)
  app/           # Redux store
  components/    # Reusable components
  features/      # Redux slices
  pages/         # Main pages (Dashboard, Login, Vehicles, etc.)
  styles/        # CSS files
  utils/         # Utility hooks (roleAccess, etc.)
  App.tsx        # Main app component
  router.tsx     # App routing
```

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

## Environment Variables

- Configure your backend API base URL in `.env`:
  ```env
  VITE_API_BASE=http://127.0.0.1:8000/api
  ```

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
