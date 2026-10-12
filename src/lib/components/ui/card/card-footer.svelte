<script>
	import { cn } from "$lib/utils.js";

	let {
		class: className,
		ref = $bindable(null),
		children,
		...restProps
	} = $props();
</script>

<div
	bind:this={ref}
	class={cn("flex items-center p-6 pt-0", className)}
	{...restProps}
>
	{@render children?.()}
</div>
