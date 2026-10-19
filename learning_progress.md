# Orbit User Portal — Learning Progress Tracker

This document tracks your personal understanding, concept mastery, and interactive learning checkpoints as we build **Orbit User Portal**. It accompanies the [learning_plan.md](file:///c:/Users/hp/Desktop/p/Useful%20learning%20projects/1.Orbit%20User%20Portal/learning_plan.md) and [learning_guide.md](file:///c:/Users/hp/Desktop/p/Useful%20learning%20projects/1.Orbit%20User%20Portal/learning_guide.md).

---

## 1. Core Learning Outcomes Matrix

Based on Section 15 of `learning_guide.md`, track your mastery of the 12 core competencies:

| # | Competency Area | Primary File / Feature | Mastery Status | Key Takeaway Understood |
|---|---|---|:---:|---|
| 1 | **Application Architecture** | `hooks.server.js`, `$lib/server/` | 🟢 Mastered & Verified | Clear separation of server boundary, session resolution, route guards, & store invariants |
| 2 | **Server-Driven Rendering** | `+page.server.js` (`load`) | 🟢 Mastered & Verified | Data fetched securely on server before HTML reaches client, passing typed data via $props() |
| 3 | **Form Processing** | `+page.server.js` (`actions`) | 🟢 Mastered & Verified | Native HTTP forms with validation, fail(400/403), use:enhance, & 303 redirects |
| 4 | **Authentication** | `src/lib/server/auth.js` | 🟢 Mastered & Verified | HttpOnly, SameSite=Lax cookie sessions with instant revocation on deactivation |
| 5 | **Authorization & RBAC** | `hooks.server.js`, auth guards | 🟢 Mastered & Verified | Server-enforced route protection in handle() hook and requireUser/requireAdmin helpers |
| 6 | **Data Modeling & Sanitization** | `src/lib/server/store.js` | 🟢 Mastered & Verified | Safe projections (toSafeUser) preventing password hashes and salts from reaching client |
| 7 | **CRUD Operations** | Admin console & profile edit | 🟢 Mastered & Verified | Full CRUD implemented: create user modal, read table, update profile & roles, toggle status, and last admin guard |
| 8 | **HTTP Communication** | `+server.js` endpoints | 🟢 Mastered & Verified | RESTful JSON API endpoints (+server.js) with 200, 400, 401, 403, 404 status codes and body parsing |
| 9 | **Data Freshness & Invalidation** | `depends()` & `invalidate()` | 🟢 Mastered & Verified | Triggering targeted client reloads via depends('app:users') and invalidate('app:users') |
| 10 | **UI Architecture & Components** | Svelte 5 Runes + shadcn-svelte | 🟢 Mastered & Verified | Composed accessible shell with responsive desktop sidebar, mobile Sheet, & focus-trapped dialogs |
| 11 | **Styling Systems & Dark Mode** | Tailwind CSS + mode-watcher | 🟢 Mastered & Verified | Zero-flash light/dark/system theme switching with semantic CSS variables |
| 12 | **Lifecycle Debugging** | `/debug-lab` | ⚪ Not Started | Diagnosing errors through the 8 stages of the HTTP lifecycle |

*Status key: ⚪ Not Started | 🟡 In Progress / Explained | 🟢 Mastered & Verified*

---

## 2. Phase-by-Phase Learning Checklist

### Module 1: Svelte 5, SvelteKit & Modern Frontend Foundations
- [x] **Concept Explained**: Svelte 5 Runes (`$state`, `$derived`, `$props`, `$effect`) vs legacy Svelte 3/4 stores & reactive declarations
- [x] **Concept Explained**: SvelteKit directory conventions (`src/routes`, `+layout.svelte`, `+page.svelte`)
- [x] **Concept Explained**: Tailwind CSS utility composition and semantic theme variables
- [x] **Concept Explained**: shadcn-svelte architecture: Why components live directly in your source code (`$lib/components/ui`)
- [x] **Concept Explained**: The JavaScript-only configuration (`"typescript": false` in `components.json`)
- [x] **Code Walkthrough**: Scaffolded project structure and dev server boot process
- [x] **Self-Check Question 1**: *Why does Svelte 5 use runes like `$state` instead of `let count = 0` reactive assignments, and how does `$derived` improve performance?*

---

### Module 2: Server-Side Data Modeling, Cryptography & Invariants
- [x] **Concept Explained**: The client vs server trust boundary: Why browser code is fundamentally untrusted
- [x] **Concept Explained**: Why plain SHA-256 is inadequate for passwords, and how cryptographic salt + scrypt work
- [x] **Concept Explained**: What timing attacks are and why `crypto.timingSafeEqual` is necessary
- [x] **Concept Explained**: Internal user record vs safe public projection (`toSafeUser` / `toPublicDirectoryUser`)
- [x] **Concept Explained**: Application invariants: Why the final active administrator rule must be enforced in the store
- [x] **Code Walkthrough**: `src/lib/server/crypto.js` and `src/lib/server/store.js` (Implemented & verified with 47 unit test assertions)
- [x] **Self-Check Question 2**: *What could happen if a server sends the `passwordHash` to a client component, even if the UI never displays it?*

---

### Module 3: Authentication, Session Management & Server Hooks
- [x] **Concept Explained**: Session-based auth vs JWT tokens: Why sessions allow instant revocation upon deactivation
- [x] **Concept Explained**: Cookie security flags: `HttpOnly` (XSS protection), `SameSite=Lax` (CSRF mitigation), `Path`, `Secure`
- [x] **Concept Explained**: How `hooks.server.js` intercepts every incoming HTTP request and populates `event.locals.user`
- [x] **Concept Explained**: Reusable server authorization helpers (`requireUser`, `requireAdmin`)
- [x] **Code Walkthrough**: `src/lib/server/auth.js` and `src/hooks.server.js`
- [x] **Self-Check Question 3**: *If an attacker steals a user's browser localStorage, can they steal an `HttpOnly` session cookie? Why or why not?*

---

### Module 4: Design Systems, Accessible Shells & Theme Switching
- [x] **Concept Explained**: How `mode-watcher` prevents flash of incorrect theme (FOUC) on initial page load
- [x] **Concept Explained**: Composing accessible layouts with semantic HTML and responsive sheet drawers
- [x] **Concept Explained**: Accessible modal confirmation dialogs (focus management and ESC dismissal)
- [x] **Code Walkthrough**: `+layout.svelte`, `theme-toggle.svelte`, `app-header.svelte`, `app-sidebar.svelte`, `confirm-action-dialog.svelte`
- [x] **Self-Check Question 4**: *Why should role indicators or account status badges not rely on color alone?*

---

### Module 5: Form Actions, Validation & Authentication Flows
- [x] **Concept Explained**: SvelteKit Form Actions: How native HTML forms submit to the server without custom fetch code
- [x] **Concept Explained**: Progressive enhancement with `use:enhance`: How it enhances UX without breaking no-JS environments
- [x] **Concept Explained**: Returning `fail(400, { ... })` to preserve form inputs while returning inline validation errors
- [x] **Concept Explained**: Why public registration must strictly force `role: 'user'` and ignore any submitted `role` field
- [x] **Code Walkthrough**: `/login`, `/register`, and `/logout` action implementations
- [x] **Self-Check Question 5**: *Why must server-side validation always be performed, even if client-side validation is already validating user input?*

---

### Module 6: Server-Driven Data Loading, Dynamic Routes & Invalidation
- [x] **Concept Explained**: SvelteKit `load` functions in `+page.server.js` and passing data to `+page.svelte` via `$props()`
- [x] **Concept Explained**: Dynamic route matching with `[id]` and returning proper HTTP 404s via `error(404, ...)`
- [x] **Concept Explained**: Data freshness: How `depends('app:users')` and `invalidate('app:users')` prevent stale UI states
- [x] **Code Walkthrough**: `/dashboard`, `/profile`, `/users`, and `/users/[id]`
- [x] **Self-Check Question 6**: *What is the difference between mutating data on the server and invalidating data on the client?*

---

### Module 7: Administrative Controls, RBAC & Endpoints
- [x] **Concept Explained**: Form actions vs HTTP endpoints (`+server.js`): When each is appropriate
- [x] **Concept Explained**: Status codes in API contracts: 200, 400, 401, 403, 404, 409, 500
- [x] **Concept Explained**: The distinction between 401 Unauthorized (unauthenticated) and 403 Forbidden (unauthorized)
- [x] **Concept Explained**: Enforcing account deactivation: Why deactivation must immediately invalidate active sessions
- [x] **Code Walkthrough**: `/admin`, `/admin/users`, and `/api/users/[id]/status`
- [x] **Self-Check Question 7**: *Why is hiding an "Admin" button in the navigation bar insufficient to protect an administrative endpoint?*

---

### Module 8: Request-Lifecycle Investigation & Debugging Laboratory
- [ ] **Concept Explained**: The 8 stages of an HTTP request lifecycle in a full-stack SvelteKit application
- [ ] **Concept Explained**: Scenario A (JSON property mismatch): Investigating API contract violations
- [ ] **Concept Explained**: Scenario B (API 404): Distinguishing routing errors from missing database entities
- [ ] **Concept Explained**: Scenario C (500 Error): Investigating server stack traces in dev vs sanitized production responses
- [ ] **Concept Explained**: Scenario D (Omitted Cookie): Comparing standard requests with `credentials: 'omit'`
- [ ] **Code Walkthrough**: `/debug-lab` UI and corresponding `/api/debug/*` endpoints
- [ ] **Self-Check Question 8**: *If an API request returns 404, how do you determine if the problem is in the client's URL or the server's database lookup?*

---

### Module 9: Verification, Mental Models & Mastery Review
- [ ] **Concept Explained**: End-to-end security matrix verification across all three user roles
- [ ] **Concept Explained**: Architectural boundaries between learning prototypes and production systems
- [ ] **Walkthrough Complete**: Full guided tour of the completed application

---

## 3. Personal Notes & Key Takeaways Log
- **Step 2.1 (Security Primitives - `src/lib/server/crypto.js`)**:
  - *Server-Only Boundary*: Code placed inside `src/lib/server/` is guaranteed by SvelteKit to never be bundled or imported by client code.
  - *Password Hashing*: Fast hash algorithms (MD5, SHA-256) are disastrous for passwords because GPUs can test billions of hashes/sec. Key Derivation Functions like `scrypt` require substantial memory and computation time, making brute-force attacks infeasible.
  - *Salts*: Every password gets a unique random 16-byte salt to prevent rainbow table attacks and ensure identical passwords produce completely distinct hashes.
  - *Timing Attacks*: Standard string comparison (`===`) short-circuits on the first mismatched byte, leaking information about how many characters were correct via microsecond timing differences. `crypto.timingSafeEqual` runs in constant time.
- **Step 2.2 (Data Store & Invariants - `src/lib/server/store.js`)**:
  - *Defense-in-Depth Projections*: Even if a developer accidentally returns a user object to a page, `toSafeUser()` ensures `passwordHash` and `passwordSalt` are stripped before leaving the store layer.
  - *Email Normalization*: Case-folding (`trim().toLowerCase()`) is non-negotiable to prevent duplicate accounts and security bypasses.
  - *Business Invariants*: The "last active administrator" guard is enforced directly in `updateUserRole` and `setUserStatus` so that no API or UI action can ever brick the administrative access to the system.
  - *Instant Revocation*: Account deactivation immediately calls `deleteSessionsForUser(id)`, cutting off compromised or deactivated accounts on their very next HTTP request.
- **Step 3.1 & 3.2 (Authentication, Sessions & Server Hooks - `auth.js`, `hooks.server.js`, `+layout.server.js`)**:
  - *Session-Based vs JWT*: Stateful server sessions allow immediate logout and revocation upon deactivation; stateless JWTs cannot be revoked until they expire without complex distributed blacklists.
  - *Cookie Security Flags*: `HttpOnly` makes cookies completely inaccessible to JavaScript (`document.cookie`), neutralizing token theft via XSS. `SameSite=Lax` prevents CSRF attacks on cross-site requests.
  - *Request Lifecycle Interception*: SvelteKit's `handle` hook runs before any route resolves. It resolves the session, attaches `event.locals.user`, enforces RBAC route protection, and redirects unauthorized traffic before rendering starts.
  - *Root Data Cascading*: `+layout.server.js` exposes `{ user: locals.user }` to all child layouts and pages, creating a single reactive source of truth for the active session.
- **Step 4.1 to 4.5 (Design Systems, Accessible Shells & Theme Switching - Module 4)**:
  - *Zero-FOUC Theme Management*: `mode-watcher` executes inline script in `<head>` before body hydration to sync the `dark` class on `<html>` with localStorage or OS preference (`prefers-color-scheme`).
  - *Dynamic Layout Shell Branching*: `src/routes/+layout.svelte` dynamically switches between a full authenticated desktop sidebar shell (for `/dashboard`, `/profile`, `/users`, `/admin`, `/debug-lab`) and a minimal public shell for unauthenticated/landing flows.
  - *Accessible Dialog Focus Trapping*: `confirm-action-dialog.svelte` leverages bits-ui WAI-ARIA under the hood, trapping tab focus inside modal dialogs and listening for ESC keys to prevent keyboard traps.
  - *Visual Role Indicator Accessibility*: Roles and statuses are never conveyed through color alone; textual badges (`user.role`, `user.status`) and screen-reader hints (`sr-only`) ensure complete assistive tech compatibility.
- **Step 5.1 to 5.5 (Public Routes & Authentication Flows - Module 5)**:
  - *Native Form Actions*: Forms submit to server `actions` via HTTP POST, handling standard `FormData` without manual fetch boilerplate.
  - *Preserving User Input on Failures*: `return fail(400, { message, email })` returns validation errors while preserving non-sensitive form input, avoiding frustrating full form resets.
  - *Progressive Enhancement with `use:enhance`*: Intercepts submissions client-side for smooth UX, spinners, and reactive state updates, while falling back gracefully to standard full-page POST in no-JS environments.
  - *Privilege Escalation Prevention*: Public registration strictly hardcodes `role: 'user'` on the server, completely ignoring any malicious `role` parameters sent in form payloads.
  - *POST-Only Session Destruction*: `/logout` accepts only HTTP POST, preventing search engine crawlers and browser prefetch algorithms from accidentally logging out users.
- **Step 6.1 to 6.5 (Server-Driven Data Loading, Dynamic Routes & Invalidation - Module 6)**:
  - *Server-Side Load Functions*: `+page.server.js` executes exclusively on the server, querying the data store, enforcing auth guards with `requireUser(locals)`, and passing safe serializable data via `return { ... }`.
  - *Receiving Data with Svelte 5*: Components use `let { data } = $props()` and reactive `$derived` bindings to consume server payloads without manual client state stores.
  - *Dynamic Route Routing (`[id]`)*: Folder names with square brackets capture URL segments into `params.id`. Missing records throw `error(404, 'User not found')`, triggering SvelteKit's standard error page boundary.
  - *Privacy-Aware Projections*: In `users/[id]`, email addresses are private; the server only passes `email` if the visitor is an administrator or the profile owner (`canViewEmail = isOwnProfile || currentUser.role === 'admin'`).
  - *Data Invalidation Contracts*: Declaring `depends('app:users')` in load functions tells SvelteKit to re-execute those loaders whenever the client calls `invalidate('app:users')` (e.g. after editing profile or changing roles), maintaining real-time freshness without manual page refreshes.
- **Step 7.1 to 7.5 (Administrative Controls, RBAC & Endpoints - Module 7)**:
  - *Form Actions vs HTTP Endpoints*: Form Actions in `+page.server.js` handle standard user interface forms with automatic progressive enhancement (`use:enhance`); HTTP endpoints in `+server.js` expose explicit RESTful JSON APIs for programmatic integrations or status toggles.
  - *Comprehensive Status Codes in API Contracts*: Status API responds with `401 Unauthorized` (no session), `403 Forbidden` (non-admin caller), `404 Not Found` (unknown target ID), `400 Bad Request` (invalid status value or last-admin invariant violation), and `200 OK` (successful mutation with serialized safe user).
  - *Application Invariant Enforcement*: The "last active administrator" guard is enforced in both form actions and the REST API. If an admin tries to demote or deactivate the only remaining active admin, the server strictly returns `400 Bad Request`.
  - *Immediate Session Eviction*: Calling `setUserStatus(id, 'inactive')` immediately purges all active session tokens for that user ID, cutting off access on their very next request.
  - *Defense-in-Depth Authorization*: UI elements (e.g., Demote button) are conditionally hidden/disabled for convenience, but the server action and HTTP endpoint independently re-verify `requireAdmin(locals)` before executing mutations.
