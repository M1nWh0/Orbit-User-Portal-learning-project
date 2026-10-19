<script>
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import Search from '@lucide/svelte/icons/search';
	import Users from '@lucide/svelte/icons/users';
	import UserCheck from '@lucide/svelte/icons/user-check';
	import ShieldAlert from '@lucide/svelte/icons/shield-alert';
	import Calendar from '@lucide/svelte/icons/calendar';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import XCircle from '@lucide/svelte/icons/x-circle';
	import Filter from '@lucide/svelte/icons/filter';

	let { data } = $props();
	let allUsers = $derived(data.users || []);

	let searchQuery = $state('');
	let selectedRole = $state('all'); // 'all' | 'admin' | 'user'

	// Svelte 5 derived filtered list
	let filteredUsers = $derived(
		allUsers.filter((u) => {
			const query = searchQuery.trim().toLowerCase();
			const matchesName = !query || u.name.toLowerCase().includes(query);
			const matchesRole = selectedRole === 'all' || u.role === selectedRole;
			return matchesName && matchesRole;
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
		selectedRole = 'all';
	}
</script>

<svelte:head>
	<title>User Directory — Orbit User Portal</title>
</svelte:head>

<div class="space-y-6">
	<!-- Page Header -->
	<div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<div class="flex items-center gap-2">
				<h1 class="text-2xl font-bold tracking-tight sm:text-3xl">User Directory</h1>
				<span class="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
					<Users class="size-3" />
					{allUsers.length} Members
				</span>
			</div>
			<p class="text-sm text-muted-foreground mt-1">
				Browse and search team members, colleagues, and administrators across the organization.
			</p>
		</div>
	</div>

	<!-- Search & Filter Controls -->
	<Card.Root class="border shadow-sm bg-card/60 backdrop-blur-sm">
		<Card.Content class="p-4">
			<div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
				<!-- Search Input -->
				<div class="relative flex-1">
					<Search class="absolute left-3 top-2.5 size-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Search members by display name..."
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

				<!-- Role Filter Badges -->
				<div class="flex items-center gap-1.5 shrink-0">
					<span class="text-xs text-muted-foreground mr-1 flex items-center gap-1">
						<Filter class="size-3.5" />
						Role:
					</span>

					<button
						type="button"
						onclick={() => (selectedRole = 'all')}
						class="rounded-full px-3 py-1 text-xs font-medium transition {selectedRole === 'all'
							? 'bg-primary text-primary-foreground shadow-sm'
							: 'bg-muted text-muted-foreground hover:bg-muted/80'}"
					>
						All ({allUsers.length})
					</button>

					<button
						type="button"
						onclick={() => (selectedRole = 'admin')}
						class="rounded-full px-3 py-1 text-xs font-medium transition {selectedRole === 'admin'
							? 'bg-purple-600 text-white shadow-sm'
							: 'bg-muted text-muted-foreground hover:bg-muted/80'}"
					>
						Admins ({allUsers.filter((u) => u.role === 'admin').length})
					</button>

					<button
						type="button"
						onclick={() => (selectedRole = 'user')}
						class="rounded-full px-3 py-1 text-xs font-medium transition {selectedRole === 'user'
							? 'bg-primary text-primary-foreground shadow-sm'
							: 'bg-muted text-muted-foreground hover:bg-muted/80'}"
					>
						Users ({allUsers.filter((u) => u.role === 'user').length})
					</button>
				</div>
			</div>
		</Card.Content>
	</Card.Root>

	<!-- Search Results Feedback -->
	<div class="flex items-center justify-between text-xs text-muted-foreground px-1">
		<span>
			Showing <strong class="text-foreground">{filteredUsers.length}</strong> of {allUsers.length} accounts
		</span>
		{#if searchQuery || selectedRole !== 'all'}
			<button
				type="button"
				onclick={resetFilters}
				class="text-primary hover:underline font-medium"
			>
				Reset all filters
			</button>
		{/if}
	</div>

	<!-- Empty State -->
	{#if filteredUsers.length === 0}
		<Card.Root class="border-dashed text-center py-12 shadow-sm">
			<Card.Content class="space-y-4">
				<div class="mx-auto rounded-full bg-muted/80 p-4 w-fit text-muted-foreground">
					<Search class="size-8" />
				</div>
				<div class="space-y-1">
					<h3 class="text-lg font-semibold">No members found</h3>
					<p class="text-sm text-muted-foreground max-w-sm mx-auto">
						No user profiles matched your search for "{searchQuery}". Try searching for another name or clearing the role filter.
					</p>
				</div>
				<Button variant="outline" size="sm" onclick={resetFilters}>
					Clear Search & Reset Filters
				</Button>
			</Card.Content>
		</Card.Root>
	{:else}
		<!-- User Cards Grid -->
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each filteredUsers as member (member.id)}
				<Card.Root class="group relative overflow-hidden border shadow-sm transition hover:shadow-md hover:border-primary/40 flex flex-col justify-between">
					<Card.Header class="pb-3">
						<div class="flex items-start justify-between gap-3">
							<div class="flex items-center gap-3">
								<Avatar.Root class="size-11 border border-border">
									<Avatar.Fallback class="bg-primary/10 text-primary font-semibold text-sm">
										{getInitials(member.name)}
									</Avatar.Fallback>
								</Avatar.Root>
								<div>
									<h2 class="font-semibold text-base leading-snug group-hover:text-primary transition">
										{member.name}
									</h2>
									<div class="flex items-center gap-1.5 mt-1">
										<Badge
											variant={member.role === 'admin' ? 'default' : 'secondary'}
											class="text-[10px] uppercase tracking-wider px-2 py-0.2"
										>
											{member.role}
										</Badge>
										<Badge
											variant="outline"
											class={member.status === 'active'
												? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px]'
												: 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 text-[10px]'}
										>
											{member.status}
										</Badge>
									</div>
								</div>
							</div>
						</div>
					</Card.Header>

					<Card.Content class="pb-4 space-y-3">
						<!-- Bio snippet -->
						<p class="text-xs text-muted-foreground line-clamp-2 min-h-[32px] leading-relaxed">
							{#if member.bio}
								{member.bio}
							{:else}
								<span class="italic text-muted-foreground/60">No biographical information added yet.</span>
							{/if}
						</p>

						<!-- Join Date -->
						<div class="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-1 border-t">
							<Calendar class="size-3 text-muted-foreground shrink-0" />
							<span>Joined {formatDate(member.createdAt)}</span>
						</div>
					</Card.Content>

					<Card.Footer class="border-t bg-muted/10 p-3 flex justify-end">
						<Button
							href="/users/{member.id}"
							variant="ghost"
							size="sm"
							class="w-full justify-between text-xs font-medium hover:bg-primary hover:text-primary-foreground group/btn"
						>
							<span>View Full Profile</span>
							<ArrowRight class="size-3.5 transition group-hover/btn:translate-x-1" />
						</Button>
					</Card.Footer>
				</Card.Root>
			{/each}
		</div>
	{/if}
</div>
