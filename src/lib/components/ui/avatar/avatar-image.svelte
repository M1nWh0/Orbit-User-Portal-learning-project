<script>
	import { Avatar as AvatarPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		class: className,
		ref = $bindable(null),
		...restProps
	} = $props();
</script>

<AvatarPrimitive.Image
	bind:ref
	class={cn("aspect-square h-full w-full object-cover", className)}
	{...restProps}
/>
