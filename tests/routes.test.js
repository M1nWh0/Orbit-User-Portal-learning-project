import { actions as loginActions, load as loginLoad } from '../src/routes/login/+page.server.js';
import { actions as registerActions, load as registerLoad } from '../src/routes/register/+page.server.js';
import { POST as logoutPost, GET as logoutGet } from '../src/routes/logout/+server.js';
import { resetStore, getUserByEmail, setUserStatus } from '../src/lib/server/store.js';
import { SESSION_COOKIE_NAME, resolveSession } from '../src/lib/server/auth.js';

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

function createMockRequest(bodyFields = {}) {
	const formData = new FormData();
	for (const [key, value] of Object.entries(bodyFields)) {
		if (value !== undefined && value !== null) {
			formData.append(key, value);
		}
	}
	return {
		formData: async () => formData
	};
}

async function runTests() {
	console.log('--- STARTING PHASE 5 PUBLIC ROUTES & AUTH ACTIONS TESTS ---');

	// Reset store
	await resetStore();

	// ==========================================
	// 1. LOGIN PAGE LOAD & ACTIONS
	// ==========================================
	console.log('\n[1] Testing Login Route');

	// 1.1 Login load guard: Unauthenticated
	const unauthLoad = await loginLoad({ locals: {} });
	assert(typeof unauthLoad === 'object', 'Login load returns empty object for unauthenticated visitor');

	// 1.2 Login load guard: Authenticated user redirected
	try {
		await loginLoad({ locals: { user: { id: 'u-1', email: 'test@example.com' } } });
		assert(false, 'Login load should throw redirect when user is authenticated');
	} catch (redirectErr) {
		assert(redirectErr.status === 303 && redirectErr.location === '/dashboard', 'Login load redirects authenticated user to /dashboard (303)');
	}

	// 1.3 Missing email
	const emptyEmailCookies = createMockCookies();
	const emptyEmailRes = await loginActions.default({
		request: createMockRequest({ email: '', password: 'any' }),
		cookies: emptyEmailCookies
	});
	assert(emptyEmailRes.status === 400 && emptyEmailRes.data.message.includes('Email address is required'), 'Login fails 400 on empty email');

	// 1.4 Missing password
	const emptyPassCookies = createMockCookies();
	const emptyPassRes = await loginActions.default({
		request: createMockRequest({ email: 'member@example.com', password: '' }),
		cookies: emptyPassCookies
	});
	assert(emptyPassRes.status === 400 && emptyPassRes.data.message.includes('Password is required'), 'Login fails 400 on empty password');

	// 1.5 Invalid credentials
	const badCredsCookies = createMockCookies();
	const badCredsRes = await loginActions.default({
		request: createMockRequest({ email: 'member@example.com', password: 'wrongpassword' }),
		cookies: badCredsCookies
	});
	assert(badCredsRes.status === 400 && badCredsRes.data.message.includes('Invalid email address or password'), 'Login fails 400 on bad password');

	// 1.6 Inactive user rejection
	const memberUser = getUserByEmail('member@example.com');
	setUserStatus(memberUser.id, 'inactive');
	const inactiveCookies = createMockCookies();
	const inactiveRes = await loginActions.default({
		request: createMockRequest({ email: 'member@example.com', password: 'member123' }),
		cookies: inactiveCookies
	});
	assert(inactiveRes.status === 403 && inactiveRes.data.message.includes('deactivated'), 'Login fails 403 when user is inactive');

	// Restore member status
	setUserStatus(memberUser.id, 'active');

	// 1.7 Successful login issues cookie and redirects
	const successCookies = createMockCookies();
	try {
		await loginActions.default({
			request: createMockRequest({ email: 'member@example.com', password: 'member123' }),
			cookies: successCookies
		});
		assert(false, 'Successful login should throw redirect');
	} catch (redirectErr) {
		assert(redirectErr.status === 303 && redirectErr.location === '/dashboard', 'Successful login redirects to /dashboard with 303');
		const issuedCookie = successCookies.get(SESSION_COOKIE_NAME);
		assert(typeof issuedCookie === 'string' && issuedCookie.length > 0, 'Successful login sets orbit_session cookie');
		const resolved = resolveSession(successCookies);
		assert(resolved && resolved.email === 'member@example.com', 'Issued session cookie resolves to member user');
	}

	// 1.8 Admin login succeeds
	const adminCookies = createMockCookies();
	try {
		await loginActions.default({
			request: createMockRequest({ email: 'admin@example.com', password: 'admin123' }),
			cookies: adminCookies
		});
		assert(false, 'Successful admin login should throw redirect');
	} catch (redirectErr) {
		assert(redirectErr.status === 303 && redirectErr.location === '/dashboard', 'Successful admin login redirects to /dashboard');
		const resolvedAdmin = resolveSession(adminCookies);
		assert(resolvedAdmin && resolvedAdmin.role === 'admin', 'Admin session resolves with admin role');
	}

	// ==========================================
	// 2. REGISTER PAGE LOAD & ACTIONS
	// ==========================================
	console.log('\n[2] Testing Register Route');

	// 2.1 Register load guard: Unauthenticated
	const unauthRegLoad = await registerLoad({ locals: {} });
	assert(typeof unauthRegLoad === 'object', 'Register load returns empty object for unauthenticated visitor');

	// 2.2 Register load guard: Authenticated user redirected
	try {
		await registerLoad({ locals: { user: { id: 'u-1' } } });
		assert(false, 'Register load should redirect authenticated user');
	} catch (redirectErr) {
		assert(redirectErr.status === 303 && redirectErr.location === '/dashboard', 'Register load redirects authenticated user to /dashboard');
	}

	// 2.3 Missing name
	const noNameRes = await registerActions.default({
		request: createMockRequest({ name: '', email: 'new@example.com', password: 'password123', confirmPassword: 'password123' }),
		cookies: createMockCookies()
	});
	assert(noNameRes.status === 400 && noNameRes.data.message.includes('Display name is required'), 'Register fails 400 on empty name');

	// 2.4 Invalid email
	const badEmailRes = await registerActions.default({
		request: createMockRequest({ name: 'New User', email: 'notanemail', password: 'password123', confirmPassword: 'password123' }),
		cookies: createMockCookies()
	});
	assert(badEmailRes.status === 400 && badEmailRes.data.message.includes('valid email address is required'), 'Register fails 400 on invalid email');

	// 2.5 Password too short (< 6 chars)
	const shortPassRes = await registerActions.default({
		request: createMockRequest({ name: 'New User', email: 'new@example.com', password: '123', confirmPassword: '123' }),
		cookies: createMockCookies()
	});
	assert(shortPassRes.status === 400 && shortPassRes.data.message.includes('at least 6 characters'), 'Register fails 400 on short password');

	// 2.6 Password mismatch
	const mismatchRes = await registerActions.default({
		request: createMockRequest({ name: 'New User', email: 'new@example.com', password: 'password123', confirmPassword: 'passwordXYZ' }),
		cookies: createMockCookies()
	});
	assert(mismatchRes.status === 400 && mismatchRes.data.message.includes('Passwords do not match'), 'Register fails 400 on password mismatch');

	// 2.7 Duplicate email conflict
	const dupRes = await registerActions.default({
		request: createMockRequest({ name: 'Duplicate Member', email: 'member@example.com', password: 'password123', confirmPassword: 'password123' }),
		cookies: createMockCookies()
	});
	assert(dupRes.status === 400 && dupRes.data.message.includes('already exists'), 'Register fails 400 when email is already registered');

	// 2.8 Successful registration creates user, strictly enforces role 'user', sets session, and redirects
	const regCookies = createMockCookies();
	try {
		await registerActions.default({
			request: createMockRequest({
				name: 'Samantha Ray',
				email: 'samantha@example.com',
				password: 'securePassword123',
				confirmPassword: 'securePassword123',
				role: 'admin' // Attempt privilege escalation via form
			}),
			cookies: regCookies
		});
		assert(false, 'Successful registration should throw redirect');
	} catch (redirectErr) {
		assert(redirectErr.status === 303 && redirectErr.location === '/dashboard', 'Successful registration redirects to /dashboard');

		const created = getUserByEmail('samantha@example.com');
		assert(created !== null, 'Registered user exists in store');
		assert(created.name === 'Samantha Ray', 'Registered user has correct display name');
		assert(created.role === 'user', 'Strict privilege protection: role forced to user even if admin requested');
		assert(created.status === 'active', 'Registered user default status is active');

		const resolvedReg = resolveSession(regCookies);
		assert(resolvedReg && resolvedReg.id === created.id, 'Session automatically created and authenticated for new registrant');
	}

	// ==========================================
	// 3. LOGOUT ENDPOINT
	// ==========================================
	console.log('\n[3] Testing Logout Endpoint');

	// 3.1 POST logout deletes session cookie and redirects to /login
	const activeCookies = createMockCookies({ [SESSION_COOKIE_NAME]: regCookies.get(SESSION_COOKIE_NAME) });
	assert(resolveSession(activeCookies) !== null, 'Pre-logout: session is valid');

	try {
		await logoutPost({ cookies: activeCookies });
		assert(false, 'Logout POST should throw redirect');
	} catch (redirectErr) {
		assert(redirectErr.status === 303 && redirectErr.location === '/login', 'Logout POST redirects to /login (303)');
		assert(resolveSession(activeCookies) === null, 'Post-logout: session destroyed and resolves to null');
		const delOp = activeCookies._operations.find((op) => op.action === 'delete' && op.name === SESSION_COOKIE_NAME);
		assert(delOp !== undefined, 'Logout POST calls cookies.delete(orbit_session)');
	}

	// 3.2 GET logout redirects to /login
	try {
		await logoutGet();
		assert(false, 'Logout GET should throw redirect');
	} catch (redirectErr) {
		assert(redirectErr.status === 303 && redirectErr.location === '/login', 'Logout GET redirects to /login (303)');
	}

	console.log(`\n==============================================`);
	console.log(`PHASE 5 TEST SUMMARY: ${passed} passed, ${failed} failed.`);
	console.log(`==============================================\n`);

	if (failed > 0) {
		process.exit(1);
	}
}

runTests().catch((err) => {
	console.error('Unhandled test failure:', err);
	process.exit(1);
});
