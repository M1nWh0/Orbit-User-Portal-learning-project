import { Select as SelectPrimitive } from "bits-ui";
import Content from "./select-content.svelte";
import Item from "./select-item.svelte";
import Trigger from "./select-trigger.svelte";
import GroupHeading from "./select-group-heading.svelte";

const Root = SelectPrimitive.Root;
const Group = SelectPrimitive.Group;
const Portal = SelectPrimitive.Portal;
const Value = SelectPrimitive.Value;

export {
	Root,
	Content,
	Item,
	Trigger,
	Group,
	GroupHeading,
	Portal,
	Value,
	//
	Root as Select,
	Content as SelectContent,
	Item as SelectItem,
	Trigger as SelectTrigger,
	Group as SelectGroup,
	GroupHeading as SelectGroupHeading,
	Portal as SelectPortal,
	Value as SelectValue
};
