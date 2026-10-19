<script>
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { toast } from 'svelte-sonner';
	import User from '@lucide/svelte/icons/user';
	import Mail from '@lucide/svelte/icons/mail';
	import Lock from '@lucide/svelte/icons/lock';
	import Shield from '@lucide/svelte/icons/shield';
	import Hash from '@lucide/svelte/icons/hash';
	import Calendar from '@lucide/svelte/icons/calendar';
	import AlertCircle from '@lucide/svelte/icons/alert-circle';
	import CheckCircle2 from '@lucide/svelte/icons/check-circle-2';
	import Loader2 from '@lucide/svelte/icons/loader-2';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';

	let { data, form } = $props();
	let user = $derived(data.user);

	let isSubmitting = $state(false);
	let nameValue = $state('');
	let bioValue = $state('');

	// Keep local state in sync when user data loads
	$effect(() => {
		if (user) {
			nameValue = form?.values?.name ?? user.name ?? '';
			bioValue = form?.values?.bio ?? user.bio ?? '';
		}
	});

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
				month: 'long',
				day: 'numeric'
			});
		} catch {
			return isoString;
		}
	}
</script>

<svelte:head>
	<title>Profile Settings — Orbit User Portal</title>
</svelte:head>

<div class="space-y-6 max-w-4xl mx-auto">
	<!-- Top Navigation / Breadcrumb Header -->
	<div class="flex items-center justify-between">
		<div>
			<div class="flex items-center gap-2">
				<Button href="/dashboard" variant="ghost" size="sm" class="gap-1 text-muted-foreground p-0 h-auto hover:bg-transparent">
					<ArrowLeft class="size-4" />
					<span>Back to Dashboard</span>
				</Button>
			</div>
			<h1 class="text-2xl font-bold tracking-tight sm:text-3xl mt-2">Profile Settings</h1>
			<p class="text-sm text-muted-foreground mt-0.5">
				Manage your personal identification, bio, and review system-enforced account boundaries.
			</p>
		</div>
	</div>

	<!-- Form Error Alert -->
	{#if form?.message && !form?.success}
		<Alert.Root variant="destructive">
			<AlertCircle class="size-4" />
			<Alert.Title>Update Failed</Alert.Title>
			<Alert.Description>{form.message}</Alert.Description>
		</Alert.Root>
	{/if}

	<!-- Form Success Alert -->
	{#if form?.success}
		<Alert.Root class="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
			<CheckCircle2 class="size-4 text-emerald-600 dark:text-emerald-400" />
			<Alert.Title>Success</Alert.Title>
			<Alert.Description>{form.message}</Alert.Description>
		</Alert.Root>
	{/if}

	<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
		<!-- Left Column: Identity Overview Card -->
		<Card.Root class="border shadow-sm h-fit">
			<Card.Header class="text-center pb-4">
				<div class="mx-auto mb-3">
					<Avatar.Root class="size-20 border-2 border-primary/20 shadow-sm mx-auto">
						<Avatar.Fallback class="bg-primary/10 text-primary font-bold text-xl">
							{getInitials(user?.name)}
						</Avatar.Fallback>
					</Avatar.Root>
				</div>
				<Card.Title class="text-lg">{user?.name}</Card.Title>
				<Card.Description class="text-xs truncate">{user?.email}</Card.Description>

				<div class="flex items-center justify-center gap-2 mt-3">
					<Badge variant={user?.role === 'admin' ? 'default' : 'secondary'} class="capitalize text-xs">
						{user?.role}
					</Badge>
					<Badge
						variant="outline"
						class={user?.status === 'active'
							? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs'
							: 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 text-xs'}
					>
						{user?.status}
					</Badge>
				</div>
			</Card.Header>

			<Card.Content class="space-y-3 text-xs border-t pt-4 text-muted-foreground">
				<div class="flex items-center justify-between">
					<span class="flex items-center gap-1.5">
						<Hash class="size-3.5" />
						Account ID
					</span>
					<span class="font-mono text-[11px] text-foreground truncate max-w-[140px]">{user?.id}</span>
				</div>

				<div class="flex items-center justify-between">
					<span class="flex items-center gap-1.5">
						<Calendar class="size-3.5" />
						Created
					</span>
					<span class="font-medium text-foreground">{formatDate(user?.createdAt)}</span>
				</div>

				<div class="flex items-center justify-between">
					<span class="flex items-center gap-1.5">
						<Shield class="size-3.5" />
						Security
					</span>
					<span class="font-medium text-emerald-600 dark:text-emerald-400">Active Session</span>
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Right Column: Profile Edit Form -->
		<Card.Root class="md:col-span-2 border shadow-sm">
			<form
				method="POST"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ result, update }) => {
						isSubmitting = false;
						await update();
						if (result.type === 'success') {
							toast.success('Profile successfully updated!');
							await invalidate('app:users');
						} else if (result.type === 'failure') {
							toast.error(result.data?.message || 'Failed to update profile.');
						}
					};
				}}
			>
				<Card.Header>
					<Card.Title class="text-lg">Edit Personal Information</Card.Title>
					<Card.Description>Update your public display name and biographical summary.</Card.Description>
				</Card.Header>

				<Card.Content class="space-y-5">
					<!-- Display Name Input -->
					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<Label for="name" class="text-sm font-medium">Display Name <span class="text-destructive">*</span></Label>
							<span class="text-xs text-muted-foreground">2–50 characters</span>
						</div>
						<div class="relative">
							<User class="absolute left-3 top-2.5 size-4 text-muted-foreground" />
							<Input
								id="name"
								name="name"
								type="text"
								required
								minlength="2"
								maxlength="50"
								bind:value={nameValue}
								placeholder="e.g. Samantha Vance"
								class="pl-9"
								disabled={isSubmitting}
							/>
						</div>
					</div>

					<!-- Email Field (Read-Only) -->
					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<Label for="email" class="text-sm font-medium">Email Address</Label>
							<span class="text-xs text-muted-foreground flex items-center gap-1">
								<Lock class="size-3 text-muted-foreground" />
								Read-only (System identifier)
							</span>
						</div>
						<div class="relative">
							<Mail class="absolute left-3 top-2.5 size-4 text-muted-foreground" />
							<Input
								id="email"
								type="email"
								value={user?.email}
								disabled
								class="pl-9 bg-muted/50 cursor-not-allowed opacity-80"
							/>
						</div>
						<p class="text-[11px] text-muted-foreground">
							Email addresses are primary login identifiers and cannot be altered directly through self-service profile settings.
						</p>
					</div>

					<!-- Role & Status (Read-Only Badges) -->
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div class="rounded-lg border p-3 bg-muted/20">
							<div class="flex items-center justify-between text-xs text-muted-foreground mb-1">
								<span>Assigned Role</span>
								<Lock class="size-3" />
							</div>
							<div class="font-semibold capitalize text-sm">{user?.role}</div>
							<p class="text-[11px] text-muted-foreground mt-0.5">Admin-controlled privilege tier</p>
						</div>

						<div class="rounded-lg border p-3 bg-muted/20">
							<div class="flex items-center justify-between text-xs text-muted-foreground mb-1">
								<span>Account Status</span>
								<Lock class="size-3" />
							</div>
							<div class="font-semibold capitalize text-sm flex items-center gap-1.5">
								<span class="size-2 rounded-full {user?.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}"></span>
								{user?.status}
							</div>
							<p class="text-[11px] text-muted-foreground mt-0.5">Governs session authorization</p>
						</div>
					</div>

					<!-- Biography Textarea -->
					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<Label for="bio" class="text-sm font-medium">About You (Bio)</Label>
							<span class="text-xs {bioValue.length > 500 ? 'text-destructive font-medium' : 'text-muted-foreground'}">
								{bioValue.length}/500
							</span>
						</div>
						<textarea
							id="bio"
							name="bio"
							rows="4"
							maxlength="500"
							bind:value={bioValue}
							placeholder="Tell team members and administrators about your role, background, or current focus..."
							class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							disabled={isSubmitting}
						></textarea>
						<p class="text-[11px] text-muted-foreground">
							Biographical details will be publicly visible to all members browsing the User Directory.
						</p>
					</div>
				</Card.Content>

				<Card.Footer class="border-t bg-muted/10 flex items-center justify-between pt-4">
					<p class="text-xs text-muted-foreground">All changes are saved directly to in-memory store</p>
					<Button type="submit" disabled={isSubmitting || !nameValue.trim()} class="gap-2">
						{#if isSubmitting}
							<Loader2 class="size-4 animate-spin" />
							Saving Changes...
						{:else}
							Save Profile
						{/if}
					</Button>
				</Card.Footer>
			</form>
		</Card.Root>
	</div>
</div>
