# Orbit User Portal 🪐

A frontend learning project built to explore **Svelte 5 (Runes)** and **SvelteKit**, written purely in **JavaScript** (no TypeScript), styled with **Tailwind CSS** and **shadcn-svelte**, and powered by a lightweight in-memory mock backend.

[![Svelte 5](https://img.shields.io/badge/Svelte-5.x_(Runes)-FF3E00?logo=svelte&logoColor=white)](https://svelte.dev)
[![SvelteKit](https://img.shields.io/badge/SvelteKit-2.x-FF3E00?logo=svelte&logoColor=white)](https://kit.svelte.dev)
[![JavaScript](https://img.shields.io/badge/Language-JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![shadcn-svelte](https://img.shields.io/badge/UI-shadcn--svelte-000000?logo=shadcnui&logoColor=white)](https://shadcn-svelte.com)
[![Tests Passing](https://img.shields.io/badge/Tests-213_Passed-22c55e?logo=vitest&logoColor=white)](#testing)

---

## 🎯 About The Project

This repository is a hands-on learning project focused on mastering **modern frontend architecture** using Svelte 5's new reactivity model and SvelteKit's full-stack routing conventions.

To simulate realistic frontend data flows—such as authenticated routes, role-based views, mutation states, and targeted UI re-fetching—the project includes a **minimal server-side mock backend** (`src/lib/server/`) using an in-memory data store. There are no external databases or complex server dependencies; everything runs out of the box with zero setup.

---

## 🔑 Demo Accounts

The in-memory store is pre-seeded with two demonstration accounts:

| Role | Email | Password | What You Can Access |
|---|---|---|---|
| **Member** | `member@example.com` | `member123` | Dashboard, User Directory, Profile Editor, Debug Lab |
| **Admin** | `admin@example.com` | `admin123` | Everything above + Admin Console (User CRUD, Role/Status Management) |

*(Quick-fill demo buttons are also provided on the login page).*

---

## 💡 What This Project Covers

### 1. Svelte 5 Runes & Reactive UI
- Using modern runes (`$state`, `$derived`, `$props`, `$effect`) instead of legacy Svelte stores.
- Real-time client-side search and filtering in the User Directory.
- Reusable component composition using **shadcn-svelte** and Tailwind CSS.
- Smooth Light / Dark / System theme switching powered by `mode-watcher`.

### 2. SvelteKit Architecture & Data Flow
- **Layout & Session Sharing**: Passing session data seamlessly from root loaders (`+layout.server.js`) to layouts and nested pages.
- **Form Actions & Mutations**: Handling form submissions, client/server input validation, and user feedback with Sonner toast alerts.
- **Targeted Cache Invalidation**: Using `depends('app:users')` and `invalidate('app:users')` to refresh UI tables and profile views automatically after mutations without full page reloads.
- **Route Protection**: Centralized session resolution and role-based guards in `hooks.server.js`.

### 3. Application Pages
- **Landing Page (`/`)**: Feature overview with dynamic CTAs depending on authentication state.
- **Auth Pages (`/login`, `/register`)**: Form validation, error messaging, and session cookie handling.
- **User Dashboard (`/dashboard`)**: Role-aware views (member welcome overview vs. admin metrics).
- **User Directory & Dynamic Profiles (`/users`, `/users/[id]`)**: Member browsing with search and privacy rules (emails are hidden from regular members).
- **Profile Editor (`/profile`)**: Self-service profile updates with server-side validation.
- **Admin Console (`/admin`, `/admin/users`)**: User provisioning modal, role updates (Member ↔ Admin), and account activation/deactivation with confirmation dialogs.
- **Debug Lab (`/debug-lab`)**: An interactive playground with a live Request Inspector to see how the frontend and server handle common HTTP scenarios (400 contract mismatch, 404 entity lookup, 500 server error, and omitted cookies).

---

## 🛠️ Minimal Mock Backend

The backend is intentionally kept lightweight and self-contained:
- **In-Memory Store (`src/lib/server/store.js`)**: Holds mock users and sessions in memory (resets on server restart).
- **Node.js Crypto (`src/lib/server/crypto.js`)**: Real password hashing (`scrypt`) and constant-time comparison (`timingSafeEqual`) to practice secure auth patterns.
- **Session Cookies**: Demonstrates real `HttpOnly`, `SameSite=Lax` browser cookie behavior without requiring an external auth provider.

---

## 🚀 Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/M1nWh0/Orbit-User-Portal-learning-project.git
cd Orbit-User-Portal-learning-project

# 2. Install dependencies
pnpm install

# 3. Start development server
pnpm dev
```

Open `http://localhost:5173` in your browser.

---

## 🧪 Testing

The project includes automated verification covering store logic, session handling, route permissions, and the permission matrix:

```bash
pnpm test
```

---

## 📌 Repository Note

> **Note on Commit History**: The commit messages for the 4th and 5th commits were unintentionally swapped during development (`Phase 4` and `Phase 5` headers). The code implementation order and progress tracker accurately reflect the roadmap.
