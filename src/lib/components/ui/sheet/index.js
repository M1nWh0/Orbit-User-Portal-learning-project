import { Dialog as SheetPrimitive } from "bits-ui";
import Content, { sheetVariants } from "./sheet-content.svelte";
import Description from "./sheet-description.svelte";
import Footer from "./sheet-footer.svelte";
import Header from "./sheet-header.svelte";
import Overlay from "./sheet-overlay.svelte";
import Title from "./sheet-title.svelte";

const Root = SheetPrimitive.Root;
const Trigger = SheetPrimitive.Trigger;
const Close = SheetPrimitive.Close;
const Portal = SheetPrimitive.Portal;

export {
	Root,
	Trigger,
	Close,
	Portal,
	Header,
	Footer,
	Title,
	Description,
	Content,
	Overlay,
	sheetVariants,
	//
	Root as Sheet,
	Trigger as SheetTrigger,
	Close as SheetClose,
	Portal as SheetPortal,
	Header as SheetHeader,
	Footer as SheetFooter,
	Title as SheetTitle,
	Description as SheetDescription,
	Content as SheetContent,
	Overlay as SheetOverlay
};
