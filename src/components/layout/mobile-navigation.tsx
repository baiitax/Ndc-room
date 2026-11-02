"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Brand } from "@/components/brand";
import { ModuleIcon } from "@/components/layout/icon";
import { WorkspaceSwitcher } from "@/components/layout/workspace-switcher";
import { navigation, workspaceLabels, type Workspace } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function MobileNavigation({ workspace }: { workspace: Workspace }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return <Sheet open={open} onOpenChange={setOpen}><SheetTrigger asChild><Button className="lg:hidden" variant="ghost" size="icon" aria-label="Open navigation menu"><Menu /></Button></SheetTrigger>
    <SheetContent side="left"><SheetHeader><SheetTitle><Brand /></SheetTitle><SheetDescription>{workspaceLabels[workspace]} · foundation preview</SheetDescription></SheetHeader>
      <div className="overflow-y-auto p-4" onClick={(event) => { if (event.target instanceof Element && event.target.closest("a")) setOpen(false); }}><WorkspaceSwitcher current={workspace} compact /><nav aria-label="Mobile workspace navigation" className="mt-5 space-y-1">{navigation[workspace].map((item) => <Link key={item.path} href={item.path} aria-current={pathname === item.path ? "page" : undefined} className={cn("nav-link", pathname === item.path && "nav-link-active")}><ModuleIcon name={item.icon} />{item.title}</Link>)}</nav></div>
    </SheetContent>
  </Sheet>;
}

export function FieldBottomNavigation() {
  const pathname = usePathname();
  const items = [navigation.field[0]!, navigation.field[2]!, navigation.field[3]!, navigation.field[7]!, navigation.field[11]!];
  return <nav aria-label="Field quick navigation" className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-card pb-[env(safe-area-inset-bottom)] lg:hidden">{items.map((item) => <Link key={item.path} href={item.path} aria-current={pathname === item.path ? "page" : undefined} className={cn("flex min-h-16 flex-col items-center justify-center gap-1.5 px-1 text-[10px] font-medium", pathname === item.path ? "bg-accent text-primary" : "text-muted-foreground")}><ModuleIcon name={item.icon} className="size-5" />{item.slug === "home" ? "Home" : item.slug === "checkin" ? "Check-in" : item.slug === "report" ? "Report" : item.slug === "messages" ? "Messages" : "Sync"}</Link>)}</nav>;
}
