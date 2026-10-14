# Orbit User Portal — Learning Progress Tracker

This document tracks your personal understanding, concept mastery, and interactive learning checkpoints as we build **Orbit User Portal**. It accompanies the [learning_plan.md](file:///c:/Users/hp/Desktop/p/Useful%20learning%20projects/1.Orbit%20User%20Portal/learning_plan.md) and [learning_guide.md](file:///c:/Users/hp/Desktop/p/Useful%20learning%20projects/1.Orbit%20User%20Portal/learning_guide.md).

---

## 1. Core Learning Outcomes Matrix

Based on Section 15 of `learning_guide.md`, track your mastery of the 12 core competencies:

| # | Competency Area | Primary File / Feature | Mastery Status | Key Takeaway Understood |
|---|---|---|:---:|---|
| 1 | **Application Architecture** | `hooks.server.js`, `$lib/server/` | ⚪ Not Started | Clear separation of UI, routing, auth, authorization, & store |
| 2 | **Server-Driven Rendering** | `+page.server.js` (`load`) | ⚪ Not Started | Data fetched securely on server before HTML reaches client |
| 3 | **Form Processing** | `+page.server.js` (`actions`) | ⚪ Not Started | Native HTTP forms with validation, `fail()`, & `use:enhance` |
| 4 | **Authentication** | `src/lib/server/auth.js` | ⚪ Not Started | Password verification, random session IDs, & session cookies |
| 5 | **Authorization & RBAC** | `hooks.server.js`, auth guards | ⚪ Not Started | Server-enforced permissions on every protected request |
| 6 | **Data Modeling & Sanitization** | `src/lib/server/store.js` | 🟢 Mastered & Verified | Safe projections preventing password hashes from reaching client |
| 7 | **CRUD Operations** | Admin console & profile edit | 🟡 In Progress | In-memory CRUD methods and invariant guards implemented in store |
| 8 | **HTTP Communication** | `+server.js` endpoints | ⚪ Not Started | HTTP methods, JSON payloads, headers, & proper status codes |
| 9 | **Data Freshness & Invalidation** | `depends()` & `invalidate()` | ⚪ Not Started | Triggering targeted client reloads when server data changes |
| 10 | **UI Architecture & Components** | Svelte 5 Runes + shadcn-svelte | 🟢 Mastered & Verified | Composing accessible, reusable components using `$state` & `$props` |
| 11 | **Styling Systems & Dark Mode** | Tailwind CSS + mode-watcher | 🟢 Mastered & Verified | Theme-aware semantic CSS variables with zero flash on reload |
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
- [ ] **Concept Explained**: Session-based auth vs JWT tokens: Why sessions allow instant revocation upon deactivation
- [ ] **Concept Explained**: Cookie security flags: `HttpOnly` (XSS protection), `SameSite=Lax` (CSRF mitigation), `Path`, `Secure`
- [ ] **Concept Explained**: How `hooks.server.js` intercepts every incoming HTTP request and populates `event.locals.user`
- [ ] **Concept Explained**: Reusable server authorization helpers (`requireUser`, `requireAdmin`)
- [ ] **Code Walkthrough**: `src/lib/server/auth.js` and `src/hooks.server.js`
- [ ] **Self-Check Question 3**: *If an attacker steals a user's browser localStorage, can they steal an `HttpOnly` session cookie? Why or why not?*

---

### Module 4: Design Systems, Accessible Shells & Theme Switching
- [ ] **Concept Explained**: How `mode-watcher` prevents flash of incorrect theme (FOUC) on initial page load
- [ ] **Concept Explained**: Composing accessible layouts with semantic HTML and responsive sheet drawers
- [ ] **Concept Explained**: Accessible modal confirmation dialogs (focus management and ESC dismissal)
- [ ] **Code Walkthrough**: `+layout.svelte`, `theme-toggle.svelte`, `app-header.svelte`, `app-sidebar.svelte`
- [ ] **Self-Check Question 4**: *Why should role indicators or account status badges not rely on color alone?*

---

### Module 5: Form Actions, Validation & Authentication Flows
- [ ] **Concept Explained**: SvelteKit Form Actions: How native HTML forms submit to the server without custom fetch code
- [ ] **Concept Explained**: Progressive enhancement with `use:enhance`: How it enhances UX without breaking no-JS environments
- [ ] **Concept Explained**: Returning `fail(400, { ... })` to preserve form inputs while returning inline validation errors
- [ ] **Concept Explained**: Why public registration must strictly force `role: 'user'` and ignore any submitted `role` field
- [ ] **Code Walkthrough**: `/login`, `/register`, and `/logout` action implementations
- [ ] **Self-Check Question 5**: *Why must server-side validation always be performed, even if client-side validation is already validating user input?*

---

### Module 6: Server-Driven Data Loading, Dynamic Routes & Invalidation
- [ ] **Concept Explained**: SvelteKit `load` functions in `+page.server.js` and passing data to `+page.svelte` via `$props()`
- [ ] **Concept Explained**: Dynamic route matching with `[id]` and returning proper HTTP 404s via `error(404, ...)`
- [ ] **Concept Explained**: Data freshness: How `depends('app:users')` and `invalidate('app:users')` prevent stale UI states
- [ ] **Code Walkthrough**: `/dashboard`, `/profile`, `/users`, and `/users/[id]`
- [ ] **Self-Check Question 6**: *What is the difference between mutating data on the server and invalidating data on the client?*

---

### Module 7: Administrative Controls, RBAC & Endpoints
- [ ] **Concept Explained**: Form actions vs HTTP endpoints (`+server.js`): When each is appropriate
- [ ] **Concept Explained**: Status codes in API contracts: 200, 400, 401, 403, 404, 409, 500
- [ ] **Concept Explained**: The distinction between 401 Unauthorized (unauthenticated) and 403 Forbidden (unauthorized)
- [ ] **Concept Explained**: Enforcing account deactivation: Why deactivation must immediately invalidate active sessions
- [ ] **Code Walkthrough**: `/admin`, `/admin/users`, and `/api/users/[id]/status`
- [ ] **Self-Check Question 7**: *Why is hiding an "Admin" button in the navigation bar insufficient to protect an administrative endpoint?*

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
