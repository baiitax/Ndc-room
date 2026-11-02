import Link from "next/link";
import { ArrowUpRight, Check, CircleDashed, Database, KeyRound, MapPinned, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const steps = [
  { title: "Architecture & permissions", description: "Blueprint delivered; foundation authorized", icon: ShieldCheck, status: "Defined", href: "/login" },
  { title: "Identity & secure access", description: "Supabase Auth, scoped roles and MFA", icon: KeyRound, status: "Phase 2", href: "/admin/security" },
  { title: "Official electoral geography", description: "Approved INEC release and source validation", icon: MapPinned, status: "Awaiting source", href: "/central/settings" },
  { title: "Operational data services", description: "Reports, evidence and authorized realtime", icon: Database, status: "Not connected", href: "/central/reports" },
];
export function ReadinessPanel() {
  return <Card className="overflow-hidden">
    <CardHeader className="border-b border-border"><div className="flex items-center justify-between gap-2"><CardTitle>Operational readiness</CardTitle><Badge variant="warning">Foundation</Badge></div><CardDescription>What must be in place before election operations.</CardDescription></CardHeader>
    <CardContent className="p-0">{steps.map(({ title, description, icon: Icon, status, href }, index) => <Link key={title} href={href} className="group flex items-start gap-3 border-b border-border px-5 py-4 last:border-b-0 hover:bg-muted"><span className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg ${index === 0 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{index === 0 ? <Check className="size-4" /> : <Icon className="size-4" />}</span><span className="min-w-0 flex-1"><span className="block text-xs font-semibold">{title}</span><span className="mt-1 block text-[11px] leading-relaxed text-muted-foreground">{description}</span><span className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground"><CircleDashed className="size-3" />{status}</span></span><ArrowUpRight className="mt-1 size-3.5 text-muted-foreground group-hover:text-primary" /></Link>)}</CardContent>
  </Card>;
}
