import { load as dashboardLoad } from '../src/routes/dashboard/+page.server.js';
import { load as profileLoad, actions as profileActions } from '../src/routes/profile/+page.server.js';
import { load as usersLoad } from '../src/routes/users/+page.server.js';
import { load as userDetailLoad } from '../src/routes/users/[id]/+page.server.js';
import { resetStore, getUserByEmail, getUserById, updateUserProfile } from '../src/lib/server/store.js';

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
	console.log('--- STARTING PHASE 6 USER PORTAL CORE FEATURES TESTS ---');

	// Reset store to pristine state
	await resetStore();
	const member = getUserByEmail('member@example.com');
	const admin = getUserByEmail('admin@example.com');

	const trackedDependencies = [];
	const mockDepends = (dep) => {
		trackedDependencies.push(dep);
	};

	// ==========================================
	// 1. DASHBOARD ROUTE (/dashboard)
	// ==========================================
	console.log('\n[1] Testing Dashboard Route');

	// 1.1 Unauthenticated access throws redirect to /login
	try {
		await dashboardLoad({ locals: {}, depends: mockDepends });
		assert(false, 'Dashboard load should reject unauthenticated visitors');
	} catch (err) {
		assert(err.status === 303 && err.location === '/login', 'Dashboard redirects unauthenticated visitor to /login (303)');
	}

	// 1.2 Regular user dashboard returns user without admin stats
	trackedDependencies.length = 0;
	const memberDashboard = await dashboardLoad({
		locals: { user: member },
		depends: mockDepends
	});
	assert(memberDashboard.user.id === member.id, 'Member dashboard returns current member');
	assert(memberDashboard.stats === null, 'Regular member dashboard has stats === null');
	assert(trackedDependencies.includes('app:users'), 'Dashboard declares app:users dependency');

	// 1.3 Admin dashboard returns computed stats
	const adminDashboard = await dashboardLoad({
		locals: { user: admin },
		depends: mockDepends
	});
	assert(adminDashboard.stats !== null, 'Admin dashboard returns live store stats');
	assert(adminDashboard.stats.totalAccounts === 2, 'Admin stats totalAccounts === 2');
	assert(adminDashboard.stats.activeAccounts === 2, 'Admin stats activeAccounts === 2');
	assert(adminDashboard.stats.adminCount === 1, 'Admin stats adminCount === 1');

	// ==========================================
	// 2. PROFILE ROUTE (/profile)
	// ==========================================
	console.log('\n[2] Testing Profile Route');

	// 2.1 Unauthenticated load throws redirect
	try {
		await profileLoad({ locals: {}, depends: mockDepends });
		assert(false, 'Profile load should redirect unauthenticated visitor');
	} catch (err) {
		assert(err.status === 303 && err.location === '/login', 'Profile load redirects to /login');
	}

	// 2.2 Authenticated load returns fresh user
	trackedDependencies.length = 0;
	const profileData = await profileLoad({
		locals: { user: member },
		depends: mockDepends
	});
	assert(profileData.user.id === member.id, 'Profile load returns fresh user data');
	assert(trackedDependencies.includes('app:users'), 'Profile declares app:users dependency');

	// 2.3 Form action validation: empty name fails 400
	const emptyNameRes = await profileActions.default({
		request: createMockRequest({ name: ' ', bio: 'valid bio' }),
		locals: { user: member }
	});
	assert(emptyNameRes.status === 400 && emptyNameRes.data.message.includes('between 2 and 50 characters'), 'Profile action rejects empty name with 400');

	// 2.4 Form action validation: bio too long fails 400
	const tooLongBio = 'a'.repeat(501);
	const longBioRes = await profileActions.default({
		request: createMockRequest({ name: 'Valid Name', bio: tooLongBio }),
		locals: { user: member }
	});
	assert(longBioRes.status === 400 && longBioRes.data.message.includes('cannot exceed 500 characters'), 'Profile action rejects bio > 500 chars with 400');

	// 2.5 Form action success: updates name & bio
	const validUpdateRes = await profileActions.default({
		request: createMockRequest({
			name: 'Demo Member Updated',
			bio: 'New bio description for testing.',
			// Malicious inputs that should be ignored:
			role: 'admin',
			status: 'inactive',
			email: 'hacked@example.com'
		}),
		locals: { user: member }
	});
	assert(validUpdateRes.success === true, 'Profile action succeeded');
	assert(validUpdateRes.user.name === 'Demo Member Updated', 'Profile action returned updated name');
	assert(validUpdateRes.user.bio === 'New bio description for testing.', 'Profile action returned updated bio');

	// Verify in store directly:
	const storeUser = getUserById(member.id);
	assert(storeUser.name === 'Demo Member Updated', 'Store has persisted updated name');
	assert(storeUser.bio === 'New bio description for testing.', 'Store has persisted updated bio');
	assert(storeUser.role === 'user', 'Role was not modified (tamper resistance verified)');
	assert(storeUser.email === 'member@example.com', 'Email was not modified (tamper resistance verified)');

	// ==========================================
	// 3. USER DIRECTORY ROUTE (/users)
	// ==========================================
	console.log('\n[3] Testing User Directory Route');

	// 3.1 Unauthenticated access throws redirect
	try {
		await usersLoad({ locals: {}, depends: mockDepends });
		assert(false, 'Directory should reject unauthenticated visitors');
	} catch (err) {
		assert(err.status === 303 && err.location === '/login', 'Directory redirects unauthenticated visitor to /login');
	}

	// 3.2 Authenticated load returns public directory list
	trackedDependencies.length = 0;
	const dirData = await usersLoad({
		locals: { user: member },
		depends: mockDepends
	});
	assert(Array.isArray(dirData.users), 'Directory load returns an array of users');
	assert(dirData.users.length === 2, 'Directory contains both seeded users');
	assert(trackedDependencies.includes('app:users'), 'Directory declares app:users dependency');

	// 3.3 Privacy verification: public directory users MUST NOT contain email, passwordHash, passwordSalt
	for (const u of dirData.users) {
		assert(u.email === undefined, `User ${u.name} in directory has no email field`);
		assert(u.passwordHash === undefined, `User ${u.name} in directory has no passwordHash`);
		assert(u.passwordSalt === undefined, `User ${u.name} in directory has no passwordSalt`);
		assert(typeof u.id === 'string' && u.id.length > 0, `User ${u.name} has valid ID`);
		assert(typeof u.role === 'string', `User ${u.name} has valid role`);
	}

	// ==========================================
	// 4. DYNAMIC PROFILE ROUTE (/users/[id])
	// ==========================================
	console.log('\n[4] Testing Dynamic Profile Route');

	// 4.1 Unauthenticated load throws redirect
	try {
		await userDetailLoad({
			params: { id: member.id },
			locals: {},
			depends: mockDepends
		});
		assert(false, 'Dynamic profile should reject unauthenticated visitors');
	} catch (err) {
		assert(err.status === 303 && err.location === '/login', 'Dynamic profile redirects to /login');
	}

	// 4.2 Non-existent user ID throws 404
	try {
		await userDetailLoad({
			params: { id: 'non-existent-id-12345' },
			locals: { user: member },
			depends: mockDepends
		});
		assert(false, 'Dynamic profile should throw 404 for unknown user');
	} catch (err) {
		assert(err.status === 404, 'Dynamic profile throws 404 for nonexistent user ID');
	}

	// 4.3 Regular member viewing another member's profile: canViewEmail is false, email is omitted
	const otherView = await userDetailLoad({
		params: { id: admin.id },
		locals: { user: member },
		depends: mockDepends
	});
	assert(otherView.isOwnProfile === false, 'isOwnProfile is false when viewing other user');
	assert(otherView.canViewEmail === false, 'canViewEmail is false for normal member viewing other user');
	assert(otherView.profileUser.email === undefined, 'Email omitted from profileUser when viewed by another member');
	assert(otherView.profileUser.name === admin.name, 'Admin name correctly loaded');

	// 4.4 Regular member viewing their OWN profile: canViewEmail is true, email is included
	const selfView = await userDetailLoad({
		params: { id: member.id },
		locals: { user: member },
		depends: mockDepends
	});
	assert(selfView.isOwnProfile === true, 'isOwnProfile is true for own profile');
	assert(selfView.canViewEmail === true, 'canViewEmail is true for own profile');
	assert(selfView.profileUser.email === 'member@example.com', 'Own email is included in profileUser');

	// 4.5 Admin viewing regular member profile: canViewEmail is true, email is included
	const adminViewOther = await userDetailLoad({
		params: { id: member.id },
		locals: { user: admin },
		depends: mockDepends
	});
	assert(adminViewOther.isOwnProfile === false, 'isOwnProfile is false for admin viewing other');
	assert(adminViewOther.canViewEmail === true, 'canViewEmail is true for admin viewing any member');
	assert(adminViewOther.profileUser.email === 'member@example.com', 'Admin can view member email');

	// ==========================================
	// 5. DATA FRESHNESS & CROSS-PAGE CONSISTENCY
	// ==========================================
	console.log('\n[5] Testing Data Freshness & Cross-Page Consistency');

	// Update admin bio
	updateUserProfile(admin.id, { bio: 'Updated Admin Bio across portal.' });

	// Directory fresh fetch
	const freshDir = await usersLoad({
		locals: { user: member },
		depends: mockDepends
	});
	const updatedAdminInDir = freshDir.users.find((u) => u.id === admin.id);
	assert(updatedAdminInDir.bio === 'Updated Admin Bio across portal.', 'Directory reflects updated bio immediately');

	// Dynamic profile fresh fetch
	const freshDetail = await userDetailLoad({
		params: { id: admin.id },
		locals: { user: member },
		depends: mockDepends
	});
	assert(freshDetail.profileUser.bio === 'Updated Admin Bio across portal.', 'Dynamic profile reflects updated bio immediately');

	console.log(`\n==============================================`);
	console.log(`PHASE 6 TEST SUMMARY: ${passed} passed, ${failed} failed.`);
	console.log(`==============================================\n`);

	if (failed > 0) {
		process.exit(1);
	}
}

runTests().catch((err) => {
	console.error('Unhandled test failure:', err);
	process.exit(1);
});
