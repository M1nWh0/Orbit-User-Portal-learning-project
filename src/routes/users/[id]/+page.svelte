<script>
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import Mail from '@lucide/svelte/icons/mail';
	import Calendar from '@lucide/svelte/icons/calendar';
	import Hash from '@lucide/svelte/icons/hash';
	import Shield from '@lucide/svelte/icons/shield';
	import Edit3 from '@lucide/svelte/icons/edit-3';
	import UserIcon from '@lucide/svelte/icons/user';
	import Settings from '@lucide/svelte/icons/settings';
	import Lock from '@lucide/svelte/icons/lock';

	let { data } = $props();
	let profileUser = $derived(data.profileUser);
	let isOwnProfile = $derived(data.isOwnProfile);
	let canViewEmail = $derived(data.canViewEmail);

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
	<title>{profileUser?.name || 'User Profile'} — Orbit User Portal</title>
</svelte:head>

<div class="space-y-6 max-w-3xl mx-auto">
	<!-- Navigation Breadcrumb Header -->
	<div class="flex items-center justify-between">
		<Button href="/users" variant="ghost" size="sm" class="gap-1.5 text-muted-foreground hover:text-foreground">
			<ArrowLeft class="size-4" />
			<span>Back to User Directory</span>
		</Button>

		{#if isOwnProfile}
			<Button href="/profile" size="sm" class="gap-1.5 shadow-sm">
				<Edit3 class="size-3.5" />
				Edit Your Profile
			</Button>
		{/if}
	</div>

	<!-- Profile Card Header -->
	<Card.Root class="border shadow-sm overflow-hidden">
		<!-- Gradient Accent Top Bar -->
		<div class="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border-b"></div>

		<Card.Content class="relative pt-0 pb-6 px-6 sm:px-8">
			<!-- Floating Avatar -->
			<div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12 mb-4">
				<Avatar.Root class="size-24 border-4 border-card shadow-md bg-card">
					<Avatar.Fallback class="bg-primary/15 text-primary font-bold text-2xl">
						{getInitials(profileUser?.name)}
					</Avatar.Fallback>
				</Avatar.Root>

				<div class="flex items-center gap-2 self-start sm:self-auto">
					<Badge
						variant={profileUser?.role === 'admin' ? 'default' : 'secondary'}
						class="text-xs uppercase tracking-wider px-2.5 py-0.5"
					>
						{profileUser?.role}
					</Badge>
					<Badge
						variant="outline"
						class={profileUser?.status === 'active'
							? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs'
							: 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 text-xs'}
					>
						{profileUser?.status}
					</Badge>
				</div>
			</div>

			<!-- Main User Name & Identity -->
			<div class="space-y-1">
				<div class="flex items-center gap-2">
					<h1 class="text-2xl font-bold tracking-tight sm:text-3xl">{profileUser?.name}</h1>
					{#if isOwnProfile}
						<span class="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
							You
						</span>
					{/if}
				</div>

				{#if canViewEmail && profileUser?.email}
					<p class="text-sm text-muted-foreground flex items-center gap-1.5">
						<Mail class="size-3.5 text-muted-foreground" />
						<span>{profileUser.email}</span>
						<span class="text-[10px] text-muted-foreground/80 italic">
							(visible to {isOwnProfile ? 'you' : 'admins'})
						</span>
					</p>
				{:else}
					<p class="text-xs text-muted-foreground flex items-center gap-1">
						<Lock class="size-3 text-muted-foreground/60" />
						<span class="italic">Email address is private</span>
					</p>
				{/if}
			</div>

			<!-- Metadata Pills -->
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 pt-6 border-t">
				<div class="flex items-center gap-3 rounded-lg border p-3 bg-muted/20">
					<Hash class="size-4 text-muted-foreground shrink-0" />
					<div class="overflow-hidden">
						<div class="text-[11px] text-muted-foreground font-medium">Identifier</div>
						<div class="font-mono text-xs text-foreground truncate">{profileUser?.id}</div>
					</div>
				</div>

				<div class="flex items-center gap-3 rounded-lg border p-3 bg-muted/20">
					<Calendar class="size-4 text-muted-foreground shrink-0" />
					<div>
						<div class="text-[11px] text-muted-foreground font-medium">Member Since</div>
						<div class="text-xs font-semibold text-foreground">{formatDate(profileUser?.createdAt)}</div>
					</div>
				</div>
			</div>

			<!-- Biography Section -->
			<div class="mt-6 pt-6 border-t space-y-2">
				<h2 class="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
					<UserIcon class="size-3.5" />
					About {profileUser?.name}
				</h2>
				{#if profileUser?.bio}
					<p class="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap bg-muted/10 p-4 rounded-lg border">
						{profileUser.bio}
					</p>
				{:else}
					<p class="text-sm italic text-muted-foreground bg-muted/10 p-4 rounded-lg border">
						This member has not written a biography yet.
					</p>
				{/if}
			</div>
		</Card.Content>

		<!-- Footer CTA -->
		<Card.Footer class="border-t bg-muted/10 p-4 flex flex-wrap items-center justify-between gap-3">
			<Button href="/users" variant="outline" size="sm" class="gap-1.5">
				<ArrowLeft class="size-3.5" />
				All Directory Users
			</Button>

			{#if isOwnProfile}
				<Button href="/profile" size="sm" class="gap-1.5">
					<Edit3 class="size-3.5" />
					Edit My Profile
				</Button>
			{/if}
		</Card.Footer>
	</Card.Root>
</div>
