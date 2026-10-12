<script>
	import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		class: className,
		ref = $bindable(null),
		...restProps
	} = $props();
</script>

<DropdownMenuPrimitive.Separator
	bind:ref
	class={cn("-mx-1 my-1 h-px bg-muted", className)}
	{...restProps}
/>
