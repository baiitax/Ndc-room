"use client";
import * as React from "react";
import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";
export const DropdownMenu = DropdownPrimitive.Root;
export const DropdownMenuTrigger = DropdownPrimitive.Trigger;
export function DropdownMenuContent({ className, sideOffset = 6, ...props }: React.ComponentProps<typeof DropdownPrimitive.Content>) {
  return <DropdownPrimitive.Portal><DropdownPrimitive.Content sideOffset={sideOffset} className={cn("z-50 min-w-52 rounded-lg border border-border bg-popover p-1.5 text-popover-foreground shadow-xl", className)} {...props} /></DropdownPrimitive.Portal>;
}
export function DropdownMenuItem({ className, ...props }: React.ComponentProps<typeof DropdownPrimitive.Item>) {
  return <DropdownPrimitive.Item className={cn("relative flex min-h-11 cursor-pointer select-none items-center gap-2 rounded-md px-3 py-2 text-sm outline-none focus:bg-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:size-4", className)} {...props} />;
}
export function DropdownMenuLabel({ className, ...props }: React.ComponentProps<typeof DropdownPrimitive.Label>) { return <DropdownPrimitive.Label className={cn("px-3 py-2 text-xs font-semibold text-muted-foreground", className)} {...props} />; }
export function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<typeof DropdownPrimitive.Separator>) { return <DropdownPrimitive.Separator className={cn("my-1 h-px bg-border", className)} {...props} />; }
