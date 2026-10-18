<script>
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import UserIcon from '@lucide/svelte/icons/user';
	import Mail from '@lucide/svelte/icons/mail';
	import Lock from '@lucide/svelte/icons/lock';
	import AlertCircle from '@lucide/svelte/icons/alert-circle';
	import Orbit from '@lucide/svelte/icons/orbit';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';

	let { form } = $props();

	let isSubmitting = $state(false);
	let nameValue = $state('');
	let emailValue = $state('');
	let passwordValue = $state('');
	let confirmPasswordValue = $state('');

	$effect(() => {
		if (form?.name) {
			nameValue = form.name;
		}
		if (form?.email) {
			emailValue = form.email;
		}
	});
</script>

<svelte:head>
	<title>Register — Orbit User Portal</title>
</svelte:head>

<div class="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 py-8">
	<div class="w-full max-w-md space-y-6">
		<!-- Header / Logo -->
		<div class="text-center space-y-2">
			<a href="/" class="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm transition-transform hover:scale-105">
				<Orbit class="h-6 w-6" />
			</a>
			<h1 class="text-2xl font-bold tracking-tight text-foreground">Create Your Account</h1>
			<p class="text-sm text-muted-foreground">Join Orbit User Portal and access your personal dashboard</p>
		</div>

		<!-- Registration Card -->
		<Card.Root class="border shadow-md">
			<Card.Header class="space-y-1">
				<Card.Title class="text-xl">Registration</Card.Title>
				<Card.Description>Enter your details to create a standard member account</Card.Description>
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
							<Alert.Title>Registration Error</Alert.Title>
							<Alert.Description>{form.message}</Alert.Description>
						</Alert.Root>
					{/if}

					<!-- Display Name Field -->
					<div class="space-y-2">
						<Label for="name">Display Name</Label>
						<div class="relative">
							<Input
								id="name"
								name="name"
								type="text"
								placeholder="Jane Doe"
								required
								autocomplete="name"
								bind:value={nameValue}
								class="pl-9"
								disabled={isSubmitting}
							/>
							<UserIcon class="absolute left-3 top-3 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
						</div>
					</div>

					<!-- Email Field -->
					<div class="space-y-2">
						<Label for="email">Email Address</Label>
						<div class="relative">
							<Input
								id="email"
								name="email"
								type="email"
								placeholder="jane@example.com"
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
						<Label for="password">Password</Label>
						<div class="relative">
							<Input
								id="password"
								name="password"
								type="password"
								placeholder="••••••••"
								required
								minlength={6}
								autocomplete="new-password"
								bind:value={passwordValue}
								class="pl-9"
								disabled={isSubmitting}
							/>
							<Lock class="absolute left-3 top-3 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
						</div>
						<p class="text-[11px] text-muted-foreground">Minimum 6 characters</p>
					</div>

					<!-- Confirm Password Field -->
					<div class="space-y-2">
						<Label for="confirmPassword">Confirm Password</Label>
						<div class="relative">
							<Input
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								placeholder="••••••••"
								required
								minlength={6}
								autocomplete="new-password"
								bind:value={confirmPasswordValue}
								class="pl-9"
								disabled={isSubmitting}
							/>
							<Lock class="absolute left-3 top-3 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
						</div>
					</div>

					<!-- Submit Button -->
					<Button type="submit" class="w-full gap-2 mt-2" disabled={isSubmitting}>
						{#if isSubmitting}
							<span>Creating account...</span>
						{:else}
							<span>Create Account</span>
							<ArrowRight class="h-4 w-4" />
						{/if}
					</Button>
				</form>
			</Card.Content>

			<Card.Footer class="flex justify-center border-t py-4 text-center">
				<p class="text-xs text-muted-foreground">
					Already have an account?{' '}
					<a href="/login" class="font-semibold text-primary underline-offset-4 hover:underline">
						Sign in
					</a>
				</p>
			</Card.Footer>
		</Card.Root>
	</div>
</div>
