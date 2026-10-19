import { load as loginLoad } from '../src/routes/login/+page.server.js';
import { load as registerLoad } from '../src/routes/register/+page.server.js';
import { load as dashboardLoad } from '../src/routes/dashboard/+page.server.js';
import { load as profileLoad, actions as profileActions } from '../src/routes/profile/+page.server.js';
import { load as usersLoad } from '../src/routes/users/+page.server.js';
import { load as userDetailLoad } from '../src/routes/users/[id]/+page.server.js';
import { load as adminLoad } from '../src/routes/admin/+page.server.js';
import {
	load as adminUsersLoad,
	actions as adminUsersActions
} from '../src/routes/admin/users/+page.server.js';
import { POST as statusPost } from '../src/routes/api/users/[id]/status/+server.js';
import { POST as logoutPost } from '../src/routes/logout/+server.js';
import { resetStore, getUserByEmail } from '../src/lib/server/store.js';
import { createSession } from '../src/lib/server/auth.js';

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
	return {
		get(name) {
			return jar.get(name);
		},
		set(name, value) {
			jar.set(name, value);
		},
		delete(name) {
			jar.delete(name);
		}
	};
}

function createMockJsonRequest(body = {}) {
	return {
		json: async () => body
	};
}

function createMockFormDataRequest(fields = {}) {
	const formData = new FormData();
	for (const [key, value] of Object.entries(fields)) {
		if (value !== undefined && value !== null) {
			formData.append(key, value);
		}
	}
	return {
		formData: async () => formData
	};
}

async function runTests() {
	console.log('--- STARTING PHASE 9 PERMISSION MATRIX & SECURITY AUDITING TESTS ---');

	await resetStore();
	const member = getUserByEmail('member@example.com');
	const admin = getUserByEmail('admin@example.com');
	const noUser = null;
	const dummyDepends = () => {};

	// ==========================================
	// 1. ANONYMOUS ROLE CAPABILITIES
	// ==========================================
	console.log('\n[1] Testing Anonymous Permissions');

	// 1.1 Can access login & register
	const anonLogin = await loginLoad({ locals: {} });
	assert(typeof anonLogin === 'object', 'Anonymous can access login page');
	const anonRegister = await registerLoad({ locals: {} });
	assert(typeof anonRegister === 'object', 'Anonymous can access register page');

	// 1.2 Cannot access dashboard
	try {
		await dashboardLoad({ locals: {}, depends: dummyDepends });
		assert(false, 'Anonymous should be blocked from dashboard');
	} catch (e) {
		assert(e.status === 303 && e.location === '/login', 'Anonymous redirected from dashboard to /login');
	}

	// 1.3 Cannot access directory
	try {
		await usersLoad({ locals: {}, depends: dummyDepends });
		assert(false, 'Anonymous should be blocked from directory');
	} catch (e) {
		assert(e.status === 303 && e.location === '/login', 'Anonymous redirected from directory to /login');
	}

	// 1.4 Cannot access profile
	try {
		await profileLoad({ locals: {}, depends: dummyDepends });
		assert(false, 'Anonymous should be blocked from profile');
	} catch (e) {
		assert(e.status === 303 && e.location === '/login', 'Anonymous redirected from profile to /login');
	}

	// 1.5 Cannot access admin console
	try {
		await adminLoad({ locals: {}, depends: dummyDepends });
		assert(false, 'Anonymous should be blocked from admin');
	} catch (e) {
		assert(e.status === 303 && e.location === '/login', 'Anonymous redirected from admin to /login');
	}

	// 1.6 Cannot invoke status API (401)
	const anonApi = await statusPost({
		params: { id: member.id },
		request: createMockJsonRequest({ status: 'inactive' }),
		locals: {}
	});
	assert(anonApi.status === 401, 'Anonymous blocked from Status API with 401 Unauthorized');

	// ==========================================
	// 2. USER (REGULAR MEMBER) CAPABILITIES
	// ==========================================
	console.log('\n[2] Testing Regular User (Member) Permissions');

	// 2.1 Redirected away from login and register
	try {
		await loginLoad({ locals: { user: member } });
		assert(false, 'User should be redirected away from login');
	} catch (e) {
		assert(e.status === 303 && e.location === '/dashboard', 'User redirected from login to /dashboard');
	}

	try {
		await registerLoad({ locals: { user: member } });
		assert(false, 'User should be redirected away from register');
	} catch (e) {
		assert(e.status === 303 && e.location === '/dashboard', 'User redirected from register to /dashboard');
	}

	// 2.2 Can access dashboard without admin stats
	const userDash = await dashboardLoad({ locals: { user: member }, depends: dummyDepends });
	assert(userDash.user.id === member.id, 'User can view own dashboard');
	assert(userDash.stats === null, 'User dashboard does not leak admin stats');

	// 2.3 Can access directory and view public profile
	const userDir = await usersLoad({ locals: { user: member }, depends: dummyDepends });
	assert(userDir.users.length > 0, 'User can view directory');

	const userViewOther = await userDetailLoad({
		params: { id: admin.id },
		locals: { user: member },
		depends: dummyDepends
	});
	assert(userViewOther.canViewEmail === false, 'User cannot view another user private email');

	// 2.4 Can view own profile with email
	const userViewSelf = await userDetailLoad({
		params: { id: member.id },
		locals: { user: member },
		depends: dummyDepends
	});
	assert(userViewSelf.canViewEmail === true, 'User can view own private email');

	// 2.5 Can edit own profile
	const userEditSelf = await profileActions.default({
		request: createMockFormDataRequest({ name: 'Member Self Edit', bio: 'Self updated bio' }),
		locals: { user: member }
	});
	assert(userEditSelf.success === true, 'User can edit own profile');

	// 2.6 CANNOT access admin overview (403)
	try {
		await adminLoad({ locals: { user: member }, depends: dummyDepends });
		assert(false, 'User should be blocked from admin overview');
	} catch (e) {
		assert(e.status === 403, 'User blocked from admin overview with 403 Forbidden');
	}

	// 2.7 CANNOT access admin user console (403)
	try {
		await adminUsersLoad({ locals: { user: member }, depends: dummyDepends });
		assert(false, 'User should be blocked from admin users console');
	} catch (e) {
		assert(e.status === 403, 'User blocked from admin users console with 403 Forbidden');
	}

	// 2.8 CANNOT invoke status API (403)
	const userApi = await statusPost({
		params: { id: admin.id },
		request: createMockJsonRequest({ status: 'inactive' }),
		locals: { user: member }
	});
	assert(userApi.status === 403, 'User blocked from Status API with 403 Forbidden');

	// ==========================================
	// 3. ADMIN ROLE CAPABILITIES
	// ==========================================
	console.log('\n[3] Testing Administrator Permissions');

	// 3.1 Can access dashboard with live stats
	const adminDash = await dashboardLoad({ locals: { user: admin }, depends: dummyDepends });
	assert(adminDash.stats !== null, 'Admin can view live metrics');

	// 3.2 Can view private emails on user profile
	const adminViewMember = await userDetailLoad({
		params: { id: member.id },
		locals: { user: admin },
		depends: dummyDepends
	});
	assert(adminViewMember.canViewEmail === true, 'Admin can view member private email');

	// 3.3 Can access admin overview
	const adminOverview = await adminLoad({ locals: { user: admin }, depends: dummyDepends });
	assert(adminOverview.stats !== null && adminOverview.users.length > 0, 'Admin can access admin overview');

	// 3.4 Can access admin user management
	const adminUsers = await adminUsersLoad({ locals: { user: admin }, depends: dummyDepends });
	assert(adminUsers.users.length > 0, 'Admin can access user management');

	// 3.5 Can create users with role assignment
	const adminCreateRes = await adminUsersActions.createUser({
		request: createMockFormDataRequest({
			name: 'Provisioned Colleague',
			email: 'colleague@example.com',
			password: 'password123',
			role: 'user'
		}),
		locals: { user: admin }
	});
	assert(adminCreateRes.success === true, 'Admin can provision accounts');

	// 3.6 Can toggle status via API
	const colleague = getUserByEmail('colleague@example.com');
	const adminApiRes = await statusPost({
		params: { id: colleague.id },
		request: createMockJsonRequest({ status: 'inactive' }),
		locals: { user: admin }
	});
	assert(adminApiRes.status === 200, 'Admin can update status via API');

	console.log(`\n==============================================`);
	console.log(`PHASE 9 PERMISSION MATRIX SUMMARY: ${passed} passed, ${failed} failed.`);
	console.log(`==============================================\n`);

	if (failed > 0) {
		process.exit(1);
	}
}

runTests().catch((err) => {
	console.error('Unhandled test failure:', err);
	process.exit(1);
});
