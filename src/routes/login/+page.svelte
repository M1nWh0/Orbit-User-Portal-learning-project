<script>
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import Lock from '@lucide/svelte/icons/lock';
	import Mail from '@lucide/svelte/icons/mail';
	import AlertCircle from '@lucide/svelte/icons/alert-circle';
	import Orbit from '@lucide/svelte/icons/orbit';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';

	let { form } = $props();

	let isSubmitting = $state(false);
	let emailValue = $state('');
	let passwordValue = $state('');

	$effect(() => {
		if (form?.email) {
			emailValue = form.email;
		}
	});

	function quickFill(email, password) {
		emailValue = email;
		passwordValue = password;
	}
</script>

<svelte:head>
	<title>Sign In — Orbit User Portal</title>
</svelte:head>

<div class="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
	<div class="w-full max-w-md space-y-6">
		<!-- Header / Logo -->
		<div class="text-center space-y-2">
			<a href="/" class="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm transition-transform hover:scale-105">
				<Orbit class="h-6 w-6" />
			</a>
			<h1 class="text-2xl font-bold tracking-tight text-foreground">Welcome Back</h1>
			<p class="text-sm text-muted-foreground">Sign in to your Orbit User Portal account</p>
		</div>

		<!-- Login Card -->
		<Card.Root class="border shadow-md">
			<Card.Header class="space-y-1">
				<Card.Title class="text-xl">Authentication</Card.Title>
				<Card.Description>Enter your credentials to access your session</Card.Description>
			</Card.Header>

			<Card.Content>
				<form
					method="POST"
					use:enhance={() => {
						isSubmitting = true;
						return async ({ update }) => {
							isSubmitting = false;
							await update();
						};
					}}
					class="space-y-4"
				>
					<!-- Error Alert -->
					{#if form?.message}
						<Alert.Root variant="destructive">
							<AlertCircle class="h-4 w-4" />
							<Alert.Title>Authentication Failed</Alert.Title>
							<Alert.Description>{form.message}</Alert.Description>
						</Alert.Root>
					{/if}

					<!-- Email Field -->
					<div class="space-y-2">
						<Label for="email">Email Address</Label>
						<div class="relative">
							<Input
								id="email"
								name="email"
								type="email"
								placeholder="name@example.com"
								required
								autocomplete="email"
								bind:value={emailValue}
								class="pl-9"
								disabled={isSubmitting}
							/>
							<Mail class="absolute left-3 top-3 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
						</div>
					</div>

					<!-- Password Field -->
					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<Label for="password">Password</Label>
						</div>
						<div class="relative">
							<Input
								id="password"
								name="password"
								type="password"
								placeholder="••••••••"
								required
								autocomplete="current-password"
								bind:value={passwordValue}
								class="pl-9"
								disabled={isSubmitting}
							/>
							<Lock class="absolute left-3 top-3 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
						</div>
					</div>

					<!-- Submit Button -->
					<Button type="submit" class="w-full gap-2 mt-2" disabled={isSubmitting}>
						{#if isSubmitting}
							<span>Authenticating...</span>
						{:else}
							<span>Sign In</span>
							<ArrowRight class="h-4 w-4" />
						{/if}
					</Button>
				</form>

				<!-- Quick-Fill Demonstration Helpers -->
				<div class="mt-6 pt-5 border-t space-y-2">
					<p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center">
						Demo Quick-Fill
					</p>
					<div class="grid grid-cols-2 gap-2">
						<Button
							type="button"
							variant="outline"
							size="sm"
							class="text-xs justify-start h-auto py-2 px-2.5"
							onclick={() => quickFill('member@example.com', 'member123')}
						>
							<div class="text-left">
								<div class="flex items-center gap-1 font-semibold">
									<span>Member</span>
									<Badge variant="secondary" class="text-[9px] px-1 py-0">User</Badge>
								</div>
								<div class="text-[10px] text-muted-foreground font-mono">member123</div>
							</div>
						</Button>

						<Button
							type="button"
							variant="outline"
							size="sm"
							class="text-xs justify-start h-auto py-2 px-2.5"
							onclick={() => quickFill('admin@example.com', 'admin123')}
						>
							<div class="text-left">
								<div class="flex items-center gap-1 font-semibold">
									<span>Admin</span>
									<Badge variant="default" class="text-[9px] px-1 py-0">Admin</Badge>
								</div>
								<div class="text-[10px] text-muted-foreground font-mono">admin123</div>
							</div>
						</Button>
					</div>
				</div>
			</Card.Content>

			<Card.Footer class="flex justify-center border-t py-4 text-center">
				<p class="text-xs text-muted-foreground">
					Don't have an account?{' '}
					<a href="/register" class="font-semibold text-primary underline-offset-4 hover:underline">
						Create an account
					</a>
				</p>
			</Card.Footer>
		</Card.Root>
	</div>
</div>
