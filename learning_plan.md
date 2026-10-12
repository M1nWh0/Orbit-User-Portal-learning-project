# Orbit User Portal — Step-by-Step Learning Plan

## 1. Educational Philosophy & Learning Goals

The Orbit User Portal project is built as an interactive learning laboratory. Rather than treating this as a passive code generation exercise, every step of implementation is coupled with an in-depth explanation of:
- **Where the code runs** (Browser client vs. SvelteKit server runtime).
- **Why this design decision was made** (Security boundaries, data integrity, and web standards).
- **How the underlying technologies operate** (Svelte 5 runes, SvelteKit lifecycle, HTTP protocols, cryptography).

This learning plan is directly mapped to [learning_guide.md](file:///c:/Users/hp/Desktop/p/Useful%20learning%20projects/1.Orbit%20User%20Portal/learning_guide.md) and [documentation.md](file:///c:/Users/hp/Desktop/p/Useful%20learning%20projects/1.Orbit%20User%20Portal/documentation.md).

---

## 2. Learning Roadmap by Implementation Phase

### Module 1: Svelte 5, SvelteKit & Modern Frontend Foundations
**Mapped to:** `learning_guide.md` §2.1, §2.2, §2.3, §2.4, §2.5, §4

#### Key Concepts to Master:
1. **Svelte 5 Runes System**:
   - `$state(initialValue)`: Universal reactive state without boilerplate stores.
   - `$derived(expression)`: Computed values that update automatically when dependencies change.
   - `$props()`: How components accept incoming data and events from parent components.
   - `$effect()`: Managed side effects with automatic cleanup.
2. **SvelteKit Architecture**:
   - File-based routing (`routes/` folder hierarchy).
   - Layout inheritance (`+layout.svelte`, `+layout.server.js`).
   - Server-only modules (`$lib/server/*`) vs client-safe shared utilities (`$lib/*`).
3. **Utility-First Styling & Component Design**:
   - Tailwind CSS utility composition and semantic tokens (`background`, `foreground`, `primary`, `muted`, `border`).
   - The shadcn-svelte architecture: Owning your component code in `$lib/components/ui/` rather than depending on an opaque third-party npm package.
   - The JavaScript-only configuration (`"typescript": false` in `components.json`).

#### Step-by-Step Implementation & Teaching Breakdown:
- **Step 1.1**: Scaffold SvelteKit JavaScript project. *Explanation: Anatomy of `svelte.config.js`, `vite.config.js`, and `package.json`.*
- **Step 1.2**: Install & configure Tailwind CSS. *Explanation: How PostCSS processes utility classes and how CSS variables enable theme switching.*
- **Step 1.3**: Configure shadcn-svelte for JavaScript. *Explanation: How CLI component generation works, directory structure, and import aliases.*
- **Step 1.4**: Install shadcn-svelte primitives. *Explanation: How headless UI components handle accessibility (WAI-ARIA) under the hood.*

---

### Module 2: Server-Side Data Modeling, Cryptography & Invariants
**Mapped to:** `learning_guide.md` §2.6, §3, §8, §9, §10

#### Key Concepts to Master:
1. **The Client vs Server Trust Boundary**:
   - Why client-side state is untrusted and easily manipulated by users.
   - Why authentication, authorization, and data validation must execute strictly on the server.
2. **Password Cryptography without Libraries**:
   - Why plain hashing (SHA-256) is vulnerable to rainbow table attacks and GPU brute-force.
   - Key derivation functions (`scrypt` / `PBKDF2`): Adding algorithmic work factors and unique salts per user.
   - Timing attacks and constant-time comparisons (`crypto.timingSafeEqual`).
3. **Data Modeling & Invariant Enforcement**:
   - Internal record representation vs safe public projections (`toSafeUser`).
   - Protecting confidential fields: `passwordHash`, `passwordSalt`, and session identifiers.
   - Application Invariants: Ensuring business constraints (such as the final active administrator rule) can never be violated, even if requested directly.

#### Step-by-Step Implementation & Teaching Breakdown:
- **Step 2.1**: Build `src/lib/server/crypto.js`. *Explanation: Salt generation, scrypt derivation parameters, and timing attack mitigation.*
- **Step 2.2**: Build `src/lib/server/store.js`. *Explanation: In-memory store architecture, state mutators, and seeded data initialization.*
- **Step 2.3**: Build safe data projectors. *Explanation: Data sanitization patterns preventing accidental credential leakage.*
- **Step 2.4**: Implement invariant guards. *Explanation: Enforcing the "last active administrator" guard inside store mutators.*

---

### Module 3: Authentication, Session Management & Request Lifecycle Hooks
**Mapped to:** `learning_guide.md` §7, §8, §9

#### Key Concepts to Master:
1. **Session-Based Authentication Mechanics**:
   - Token-based (JWT) vs Session-based: Why server-managed sessions allow immediate revocation on deactivation or logout.
   - Unpredictable session tokens (`crypto.randomUUID()`).
2. **HTTP Cookies Demystified**:
   - `HttpOnly`: Blocking JavaScript (`document.cookie`) access to prevent XSS session theft.
   - `SameSite=Lax`: Protecting against Cross-Site Request Forgery (CSRF).
   - `Path=/` and `Secure`: Controlling scope and HTTPS transmission.
3. **SvelteKit Server Hooks (`hooks.server.js`)**:
   - The request interception pipeline: Every incoming HTTP request passes through `handle({ event, resolve })`.
   - Populating `event.locals`: Making safe user data available downstream to layouts, load functions, and form actions.
   - Centralized route protection and early redirects.

#### Step-by-Step Implementation & Teaching Breakdown:
- **Step 3.1**: Build `src/lib/server/auth.js`. *Explanation: Session creation, cookie header setting, and active status validation.*
- **Step 3.2**: Build `src/hooks.server.js`. *Explanation: Tracing a request through the hook pipeline and populating `event.locals.user`.*
- **Step 3.3**: Build route-guard helpers (`requireUser`, `requireAdmin`). *Explanation: Centralized server authorization logic.*

---

### Module 4: Design Systems, Accessible Shells & Theme Switching
**Mapped to:** `learning_guide.md` §4, §5

#### Key Concepts to Master:
1. **Theme Switching without Flash (FOUC)**:
   - How `mode-watcher` reads localStorage / `prefers-color-scheme` in the `<head>` before body render.
   - CSS variables in `:root` and `.dark` selectors.
2. **Accessible Layout Composition**:
   - Semantic HTML layout (`<header>`, `<aside>`, `<main>`).
   - Responsive sidebar vs Sheet drawer for mobile viewports.
   - Accessible action confirmations with Alert Dialogs.

#### Step-by-Step Implementation & Teaching Breakdown:
- **Step 4.1**: Build `+layout.svelte` with `ModeWatcher` and Sonner toast. *Explanation: Layout cascading in SvelteKit.*
- **Step 4.2**: Build `theme-toggle.svelte`. *Explanation: Listening to mode changes and updating the document class.*
- **Step 4.3**: Build `app-header.svelte` & `app-sidebar.svelte`. *Explanation: Responsive navigation patterns and role-based link visibility.*
- **Step 4.4**: Build `confirm-action-dialog.svelte`. *Explanation: Accessible modal focus trapping and keyboard dismissal.*

---

### Module 5: Form Actions, Validation & Authentication Flows
**Mapped to:** `learning_guide.md` §3, §7, §8, §12

#### Key Concepts to Master:
1. **SvelteKit Form Actions (`+page.server.js`)**:
   - Native HTML form submissions via POST.
   - Handling FormData without manual fetch wrappers.
   - Progressive enhancement with `use:enhance`: Seamless client-side UX while retaining full zero-JS fallback capability.
2. **Server-Side Validation Patterns**:
   - Returning `fail(400, { ... })` to preserve user input and return targeted field errors.
   - Redirecting with `redirect(303, ...)` upon successful mutation.
   - Why submitted input cannot be trusted (e.g. ignoring submitted `role` field on registration).

#### Step-by-Step Implementation & Teaching Breakdown:
- **Step 5.1**: Build `/` Landing page. *Explanation: Public branding, marketing UI, and conditional auth CTA buttons.*
- **Step 5.2**: Build `/login` action & page. *Explanation: Parsing credentials, checking inactive account status, setting session cookie, handling pending state.*
- **Step 5.3**: Build `/register` action & page. *Explanation: Email normalization, password length validation, confirm password match, and automatic user role assignment.*
- **Step 5.4**: Build `/logout` endpoint. *Explanation: POST request handling, server session invalidation, and clearing cookies.*

---

### Module 6: Server-Driven Data Loading, Dynamic Routes & Invalidation
**Mapped to:** `learning_guide.md` §5, §6, §11

#### Key Concepts to Master:
1. **Server-Side Data Loading (`+page.server.js`)**:
   - The `load({ params, locals, depends })` function.
   - Passing data securely to `+page.svelte` via `let { data } = $props()`.
   - Handling nonexistent resources with `error(404, 'User not found')`.
2. **Dynamic Route Parameters**:
   - Filesystem folder syntax `[id]`.
   - Isolating parameters and preventing ID injection.
3. **Data Freshness & SvelteKit Invalidation**:
   - The stale data problem in single-page apps.
   - Declaring custom cache keys with `depends('app:users')`.
   - Busting stale cache with `invalidate('app:users')` after mutations.

#### Step-by-Step Implementation & Teaching Breakdown:
- **Step 6.1**: Build `/dashboard` load function and views. *Explanation: Role-conditional dashboard rendering and live metrics computation.*
- **Step 6.2**: Build `/profile` load and update action. *Explanation: Self-profile mutation, input sanitization, and invalidating dependent data.*
- **Step 6.3**: Build `/users` directory with search. *Explanation: Combining Svelte 5 reactive filtering (`$derived`) with server-loaded data.*
- **Step 6.4**: Build `/users/[id]` dynamic route. *Explanation: Route param extraction, 404 handling, and route navigation reactivity.*

---

### Module 7: Administrative Controls, RBAC & Endpoints
**Mapped to:** `learning_guide.md` §3, §7, §9, §12

#### Key Concepts to Master:
1. **Form Actions vs HTTP Endpoints (`+server.js`)**:
   - When to use a Form Action (page-centric forms) vs HTTP Endpoint (explicit JSON API).
   - HTTP status codes: `200 OK`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`.
2. **Enforcing RBAC on Mutations**:
   - Why hiding a button on the UI provides zero security.
   - Enforcing admin role checks on every administrative action.
   - Live session revocation when deactivating an account.

#### Step-by-Step Implementation & Teaching Breakdown:
- **Step 7.1**: Build `/admin` dashboard. *Explanation: Administrative overview and metrics computation.*
- **Step 7.2**: Build `/admin/users` management table. *Explanation: Administrative filtering, user creation modal, role promotion/demotion.*
- **Step 7.3**: Build `/api/users/[id]/status` HTTP endpoint. *Explanation: Designing RESTful status update endpoints with explicit JSON error contracts.*
- **Step 7.4**: Implement deactivation with immediate session invalidation. *Explanation: Verifying that deactivating an account blocks active sessions in real time.*

---

### Module 8: Request-Lifecycle Investigation & Debugging Laboratory
**Mapped to:** `learning_guide.md` §12, §13

#### Key Concepts to Master:
1. **The 8-Stage HTTP Request Lifecycle**:
   - Client construct -> HTTP transmission -> SvelteKit routing -> Server validation -> Authorization -> Business logic -> Response transmission -> Client rendering.
2. **Analyzing the 4 Diagnostic Scenarios**:
   - **Scenario A (JSON Mismatch)**: Contract violation (`username` vs `email`) resulting in `400 Bad Request`.
   - **Scenario B (API 404)**: Distinguishing route matching failure from data resource absence.
   - **Scenario C (500 Error)**: Server exception logging in dev terminal vs sanitized 500 in production.
   - **Scenario D (Omitted Cookie)**: `credentials: 'omit'` demonstrating the mechanics of browser session cookie transmission.

#### Step-by-Step Implementation & Teaching Breakdown:
- **Step 8.1**: Build `/api/debug/echo`. *Explanation: Request schema validation and contract enforcement.*
- **Step 8.2**: Build `/api/debug/users/[id]`. *Explanation: Resource existence checking and 404 response structure.*
- **Step 8.3**: Build `/api/debug/trigger-error`. *Explanation: Development-only error handling and terminal stack trace analysis.*
- **Step 8.4**: Build `/api/debug/session`. *Explanation: Cookie parsing mechanics and credential transmission flags.*
- **Step 8.5**: Build `/debug-lab` UI workbench. *Explanation: Building interactive diagnostic tools and real-time response inspectors.*

---

### Module 9: Verification, Mental Models & Mastery Review
**Mapped to:** `learning_guide.md` §14, §15

#### Key Concepts to Master:
1. Synthesizing the 12 core learning outcomes.
2. Reviewing the boundary between learning prototypes and production enterprise applications.
3. End-to-end audit of permissions, invariants, and mobile responsiveness.

---

## 3. Teaching Protocol for Every Step

For every feature or file we implement, the following explanation structure will be provided in chat:
1. **The Goal**: What does this module or component do?
2. **The Architectural Context**: Where does this run (browser or server)? Why?
3. **The Code Anatomy**: Line-by-line explanation of the interesting mechanics (e.g. Svelte 5 runes, SvelteKit cookies, crypto functions).
4. **The Security/Engineering Implication**: What would happen if this was implemented incorrectly?
5. **How to Test It**: Step-by-step instructions to observe its behavior in the browser or terminal.
