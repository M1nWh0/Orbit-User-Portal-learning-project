<script>
	import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		class: className,
		ref = $bindable(null),
		inset = false,
		children,
		...restProps
	} = $props();
</script>

<DropdownMenuPrimitive.GroupHeading
	bind:ref
	class={cn("px-2 py-1.5 text-xs font-semibold text-muted-foreground", inset && "pl-8", className)}
	{...restProps}
>
	{@render children?.()}
</DropdownMenuPrimitive.GroupHeading>
