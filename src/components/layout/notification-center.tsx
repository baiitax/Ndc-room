"use client";
import { useState } from "react";
import { Bell, BellOff, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  return <Sheet open={open} onOpenChange={setOpen}>
    <SheetTrigger asChild><Button variant="ghost" size="icon" aria-label="Open notification center" title="Notification center"><Bell /></Button></SheetTrigger>
    <SheetContent>
      <SheetHeader><SheetTitle>Notification center</SheetTitle><SheetDescription>Operational updates, securely delivered.</SheetDescription></SheetHeader>
      <div className="flex flex-1 flex-col justify-center">
        <EmptyState icon={BellOff} title="No notification service connected" description="This foundation preview does not subscribe to operational events. Alerts and messages will appear only after authorized services are implemented." action={<Button asChild variant="outline"><Link href="/admin/notifications" onClick={() => setOpen(false)}>View notification preferences</Link></Button>} />
      </div>
      <div className="m-5 flex gap-3 rounded-lg border border-border bg-muted p-4"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" /><div><p className="text-xs font-semibold">Privacy by design</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">Future lock-screen notifications will use generic previews. Sensitive details will require authorized access.</p><Badge className="mt-3">Planned · Phase 10</Badge></div></div>
    </SheetContent>
  </Sheet>;
}
