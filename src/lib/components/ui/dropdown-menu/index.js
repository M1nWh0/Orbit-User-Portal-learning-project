import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
import Content from "./dropdown-menu-content.svelte";
import Item from "./dropdown-menu-item.svelte";
import Label from "./dropdown-menu-label.svelte";
import Separator from "./dropdown-menu-separator.svelte";
import Shortcut from "./dropdown-menu-shortcut.svelte";

const Root = DropdownMenuPrimitive.Root;
const Trigger = DropdownMenuPrimitive.Trigger;
const Group = DropdownMenuPrimitive.Group;
const Portal = DropdownMenuPrimitive.Portal;

export {
	Root,
	Trigger,
	Content,
	Item,
	Label,
	Separator,
	Shortcut,
	Group,
	Portal,
	//
	Root as DropdownMenu,
	Trigger as DropdownMenuTrigger,
	Content as DropdownMenuContent,
	Item as DropdownMenuItem,
	Label as DropdownMenuLabel,
	Separator as DropdownMenuSeparator,
	Shortcut as DropdownMenuShortcut,
	Group as DropdownMenuGroup
};
