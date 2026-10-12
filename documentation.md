# Orbit User Portal

## Project Specification

**Project type:** Full-stack-style frontend application with server-side functionality
**Framework:** Svelte 5 + SvelteKit
**Language:** JavaScript only
**Styling:** Tailwind CSS
**UI components:** shadcn-svelte
**Data storage:** Server-side in-memory mock store
**Authentication:** Custom session-based authentication
**Application roles:** Anonymous, User, Admin

---

## 1. Project Overview

### 1.1 Objective

Build Orbit User Portal, a modern SaaS-style user management application that simulates the behavior of a small, realistic web application.

The application must allow users to register, authenticate, manage their profiles, browse a user directory, and access features according to their permissions. Administrators must have additional capabilities for managing accounts, assigning roles, and controlling account status.

The application must implement real behavior within the running development environment. It must not be a collection of static pages or isolated UI demonstrations.

### 1.2 Core Features

The application must provide:

* Public landing page.
* User registration and login.
* Session management and logout.
* Role-based access control.
* Personalized user dashboard.
* Profile viewing and editing.
* Searchable user directory.
* Dynamic user profile pages.
* Administrative dashboard.
* Account creation and management.
* Role assignment and account activation/deactivation.
* Light and dark themes.
* Responsive navigation and layouts.
* Server-side data loading.
* SvelteKit form actions.
* HTTP API endpoints.
* Server-side validation and authorization.
* Data invalidation and refresh.
* A controlled debugging laboratory.
* Consistent loading, empty, success, error, and confirmation states.

### 1.3 Project Boundaries

This is a learning project that simulates a complete application without introducing a database or an external authentication provider.

All accounts and sessions must operate consistently while the development server is running. Data will be lost when the server restarts.

The architecture should isolate data access, authentication, authorization, and presentation so that the mock data layer can later be replaced with a database-backed implementation.

---

## 2. Technical Requirements

### 2.1 Required Technologies

* **Svelte 5:** Components, reactive state, and interactive behavior.
* **SvelteKit:** Routing, server-side loading, form actions, endpoints, hooks, cookies, redirects, and error handling.
* **JavaScript:** All application source code.
* **Tailwind CSS:** Layout, styling, responsive behavior, and theme-aware utilities.
* **shadcn-svelte:** Reusable UI components.
* **mode-watcher:** Theme preference and theme switching.
* **@lucide/svelte:** Icons.
* **Node.js built-in cryptographic functionality:** Password hashing and secure random session identifiers.

Use the dependencies required by the selected SvelteKit, Tailwind CSS, and shadcn-svelte installation.

### 2.2 JavaScript-Only Constraint

TypeScript must not be used.

* Use `.js` for JavaScript modules.
* Use `.svelte` for Svelte components.
* Use `hooks.server.js`, `+page.server.js`, and `+server.js` where applicable.
* Do not use `.ts` source files.
* Do not use `lang="ts"` in Svelte components.
* Configure `jsconfig.json` where editor configuration or path aliases are needed.
* Configure shadcn-svelte for JavaScript generation with `"typescript": false` in `components.json`.

Documentation examples must be adapted to JavaScript when they use TypeScript.

### 2.3 UI Component Requirements

Use shadcn-svelte components where appropriate, including:

* Button
* Card
* Input and Label
* Badge
* Table
* Dialog and Alert Dialog
* Dropdown Menu
* Select
* Avatar
* Sheet
* Skeleton
* Alert
* Sonner
* Separator

Generate components using the supported CLI and installation instructions. Keep generated component source code within the project.

Do not introduce another component library without a specific requirement.

### 2.4 Project Initialization

Start from a working SvelteKit application configured for JavaScript.

Install and configure Tailwind CSS and shadcn-svelte using their current SvelteKit installation instructions. Configure theme support and the required icons.

Verify that the application starts successfully before implementing application features.

Documentation:

* https://svelte.dev/docs/kit
* https://shadcn-svelte.com/docs/installation/sveltekit
* https://shadcn-svelte.com/docs/javascript
* https://tailwindcss.com/docs

---

## 3. Application Design

### 3.1 Visual Direction

Create a polished, modern SaaS dashboard with:

* Clear visual hierarchy.
* Consistent spacing and typography.
* Restrained use of color.
* Consistent borders, backgrounds, and corner radii.
* Responsive layouts.
* Readable forms and tables.
* Accessible interactions.
* Consistent feedback and status indicators.

The application should feel like a coherent product rather than a collection of unrelated pages.

### 3.2 Shared Application Layout

Authenticated application pages should use a shared layout containing:

* Application logo and navigation sidebar.
* Top bar with page title or breadcrumb.
* Current user information.
* Theme control.
* Account menu and logout action.
* Main content area with consistent spacing.
* Responsive mobile navigation, using a Sheet or equivalent component.

Navigation must reflect the current authentication state and role.

Regular users must not be shown administrator-only navigation items. However, navigation visibility must never be treated as an authorization mechanism.

### 3.3 Responsive Behavior

* Sidebar navigation must adapt to smaller screens.
* Tables must remain usable on mobile through responsive layouts or controlled horizontal scrolling.
* Forms must remain readable and operable on small screens.
* Dialogs and dropdowns must remain usable on touch devices.
* Interactive elements must have appropriate focus and hover states.

### 3.4 Accessibility

* Use semantic HTML.
* Associate form controls with labels.
* Support keyboard navigation.
* Provide visible focus indicators.
* Ensure dialogs have appropriate accessible behavior.
* Use descriptive accessible names for icon-only controls.
* Do not communicate roles or account status through color alone.
* Respect reduced-motion preferences where applicable.

### 3.5 UI States

Implement consistent states for:

* Initial and pending submissions.
* Disabled controls.
* Validation errors.
* Failed authentication.
* Successful operations.
* Empty search results.
* Empty directories.
* Loading data where appropriate.
* Not-found pages.
* Access-denied states.
* Active and inactive accounts.
* Anonymous, regular-user, and administrator sessions.

Show success notifications only after the server confirms that the operation succeeded.

---

## 4. Theme System

Implement application-wide light and dark themes.

Requirements:

1. Provide a theme control in the shared top bar.
2. Allow switching between light and dark.
3. Support a System preference if practical.
4. Persist the selected preference across navigation and reloads.
5. Ensure all pages and shadcn-svelte components follow the active theme.
6. Minimize flashes of the wrong theme during initialization.
7. Use accessible labels and controls.
8. Use the supported shadcn-svelte theme variables and Tailwind dark-mode configuration.

Use `mode-watcher` for theme management.

Theme preferences may be stored in browser storage. Authentication, sessions, roles, and authorization decisions must not depend on browser storage.

Reference: https://shadcn-svelte.com/docs/dark-mode/svelte

---

## 5. Authentication and User Roles

### 5.1 Application States

The application supports three states:

* **Anonymous:** No authenticated user.
* **User:** Authenticated regular account.
* **Admin:** Authenticated administrator account.

### 5.2 Permission Matrix

| Capability                              | Anonymous | User    | Admin   |
| --------------------------------------- | --------- | ------- | ------- |
| View landing page                       | Yes       | Yes     | Yes     |
| Register                                | Yes       | No need | No need |
| Log in / log out                        | Yes       | Yes     | Yes     |
| Access dashboard                        | No        | Yes     | Yes     |
| View user directory                     | No        | Yes     | Yes     |
| View user profiles                      | No        | Yes     | Yes     |
| Edit own profile                        | No        | Yes     | Yes     |
| Create accounts through admin interface | No        | No      | Yes     |
| Assign roles                            | No        | No      | Yes     |
| Activate/deactivate accounts            | No        | No      | Yes     |
| Edit another user's profile             | No        | No      | Yes     |
| Access admin dashboard                  | No        | No      | Yes     |
| Manage accounts                         | No        | No      | Yes     |

Public registration must always create a regular user. A regular user must not be able to assign themselves an administrator role or operate on another account without permission.

### 5.3 Seeded Accounts

Initialize two demonstration accounts:

| Email                | Password    | Role  |
| -------------------- | ----------- | ----- |
| `member@example.com` | `member123` | User  |
| `admin@example.com`  | `admin123`  | Admin |

These credentials are for local learning only.

Seed accounts must be initialized by the server-side data layer. Their passwords must be hashed using the same verification mechanism as registered accounts.

Additional users and administrators created through the application must become real entries in the same running data store.

### 5.4 Login

Route: `/login`

Provide:

* Email input.
* Password input.
* Submit button.
* Server-side validation.
* Inline validation feedback.
* A useful invalid-credentials message.
* A registration link.
* Pending and success/failure states.

Submit the form through a SvelteKit server action.

The server must verify credentials, reject inactive accounts, create a session on success, set the session cookie, and redirect the user to the dashboard.

Authenticated users should be redirected away from the login page where appropriate.

### 5.5 Registration

Route: `/register`

Collect:

* Display name.
* Email address.
* Password.
* Password confirmation.

Validate on the server:

* Required fields.
* Email format.
* Password minimum requirements.
* Password confirmation.
* Email uniqueness.

Normalize email addresses consistently by trimming whitespace and converting them to lowercase.

Public registration must not accept a role field that can grant privileges.

A successfully registered account must be able to log in immediately.

### 5.6 Sessions and Cookies

Use `hooks.server.js` to resolve the current session on incoming requests.

The authentication flow must:

1. Generate an unpredictable session identifier after successful login.
2. Associate the session with the authenticated user in a server-side store.
3. Set an appropriately configured session cookie.
4. Read the cookie in the server hook.
5. Look up the session and associated user.
6. Verify that the user still exists and is active.
7. Populate `event.locals.user` with safe authenticated-user information.
8. Treat invalid, expired, or revoked sessions as unauthenticated.

Use appropriate cookie options, including `HttpOnly`, `SameSite=Lax`, and `Secure` when appropriate for the environment.

Store passwords as salted password hashes using Node.js built-in cryptographic functionality. Keep password hashes, salts, and session records on the server.

### 5.7 Logout

Route: `/logout`

Implement logout as a POST operation.

The server must invalidate the session, clear the session cookie, and redirect the user to the login page.

After logout, the previous session must no longer grant access to protected pages or endpoints.

### 5.8 Authentication Limitations

Authentication is implemented for educational purposes. The in-memory session store is not production-ready.

Accounts and sessions reset when the development server restarts. Do not present the system as suitable for real users or production deployment.

---

## 6. Route Requirements

### 6.1 `/` — Landing Page

Public route.

Include:

* Product name and concise introduction.
* Overview of the portal's purpose.
* Clear login and registration calls to action.
* A dashboard link for authenticated users.

### 6.2 `/login` — Login Page

Implement the login action, server-side validation, session creation, and appropriate redirects.

### 6.3 `/register` — Registration Page

Implement validated public registration and clear success/failure feedback.

### 6.4 `/dashboard` — User Dashboard

Requires authentication.

For regular users, display:

* Personalized welcome message.
* Relevant account information.
* Links to the user directory and personal profile.

For administrators, display server-derived account summaries, including:

* Total accounts.
* Active accounts.
* Inactive accounts.
* Number of administrators.

Do not use invented static statistics.

### 6.5 `/profile` — Personal Profile

Requires authentication.

Allow users to view and edit their own display name and bio.

Validate changes on the server and provide feedback.

Users must not be able to change their own role, account status, or another user's profile through this form.

### 6.6 `/users` — User Directory

Requires authentication.

Display server-loaded user data and provide:

* Search by display name.
* User names and roles.
* Relevant account-status indicators.
* Links to individual profiles.
* Empty and error states where appropriate.

Do not expose password hashes, salts, session identifiers, or unnecessary private account data.

### 6.7 `/users/[id]` — User Profile

Requires authentication.

Use `+page.server.js` to retrieve the user specified by the dynamic route parameter.

Requirements:

* Return safe profile data.
* Display the selected user's profile.
* Return a proper 404 for an unknown user.
* Apply authorization before returning private information.
* Ensure navigation between profiles displays the correct record.

### 6.8 `/admin` — Administrative Dashboard

Requires the administrator role.

Display account summaries and an entry point to account management.

Enforce the role on the server regardless of whether the navigation item is visible.

### 6.9 `/admin/users` — Account Management

Requires the administrator role.

Provide:

* View all accounts.
* Search by name or email.
* Filter by role and status.
* Create accounts.
* Assign a role during account creation.
* Change an existing user's role.
* Activate and deactivate accounts.
* Review account details.

Account creation must collect a display name, email, initial password, and role.

All inputs must be validated on the server. Accounts created here must use the same store and authentication mechanism as all other accounts.

Use a confirmation dialog for deactivation and other consequential operations.

Prefer deactivation over permanent deletion. Inactive accounts must not be able to log in, and existing sessions must no longer grant access.

Prevent operations that would leave the system without an active administrator. The final active administrator must not be deactivated or demoted.

### 6.10 `/logout` — Logout Endpoint

Accept POST requests, invalidate the current session, clear the session cookie, and redirect appropriately.

### 6.11 `/debug-lab` — Debugging Laboratory

Provide the controlled debugging exercises defined in Section 12.

Intentional failures and test-only behavior must not be accessible in production.

---

## 7. User Data and Management

### 7.1 Shared Source of Truth

The user directory, individual profiles, login system, dashboards, and administrative interface must use the same server-side mock user store.

Do not maintain separate hardcoded user lists for different pages.

### 7.2 User Record

Each internal user record should contain:

| Field          | Purpose                                                                    |
| -------------- | -------------------------------------------------------------------------- |
| `id`           | Unique account identifier                                                  |
| `name`         | Display name                                                               |
| `email`        | Normalized, unique email                                                   |
| `passwordHash` | Stored password hash                                                       |
| `passwordSalt` | Salt used for password hashing, if required by the selected implementation |
| `role`         | `user` or `admin`                                                          |
| `status`       | Active or inactive                                                         |
| `bio`          | Profile biography                                                          |
| `createdAt`    | Account creation timestamp                                                 |

Additional fields may be added when required.

### 7.3 Server-Only Store

Create a server-only module, such as `src/lib/server/store.js`, responsible for user data operations.

Its API should cover responsibilities equivalent to:

* `getUsers()`
* `getUserById(id)`
* `getUserByEmail(email)`
* `createUser(input)`
* `updateUserProfile(id, input)`
* `updateUserRole(id, role)`
* `setUserStatus(id, status)`
* `verifyCredentials(email, password)`

The exact function names may differ.

Store mutations must preserve data consistency and enforce relevant invariants.

### 7.4 Safe Data Exposure

Create safe user representations for use by pages and components.

Never return password hashes, salts, session identifiers, or other server-only values to the browser.

Only return fields required by the current page and permitted for the requester.

### 7.5 Account Creation

An account created by an administrator must:

* Appear in the user directory.
* Be available on its profile route.
* Work with the login flow.
* Receive permissions associated with its assigned role.
* Be reflected in server-derived dashboard statistics.

### 7.6 Account Deactivation

After deactivation:

* The account is marked inactive.
* New login attempts fail.
* Existing sessions stop granting access.
* The account remains visible in administrative management.
* An administrator can reactivate the account.

### 7.7 Role Changes

Authorization must use the current trusted server-side role.

Changes to a user's role must affect subsequent requests and page loads. Do not rely on a role value supplied by the browser or cached indefinitely in client state.

---

## 8. Server-Side Data Loading and Invalidation

### 8.1 Data Loading

Use `+page.server.js` to retrieve user data for `/users` and `/users/[id]`.

For a dynamic user profile:

1. Read `params.id`.
2. Retrieve the matching record from the server-side store.
3. Return safe profile data.
4. Return a 404 when the record does not exist.
5. Expose the returned data to the Svelte page through its `data` prop.

Do not hardcode the selected user inside the component.

### 8.2 Navigation

Verify that navigating between different user profiles displays the correct record.

Ensure relevant load functions rerun when their route parameters or declared dependencies change.

### 8.3 Invalidation

Declare a custom dependency such as `app:users` in load functions that depend on the shared user collection.

After a successful account creation, role change, activation, deactivation, or relevant profile update, invalidate the corresponding dependency using SvelteKit's invalidation mechanism.

For example:

`invalidate('app:users')`

The affected directory, profile, dashboard, and administration views must refresh when their data depends on the invalidated resource.

Do not invalidate unrelated data unnecessarily.

---

## 9. Form Actions and HTTP Endpoints

### 9.1 Form Actions

Use SvelteKit form actions for page-based operations, including:

* Login.
* Registration.
* Profile editing.
* Administrative account creation.
* Other suitable page forms.

Forms must:

* Use appropriate HTTP methods.
* Validate input on the server.
* Return meaningful validation failures.
* Preserve appropriate form values and feedback.
* Prevent malformed or duplicate records.
* Display pending states when appropriate.
* Show success only after server confirmation.
* Remain functional without making client-side code the sole authority for business rules.

Use `use:enhance` where appropriate.

### 9.2 HTTP Endpoints

Use `+server.js` for HTTP APIs where appropriate, including:

* Account-status updates.
* Debugging endpoints.
* Other operations that benefit from an explicit HTTP interface.

Endpoints must enforce authentication and authorization on the server.

Use predictable response bodies and appropriate HTTP statuses.

| Status                      | Intended use                                     |
| --------------------------- | ------------------------------------------------ |
| `400 Bad Request`           | Malformed or invalid request                     |
| `401 Unauthorized`          | Missing or invalid authentication                |
| `403 Forbidden`             | Authenticated requester lacks permission         |
| `404 Not Found`             | Resource does not exist                          |
| `409 Conflict`              | Conflicting operation, such as a duplicate email |
| `500 Internal Server Error` | Unexpected server failure                        |

Protected browser pages may redirect anonymous visitors to login. API endpoints should generally return appropriate HTTP errors rather than HTML login pages.

---

## 10. Project Structure

Use the following structure as an architectural guide. Additional files may be introduced when necessary.

```text
src/
├── app.css
├── hooks.server.js
├── lib/
│   ├── server/
│   │   ├── store.js
│   │   └── auth.js
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button/
│   │   │   ├── card/
│   │   │   ├── input/
│   │   │   ├── table/
│   │   │   └── ...
│   │   ├── app-sidebar.svelte
│   │   ├── app-header.svelte
│   │   ├── theme-toggle.svelte
│   │   ├── user-table.svelte
│   │   └── confirm-action-dialog.svelte
│   └── utils.js
└── routes/
    ├── +layout.server.js
    ├── +layout.svelte
    ├── +page.svelte
    ├── login/
    │   ├── +page.svelte
    │   └── +page.server.js
    ├── register/
    │   ├── +page.svelte
    │   └── +page.server.js
    ├── logout/
    │   └── +server.js
    ├── dashboard/
    │   ├── +page.svelte
    │   └── +page.server.js
    ├── profile/
    │   ├── +page.svelte
    │   └── +page.server.js
    ├── users/
    │   ├── +page.svelte
    │   ├── +page.server.js
    │   └── [id]/
    │       ├── +page.svelte
    │       └── +page.server.js
    ├── admin/
    │   ├── +page.svelte
    │   ├── +page.server.js
    │   └── users/
    │       ├── +page.svelte
    │       └── +page.server.js
    ├── api/
    │   ├── users/
    │   │   └── [id]/
    │   │       └── status/
    │   │           └── +server.js
    │   └── debug/
    │       ├── echo/
    │       │   └── +server.js
    │       ├── session/
    │       │   └── +server.js
    │       ├── users/
    │       │   └── [id]/
    │       │       └── +server.js
    │       └── trigger-error/
    │           └── +server.js
    └── debug-lab/
        └── +page.svelte
```

The `ui` directory is populated by the shadcn-svelte CLI.

Keep server-only modules separate from browser-facing components. Avoid concentrating all application logic in one large page component.

---

## 11. Authorization and Security Requirements

The following rules are mandatory:

1. Authentication must be resolved using trusted server-side session state.
2. Authorization must be checked for every protected server operation.
3. Hiding a navigation item does not protect its route.
4. Public registration must not allow role assignment.
5. Passwords must never be stored or returned as plaintext.
6. Session identifiers must be unpredictable and kept out of client-readable storage.
7. Password hashes, salts, and session records must never be returned to components.
8. Inactive accounts must not be able to authenticate or use existing sessions.
9. Users may edit only their own profiles unless an administrator performs the operation.
10. Account management and role assignment require administrator authorization.
11. The final active administrator must not be demoted or deactivated.
12. Server-side validation must be applied even when client-side validation exists.
13. API endpoints must enforce permissions independently of page-level navigation.
14. Intentional debugging failures must be restricted to local development.
15. Never trust a role, user ID, or authorization claim merely because it appears in submitted form data.

This implementation is an educational demonstration, not a production authentication system.

---

## 12. Debugging Laboratory

### Objective

Create a dedicated development page that allows controlled failures to be triggered, observed, and investigated without breaking normal application behavior.

The page should identify the test scenario, allow the request to be executed, and display useful request/response information.

### Scenario A: JSON Property Mismatch

**Endpoint:** `POST /api/debug/echo`

The server expects a JSON object containing `email`, while the client deliberately submits `username`.

Requirements:

* Trigger the incorrect request.
* Inspect the request payload.
* Display the response status and body.
* Identify the contract mismatch.
* Correct the request or validation logic.

### Scenario B: API 404

**Endpoint:** `GET /api/debug/users/[id]`

Request a user ID that does not exist.

Requirements:

* Inspect the request URL.
* Display the HTTP status and response body.
* Determine whether the URL is incorrect or the requested resource is absent.
* Distinguish routing errors from missing data.

### Scenario C: Controlled Server Error

**Endpoint:** `GET /api/debug/trigger-error`

Trigger a deliberate server-side failure.

Requirements:

* Observe the HTTP response.
* Inspect the development server terminal.
* Identify the cause.
* Ensure the intentional failure cannot be triggered in production.

### Scenario D: Session Cookie Omitted

**Endpoint:** `GET /api/debug/session`

Call the endpoint normally and with a browser request configured using `credentials: 'omit'`.

Requirements:

* Compare the requests.
* Determine whether the session cookie was sent.
* Inspect the server's session-resolution result.
* Display the response for each request.

### Debugging Information

For every scenario, make it possible to inspect:

* Request URL and method.
* Request headers and cookies where accessible.
* Request payload.
* Response status.
* Response body.
* Relevant server terminal logs.

Do not solve these scenarios by changing the UI alone. Identify the responsible part of the request lifecycle.

---

## 13. Constraints and Exclusions

Do not introduce these features in this project:

* A database or ORM.
* OAuth or an external authentication provider.
* Email verification.
* Email-based password reset.
* Production account recovery.
* A production deployment pipeline.
* A complex permission framework.
* An unnecessarily large custom design system.
* Additional component libraries without a clear need.

Small usability improvements are allowed when they reinforce the defined requirements.

The in-memory store is intentionally temporary. Do not assume persistence across server restarts or reliability across multiple server instances.

---

## 14. Expected Deliverable

The completed application should provide:

* A polished, responsive user portal.
* Working login and registration.
* Functional seeded and newly created accounts.
* Correct session creation and logout.
* Server-enforced role-based access control.
* Working profile management.
* A user directory with search.
* Dynamic user profile routes.
* An administrator dashboard with real mock-store statistics.
* Functional account creation, role changes, activation, and deactivation.
* Correct handling of inactive accounts and existing sessions.
* Application-wide light and dark themes.
* Server-side form validation.
* Appropriate API responses.
* Server-driven data loading and invalidation.
* A controlled debugging laboratory.
* Consistent loading, empty, error, and success states.
* Clear separation between UI components, authentication, authorization, and data access.

The implementation should be understandable enough to extend with a database and a more complete authentication system in a later project.

---

## 15. Official References

* SvelteKit: https://svelte.dev/docs/kit
* SvelteKit loading data: https://svelte.dev/docs/kit/load
* SvelteKit form actions: https://svelte.dev/docs/kit/form-actions
* SvelteKit authentication: https://svelte.dev/docs/kit/auth
* SvelteKit hooks: https://svelte.dev/docs/kit/hooks
* shadcn-svelte: https://shadcn-svelte.com/docs
* shadcn-svelte JavaScript configuration: https://shadcn-svelte.com/docs/javascript
* shadcn-svelte SvelteKit installation: https://shadcn-svelte.com/docs/installation/sveltekit
* shadcn-svelte dark mode: https://shadcn-svelte.com/docs/dark-mode/svelte
* Tailwind CSS: https://tailwindcss.com/docs
