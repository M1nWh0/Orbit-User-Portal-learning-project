import {
	createSession,
	resolveSession,
	destroySession,
	requireUser,
	requireAdmin,
	SESSION_COOKIE_NAME
} from '../src/lib/server/auth.js';
import {
	getUserByEmail,
	setUserStatus,
	resetStore
} from '../src/lib/server/store.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
	if (!condition) {
		console.error(`❌ FAIL: ${message}`);
		failed++;
		throw new Error(message);
	} else {
		console.log(`✅ PASS: ${message}`);
		passed++;
	}
}

/**
 * Creates a mock SvelteKit cookies object.
 */
function createMockCookies(initialCookies = {}) {
	const jar = new Map(Object.entries(initialCookies));
	const operations = [];

	return {
		get(name) {
			return jar.get(name);
		},
		set(name, value, opts) {
			jar.set(name, value);
			operations.push({ action: 'set', name, value, opts });
		},
		delete(name, opts) {
			jar.delete(name);
			operations.push({ action: 'delete', name, opts });
		},
		_jar: jar,
		_operations: operations
	};
}

async function runTests() {
	console.log('--- STARTING PHASE 3 AUTH & SESSION LIFECYCLE TESTS ---');

	// Reset store to pristine state
	await resetStore();
	const member = getUserByEmail('member@example.com');
	const admin = getUserByEmail('admin@example.com');

	// 1. Session Creation & Cookie Setting
	const cookies1 = createMockCookies();
	const session1 = createSession(member.id, cookies1);

	assert(session1 !== null, 'createSession returns a session record');
	assert(typeof session1.sessionId === 'string', 'Session ID is a valid string');
	assert(cookies1.get(SESSION_COOKIE_NAME) === session1.sessionId, 'Session cookie is set in cookies jar');

	const setOp = cookies1._operations.find((op) => op.action === 'set' && op.name === SESSION_COOKIE_NAME);
	assert(setOp !== undefined, 'Cookie set operation was recorded');
	assert(setOp.opts.httpOnly === true, 'Session cookie is HttpOnly');
	assert(setOp.opts.sameSite === 'lax', 'Session cookie has SameSite=lax');
	assert(setOp.opts.path === '/', 'Session cookie has Path=/');

	// 2. Session Resolution for Active User
	const resolvedUser = resolveSession(cookies1);
	assert(resolvedUser !== null, 'resolveSession returns authenticated user');
	assert(resolvedUser.email === 'member@example.com', 'Resolved user matches expected member');
	assert(resolvedUser.passwordHash === undefined, 'Resolved user is a safe user projection');

	// 3. Session Resolution with Empty Cookie
	const emptyCookies = createMockCookies();
	const noUser = resolveSession(emptyCookies);
	assert(noUser === null, 'resolveSession returns null when cookie is missing');

	// 4. Session Resolution with Invalid Cookie ID
	const invalidCookies = createMockCookies({ [SESSION_COOKIE_NAME]: 'fake_session_12345' });
	const invalidUser = resolveSession(invalidCookies);
	assert(invalidUser === null, 'resolveSession returns null for nonexistent session');
	assert(!invalidCookies._jar.has(SESSION_COOKIE_NAME), 'Invalid session cookie is automatically purged');

	// 5. Session Invalidation on User Deactivation
	const cookies2 = createMockCookies();
	createSession(member.id, cookies2);
	assert(resolveSession(cookies2) !== null, 'Session valid before deactivation');

	// Deactivate user
	setUserStatus(member.id, 'inactive');
	const userAfterDeactivation = resolveSession(cookies2);
	assert(userAfterDeactivation === null, 'Session rejected immediately after user deactivation');
	assert(!cookies2._jar.has(SESSION_COOKIE_NAME), 'Deactivated user session cookie was purged');

	// Reactivate member for subsequent tests
	setUserStatus(member.id, 'active');

	// 6. Explicit Logout (destroySession)
	const cookies3 = createMockCookies();
	const session3 = createSession(member.id, cookies3);
	assert(resolveSession(cookies3) !== null, 'Session is valid before logout');

	destroySession(cookies3);
	assert(!cookies3._jar.has(SESSION_COOKIE_NAME), 'Cookie deleted after destroySession');
	assert(resolveSession(cookies3) === null, 'resolveSession returns null after destroySession');

	// 7. Authorization Helper: requireUser
	const authenticatedLocals = { user: resolvedUser };
	const unauthenticatedLocals = { user: null };

	const userResult = requireUser(authenticatedLocals);
	assert(userResult.email === 'member@example.com', 'requireUser succeeds for authenticated locals');

	let requireUserThrew = false;
	try {
		requireUser(unauthenticatedLocals);
	} catch (err) {
		requireUserThrew = true;
		assert(err.status === 303, 'requireUser redirects with HTTP 303');
		assert(err.location === '/login', 'requireUser redirects to /login');
	}
	assert(requireUserThrew, 'requireUser threw redirect for unauthenticated locals');

	// 8. Authorization Helper: requireAdmin
	const adminLocals = { user: { ...admin, role: 'admin' } };
	const regularUserLocals = { user: { ...member, role: 'user' } };

	const adminResult = requireAdmin(adminLocals);
	assert(adminResult.email === 'admin@example.com', 'requireAdmin succeeds for admin user');

	let requireAdminThrew403 = false;
	try {
		requireAdmin(regularUserLocals);
	} catch (err) {
		requireAdminThrew403 = true;
		assert(err.status === 403, 'requireAdmin throws HTTP 403 for non-admin');
	}
	assert(requireAdminThrew403, 'requireAdmin blocked regular user with 403');

	let requireAdminThrewUnauth = false;
	try {
		requireAdmin(unauthenticatedLocals);
	} catch (err) {
		requireAdminThrewUnauth = true;
		assert(err.status === 303, 'requireAdmin redirects unauthenticated visitor to /login');
	}
	assert(requireAdminThrewUnauth, 'requireAdmin redirected unauthenticated visitor');

	// Clean up store
	await resetStore();
	console.log(`\n🎉 ALL PHASE 3 TESTS PASSED! (${passed} checks passed, ${failed} failed)`);
}

runTests().catch((err) => {
	console.error('Fatal test runner error:', err);
	process.exit(1);
});
