import Link from "next/link";
import { ArrowUpRight, MapPinned, Radio, Users, ClipboardList } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const districtNames = ["Kano North", "Kano Central", "Kano South"] as const;
export function ZoneOverview() {
  return <Card>
    <CardHeader className="flex-row items-start justify-between gap-3"><div><CardTitle>Senatorial overview</CardTitle><CardDescription className="mt-1">Three command structures. One accountable system.</CardDescription></div><Badge>Not live</Badge></CardHeader>
    <CardContent className="grid gap-3 md:grid-cols-3">{districtNames.map((name, index) => <Link href="/central/zones" key={name} className="group rounded-lg border border-border bg-background/40 p-4 hover:border-primary/50 hover:bg-muted">
      <div className="flex items-center justify-between"><span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground"><MapPinned className="size-4" /></span><span className="text-[10px] font-medium text-muted-foreground">ZONE 0{index + 1}</span></div>
      <h3 className="mt-4 text-sm font-semibold">{name}</h3><p className="mt-1 text-[11px] text-muted-foreground">Commander not assigned</p>
      <div className="mt-5 space-y-3 border-t border-border pt-4">{[{ label: "Assigned agents", icon: Users }, { label: "Reports received", icon: ClipboardList }, { label: "Coverage", icon: Radio }].map(({ label, icon: Icon }) => <div key={label} className="flex items-center justify-between gap-2 text-[11px]"><span className="flex items-center gap-2 text-muted-foreground"><Icon className="size-3" />{label}</span><span aria-label={`${label} unavailable`} className="font-medium text-muted-foreground">—</span></div>)}</div>
      <span className="mt-4 flex items-center gap-1 text-[11px] font-semibold text-primary">View zone structure<ArrowUpRight className="size-3" /></span>
    </Link>)}</CardContent>
  </Card>;
}
