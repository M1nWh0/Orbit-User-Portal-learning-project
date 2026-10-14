import {
	getUsers,
	getUserById,
	getUserByEmail,
	getSafeUserById,
	getAllSafeUsers,
	createUser,
	updateUserProfile,
	updateUserRole,
	setUserStatus,
	verifyCredentials,
	getActiveAdminCount,
	getAccountStats,
	createSessionRecord,
	getSessionRecord,
	deleteSessionRecord,
	deleteSessionsForUser,
	toSafeUser,
	toPublicDirectoryUser,
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

async function runTests() {
	console.log('--- STARTING PHASE 2 STORE & CRYPTO ISOLATION TESTS ---');

	// 1. Initial seeded accounts
	await resetStore();
	const initialUsers = getUsers();
	assert(initialUsers.length === 2, `Initial user count should be 2, got ${initialUsers.length}`);

	const member = getUserByEmail('member@example.com');
	assert(member !== null, 'Member account exists by email');
	assert(member.role === 'user', 'Member account has role "user"');
	assert(member.status === 'active', 'Member account has status "active"');

	const admin = getUserByEmail('admin@example.com');
	assert(admin !== null, 'Admin account exists by email');
	assert(admin.role === 'admin', 'Admin account has role "admin"');
	assert(admin.status === 'active', 'Admin account has status "active"');

	// 2. Safe projections
	const safeAdmin = toSafeUser(admin);
	assert(safeAdmin.passwordHash === undefined, 'toSafeUser strips passwordHash');
	assert(safeAdmin.passwordSalt === undefined, 'toSafeUser strips passwordSalt');
	assert(safeAdmin.email === 'admin@example.com', 'toSafeUser retains email');

	const publicMember = toPublicDirectoryUser(member);
	assert(publicMember.passwordHash === undefined, 'toPublicDirectoryUser strips passwordHash');
	assert(publicMember.email === undefined, 'toPublicDirectoryUser omits email');
	assert(publicMember.name === member.name, 'toPublicDirectoryUser keeps name');

	// 3. Credential verification with seeded accounts
	const memberAuthValid = await verifyCredentials('member@example.com', 'member123');
	assert(memberAuthValid.success === true, 'member@example.com verifies with "member123"');
	assert(memberAuthValid.user.email === 'member@example.com', 'verifyCredentials returns safe user');

	const memberAuthInvalid = await verifyCredentials('member@example.com', 'wrongpassword');
	assert(memberAuthInvalid.success === false, 'Wrong password returns failure');
	assert(memberAuthInvalid.reason === 'invalid_password', 'Failure reason is "invalid_password"');

	const notFoundAuth = await verifyCredentials('ghost@example.com', 'any');
	assert(notFoundAuth.success === false, 'Non-existent email returns failure');
	assert(notFoundAuth.reason === 'not_found', 'Failure reason is "not_found"');

	// 4. Email case-insensitivity and trimming
	const caseAuth = await verifyCredentials('  ADMIN@example.com  ', 'admin123');
	assert(caseAuth.success === true, 'Email normalization works for whitespace and uppercase');

	// 5. Creating new accounts
	const newUser = await createUser({
		name: 'Alice Johnson',
		email: 'Alice.Johnson@Test.Org',
		password: 'password999',
		role: 'user',
		bio: 'Software engineer'
	});
	assert(newUser.email === 'alice.johnson@test.org', 'Created user has normalized email');
	assert(newUser.passwordHash === undefined, 'createUser returns safe user object');

	const foundAlice = getUserByEmail('alice.johnson@test.org');
	assert(foundAlice !== null, 'Alice found in store');
	const aliceAuth = await verifyCredentials('alice.johnson@test.org', 'password999');
	assert(aliceAuth.success === true, 'Newly created user can authenticate immediately');

	// 6. Duplicate email rejection
	let duplicateThrew = false;
	try {
		await createUser({
			name: 'Duplicate Alice',
			email: 'alice.johnson@test.org',
			password: 'password123'
		});
	} catch (err) {
		duplicateThrew = true;
		assert(err.message.includes('already exists'), 'Duplicate email throws expected error message');
	}
	assert(duplicateThrew, 'Duplicate email creation threw an error');

	// 7. Profile editing
	const updatedAlice = updateUserProfile(newUser.id, {
		name: 'Alice J. Smith',
		bio: 'Lead Architect'
	});
	assert(updatedAlice.name === 'Alice J. Smith', 'Profile name updated');
	assert(updatedAlice.bio === 'Lead Architect', 'Profile bio updated');

	// 8. Invariant: Final active administrator guard
	assert(getActiveAdminCount() === 1, `Active admin count is 1 before test, got ${getActiveAdminCount()}`);

	// Try demoting the only active admin
	let demoteThrew = false;
	try {
		updateUserRole(admin.id, 'user');
	} catch (err) {
		demoteThrew = true;
		assert(err.message.includes('final active administrator'), 'Demoting last admin throws guard error');
	}
	assert(demoteThrew, 'Demoting last admin was successfully prevented');

	// Try deactivating the only active admin
	let deactivateThrew = false;
	try {
		setUserStatus(admin.id, 'inactive');
	} catch (err) {
		deactivateThrew = true;
		assert(err.message.includes('final active administrator'), 'Deactivating last admin throws guard error');
	}
	assert(deactivateThrew, 'Deactivating last admin was successfully prevented');

	// Now create a second admin
	const admin2 = await createUser({
		name: 'Second Admin',
		email: 'admin2@example.com',
		password: 'password123',
		role: 'admin'
	});
	assert(getActiveAdminCount() === 2, `Active admin count is 2 after adding admin2`);

	// Now demoting admin2 should succeed
	updateUserRole(admin2.id, 'user');
	assert(getActiveAdminCount() === 1, 'Admin count back to 1 after demoting admin2');

	// Once back to 1, demoting admin again must fail!
	let demoteAgainThrew = false;
	try {
		updateUserRole(admin.id, 'user');
	} catch (err) {
		demoteAgainThrew = true;
	}
	assert(demoteAgainThrew, 'Demoting last admin fails again once only 1 remains');

	// 9. Account deactivation and session invalidation
	// Create session for member
	const sess1 = createSessionRecord(member.id);
	assert(getSessionRecord(sess1.sessionId) !== null, 'Session record exists');

	// Deactivate member
	setUserStatus(member.id, 'inactive');
	assert(member.status === 'inactive', 'Member status is now inactive');

	// Verify session for deactivated user was purged
	assert(getSessionRecord(sess1.sessionId) === null, 'Deactivating user revoked their active sessions');

	// Inactive member cannot authenticate
	const inactiveAuth = await verifyCredentials('member@example.com', 'member123');
	assert(inactiveAuth.success === false, 'Inactive user cannot authenticate');
	assert(inactiveAuth.reason === 'inactive', 'Auth failure reason is "inactive"');

	// Reactivate member
	setUserStatus(member.id, 'active');
	assert(member.status === 'active', 'Member reactivated successfully');
	const reactivatedAuth = await verifyCredentials('member@example.com', 'member123');
	assert(reactivatedAuth.success === true, 'Reactivated member can authenticate again');

	// 10. Dashboard Stats
	const stats = getAccountStats();
	assert(stats.totalAccounts === 4, `Total accounts should be 4, got ${stats.totalAccounts}`);
	assert(stats.activeAccounts === 4, `Active accounts should be 4, got ${stats.activeAccounts}`);
	assert(stats.adminCount === 1, `Admin count should be 1, got ${stats.adminCount}`);

	// Reset store at end to restore pristine initial state
	await resetStore();
	assert(getUsers().length === 2, 'Reset store restored pristine initial state of 2 users');

	console.log(`\n🎉 ALL TESTS PASSED! (${passed} checks passed, ${failed} failed)`);
}

runTests().catch((err) => {
	console.error('Fatal test runner error:', err);
	process.exit(1);
});
