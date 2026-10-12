<script>
	import { Avatar as AvatarPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		class: className,
		ref = $bindable(null),
		children,
		...restProps
	} = $props();
</script>

<AvatarPrimitive.Fallback
	bind:ref
	class={cn("flex h-full w-full items-center justify-center rounded-full bg-muted font-medium text-muted-foreground", className)}
	{...restProps}
>
	{@render children?.()}
</AvatarPrimitive.Fallback>
