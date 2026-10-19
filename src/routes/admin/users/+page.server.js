import { fail } from '@sveltejs/kit';
import { requireAdmin } from '$lib/server/auth.js';
import {
	getAllSafeUsers,
	createUser,
	updateUserRole,
	setUserStatus
} from '$lib/server/store.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, depends }) {
	requireAdmin(locals);
	depends('app:users');

	const users = getAllSafeUsers();

	return {
		users
	};
}

/** @type {import('./$types').Actions} */
export const actions = {
	createUser: async ({ request, locals }) => {
		requireAdmin(locals);
		const formData = await request.formData();

		const name = formData.get('name');
		const email = formData.get('email');
		const password = formData.get('password');
		const role = formData.get('role') || 'user';

		const safeName = typeof name === 'string' ? name.trim() : '';
		const safeEmail = typeof email === 'string' ? email.trim() : '';
		const safeRole = role === 'admin' ? 'admin' : 'user';

		if (!safeName || safeName.length < 2) {
			return fail(400, {
				success: false,
				action: 'createUser',
				message: 'Display name must be at least 2 characters long.',
				values: { name: safeName, email: safeEmail, role: safeRole }
			});
		}

		if (!safeEmail || !safeEmail.includes('@') || !safeEmail.includes('.')) {
			return fail(400, {
				success: false,
				action: 'createUser',
				message: 'A valid email address is required.',
				values: { name: safeName, email: safeEmail, role: safeRole }
			});
		}

		if (!password || typeof password !== 'string' || password.length < 6) {
			return fail(400, {
				success: false,
				action: 'createUser',
				message: 'Initial password must be at least 6 characters long.',
				values: { name: safeName, email: safeEmail, role: safeRole }
			});
		}

		try {
			const newUser = await createUser({
				name: safeName,
				email: safeEmail,
				password,
				role: safeRole,
				status: 'active',
				bio: ''
			});

			return {
				success: true,
				action: 'createUser',
				message: `Account for ${newUser.name} created successfully as ${newUser.role}.`
			};
		} catch (err) {
			return fail(400, {
				success: false,
				action: 'createUser',
				message: err.message || 'Failed to create account.',
				values: { name: safeName, email: safeEmail, role: safeRole }
			});
		}
	},

	updateRole: async ({ request, locals }) => {
		requireAdmin(locals);
		const formData = await request.formData();

		const id = formData.get('id');
		const newRole = formData.get('role');

		if (!id || typeof id !== 'string') {
			return fail(400, {
				success: false,
				action: 'updateRole',
				message: 'User ID is required.'
			});
		}

		if (newRole !== 'user' && newRole !== 'admin') {
			return fail(400, {
				success: false,
				action: 'updateRole',
				message: 'Role must be either user or admin.'
			});
		}

		try {
			const updated = updateUserRole(id, newRole);
			return {
				success: true,
				action: 'updateRole',
				message: `Role for ${updated.name} updated to ${updated.role}.`
			};
		} catch (err) {
			return fail(400, {
				success: false,
				action: 'updateRole',
				message: err.message || 'Failed to update role.'
			});
		}
	},

	toggleStatus: async ({ request, locals }) => {
		requireAdmin(locals);
		const formData = await request.formData();

		const id = formData.get('id');
		const newStatus = formData.get('status');

		if (!id || typeof id !== 'string') {
			return fail(400, {
				success: false,
				action: 'toggleStatus',
				message: 'User ID is required.'
			});
		}

		if (newStatus !== 'active' && newStatus !== 'inactive') {
			return fail(400, {
				success: false,
				action: 'toggleStatus',
				message: 'Status must be active or inactive.'
			});
		}

		try {
			const updated = setUserStatus(id, newStatus);
			return {
				success: true,
				action: 'toggleStatus',
				message: `Account status for ${updated.name} set to ${updated.status}.`
			};
		} catch (err) {
			return fail(400, {
				success: false,
				action: 'toggleStatus',
				message: err.message || 'Failed to update account status.'
			});
		}
	}
};
