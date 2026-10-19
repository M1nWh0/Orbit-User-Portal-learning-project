import { load as adminLoad } from '../src/routes/admin/+page.server.js';
import {
	load as adminUsersLoad,
	actions as adminUsersActions
} from '../src/routes/admin/users/+page.server.js';
import {
	POST as statusPost,
	PATCH as statusPatch
} from '../src/routes/api/users/[id]/status/+server.js';
import {
	resetStore,
	getUserByEmail,
	getUserById,
	createUser,
	getActiveAdminCount
} from '../src/lib/server/store.js';
import {
	createSession,
	resolveSession,
	SESSION_COOKIE_NAME
} from '../src/lib/server/auth.js';

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

function createMockJsonRequest(body = {}) {
	return {
		json: async () => body
	};
}

async function runTests() {
	console.log('--- STARTING PHASE 7 ADMINISTRATIVE CONSOLE & INVARIANT TESTS ---');

	// Reset store
	await resetStore();
	const member = getUserByEmail('member@example.com');
	const admin = getUserByEmail('admin@example.com');

	const trackedDependencies = [];
	const mockDepends = (dep) => {
		trackedDependencies.push(dep);
	};

	// ==========================================
	// 1. ADMIN OVERVIEW ROUTE (/admin)
	// ==========================================
	console.log('\n[1] Testing Admin Dashboard Route');

	// 1.1 Unauthenticated access throws redirect
	try {
		await adminLoad({ locals: {}, depends: mockDepends });
		assert(false, 'Admin overview must reject anonymous visitor');
	} catch (err) {
		assert(err.status === 303 && err.location === '/login', 'Admin overview redirects unauthenticated visitor to /login');
	}

	// 1.2 Regular user access throws 403 Forbidden
	try {
		await adminLoad({ locals: { user: member }, depends: mockDepends });
		assert(false, 'Admin overview must reject regular user');
	} catch (err) {
		assert(err.status === 403, 'Admin overview rejects regular member with 403 Forbidden');
	}

	// 1.3 Administrator access succeeds
	trackedDependencies.length = 0;
	const overviewData = await adminLoad({ locals: { user: admin }, depends: mockDepends });
	assert(overviewData.stats.totalAccounts === 2, 'Admin overview returns correct totalAccounts');
	assert(overviewData.stats.adminCount === 1, 'Admin overview returns correct adminCount');
	assert(Array.isArray(overviewData.users) && overviewData.users.length === 2, 'Admin overview returns all users');
	assert(trackedDependencies.includes('app:users'), 'Admin overview declares app:users dependency');

	// ==========================================
	// 2. ADMIN USER MANAGEMENT (/admin/users)
	// ==========================================
	console.log('\n[2] Testing Admin Users Console Route');

	// 2.1 Unauthorized load checks
	try {
		await adminUsersLoad({ locals: { user: member }, depends: mockDepends });
		assert(false, 'Admin users load must reject regular member');
	} catch (err) {
		assert(err.status === 403, 'Admin users load throws 403 Forbidden for regular member');
	}

	// 2.2 Administrator load returns all users with emails
	const usersData = await adminUsersLoad({ locals: { user: admin }, depends: mockDepends });
	assert(usersData.users.length === 2, 'Admin users load returns user records');
	assert(usersData.users.every((u) => typeof u.email === 'string'), 'All users in admin list include full email');

	// 2.3 Action: createUser validation
	const badNameRes = await adminUsersActions.createUser({
		request: createMockFormDataRequest({ name: 'A', email: 'test@example.com', password: 'password123', role: 'user' }),
		locals: { user: admin }
	});
	assert(badNameRes.status === 400 && badNameRes.data.message.includes('at least 2 characters'), 'createUser rejects short name with 400');

	const dupEmailRes = await adminUsersActions.createUser({
		request: createMockFormDataRequest({ name: 'Duplicate', email: 'member@example.com', password: 'password123', role: 'user' }),
		locals: { user: admin }
	});
	assert(dupEmailRes.status === 400 && dupEmailRes.data.message.includes('already exists'), 'createUser rejects duplicate email with 400');

	// 2.4 Action: createUser success
	const createRes = await adminUsersActions.createUser({
		request: createMockFormDataRequest({
			name: 'Second Admin',
			email: 'admin2@example.com',
			password: 'adminPassword123',
			role: 'admin'
		}),
		locals: { user: admin }
	});
	assert(createRes.success === true, 'createUser provisions second admin successfully');
	const admin2 = getUserByEmail('admin2@example.com');
	assert(admin2 !== null && admin2.role === 'admin', 'Second admin created with admin role');
	assert(getActiveAdminCount() === 2, 'Active admin count is now 2');

	// 2.5 Action: updateRole demotes admin2 (allowed since 2 active admins exist)
	const demoteRes = await adminUsersActions.updateRole({
		request: createMockFormDataRequest({ id: admin2.id, role: 'user' }),
		locals: { user: admin }
	});
	assert(demoteRes.success === true, 'updateRole demoted second admin successfully');
	assert(getActiveAdminCount() === 1, 'Active admin count is now back to 1');

	// 2.6 Invariant guard: demoting last active admin must fail (Task 7.5)
	const failDemoteRes = await adminUsersActions.updateRole({
		request: createMockFormDataRequest({ id: admin.id, role: 'user' }),
		locals: { user: admin }
	});
	assert(failDemoteRes.status === 400, 'updateRole rejects demoting last active admin with 400');
	assert(failDemoteRes.data.message.includes('Cannot demote the final active administrator'), 'Error message confirms final admin invariant');
	assert(getUserById(admin.id).role === 'admin', 'Last admin role remains admin');

	// 2.7 Invariant guard: deactivating last active admin must fail (Task 7.5)
	const failDeactivateRes = await adminUsersActions.toggleStatus({
		request: createMockFormDataRequest({ id: admin.id, status: 'inactive' }),
		locals: { user: admin }
	});
	assert(failDeactivateRes.status === 400, 'toggleStatus rejects deactivating last active admin with 400');
	assert(failDeactivateRes.data.message.includes('Cannot deactivate the final active administrator'), 'Error message confirms deactivation invariant');
	assert(getUserById(admin.id).status === 'active', 'Last admin status remains active');

	// ==========================================
	// 3. SESSION REVOCATION ON DEACTIVATION (Task 7.4)
	// ==========================================
	console.log('\n[3] Testing Session Revocation on Deactivation');

	// 3.1 Create session for member
	const memberCookies = createMockCookies();
	createSession(member.id, memberCookies);
	const initialResolved = resolveSession(memberCookies);
	assert(initialResolved !== null && initialResolved.id === member.id, 'Pre-deactivation: member has active valid session');

	// 3.2 Deactivate member via toggleStatus action
	const deactivateMemberRes = await adminUsersActions.toggleStatus({
		request: createMockFormDataRequest({ id: member.id, status: 'inactive' }),
		locals: { user: admin }
	});
	assert(deactivateMemberRes.success === true, 'Member deactivated successfully');
	assert(getUserById(member.id).status === 'inactive', 'Member status in store is inactive');

	// 3.3 Verify existing session is immediately revoked
	const revokedResolved = resolveSession(memberCookies);
	assert(revokedResolved === null, 'Post-deactivation: member session is immediately invalid (resolves to null)');

	// 3.4 Reactivate member
	const reactivateMemberRes = await adminUsersActions.toggleStatus({
		request: createMockFormDataRequest({ id: member.id, status: 'active' }),
		locals: { user: admin }
	});
	assert(reactivateMemberRes.success === true, 'Member reactivated successfully');
	assert(getUserById(member.id).status === 'active', 'Member status is back to active');

	// ==========================================
	// 4. STATUS API ENDPOINT (/api/users/[id]/status) (Task 7.3)
	// ==========================================
	console.log('\n[4] Testing Status API Endpoint');

	// 4.1 401 Unauthorized for unauthenticated call
	const unauthApiRes = await statusPost({
		params: { id: member.id },
		request: createMockJsonRequest({ status: 'inactive' }),
		locals: {}
	});
	const unauthJson = await unauthApiRes.json();
	assert(unauthApiRes.status === 401 && unauthJson.error.includes('Unauthorized'), 'API returns 401 for unauthenticated request');

	// 4.2 403 Forbidden for regular member
	const forbiddenApiRes = await statusPost({
		params: { id: member.id },
		request: createMockJsonRequest({ status: 'inactive' }),
		locals: { user: member }
	});
	const forbiddenJson = await forbiddenApiRes.json();
	assert(forbiddenApiRes.status === 403 && forbiddenJson.error.includes('Forbidden'), 'API returns 403 for non-admin user');

	// 4.3 404 Not Found for nonexistent user ID
	const notFoundApiRes = await statusPost({
		params: { id: 'usr_nonexistent_999' },
		request: createMockJsonRequest({ status: 'inactive' }),
		locals: { user: admin }
	});
	const notFoundJson = await notFoundApiRes.json();
	assert(notFoundApiRes.status === 404 && notFoundJson.error.includes('User not found'), 'API returns 404 for unknown user ID');

	// 4.4 400 Bad Request for invalid status
	const invalidStatusApiRes = await statusPost({
		params: { id: member.id },
		request: createMockJsonRequest({ status: 'banned_forever' }),
		locals: { user: admin }
	});
	const invalidStatusJson = await invalidStatusApiRes.json();
	assert(invalidStatusApiRes.status === 400 && invalidStatusJson.error.includes('Invalid status parameter'), 'API returns 400 for invalid status value');

	// 4.5 400 Bad Request for deactivating final admin via API
	const apiFinalAdminRes = await statusPost({
		params: { id: admin.id },
		request: createMockJsonRequest({ status: 'inactive' }),
		locals: { user: admin }
	});
	const apiFinalAdminJson = await apiFinalAdminRes.json();
	assert(apiFinalAdminRes.status === 400 && apiFinalAdminJson.error.includes('Cannot deactivate the final active administrator'), 'API rejects deactivating last admin with 400');

	// 4.6 200 OK for valid deactivation via POST
	const validApiPost = await statusPost({
		params: { id: member.id },
		request: createMockJsonRequest({ status: 'inactive' }),
		locals: { user: admin }
	});
	const validPostJson = await validApiPost.json();
	assert(validApiPost.status === 200 && validPostJson.success === true, 'API returns 200 OK on valid status change');
	assert(validPostJson.user.status === 'inactive', 'API response includes updated safe user');

	// 4.7 200 OK for valid reactivation via PATCH
	const validApiPatch = await statusPatch({
		params: { id: member.id },
		request: createMockJsonRequest({ status: 'active' }),
		locals: { user: admin }
	});
	const validPatchJson = await validApiPatch.json();
	assert(validApiPatch.status === 200 && validPatchJson.success === true, 'API PATCH returns 200 OK');
	assert(validPatchJson.user.status === 'active', 'Member reactivated via API PATCH');

	console.log(`\n==============================================`);
	console.log(`PHASE 7 TEST SUMMARY: ${passed} passed, ${failed} failed.`);
	console.log(`==============================================\n`);

	if (failed > 0) {
		process.exit(1);
	}
}

runTests().catch((err) => {
	console.error('Unhandled test failure:', err);
	process.exit(1);
});
