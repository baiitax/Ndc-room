import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function MetricPlaceholder({ label, icon: Icon, note = "Awaiting database connection" }: { label: string; icon: LucideIcon; note?: string }) {
  return <Card><CardContent className="p-5">
    <div className="flex items-center justify-between gap-2"><p className="text-xs font-medium text-muted-foreground">{label}</p><Icon className="size-4 text-muted-foreground" /></div>
    <p className="data-number mt-4 text-3xl text-muted-foreground" aria-label={`${label}: unavailable`}>—</p>
    <p className="mt-2 text-[10px] text-muted-foreground">{note}</p>
  </CardContent></Card>;
}
