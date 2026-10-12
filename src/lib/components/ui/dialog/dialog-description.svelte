<script>
	import { Dialog as DialogPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		class: className,
		ref = $bindable(null),
		children,
		...restProps
	} = $props();
</script>

<DialogPrimitive.Description
	bind:ref
	class={cn("text-sm text-muted-foreground", className)}
	{...restProps}
>
	{@render children?.()}
</DialogPrimitive.Description>
