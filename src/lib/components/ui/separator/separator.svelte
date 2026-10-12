<script>
	import { Separator as SeparatorPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		class: className,
		orientation = "horizontal",
		decorative = true,
		ref = $bindable(null),
		...restProps
	} = $props();
</script>

<SeparatorPrimitive.Root
	bind:ref
	{decorative}
	{orientation}
	class={cn(
		"shrink-0 bg-border",
		orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
		className
	)}
	{...restProps}
/>
