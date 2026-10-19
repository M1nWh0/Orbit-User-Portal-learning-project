<script>
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import ConfirmActionDialog from '$lib/components/confirm-action-dialog.svelte';
	import { toast } from 'svelte-sonner';
	import Search from '@lucide/svelte/icons/search';
	import UserPlus from '@lucide/svelte/icons/user-plus';
	import ShieldAlert from '@lucide/svelte/icons/shield-alert';
	import ShieldCheck from '@lucide/svelte/icons/shield-check';
	import UserX from '@lucide/svelte/icons/user-x';
	import UserCheck from '@lucide/svelte/icons/user-check';
	import UserCog from '@lucide/svelte/icons/user-cog';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import XCircle from '@lucide/svelte/icons/x-circle';
	import Filter from '@lucide/svelte/icons/filter';
	import Loader2 from '@lucide/svelte/icons/loader-2';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';

	let { data, form } = $props();
	let allUsers = $derived(data.users || []);

	// Search and filter state
	let searchQuery = $state('');
	let filterRole = $state('all'); // 'all' | 'admin' | 'user'
	let filterStatus = $state('all'); // 'all' | 'active' | 'inactive'

	// Create user dialog state
	let createDialogOpen = $state(false);
	let isCreating = $state(false);
	let createName = $state('');
	let createEmail = $state('');
	let createPassword = $state('');
	let createRole = $state('user');

	// Deactivation confirmation dialog state
	let confirmDeactivateOpen = $state(false);
	let targetDeactivateUser = $state(null);

	// Derived filtered user list
	let filteredUsers = $derived(
		allUsers.filter((u) => {
			const query = searchQuery.trim().toLowerCase();
			const matchesQuery =
				!query ||
				u.name.toLowerCase().includes(query) ||
				u.email.toLowerCase().includes(query);
			const matchesRole = filterRole === 'all' || u.role === filterRole;
			const matchesStatus = filterStatus === 'all' || u.status === filterStatus;
			return matchesQuery && matchesRole && matchesStatus;
		})
	);

	function getInitials(name) {
		if (!name) return 'U';
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	}

	function formatDate(isoString) {
		if (!isoString) return 'N/A';
		try {
			return new Date(isoString).toLocaleDateString(undefined, {
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			});
		} catch {
			return isoString;
		}
	}

	function resetFilters() {
		searchQuery = '';
		filterRole = 'all';
		filterStatus = 'all';
	}

	function promptDeactivate(user) {
		targetDeactivateUser = user;
		confirmDeactivateOpen = true;
	}
</script>

<svelte:head>
	<title>Manage Accounts — Orbit User Portal</title>
</svelte:head>

<div class="space-y-6">
	<!-- Top Navigation & Header -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<div class="flex items-center gap-2">
				<Button href="/admin" variant="ghost" size="sm" class="gap-1 text-muted-foreground p-0 h-auto hover:bg-transparent">
					<ArrowLeft class="size-4" />
					<span>Back to Admin Overview</span>
				</Button>
			</div>
			<div class="flex items-center gap-2 mt-2">
				<h1 class="text-2xl font-bold tracking-tight sm:text-3xl">Manage Accounts</h1>
				<span class="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-700 dark:text-purple-300">
					<UserCog class="size-3.5" />
					{allUsers.length} Total
				</span>
			</div>
			<p class="text-sm text-muted-foreground mt-0.5">
				Create accounts, modify roles, and control account activation status with guaranteed safety guards.
			</p>
		</div>

		<div>
			<!-- Create Account Dialog Trigger -->
			<Button onclick={() => (createDialogOpen = true)} class="gap-2 shadow-sm">
				<UserPlus class="size-4" />
				Create New Account
			</Button>
		</div>
	</div>

	<!-- Search & Filter Controls -->
	<Card.Root class="border shadow-sm bg-card/60 backdrop-blur-sm">
		<Card.Content class="p-4">
			<div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
				<!-- Search Input -->
				<div class="relative flex-1">
					<Search class="absolute left-3 top-2.5 size-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Search accounts by name or email address..."
						bind:value={searchQuery}
						class="pl-9 bg-background/80"
					/>
					{#if searchQuery}
						<button
							type="button"
							onclick={() => (searchQuery = '')}
							class="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
							aria-label="Clear search"
						>
							<XCircle class="size-4" />
						</button>
					{/if}
				</div>

				<!-- Role & Status Filter Badges -->
				<div class="flex flex-wrap items-center gap-2 shrink-0">
					<!-- Role Filter -->
					<div class="flex items-center gap-1 bg-muted/40 p-1 rounded-lg border">
						<span class="text-xs text-muted-foreground px-1.5 flex items-center gap-1">
							<Filter class="size-3" />
							Role:
						</span>
						<button
							type="button"
							onclick={() => (filterRole = 'all')}
							class="rounded-md px-2.5 py-0.5 text-xs font-medium transition {filterRole === 'all'
								? 'bg-primary text-primary-foreground shadow-sm'
								: 'text-muted-foreground hover:bg-muted'}"
						>
							All
						</button>
						<button
							type="button"
							onclick={() => (filterRole = 'admin')}
							class="rounded-md px-2.5 py-0.5 text-xs font-medium transition {filterRole === 'admin'
								? 'bg-purple-600 text-white shadow-sm'
								: 'text-muted-foreground hover:bg-muted'}"
						>
							Admins
						</button>
						<button
							type="button"
							onclick={() => (filterRole = 'user')}
							class="rounded-md px-2.5 py-0.5 text-xs font-medium transition {filterRole === 'user'
								? 'bg-primary text-primary-foreground shadow-sm'
								: 'text-muted-foreground hover:bg-muted'}"
						>
							Users
						</button>
					</div>

					<!-- Status Filter -->
					<div class="flex items-center gap-1 bg-muted/40 p-1 rounded-lg border">
						<span class="text-xs text-muted-foreground px-1.5">Status:</span>
						<button
							type="button"
							onclick={() => (filterStatus = 'all')}
							class="rounded-md px-2.5 py-0.5 text-xs font-medium transition {filterStatus === 'all'
								? 'bg-primary text-primary-foreground shadow-sm'
								: 'text-muted-foreground hover:bg-muted'}"
						>
							All
						</button>
						<button
							type="button"
							onclick={() => (filterStatus = 'active')}
							class="rounded-md px-2.5 py-0.5 text-xs font-medium transition {filterStatus === 'active'
								? 'bg-emerald-600 text-white shadow-sm'
								: 'text-muted-foreground hover:bg-muted'}"
						>
							Active
						</button>
						<button
							type="button"
							onclick={() => (filterStatus = 'inactive')}
							class="rounded-md px-2.5 py-0.5 text-xs font-medium transition {filterStatus === 'inactive'
								? 'bg-amber-600 text-white shadow-sm'
								: 'text-muted-foreground hover:bg-muted'}"
						>
							Inactive
						</button>
					</div>
				</div>
			</div>
		</Card.Content>
	</Card.Root>

	<!-- Table Results Count Banner -->
	<div class="flex items-center justify-between text-xs text-muted-foreground px-1">
		<span>
			Displaying <strong class="text-foreground">{filteredUsers.length}</strong> of {allUsers.length} accounts
		</span>
		{#if searchQuery || filterRole !== 'all' || filterStatus !== 'all'}
			<button
				type="button"
				onclick={resetFilters}
				class="text-primary hover:underline font-medium"
			>
				Reset all filters
			</button>
		{/if}
	</div>

	<!-- Accounts Management Table -->
	<Card.Root class="border shadow-sm overflow-hidden">
		<div class="overflow-x-auto">
			<Table.Root>
				<Table.Header>
					<Table.Row class="bg-muted/30">
						<Table.Head class="w-[280px]">User</Table.Head>
						<Table.Head>Email Address</Table.Head>
						<Table.Head class="text-center">Role</Table.Head>
						<Table.Head class="text-center">Status</Table.Head>
						<Table.Head>Created</Table.Head>
						<Table.Head class="text-right">Actions</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#if filteredUsers.length === 0}
						<Table.Row>
							<Table.Cell colspan={6} class="text-center py-10 text-muted-foreground">
								No user records matched your criteria.
								<button type="button" onclick={resetFilters} class="text-primary hover:underline font-medium ml-1">
									Reset filters
								</button>
							</Table.Cell>
						</Table.Row>
					{:else}
						{#each filteredUsers as acc (acc.id)}
							<Table.Row class="transition hover:bg-muted/20">
								<!-- User Avatar & Name -->
								<Table.Cell>
									<div class="flex items-center gap-3">
										<Avatar.Root class="size-9 border border-border">
											<Avatar.Fallback class="bg-primary/10 text-primary font-semibold text-xs">
												{getInitials(acc.name)}
											</Avatar.Fallback>
										</Avatar.Root>
										<div class="overflow-hidden">
											<div class="font-semibold text-sm leading-tight text-foreground truncate">
												{acc.name}
											</div>
											<div class="text-[11px] font-mono text-muted-foreground truncate">
												{acc.id}
											</div>
										</div>
									</div>
								</Table.Cell>

								<!-- Email -->
								<Table.Cell>
									<span class="text-xs font-mono text-foreground">{acc.email}</span>
								</Table.Cell>

								<!-- Role Badge -->
								<Table.Cell class="text-center">
									<Badge
										variant={acc.role === 'admin' ? 'default' : 'secondary'}
										class="text-[10px] uppercase tracking-wider"
									>
										{acc.role}
									</Badge>
								</Table.Cell>

								<!-- Status Badge -->
								<Table.Cell class="text-center">
									<Badge
										variant="outline"
										class={acc.status === 'active'
											? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px]'
											: 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 text-[10px]'}
									>
										{acc.status}
									</Badge>
								</Table.Cell>

								<!-- Created Date -->
								<Table.Cell class="text-xs text-muted-foreground whitespace-nowrap">
									{formatDate(acc.createdAt)}
								</Table.Cell>

								<!-- Action Buttons -->
								<Table.Cell class="text-right">
									<div class="flex items-center justify-end gap-1.5">
										<!-- Inspect Profile Link -->
										<Button
											href="/users/{acc.id}"
											variant="ghost"
											size="sm"
											class="h-8 w-8 p-0"
											title="View user profile"
											aria-label="View user profile"
										>
											<ExternalLink class="size-3.5 text-muted-foreground" />
										</Button>

										<!-- Role Mutation Form -->
										<form
											method="POST"
											action="?/updateRole"
											use:enhance={() => {
												return async ({ result, update }) => {
													await update();
													if (result.type === 'success') {
														toast.success(result.data?.message || 'Role updated successfully.');
														await invalidate('app:users');
													} else if (result.type === 'failure') {
														toast.error(result.data?.message || 'Failed to update role.');
													}
												};
											}}
										>
											<input type="hidden" name="id" value={acc.id} />
											<input
												type="hidden"
												name="role"
												value={acc.role === 'admin' ? 'user' : 'admin'}
											/>
											<Button
												type="submit"
												variant="outline"
												size="sm"
												class="h-8 text-xs font-medium gap-1"
												title={acc.role === 'admin' ? 'Demote to regular user' : 'Promote to administrator'}
											>
												{#if acc.role === 'admin'}
													<ShieldCheck class="size-3 text-purple-600" />
													<span>Demote</span>
												{:else}
													<ShieldAlert class="size-3 text-muted-foreground" />
													<span>Promote</span>
												{/if}
											</Button>
										</form>

										<!-- Status Toggle Form -->
										{#if acc.status === 'active'}
											<Button
												type="button"
												variant="destructive"
												size="sm"
												class="h-8 text-xs font-medium gap-1"
												onclick={() => promptDeactivate(acc)}
												title="Deactivate account and revoke sessions"
											>
												<UserX class="size-3" />
												<span>Deactivate</span>
											</Button>
										{:else}
											<form
												method="POST"
												action="?/toggleStatus"
												use:enhance={() => {
													return async ({ result, update }) => {
														await update();
														if (result.type === 'success') {
															toast.success(result.data?.message || 'Account reactivated.');
															await invalidate('app:users');
														} else if (result.type === 'failure') {
															toast.error(result.data?.message || 'Failed to reactivate account.');
														}
													};
												}}
											>
												<input type="hidden" name="id" value={acc.id} />
												<input type="hidden" name="status" value="active" />
												<Button
													type="submit"
													variant="outline"
													size="sm"
													class="h-8 text-xs font-medium gap-1 border-emerald-500/40 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
												>
													<UserCheck class="size-3" />
													<span>Activate</span>
												</Button>
											</form>
										{/if}
									</div>
								</Table.Cell>
							</Table.Row>
						{/each}
					{/if}
				</Table.Body>
			</Table.Root>
		</div>
	</Card.Root>
</div>

<!-- ============================================================== -->
<!-- Create Account Modal Dialog                                    -->
<!-- ============================================================== -->
<Dialog.Root bind:open={createDialogOpen}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title class="flex items-center gap-2">
				<UserPlus class="size-5 text-primary" />
				Create New Account
			</Dialog.Title>
			<Dialog.Description>
				Provision a new team member or administrator directly into the server in-memory store.
			</Dialog.Description>
		</Dialog.Header>

		<form
			method="POST"
			action="?/createUser"
			use:enhance={() => {
				isCreating = true;
				return async ({ result, update }) => {
					isCreating = false;
					await update();
					if (result.type === 'success') {
						toast.success(result.data?.message || 'User account successfully provisioned!');
						createDialogOpen = false;
						createName = '';
						createEmail = '';
						createPassword = '';
						createRole = 'user';
						await invalidate('app:users');
					} else if (result.type === 'failure') {
						toast.error(result.data?.message || 'Failed to provision account.');
					}
				};
			}}
			class="space-y-4 py-2"
		>
			<!-- Name -->
			<div class="space-y-1.5">
				<Label for="create-name" class="text-xs font-medium">Display Name <span class="text-destructive">*</span></Label>
				<Input
					id="create-name"
					name="name"
					type="text"
					required
					placeholder="e.g. Jordan Hayes"
					bind:value={createName}
					disabled={isCreating}
				/>
			</div>

			<!-- Email -->
			<div class="space-y-1.5">
				<Label for="create-email" class="text-xs font-medium">Email Address <span class="text-destructive">*</span></Label>
				<Input
					id="create-email"
					name="email"
					type="email"
					required
					placeholder="jordan@example.com"
					bind:value={createEmail}
					disabled={isCreating}
				/>
			</div>

			<!-- Password -->
			<div class="space-y-1.5">
				<Label for="create-password" class="text-xs font-medium">Initial Password <span class="text-destructive">*</span></Label>
				<Input
					id="create-password"
					name="password"
					type="password"
					required
					minlength="6"
					placeholder="At least 6 characters"
					bind:value={createPassword}
					disabled={isCreating}
				/>
			</div>

			<!-- Role Selection -->
			<div class="space-y-1.5">
				<Label class="text-xs font-medium">Assigned Role</Label>
				<div class="grid grid-cols-2 gap-3">
					<label
						class="flex cursor-pointer items-center justify-between rounded-lg border p-3 text-xs transition {createRole === 'user'
							? 'border-primary bg-primary/5 font-semibold text-primary'
							: 'border-border text-muted-foreground'}"
					>
						<span>Regular User</span>
						<input
							type="radio"
							name="role"
							value="user"
							bind:group={createRole}
							class="sr-only"
							disabled={isCreating}
						/>
					</label>

					<label
						class="flex cursor-pointer items-center justify-between rounded-lg border p-3 text-xs transition {createRole === 'admin'
							? 'border-purple-600 bg-purple-500/5 font-semibold text-purple-700 dark:text-purple-300'
							: 'border-border text-muted-foreground'}"
					>
						<span>Administrator</span>
						<input
							type="radio"
							name="role"
							value="admin"
							bind:group={createRole}
							class="sr-only"
							disabled={isCreating}
						/>
					</label>
				</div>
			</div>

			<Dialog.Footer class="pt-4 border-t gap-2 sm:gap-0">
				<Button
					type="button"
					variant="ghost"
					onclick={() => (createDialogOpen = false)}
					disabled={isCreating}
				>
					Cancel
				</Button>
				<Button type="submit" disabled={isCreating} class="gap-2">
					{#if isCreating}
						<Loader2 class="size-4 animate-spin" />
						Provisioning...
					{:else}
						Create Account
					{/if}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

<!-- ============================================================== -->
<!-- Deactivation Confirmation Dialog                               -->
<!-- ============================================================== -->
{#if targetDeactivateUser}
	<ConfirmActionDialog
		bind:open={confirmDeactivateOpen}
		title="Deactivate {targetDeactivateUser.name}'s Account?"
		description="Deactivating this account will immediately revoke all active browser sessions and prevent future authentication until an administrator reactivates it."
		confirmText="Deactivate Account"
		cancelText="Keep Active"
		variant="destructive"
		onConfirm={async () => {
			const formData = new FormData();
			formData.append('id', targetDeactivateUser.id);
			formData.append('status', 'inactive');

			const res = await fetch('?/toggleStatus', {
				method: 'POST',
				body: formData
			});
			const result = await res.json();

			if (result.type === 'success' || (result.status === 200 && result.data?.success)) {
				toast.success(`Account for ${targetDeactivateUser.name} has been deactivated.`);
				await invalidate('app:users');
			} else {
				const errMsg = result.data?.message || 'Failed to deactivate account.';
				toast.error(errMsg);
			}
			targetDeactivateUser = null;
		}}
		onCancel={() => {
			targetDeactivateUser = null;
		}}
	/>
{/if}
