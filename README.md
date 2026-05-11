# ⚡ Team Task Force

A production-ready office task management PWA built with React + Vite.

## Features

- 🔐 Role-based auth (Admin / Employee)
- ✅ Task management with activity logs
- 🏖️ Leave management with approval flow
- 📍 Attendance check-in / check-out
- 📊 Daily reports (Admin)
- 👥 Team management (Admin)
- 🔔 In-app notifications
- 🌙 Dark / Light mode
- 📱 Mobile-first, fully responsive

## Quick Start

```bash
npm install
npm run dev
```

## Demo Credentials

| Role   | Email                   | Password   |
|--------|-------------------------|------------|
| Admin  | bhargav@office.com      | boss123    |
| Emp    | parth@office.com        | parth123   |
| Emp    | urvil@office.com        | urvil123   |
| Emp    | yadav@office.com        | yadav123   |

## Deploy

### Vercel
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm run build
# drag-drop the dist/ folder on netlify.com
```

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## Project Structure

```
src/
├── components/      # Reusable UI + feature components
├── pages/           # Route-level page components
├── hooks/           # Custom React hooks
├── context/         # Global state (Context API)
├── services/        # Business logic + storage abstraction
├── utils/           # Pure utility functions
├── data/            # Seed data
├── styles/          # Global CSS + variables
└── router/          # React Router config
```

## Tech Stack

- **React 18** — UI library
- **Vite 5** — Build tool
- **React Router 6** — Client-side routing
- **Context API + useReducer** — State management
- **CSS Custom Properties** — Theming

## Future-Ready

The `services/` layer is abstracted so you can swap localStorage for Firebase or Supabase with minimal changes.
