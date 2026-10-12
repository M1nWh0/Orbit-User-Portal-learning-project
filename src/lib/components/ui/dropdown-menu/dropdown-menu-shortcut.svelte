<script>
	import { cn } from "$lib/utils.js";

	let {
		class: className,
		children,
		...restProps
	} = $props();
</script>

<span
	class={cn("ml-auto text-xs tracking-widest opacity-60", className)}
	{...restProps}
>
	{@render children?.()}
</span>
