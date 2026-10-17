<script>
	import { Select as SelectPrimitive } from "bits-ui";
	import Check from "@lucide/svelte/icons/check";
	import { cn } from "$lib/utils.js";

	let {
		class: className,
		value,
		label,
		ref = $bindable(null),
		children,
		...restProps
	} = $props();
</script>

<SelectPrimitive.Item
	bind:ref
	{value}
	{label}
	class={cn(
		"relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50",
		className
	)}
	{...restProps}
>
	{#snippet children({ isSelected })}
		<span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
			{#if isSelected}
				<Check class="h-4 w-4" />
			{/if}
		</span>
		{@render children?.()}
	{/snippet}
</SelectPrimitive.Item>
