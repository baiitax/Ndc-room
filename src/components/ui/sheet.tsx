"use client";
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;
export function SheetContent({ className, children, side = "right", ...props }: React.ComponentProps<typeof DialogPrimitive.Content> & { side?: "left" | "right" }) {
  return <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60" />
    <DialogPrimitive.Content className={cn("fixed inset-y-0 z-50 flex w-[min(24rem,90vw)] flex-col border-border bg-popover text-popover-foreground shadow-2xl focus:outline-none", side === "right" ? "right-0 border-l" : "left-0 border-r", className)} {...props}>
      {children}
      <DialogPrimitive.Close className="absolute right-3 top-3 inline-flex size-11 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"><X className="size-4" /><span className="sr-only">Close panel</span></DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>;
}
export function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div className={cn("border-b border-border px-6 py-6 pr-16", className)} {...props} />; }
export function SheetTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) { return <DialogPrimitive.Title className={cn("text-lg font-semibold", className)} {...props} />; }
export function SheetDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) { return <DialogPrimitive.Description className={cn("mt-1 text-sm leading-relaxed text-muted-foreground", className)} {...props} />; }
