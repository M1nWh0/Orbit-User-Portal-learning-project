import { hashPassword, verifyPassword, generateSessionId } from './crypto.js';

/**
 * @typedef {Object} InternalUser
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} passwordHash
 * @property {string} passwordSalt
 * @property {'user' | 'admin'} role
 * @property {'active' | 'inactive'} status
 * @property {string} bio
 * @property {string} createdAt
 */

/**
 * @typedef {Object} SafeUser
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {'user' | 'admin'} role
 * @property {'active' | 'inactive'} status
 * @property {string} bio
 * @property {string} createdAt
 */

/**
 * @typedef {Object} SessionRecord
 * @property {string} sessionId
 * @property {string} userId
 * @property {string} createdAt
 * @property {string} expiresAt
 */

// In-memory collections
/** @type {Map<string, InternalUser>} */
const users = new Map();

/** @type {Map<string, SessionRecord>} */
const sessions = new Map();

/**
 * Normalizes an email address by trimming whitespace and converting to lowercase.
 * @param {string} email
 * @returns {string}
 */
export function normalizeEmail(email) {
	if (typeof email !== 'string') return '';
	return email.trim().toLowerCase();
}

/**
 * Transforms an internal user record into a safe user object by removing password hashes and salts.
 * @param {InternalUser | null | undefined} user
 * @returns {SafeUser | null}
 */
export function toSafeUser(user) {
	if (!user) return null;
	const { passwordHash, passwordSalt, ...safe } = user;
	return { ...safe };
}

/**
 * Transforms an internal user record into a public directory user entry.
 * @param {InternalUser | null | undefined} user
 * @returns {Omit<SafeUser, 'email'> | null}
 */
export function toPublicDirectoryUser(user) {
	if (!user) return null;
	return {
		id: user.id,
		name: user.name,
		role: user.role,
		status: user.status,
		bio: user.bio || '',
		createdAt: user.createdAt
	};
}

/**
 * Returns the count of currently active administrators in the store.
 * @returns {number}
 */
export function getActiveAdminCount() {
	let count = 0;
	for (const user of users.values()) {
		if (user.role === 'admin' && user.status === 'active') {
			count++;
		}
	}
	return count;
}

/**
 * Returns all internal user records.
 * @returns {InternalUser[]}
 */
export function getUsers() {
	return Array.from(users.values());
}

/**
 * Returns all users projected to safe user representations.
 * @returns {SafeUser[]}
 */
export function getAllSafeUsers() {
	return getUsers().map(toSafeUser);
}

/**
 * Finds an internal user record by unique ID.
 * @param {string} id
 * @returns {InternalUser | null}
 */
export function getUserById(id) {
	if (!id) return null;
	return users.get(id) || null;
}

/**
 * Finds a safe user representation by unique ID.
 * @param {string} id
 * @returns {SafeUser | null}
 */
export function getSafeUserById(id) {
	return toSafeUser(getUserById(id));
}

/**
 * Finds an internal user record by email (case-insensitive and normalized).
 * @param {string} email
 * @returns {InternalUser | null}
 */
export function getUserByEmail(email) {
	const normalized = normalizeEmail(email);
	if (!normalized) return null;

	for (const user of users.values()) {
		if (user.email === normalized) {
			return user;
		}
	}
	return null;
}

/**
 * Creates and stores a new user record.
 * @param {Object} params
 * @param {string} params.name - User's display name
 * @param {string} params.email - User's email
 * @param {string} params.password - Plaintext password
 * @param {'user' | 'admin'} [params.role='user'] - User role
 * @param {'active' | 'inactive'} [params.status='active'] - User status
 * @param {string} [params.bio=''] - User bio
 * @returns {Promise<SafeUser>} The created safe user
 */
export async function createUser({
	name,
	email,
	password,
	role = 'user',
	status = 'active',
	bio = ''
}) {
	if (!name || typeof name !== 'string' || !name.trim()) {
		throw new Error('Name is required');
	}

	const normalizedEmail = normalizeEmail(email);
	if (!normalizedEmail) {
		throw new Error('A valid email address is required');
	}

	if (getUserByEmail(normalizedEmail)) {
		throw new Error('An account with this email address already exists');
	}

	if (!password || typeof password !== 'string' || password.length < 6) {
		throw new Error('Password must be at least 6 characters long');
	}

	if (role !== 'user' && role !== 'admin') {
		throw new Error('Invalid role specified. Must be user or admin');
	}

	if (status !== 'active' && status !== 'inactive') {
		throw new Error('Invalid status specified. Must be active or inactive');
	}

	const { hash, salt } = await hashPassword(password);
	const id = 'usr_' + generateSessionId().replace(/-/g, '').slice(0, 16);
	const createdAt = new Date().toISOString();

	/** @type {InternalUser} */
	const newUser = {
		id,
		name: name.trim(),
		email: normalizedEmail,
		passwordHash: hash,
		passwordSalt: salt,
		role,
		status,
		bio: typeof bio === 'string' ? bio.trim() : '',
		createdAt
	};

	users.set(id, newUser);
	return toSafeUser(newUser);
}

/**
 * Updates a user's editable profile information (name and bio).
 * @param {string} id
 * @param {Object} input
 * @param {string} [input.name]
 * @param {string} [input.bio]
 * @returns {SafeUser}
 */
export function updateUserProfile(id, { name, bio }) {
	const user = getUserById(id);
	if (!user) {
		throw new Error('User not found');
	}

	if (name !== undefined) {
		if (typeof name !== 'string' || !name.trim()) {
			throw new Error('Name cannot be empty');
		}
		user.name = name.trim();
	}

	if (bio !== undefined) {
		user.bio = typeof bio === 'string' ? bio.trim() : '';
	}

	return toSafeUser(user);
}

/**
 * Updates a user's role with invariant protection against demoting the last active admin.
 * @param {string} id
 * @param {'user' | 'admin'} newRole
 * @returns {SafeUser}
 */
export function updateUserRole(id, newRole) {
	const user = getUserById(id);
	if (!user) {
		throw new Error('User not found');
	}

	if (newRole !== 'user' && newRole !== 'admin') {
		throw new Error('Invalid role specified');
	}

	// Invariant check: cannot demote final active administrator
	if (user.role === 'admin' && user.status === 'active' && newRole !== 'admin') {
		if (getActiveAdminCount() <= 1) {
			throw new Error('Cannot demote the final active administrator. The system must retain at least one active administrator.');
		}
	}

	user.role = newRole;
	return toSafeUser(user);
}

/**
 * Sets a user's account status with invariant protection against deactivating the last active admin.
 * If deactivated, all active sessions for this user are invalidated.
 * @param {string} id
 * @param {'active' | 'inactive'} newStatus
 * @returns {SafeUser}
 */
export function setUserStatus(id, newStatus) {
	const user = getUserById(id);
	if (!user) {
		throw new Error('User not found');
	}

	if (newStatus !== 'active' && newStatus !== 'inactive') {
		throw new Error('Invalid status specified');
	}

	// Invariant check: cannot deactivate final active administrator
	if (user.role === 'admin' && user.status === 'active' && newStatus !== 'active') {
		if (getActiveAdminCount() <= 1) {
			throw new Error('Cannot deactivate the final active administrator. The system must retain at least one active administrator.');
		}
	}

	user.status = newStatus;

	// Inactive accounts immediately lose all session validity
	if (newStatus === 'inactive') {
		deleteSessionsForUser(id);
	}

	return toSafeUser(user);
}

/**
 * Verifies credentials and checks account active status.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ success: boolean, reason?: 'not_found' | 'inactive' | 'invalid_password', user: SafeUser | null }>}
 */
export async function verifyCredentials(email, password) {
	const user = getUserByEmail(email);
	if (!user) {
		return { success: false, reason: 'not_found', user: null };
	}

	if (user.status !== 'active') {
		return { success: false, reason: 'inactive', user: null };
	}

	const isValid = await verifyPassword(password, user.passwordHash, user.passwordSalt);
	if (!isValid) {
		return { success: false, reason: 'invalid_password', user: null };
	}

	return { success: true, user: toSafeUser(user) };
}

/**
 * Computes server-side derived account metrics for the dashboard.
 * @returns {{ totalAccounts: number, activeAccounts: number, inactiveAccounts: number, adminCount: number }}
 */
export function getAccountStats() {
	let totalAccounts = 0;
	let activeAccounts = 0;
	let inactiveAccounts = 0;
	let adminCount = 0;

	for (const user of users.values()) {
		totalAccounts++;
		if (user.status === 'active') {
			activeAccounts++;
		} else {
			inactiveAccounts++;
		}
		if (user.role === 'admin') {
			adminCount++;
		}
	}

	return {
		totalAccounts,
		activeAccounts,
		inactiveAccounts,
		adminCount
	};
}

// -------------------------------------------------------------
// Session Store Operations
// -------------------------------------------------------------

/**
 * Creates and records a session for a user.
 * @param {string} userId
 * @param {number} [ttlDays=7] - Session time to live in days
 * @returns {SessionRecord}
 */
export function createSessionRecord(userId, ttlDays = 7) {
	const sessionId = generateSessionId();
	const now = new Date();
	const expires = new Date(now.getTime() + ttlDays * 24 * 60 * 60 * 1000);

	/** @type {SessionRecord} */
	const session = {
		sessionId,
		userId,
		createdAt: now.toISOString(),
		expiresAt: expires.toISOString()
	};

	sessions.set(sessionId, session);
	return session;
}

/**
 * Retrieves a session record by sessionId, validating expiration.
 * @param {string} sessionId
 * @returns {SessionRecord | null}
 */
export function getSessionRecord(sessionId) {
	if (!sessionId) return null;
	const session = sessions.get(sessionId);
	if (!session) return null;

	// Check expiration
	if (new Date(session.expiresAt) <= new Date()) {
		sessions.delete(sessionId);
		return null;
	}

	return session;
}

/**
 * Deletes a session record.
 * @param {string} sessionId
 * @returns {boolean} True if a session was deleted
 */
export function deleteSessionRecord(sessionId) {
	if (!sessionId) return false;
	return sessions.delete(sessionId);
}

/**
 * Deletes all sessions associated with a specific user ID.
 * @param {string} userId
 * @returns {number} Count of removed sessions
 */
export function deleteSessionsForUser(userId) {
	if (!userId) return 0;
	let count = 0;
	for (const [sId, session] of sessions.entries()) {
		if (session.userId === userId) {
			sessions.delete(sId);
			count++;
		}
	}
	return count;
}

// -------------------------------------------------------------
// Pre-Seeding & Reset Functionality
// -------------------------------------------------------------

/**
 * Resets the in-memory store and re-populates with default seeded demonstration accounts.
 * @returns {Promise<void>}
 */
export async function resetStore() {
	users.clear();
	sessions.clear();

	// Seed member account: member@example.com / member123
	const memberPass = await hashPassword('member123');
	const memberId = 'usr_seed_member_01';
	users.set(memberId, {
		id: memberId,
		name: 'Demo Member',
		email: 'member@example.com',
		passwordHash: memberPass.hash,
		passwordSalt: memberPass.salt,
		role: 'user',
		status: 'active',
		bio: 'Community member exploring the Orbit User Portal.',
		createdAt: new Date('2026-01-01T00:00:00.000Z').toISOString()
	});

	// Seed admin account: admin@example.com / admin123
	const adminPass = await hashPassword('admin123');
	const adminId = 'usr_seed_admin_01';
	users.set(adminId, {
		id: adminId,
		name: 'System Administrator',
		email: 'admin@example.com',
		passwordHash: adminPass.hash,
		passwordSalt: adminPass.salt,
		role: 'admin',
		status: 'active',
		bio: 'Managing accounts, security configurations, and user operations.',
		createdAt: new Date('2026-01-01T00:00:00.000Z').toISOString()
	});
}

// Automatically seed on module initialization
await resetStore();
