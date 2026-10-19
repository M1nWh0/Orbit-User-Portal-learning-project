import { POST as echoPost } from '../src/routes/api/debug/echo/+server.js';
import { GET as debugUserGet } from '../src/routes/api/debug/users/[id]/+server.js';
import { GET as triggerErrorGet } from '../src/routes/api/debug/trigger-error/+server.js';
import { GET as sessionDebugGet } from '../src/routes/api/debug/session/+server.js';
import { resetStore, getUserByEmail } from '../src/lib/server/store.js';
import { createSession, SESSION_COOKIE_NAME } from '../src/lib/server/auth.js';

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

async function runTests() {
	console.log('--- STARTING PHASE 8 CONTROLLED DEBUG LAB TESTS ---');

	await resetStore();
	const member = getUserByEmail('member@example.com');

	// ==========================================
	// 1. SCENARIO A: JSON PROPERTY MISMATCH
	// ==========================================
	console.log('\n[1] Testing Scenario A (/api/debug/echo)');

	// 1.1 Contract mismatch: client sends username instead of email -> 400
	const mismatchRes = await echoPost({
		request: createMockJsonRequest({ username: 'jordan', role: 'guest' })
	});
	const mismatchJson = await mismatchRes.json();
	assert(mismatchRes.status === 400, 'Scenario A returns 400 for contract mismatch');
	assert(mismatchJson.code === 'CONTRACT_PROPERTY_MISMATCH', 'Error code is CONTRACT_PROPERTY_MISMATCH');
	assert(mismatchJson.diagnostic.includes("property 'username'"), 'Diagnostic explains username vs email');

	// 1.2 Contract match: client sends email -> 200
	const matchRes = await echoPost({
		request: createMockJsonRequest({ email: 'developer@example.com' })
	});
	const matchJson = await matchRes.json();
	assert(matchRes.status === 200, 'Scenario A returns 200 for valid email contract');
	assert(matchJson.code === 'CONTRACT_MATCH', 'Success code is CONTRACT_MATCH');
	assert(matchJson.data.email === 'developer@example.com', 'Received data returned correctly');

	// ==========================================
	// 2. SCENARIO B: API 404 (DATA VS ROUTE 404)
	// ==========================================
	console.log('\n[2] Testing Scenario B (/api/debug/users/[id])');

	// 2.1 Nonexistent user -> 404 with data-level diagnostic
	const notFoundRes = await debugUserGet({
		params: { id: 'usr_ghost_404_test' }
	});
	const notFoundJson = await notFoundRes.json();
	assert(notFoundRes.status === 404, 'Scenario B returns 404 for missing resource');
	assert(notFoundJson.code === 'USER_NOT_FOUND', 'Code is USER_NOT_FOUND');
	assert(notFoundJson.diagnostic.routeMatched === true, 'Diagnostic confirms route was matched');
	assert(notFoundJson.diagnostic.dataExplanation.includes('DATA-LEVEL 404'), 'Explains data-level 404 distinction');

	// 2.2 Existing user -> 200
	const foundRes = await debugUserGet({
		params: { id: member.id }
	});
	const foundJson = await foundRes.json();
	assert(foundRes.status === 200, 'Scenario B returns 200 for existing user ID');
	assert(foundJson.code === 'RESOURCE_FOUND', 'Code is RESOURCE_FOUND');
	assert(foundJson.user.name === member.name, 'Safe user returned');

	// ==========================================
	// 3. SCENARIO C: CONTROLLED SERVER ERROR
	// ==========================================
	console.log('\n[3] Testing Scenario C (/api/debug/trigger-error)');

	const errorRes = await triggerErrorGet();
	const errorJson = await errorRes.json();
	// In local dev/test environment, dev is true
	assert(errorRes.status === 500, 'Scenario C returns 500 in development');
	assert(errorJson.code === 'INTENTIONAL_500_ERROR', 'Code is INTENTIONAL_500_ERROR');
	assert(errorJson.diagnostic.severity.includes('500 Failure'), 'Diagnostic confirms 500 failure');

	// ==========================================
	// 4. SCENARIO D: SESSION COOKIE OMISSION
	// ==========================================
	console.log('\n[4] Testing Scenario D (/api/debug/session)');

	// 4.1 Cookie omitted -> locals.user is null
	const omittedCookies = createMockCookies();
	const omittedRes = await sessionDebugGet({
		cookies: omittedCookies,
		locals: {}
	});
	const omittedJson = await omittedRes.json();
	assert(omittedRes.status === 200, 'Scenario D returns 200');
	assert(omittedJson.hasSessionCookie === false, 'hasSessionCookie is false when cookie omitted');
	assert(omittedJson.isAuthenticated === false, 'isAuthenticated is false');
	assert(omittedJson.user === null, 'User is null when cookie omitted');
	assert(omittedJson.diagnostic.credentialsMode.includes('omit'), 'Diagnostic explains credentials omit mode');

	// 4.2 Cookie present -> locals.user resolved
	const presentCookies = createMockCookies();
	const session = createSession(member.id, presentCookies);
	const presentRes = await sessionDebugGet({
		cookies: presentCookies,
		locals: { user: member }
	});
	const presentJson = await presentRes.json();
	assert(presentRes.status === 200, 'Scenario D returns 200');
	assert(presentJson.hasSessionCookie === true, 'hasSessionCookie is true when cookie present');
	assert(presentJson.isAuthenticated === true, 'isAuthenticated is true');
	assert(presentJson.user.id === member.id, 'User is authenticated and matches member');
	assert(presentJson.diagnostic.credentialsMode.includes('same-origin'), 'Diagnostic explains credentials include mode');

	console.log(`\n==============================================`);
	console.log(`PHASE 8 TEST SUMMARY: ${passed} passed, ${failed} failed.`);
	console.log(`==============================================\n`);

	if (failed > 0) {
		process.exit(1);
	}
}

runTests().catch((err) => {
	console.error('Unhandled test failure:', err);
	process.exit(1);
});
