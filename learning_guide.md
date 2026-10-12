# Orbit User Portal — Learning & Concepts Guide

## 1. Purpose of This Guide

Orbit User Portal is more than a UI exercise. It brings together frontend development, server-side application logic, authentication, authorization, data management, and HTTP communication.

The project specification tells you what to build. This guide explains the concepts behind those requirements.

You do not need to memorize every API or component. You should understand the responsibility of each part, how data moves through the application, and why security-sensitive operations belong on the server.

---

## 2. Understanding the Technology Stack

### 2.1 Svelte 5

Svelte is the component framework used to build the interface.

It is responsible for:

* Defining reusable components.
* Displaying data.
* Managing reactive UI state.
* Responding to user interactions.
* Handling form input.
* Updating the interface when relevant state changes.

For example, the user directory might contain a search input, a filter control, and a table. Svelte manages the interactive relationship between those elements and the displayed results.

### 2.2 SvelteKit

SvelteKit builds on Svelte and provides the application framework.

It is responsible for:

* File-based routing.
* Shared layouts.
* Server-side data loading.
* Form actions.
* HTTP endpoints.
* Request handling.
* Cookies and redirects.
* Server hooks.
* Error handling.
* Server-side access control.

A Svelte component can render a user profile, but SvelteKit determines how the profile URL is resolved and how its data is loaded.

### 2.3 JavaScript

JavaScript is the language used for all application logic.

In this project, JavaScript is used in both browser-facing components and server-side modules.

The important distinction is not the language itself, but **where the code executes**.

* Browser-side JavaScript handles interface interactions.
* Server-side JavaScript handles trusted data access, authentication, authorization, and request processing.

A `.js` file can contain server-side code. The file's location and how it is imported determine its role, not the extension alone.

### 2.4 Tailwind CSS

Tailwind CSS is a utility-first CSS framework.

Instead of creating a separate CSS class for every small styling decision, you compose utilities directly in markup.

For example:

```svelte
<div class="rounded-xl border p-6 shadow-sm">
    <h2 class="text-lg font-semibold">Account Overview</h2>
</div>
```

The classes describe the element's appearance:

* `rounded-xl`: rounded corners.
* `border`: border.
* `p-6`: padding.
* `shadow-sm`: subtle shadow.
* `text-lg`: larger text.
* `font-semibold`: stronger font weight.

Tailwind also provides responsive and state variants, allowing layouts to adapt to screen size, hover, focus, and other conditions.

**What Tailwind solves:** It makes styling consistent and composable without requiring a large collection of custom CSS rules.

It does not provide your application's business logic or complete UI component behavior.

### 2.5 What Is shadcn-svelte?

shadcn-svelte provides reusable Svelte UI components following the shadcn/ui approach.

Unlike a traditional component library that you consume entirely from an external package, its CLI adds component source code to your project.

For example, you can generate a button component and then use it in your own Svelte files:

```svelte
<script>
    import { Button } from '$lib/components/ui/button';
</script>

<Button>Save changes</Button>
```

The exact generated component API depends on the selected version and configuration.

The generated source remains in your project, so you can inspect and customize it.

A dialog component, for example, can provide much of the structure and interaction required for a confirmation dialog without forcing you to implement everything from scratch.

**What shadcn-svelte solves:** It provides reusable, accessible UI building blocks while leaving their source code under your control.

It is not a replacement for Svelte, SvelteKit, or Tailwind CSS.

### 2.6 How the Technologies Fit Together

| Technology                 | Main responsibility                                            |
| -------------------------- | -------------------------------------------------------------- |
| Svelte                     | Components and reactive interface behavior                     |
| SvelteKit                  | Routes, server-side rendering, loading, actions, and endpoints |
| JavaScript                 | Application logic on the client and server                     |
| Tailwind CSS               | Styling and responsive layouts                                 |
| shadcn-svelte              | Reusable UI component source code                              |
| mode-watcher               | Theme preference and switching                                 |
| Node.js cryptographic APIs | Password hashing and secure random values                      |

A single feature may use several of these technologies.

For example, an account deactivation operation might use a shadcn-svelte dialog, Svelte state, a SvelteKit form action or endpoint, server-side authorization, and the shared user store.

Each tool has a distinct responsibility.

---

## 3. Client-Side and Server-Side Responsibilities

One of the most important concepts in this project is the separation between the browser and the server.

### Client-side responsibilities

The browser should handle presentation and interaction:

* Opening a confirmation dialog.
* Updating a search input.
* Displaying validation feedback returned by the server.
* Showing pending states.
* Switching the visual theme.
* Rendering user data supplied by the application.

### Server-side responsibilities

The server should handle trusted operations:

* Reading and modifying account records.
* Verifying passwords.
* Resolving sessions.
* Checking roles and permissions.
* Validating submitted data.
* Deciding whether an operation is permitted.
* Returning safe data to the browser.

### Why the distinction matters

The browser is controlled by the user. Someone can modify JavaScript, manipulate form fields, issue requests manually, or bypass your interface.

Therefore, this is not sufficient:

```js
if (user.role === 'admin') {
    showAdminButton = true;
}
```

Even if the interface hides the button from regular users, a user could still attempt to invoke the corresponding endpoint.

The server must independently verify the requester's permissions before performing the operation.

**Principle:** The browser requests an operation. The server decides whether it is allowed.

---

## 4. shadcn-svelte and Tailwind Configuration

### JavaScript configuration

shadcn-svelte supports JavaScript projects. Its configuration should use:

```json
{
  "typescript": false
}
```

This setting belongs in the relevant `components.json` configuration, alongside the other fields generated during setup.

Use the official JavaScript installation guidance rather than copying TypeScript examples without adapting them.

### Component customization

Because generated components are part of your source code, you can:

* Reuse them across pages.
* Change their appearance.
* Adapt their behavior.
* Compose them into application-specific components.

However, do not create a new abstraction for every small element. A reusable component is most valuable when it centralizes meaningful behavior, visual consistency, or repeated structure.

### Theme-aware styling

Prefer semantic theme tokens such as:

* Background.
* Foreground.
* Card.
* Border.
* Primary.
* Muted.

These tokens allow components to follow the active theme without independently hardcoding every color.

References:

* https://shadcn-svelte.com/docs
* https://shadcn-svelte.com/docs/javascript
* https://shadcn-svelte.com/docs/dark-mode/svelte
* https://tailwindcss.com/docs

---

## 5. Routing, Layouts, and Dynamic Routes

SvelteKit uses the filesystem to define application routes.

For example:

```text
src/routes/
├── +page.svelte
├── login/
│   └── +page.svelte
└── users/
    ├── +page.svelte
    └── [id]/
        └── +page.svelte
```

This produces routes such as:

* `/`
* `/login`
* `/users`
* `/users/123`

The `[id]` directory represents a dynamic route parameter.

### Layouts

A layout provides shared structure for multiple pages.

For example, an application layout can contain the sidebar and top bar while individual pages supply their own content.

This avoids duplicating the same navigation and page shell in every route.

Layouts can also participate in data loading. A server layout can supply the current user's safe information to the application shell.

### Dynamic routes

A route such as `/users/[id]` represents many possible pages.

The route parameter identifies the requested record. The server retrieves that record and supplies it to the page.

The component should render the selected user rather than contain a separate hardcoded implementation for each user.

Reference: https://svelte.dev/docs/kit/routing

---

## 6. Server-Side Data Loading

SvelteKit load functions retrieve data needed to render pages.

For server-controlled data, `+page.server.js` is especially useful because the load function executes on the server.

A simplified example:

```js
// src/routes/users/[id]/+page.server.js
import { error } from '@sveltejs/kit';
import { getPublicUserById } from '$lib/server/store.js';

export function load({ params }) {
    const user = getPublicUserById(params.id);

    if (!user) {
        error(404, 'User not found');
    }

    return { user };
}
```

This example assumes that `getPublicUserById` is implemented in the server-only store.

The corresponding page receives the result through its `data` prop.

```svelte
<script>
    let { data } = $props();
</script>

<h1>{data.user.name}</h1>
<p>{data.user.bio}</p>
```

### What this teaches

* Route parameters identify resources.
* The server retrieves the requested data.
* The page receives data through SvelteKit's loading mechanism.
* Missing resources should produce appropriate HTTP errors.
* Data-access logic does not need to live inside the component.

A production implementation must also enforce the correct access policy before returning any private fields.

Reference: https://svelte.dev/docs/kit/load

---

## 7. Form Actions Versus HTTP Endpoints

Both mechanisms allow the browser to communicate with the server, but they serve different purposes.

### Form actions

SvelteKit form actions are designed for form submissions associated with a page.

Examples include:

* Logging in.
* Registering.
* Updating a profile.
* Creating an account.

They work naturally with HTML forms and SvelteKit's form handling.

A simplified structure:

```js
// src/routes/profile/+page.server.js
import { fail } from '@sveltejs/kit';

export const actions = {
    default: async ({ request, locals }) => {
        const formData = await request.formData();
        const name = String(formData.get('name') ?? '').trim();

        if (!name) {
            return fail(400, {
                message: 'Name is required'
            });
        }

        // Verify authorization and update the profile.
        // Return appropriate feedback.
    }
};
```

This is an illustrative structure, not a complete production-ready action. The actual implementation must perform the update through the server-side store and enforce authorization.

### HTTP endpoints

A `+server.js` file defines an HTTP endpoint.

For example:

```js
// src/routes/api/example/+server.js
export function GET() {
    return Response.json({
        message: 'Hello from the server'
    });
}
```

This endpoint responds to a GET request with JSON.

Endpoints are useful when you want an explicit HTTP interface, such as an account-status API or a debugging endpoint.

### How to choose

| Requirement                             | Appropriate mechanism |
| --------------------------------------- | --------------------- |
| Login form                              | Form action           |
| Registration form                       | Form action           |
| Profile-editing form                    | Form action           |
| Explicit JSON API                       | HTTP endpoint         |
| API request that updates account status | HTTP endpoint         |
| Controlled debugging request            | HTTP endpoint         |

This is a practical guideline rather than an absolute rule. SvelteKit supports multiple valid ways to implement server interactions.

### Progressive enhancement

`use:enhance` can improve the experience of SvelteKit form submissions by allowing them to be handled without a full-page navigation.

It does not replace server validation. The server remains responsible for the actual operation.

Reference: https://svelte.dev/docs/kit/form-actions

---

## 8. Authentication, Sessions, and Cookies

### Authentication

Authentication answers:

**Who is making this request?**

In this project, a user proves their identity by submitting an email address and password.

The server verifies the credentials and establishes a session if they are valid.

### Authorization

Authorization answers:

**What is this authenticated user allowed to do?**

A regular user might be allowed to update their own biography but not change another user's role.

An administrator has additional permissions, but those permissions must still be checked by the server.

Authentication and authorization are related, but they solve different problems.

### Session-based authentication

After login, the server creates a session and sends the browser a session identifier in a cookie.

Conceptually:

1. The user submits credentials.
2. The server verifies the password.
3. The server creates a session.
4. The browser receives a session cookie.
5. The browser sends the cookie with applicable future requests.
6. The server resolves the session and identifies the user.

The browser does not need to receive the password hash or the server's session records.

### Cookies

Cookies allow a browser to send small pieces of data with matching HTTP requests.

Important options include:

* `HttpOnly`: prevents ordinary browser JavaScript from reading the cookie.
* `SameSite`: helps control when the browser sends the cookie in cross-site situations.
* `Secure`: restricts cookie transmission to HTTPS.

Use `Secure` appropriately for the environment. Local development and HTTPS deployments may require different configurations.

These options contribute to security but do not independently make an authentication system secure.

### Password storage

Passwords should not be stored in plaintext.

The server should store a password hash generated using an appropriate password-hashing method, with a unique salt where required by the chosen algorithm.

For this learning project, use suitable Node.js built-in cryptographic functionality.

At login, the server verifies the submitted password against the stored hash.

A normal fast hash such as a plain SHA-256 digest is not a suitable password-storage strategy by itself.

### Why use `hooks.server.js`?

A server hook runs as part of request handling. It can resolve the session and populate `event.locals` with the current authenticated user.

This centralizes session resolution rather than requiring every route to interpret the session cookie independently.

However, the hook does not automatically protect every operation. Protected routes, actions, and endpoints must still enforce their relevant permissions.

References:

* https://svelte.dev/docs/kit/auth
* https://svelte.dev/docs/kit/hooks

---

## 9. Role-Based Access Control

Role-based access control, or RBAC, assigns permissions according to a user's role.

Orbit has two authenticated roles:

* `user`
* `admin`

A role can determine whether a person may manage other accounts, assign roles, or access the administration area.

### Centralized authorization

Reusable server-side helpers can express common requirements:

* `requireUser`: the requester must be authenticated.
* `requireAdmin`: the requester must have the administrator role.
* Resource-specific checks: the requester must own the resource or have explicit administrative permission.

Centralized helpers reduce inconsistent permission checks across routes.

### Why submitted roles cannot be trusted

Suppose a registration form contains:

```html
<input name="role" value="admin">
```

A user could manipulate the request and submit that value even if the UI never displays the field.

Public registration must therefore assign the `user` role on the server, independently of submitted data.

Similarly, an administrator operation must verify the current administrator's permissions before changing another account's role.

### Account deactivation

Deactivation illustrates why authentication and authorization depend on current server state.

If an account becomes inactive, the system must reject new logins and stop existing sessions from granting access.

Checking the account's status only during login is insufficient because a previously issued session could otherwise remain usable.

### The final administrator

The application must prevent the last active administrator from being demoted or deactivated.

This is an application invariant: a rule that must remain true after every permitted operation.

It should be checked by the server-side operation that changes the role or account status, not only by disabling a button.

---

## 10. The In-Memory Data Store

The mock store is the application's single source of truth for accounts.

It holds the data used by login, registration, profiles, the directory, and administration.

### Why centralize data access?

Without a shared store, different pages might maintain independent lists of users. An administrator could create an account that appears in one table but cannot log in because the authentication system uses a different list.

A single store prevents this kind of inconsistency.

### Separate internal and public records

An internal record may contain:

```js
{
    id: 'example-id',
    name: 'Example User',
    email: 'member@example.com',
    passwordHash: 'server-only-value',
    passwordSalt: 'server-only-value',
    role: 'user',
    status: 'active',
    bio: '',
    createdAt: '2026-10-12T00:00:00.000Z'
}
```

This is an illustrative record, not an actual account or password hash.

The server should create a separate safe representation before returning data to a page.

```js
function toPublicUser(user) {
    return {
        id: user.id,
        name: user.name,
        role: user.role,
        status: user.status,
        bio: user.bio,
        createdAt: user.createdAt
    };
}
```

The exact fields depend on what the recipient is permitted to see.

### Why in-memory storage is limited

An in-memory store is useful for learning because it removes database setup from the project.

However:

* Data disappears when the server process restarts.
* It does not provide durable persistence.
* Multiple server instances do not automatically share the same records.
* It does not provide database transactions or database-level constraints.

The store should therefore be isolated behind functions. Later, those functions can be reimplemented using a database without requiring every page to understand database queries.

---

## 11. Data Invalidation and Freshness

A page may display data that was correct when it loaded but has become outdated after a mutation.

For example:

1. An administrator opens the user directory.
2. The administrator deactivates an account.
3. The store updates the account's status.
4. Another part of the interface still displays the previous status.

This is a data-freshness problem.

### SvelteKit dependencies

A load function can declare a dependency using `depends('app:users')`.

When a successful operation changes the user collection, the application can call:

```js
invalidate('app:users');
```

SvelteKit can then rerun the load functions that declared the matching dependency.

### Important distinction

Updating the server-side store and refreshing the displayed data are separate operations.

* **Mutation:** changes the underlying data.
* **Invalidation:** tells SvelteKit that dependent loaded data may be stale.
* **Reloading the relevant data:** obtains the updated state for the interface.

Invalidation is not a database transaction and does not itself change the underlying records.

Reference: https://svelte.dev/docs/kit/load

---

## 12. HTTP Status Codes and API Contracts

An API contract defines what a request must contain and what a response means.

For example, an endpoint may expect:

```json
{
    "email": "member@example.com"
}
```

If the client submits:

```json
{
    "username": "member@example.com"
}
```

the request does not match the expected contract.

Even if the values appear equivalent to a human, the property names are different.

The server must validate the received data rather than silently assuming that the expected field exists.

### Common HTTP statuses

| Status                      | Meaning in this project                      |
| --------------------------- | -------------------------------------------- |
| `200 OK`                    | Request succeeded                            |
| `201 Created`               | A resource was created                       |
| `400 Bad Request`           | The request is malformed or invalid          |
| `401 Unauthorized`          | Authentication is missing or invalid         |
| `403 Forbidden`             | The authenticated requester lacks permission |
| `404 Not Found`             | The resource does not exist                  |
| `409 Conflict`              | The request conflicts with existing state    |
| `500 Internal Server Error` | An unexpected server failure occurred        |

These are typical uses, not a rule that every endpoint must use all of them.

### `401` versus `403`

The distinction is important:

* `401`: the request does not have valid authentication.
* `403`: the requester is authenticated but lacks permission.

For example, an anonymous API request to an administrator endpoint may receive `401`. A logged-in regular user attempting the same operation may receive `403`.

### Browser pages versus APIs

A protected browser page may redirect an anonymous visitor to `/login`.

A JSON API should generally return an appropriate HTTP error instead of returning the HTML login page where the client expects JSON.

Reference: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status

---

## 13. Debugging as a Request-Lifecycle Investigation

The debugging laboratory is designed to teach you to locate the source of a failure instead of guessing at a fix.

A browser request usually passes through several relevant stages:

1. The client constructs the request.
2. The browser sends the URL, method, headers, cookies, and body.
3. SvelteKit resolves the route.
4. Server-side code validates the request.
5. Authentication and authorization are checked where required.
6. The application performs the requested operation.
7. The server returns a response.
8. The browser interprets the response and updates the interface.

A failure can occur at any of these stages.

### Scenario A: Incorrect JSON property

Investigate the request payload and the server's expected schema.

Do not assume the server is broken merely because the request failed.

### Scenario B: `404 Not Found`

Inspect the URL, route matching, dynamic parameter, and requested record.

A `404` may indicate a nonexistent resource or an incorrect route. The response and server behavior help distinguish them.

### Scenario C: `500 Internal Server Error`

Inspect the development server's terminal output and identify the underlying exception.

A `500` indicates an unexpected server failure; it does not, by itself, reveal the cause.

### Scenario D: Missing session cookie

Compare the requests and inspect their credentials configuration and cookie headers.

If a cookie is not sent, the server may be unable to resolve the session. This is different from a server receiving a valid session cookie but failing to find its corresponding session.

### Tools

Use:

* Browser Console for client-side errors.
* Network tab for requests and responses.
* Request headers and payload for input inspection.
* Response status and body for server feedback.
* Development server terminal logs for server-side failures.

The goal is to identify the failing layer before changing the code.

---

## 14. Security and Scope Limitations

Orbit simulates a real application, but it does not provide production-grade infrastructure.

The following remain outside the project's scope:

* Durable database storage.
* External authentication.
* Email verification.
* Password-reset delivery.
* Production account recovery.
* Production deployment and operational monitoring.

Session handling, password hashing, authorization, and validation are still important because the project is intended to teach correct responsibilities and boundaries.

However, implementing those mechanisms does not automatically make the complete application production-ready.

Before a real deployment, additional work would be required around persistent storage, session lifecycle, abuse prevention, CSRF protection, operational configuration, logging, deployment security, and other production concerns.

The exact requirements depend on the deployment environment and threat model.

---

## 15. What This Project Is Intended to Teach

The central learning outcomes are:

1. **Application architecture:** dividing UI, routing, authentication, authorization, and data access into coherent responsibilities.
2. **Server-driven rendering:** retrieving the correct data through SvelteKit load functions.
3. **Form processing:** validating submitted data and returning meaningful results.
4. **Authentication:** verifying credentials and maintaining sessions.
5. **Authorization:** enforcing permissions on the server.
6. **Data modeling:** maintaining consistent user records and protecting internal fields.
7. **CRUD operations:** creating and updating accounts, modifying profiles, changing roles, and changing account status.
8. **HTTP communication:** understanding methods, payloads, status codes, and API contracts.
9. **Data freshness:** using invalidation to refresh affected views.
10. **UI architecture:** composing reusable components with Svelte and shadcn-svelte.
11. **Styling systems:** using Tailwind CSS and theme-aware design tokens.
12. **Debugging:** tracing failures through the browser-server request lifecycle.

The objective is not to memorize every syntax detail. It is to understand why each part exists, where it belongs, and how to determine what went wrong when the parts do not work together.
