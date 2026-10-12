<script>
	import { cn } from "$lib/utils.js";

	let {
		class: className,
		ref = $bindable(null),
		children,
		...restProps
	} = $props();
</script>

<tfoot
	bind:this={ref}
	class={cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className)}
	{...restProps}
>
	{@render children?.()}
</tfoot>
