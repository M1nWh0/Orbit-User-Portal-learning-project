<script>
	import { cn } from "$lib/utils.js";

	let {
		class: className,
		ref = $bindable(null),
		children,
		...restProps
	} = $props();
</script>

<td
	bind:this={ref}
	class={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
	{...restProps}
>
	{@render children?.()}
</td>
