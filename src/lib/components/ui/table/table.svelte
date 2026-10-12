<script>
	import { cn } from "$lib/utils.js";

	let {
		class: className,
		ref = $bindable(null),
		children,
		...restProps
	} = $props();
</script>

<div class="relative w-full overflow-auto">
	<table
		bind:this={ref}
		class={cn("w-full caption-bottom text-sm", className)}
		{...restProps}
	>
		{@render children?.()}
	</table>
</div>
