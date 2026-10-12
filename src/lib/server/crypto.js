import crypto from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(crypto.scrypt);

const KEY_LENGTH = 64; // 64 bytes (512 bits)
const SALT_LENGTH = 16; // 16 bytes (128 bits)

/**
 * Generates a cryptographically secure random salt as a hex string.
 * @returns {string} Hex-encoded salt
 */
export function generateSalt() {
	return crypto.randomBytes(SALT_LENGTH).toString('hex');
}

/**
 * Hashes a plaintext password using scrypt with a unique salt.
 * @param {string} password - Plaintext password
 * @param {string} [salt] - Optional existing hex salt. If omitted, a fresh salt is generated.
 * @returns {Promise<{ hash: string, salt: string }>} Hex-encoded hash and salt
 */
export async function hashPassword(password, salt = generateSalt()) {
	const derivedKey = await scryptAsync(password, salt, KEY_LENGTH);
	return {
		hash: derivedKey.toString('hex'),
		salt
	};
}

/**
 * Verifies a plaintext password against a stored hash and salt using constant-time comparison.
 * @param {string} password - Plaintext password candidate
 * @param {string} storedHash - Stored hex-encoded hash
 * @param {string} storedSalt - Stored hex-encoded salt
 * @returns {Promise<boolean>} True if password matches, false otherwise
 */
export async function verifyPassword(password, storedHash, storedSalt) {
	if (!password || !storedHash || !storedSalt) {
		return false;
	}

	try {
		const derivedKey = await scryptAsync(password, storedSalt, KEY_LENGTH);
		const storedBuffer = Buffer.from(storedHash, 'hex');

		if (derivedKey.length !== storedBuffer.length) {
			return false;
		}

		return crypto.timingSafeEqual(derivedKey, storedBuffer);
	} catch {
		return false;
	}
}

/**
 * Generates a cryptographically secure, unpredictable session identifier (UUID v4).
 * @returns {string} UUID v4 session ID
 */
export function generateSessionId() {
	return crypto.randomUUID();
}
