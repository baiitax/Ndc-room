import Link from "next/link";
import { ArrowUpRight, CheckCircle2, CircleDashed, Database, LockKeyhole, Layers, Workflow } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ModuleIcon } from "@/components/layout/icon";
import { workspaceLabels, type AppRoute } from "@/lib/navigation";
import { workflows } from "@/lib/workflows";

export function ModuleShell({ route }: { route: AppRoute }) {
  return <div className="page-container">
    <PageHeading eyebrow={`${workspaceLabels[route.workspace]} / ${route.group}`} title={route.title} description={route.description} action={<Badge className="mt-1">Planned · Phase {route.phase}</Badge>} />
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="space-y-6"><Card><CardHeader><div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><ModuleIcon name={route.icon} className="size-5" /></div><CardTitle>{route.title} workspace</CardTitle><CardDescription>This navigation and interaction foundation is implemented. Operational workflows are not enabled.</CardDescription></CardHeader><CardContent><EmptyState icon={Database} title="No operational service connected" description="No records have been fetched, created or simulated. Secure access and the module’s domain services must be implemented and tested before real operations." className="rounded-lg border border-dashed border-border bg-background/50" action={<Button asChild variant="outline"><Link href="/login">Review access requirements<ArrowUpRight /></Link></Button>} /></CardContent></Card>
      <Card><CardHeader><CardTitle>Designed workflow</CardTitle><CardDescription>Architecturally defined contracts, not implemented features.</CardDescription></CardHeader><CardContent><ol className="space-y-5">{workflows[route.icon].map((step, index) => <li key={step} className="flex items-start gap-3"><span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-xs font-semibold text-muted-foreground">{index + 1}</span><p className="pt-1 text-sm leading-relaxed">{step}</p></li>)}</ol></CardContent></Card></div>
      <div className="space-y-6"><Card><CardHeader><CardTitle>Implementation boundary</CardTitle><CardDescription>Honest status, by design.</CardDescription></CardHeader><CardContent className="space-y-5">{[{ label: "Navigation & responsive shell", status: "Phase 1 · code implemented", icon: CheckCircle2, active: true }, { label: "Identity & database authorization", status: "Required · Phase 2", icon: LockKeyhole, active: false }, { label: "Operational module services", status: `Planned · Phase ${route.phase}`, icon: Layers, active: false }, { label: "End-to-end acceptance", status: "Not verified", icon: Workflow, active: false }].map(({ label, status, icon: Icon, active }) => <div key={label} className="flex items-start gap-3"><Icon className={`mt-0.5 size-4 shrink-0 ${active ? "text-primary" : "text-muted-foreground"}`} /><div><p className="text-xs font-semibold">{label}</p><p className="mt-1 text-[11px] text-muted-foreground">{status}</p></div></div>)}</CardContent></Card>
      <Card><CardHeader><CardTitle>Required permission</CardTitle></CardHeader><CardContent><code className="block break-all rounded-lg border border-border bg-muted px-3 py-3 text-xs text-primary">{route.permission}</code><p className="mt-3 text-xs leading-relaxed text-muted-foreground">This is a future server/database policy contract, not an authorization check active in this preview.</p><div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><CircleDashed className="size-3.5" />No sensitive records exposed</div></CardContent></Card></div>
    </div>
  </div>;
}
