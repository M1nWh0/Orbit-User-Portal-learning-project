# Orbit User Portal — Progress Tracker

This document tracks the end-to-end execution progress of **Orbit User Portal** based on [documentation.md](file:///c:/Users/hp/Desktop/p/Useful%20learning%20projects/1.Orbit%20User%20Portal/documentation.md) and [learning_guide.md](file:///c:/Users/hp/Desktop/p/Useful%20learning%20projects/1.Orbit%20User%20Portal/learning_guide.md).

---

## Overall Status Summary

| Phase | Description | Total Tasks | Completed | Status |
|---|---|:---:|:---:|:---:|
| **Phase 1** | Project Initialization & Tooling Setup | 7 | 7 | ✅ Completed |
| **Phase 2** | Server-Only Data Store & Security Primitives | 6 | 6 | ✅ Completed |
| **Phase 3** | Authentication, Session Management & Server Hooks | 5 | 0 | ⏳ Pending Approval |
| **Phase 4** | Shared Application Shell, Layout & Theme System | 5 | 0 | ⏳ Pending Approval |
| **Phase 5** | Public Routes & Authentication Pages | 5 | 0 | ⏳ Pending Approval |
| **Phase 6** | User Portal Core Features | 5 | 0 | ⏳ Pending Approval |
| **Phase 7** | Administrative Console & User Management | 5 | 0 | ⏳ Pending Approval |
| **Phase 8** | Controlled Debugging Laboratory (`/debug-lab`) | 5 | 0 | ⏳ Pending Approval |
| **Phase 9** | End-to-End Verification, Security Auditing & Polish | 6 | 0 | ⏳ Pending Approval |
| **Total** | | **49** | **13** | **27% Completed** |

---

## Detailed Task Breakdown

### Phase 1: Project Initialization & Tooling Setup
- [x] **1.1** Initialize SvelteKit project configured strictly for JavaScript (no TypeScript)
- [x] **1.2** Install dependencies (`svelte@5`, `@sveltejs/kit`, `tailwindcss`, `clsx`, `tailwind-merge`, `mode-watcher`, `@lucide/svelte`, `bits-ui`)
- [x] **1.3** Configure Tailwind CSS with semantic design tokens and dark mode support in `tailwind.config.js` and `src/app.css`
- [x] **1.4** Configure shadcn-svelte in `components.json` with `"typescript": false` and custom path aliases
- [x] **1.5** Install required shadcn-svelte components:
  - [x] Button
  - [x] Card
  - [x] Input & Label
  - [x] Badge
  - [x] Table
  - [x] Dialog & Alert Dialog
  - [x] Dropdown Menu
  - [x] Select
  - [x] Avatar
  - [x] Sheet
  - [x] Skeleton
  - [x] Alert
  - [x] Sonner
  - [x] Separator
- [x] **1.6** Configure `jsconfig.json` for proper module resolution and alias mapping
- [x] **1.7** Smoke test application boot (`pnpm dev` & `pnpm build`) and verify zero console errors

---

### Phase 2: Server-Only Data Store & Security Primitives
- [x] **2.1** Implement Node.js built-in cryptographic module (`src/lib/server/crypto.js`):
  - [x] `hashPassword(password, salt)` using `crypto.scrypt` or `crypto.pbkdf2Sync`
  - [x] `verifyPassword(password, hash, salt)` with `crypto.timingSafeEqual`
  - [x] `generateSessionId()` with `crypto.randomUUID()`
- [x] **2.2** Implement in-memory store (`src/lib/server/store.js`):
  - [x] User record structure (`id`, `name`, `email`, `passwordHash`, `passwordSalt`, `role`, `status`, `bio`, `createdAt`)
  - [x] Seed accounts with hashed passwords:
    - [x] `member@example.com` / `member123` (`user`, `active`)
    - [x] `admin@example.com` / `admin123` (`admin`, `active`)
- [x] **2.3** Implement User CRUD methods:
  - [x] `getUsers()`
  - [x] `getUserById(id)`
  - [x] `getUserByEmail(email)` (with normalized email)
  - [x] `createUser(input)`
  - [x] `updateUserProfile(id, input)`
  - [x] `updateUserRole(id, role)`
  - [x] `setUserStatus(id, status)`
  - [x] `verifyCredentials(email, password)`
- [x] **2.4** Implement invariant checks:
  - [x] Final active administrator protection (cannot demote or deactivate if active admins <= 1)
  - [x] Email uniqueness enforcement
- [x] **2.5** Implement safe projection helpers (`toSafeUser`, `toPublicDirectoryUser`)
- [x] **2.6** Unit test store functions and invariant guards in isolation

---

### Phase 3: Authentication, Session Management & Server Hooks
- [ ] **3.1** Implement session manager (`src/lib/server/auth.js`):
  - [ ] `createSession(userId, cookies)` (HttpOnly, SameSite=Lax, Path=/)
  - [ ] `resolveSession(cookies)` (validates session, checks user active status)
  - [ ] `destroySession(cookies)` (removes session and clears cookie)
- [ ] **3.2** Implement access control helpers:
  - [ ] `requireUser(locals)`
  - [ ] `requireAdmin(locals)`
- [ ] **3.3** Implement server hook (`src/hooks.server.js`):
  - [ ] Resolves session and attaches `event.locals.user`
  - [ ] Enforces route-level access rules (protects `/dashboard`, `/profile`, `/users`, `/admin`)
  - [ ] Redirects authenticated users away from `/login` and `/register`
- [ ] **3.4** Implement root server layout loader (`src/routes/+layout.server.js`) to provide `{ user }`
- [ ] **3.5** Test session lifecycle (cookie issue, validation, expiration on deactivation, logout)

---

### Phase 4: Shared Application Shell, Layout & Theme System
- [ ] **4.1** Configure root layout (`src/routes/+layout.svelte`):
  - [ ] Integrate `<ModeWatcher />`
  - [ ] Integrate Sonner toast container (`<Toaster />`)
- [ ] **4.2** Build `theme-toggle.svelte` with Light, Dark, System support and Lucide icons
- [ ] **4.3** Build `app-header.svelte`:
  - [ ] Breadcrumbs/Page title
  - [ ] User avatar, display name, and role badge
  - [ ] User dropdown menu (Profile, Dashboard, Logout)
  - [ ] Mobile navigation trigger
- [ ] **4.4** Build `app-sidebar.svelte`:
  - [ ] Desktop sidebar with active route highlighting
  - [ ] Mobile navigation drawer using Sheet
  - [ ] Role-sensitive navigation links (Admin link visible only for admins)
- [ ] **4.5** Build `confirm-action-dialog.svelte` for accessible confirmations

---

### Phase 5: Public Routes & Authentication Pages
- [ ] **5.1** Implement Landing Page (`src/routes/+page.svelte`):
  - [ ] Hero banner, feature highlights, responsive layout
  - [ ] Dynamic CTAs based on authentication state
  - [ ] Demonstration account quick-reference helper
- [ ] **5.2** Implement Login Page (`src/routes/login/+page.svelte` & `+page.server.js`):
  - [ ] Form action with email/password validation
  - [ ] Inactive account rejection feedback
  - [ ] Session creation and redirect to `/dashboard`
  - [ ] Demo credentials quick-fill buttons
- [ ] **5.3** Implement Registration Page (`src/routes/register/+page.svelte` & `+page.server.js`):
  - [ ] Form action with full field validation
  - [ ] Strict assignment of `user` role (ignore client role input)
  - [ ] Automatic login and redirect to `/dashboard` upon registration
- [ ] **5.4** Implement Logout endpoint (`src/routes/logout/+server.js`):
  - [ ] Accepts POST, destroys session, clears cookie, redirects to `/login`
- [ ] **5.5** Test validation states, failed login messages, and successful redirects

---

### Phase 6: User Portal Core Features
- [ ] **6.1** Implement User Dashboard (`src/routes/dashboard/+page.svelte` & `+page.server.js`):
  - [ ] Regular user personalized welcome & account overview
  - [ ] Administrator live metric summaries derived from store
- [ ] **6.2** Implement Profile Page (`src/routes/profile/+page.svelte` & `+page.server.js`):
  - [ ] Form action for display name and bio update
  - [ ] Server validation and authorization guard
  - [ ] Data invalidation with `invalidate('app:users')`
- [ ] **6.3** Implement User Directory (`src/routes/users/+page.svelte` & `+page.server.js`):
  - [ ] Server load with `depends('app:users')`
  - [ ] Interactive search by display name using Svelte 5 runes
  - [ ] Role and status badges with profile navigation links
  - [ ] Empty state for unmatched search
- [ ] **6.4** Implement Dynamic Profile Page (`src/routes/users/[id]/+page.svelte` & `+page.server.js`):
  - [ ] Server load reading `params.id`
  - [ ] 404 error handling for nonexistent user IDs
  - [ ] Display safe user details and breadcrumb navigation
- [ ] **6.5** Test navigation between user profiles and data freshness

---

### Phase 7: Administrative Console & User Management
- [ ] **7.1** Implement Admin Dashboard (`src/routes/admin/+page.svelte` & `+page.server.js`):
  - [ ] Enforce `requireAdmin`
  - [ ] Live statistics (total accounts, active, inactive, admin count)
  - [ ] Quick links to user management
- [ ] **7.2** Implement User Management Console (`src/routes/admin/users/+page.svelte` & `+page.server.js`):
  - [ ] Search by name/email and filter by role/status
  - [ ] Create account modal (name, email, password, role)
  - [ ] Role change action (Promote/Demote)
  - [ ] Activate/Deactivate action with confirmation alert dialog
  - [ ] Final admin protection guard
  - [ ] `depends('app:users')` and `invalidate('app:users')` integration
- [ ] **7.3** Implement Status API Endpoint (`src/routes/api/users/[id]/status/+server.js`):
  - [ ] Enforces authentication (401), authorization (403), resource lookup (404), invariant checks (400)
  - [ ] Returns structured JSON response
- [ ] **7.4** Verify deactivation locks existing user sessions immediately
- [ ] **7.5** Verify final admin cannot be deactivated or demoted

---

### Phase 8: Controlled Debugging Laboratory (`/debug-lab`)
- [ ] **8.1** Implement Scenario A: JSON Property Mismatch (`/api/debug/echo`):
  - [ ] Server expects `email`, client sends `username`
  - [ ] Inspector displays 400 Bad Request and diagnostic breakdown
- [ ] **8.2** Implement Scenario B: API 404 (`/api/debug/users/[id]`):
  - [ ] Request nonexistent user ID
  - [ ] Inspector displays 404 Not Found and explains route vs data 404
- [ ] **8.3** Implement Scenario C: Controlled Server Error (`/api/debug/trigger-error`):
  - [ ] Deliberate exception in development; disabled in production
  - [ ] Inspector displays 500 Internal Server Error and terminal log instructions
- [ ] **8.4** Implement Scenario D: Session Cookie Omitted (`/api/debug/session`):
  - [ ] Compare standard fetch vs fetch with `credentials: 'omit'`
  - [ ] Inspector displays session resolution differences
- [ ] **8.5** Implement Debug Lab UI (`src/routes/debug-lab/+page.svelte`):
  - [ ] 4 scenario cards with trigger buttons and live response inspector
  - [ ] Payload, headers, status color pills, and lifecycle analysis

---

### Phase 9: End-to-End Verification, Security Auditing & Polish
- [ ] **9.1** Permission Matrix Verification (validate matrix for Anonymous, User, Admin)
- [ ] **9.2** Run `npm run check` and verify zero errors
- [ ] **9.3** Run `npm run build` to verify production compilation
- [ ] **9.4** Theme switcher and dark mode testing across all pages
- [ ] **9.5** Responsive layout testing on mobile, tablet, and desktop viewports
- [ ] **9.6** Record browser demo and generate walkthrough documentation

---

## Log of Completed Milestones

*(Milestones will be recorded here as development progresses)*
