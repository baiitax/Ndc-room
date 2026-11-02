import Link from "next/link";
import { ArrowRight, ClipboardList, Users, MapPin, ShieldAlert, Radio, Clock3, BookOpen, ChevronRight } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { MetricPlaceholder } from "@/components/metric-placeholder";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ZoneOverview } from "@/components/dashboard/zone-overview";
import { ReadinessPanel } from "@/components/dashboard/readiness-panel";
import { ActivityFeed, IncidentSummary } from "@/components/dashboard/activity-feed";

export function CentralDashboard() {
  return <div className="page-container">
    <PageHeading eyebrow="Statewide operations" title="Central command" description="A unified view of election observation across Kano State. Operational data will appear when secure services are connected." action={<Badge variant="warning" className="mt-1"><Clock3 className="size-3" />Election not configured</Badge>} />
    <section aria-label="Command introduction" className="hero-panel relative mb-6 overflow-hidden rounded-xl border border-white/10 p-6 sm:p-8">
      <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-28 size-80 rounded-full border-[36px] border-white/[0.025]" />
      <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center"><div className="max-w-2xl"><span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[10px] font-semibold tracking-wider text-[#a5eee1]"><Radio className="size-3" />COMMAND CENTER · FOUNDATION</span><h2 className="text-2xl font-semibold leading-tight tracking-tight sm:text-[30px]">Clear visibility.<br />Coordinated response.</h2><p className="mt-3 max-w-lg text-sm leading-relaxed text-[#c4d6e1]">Preparing the operational foundation for central command, three senatorial zones and field observers. No live election activity is represented.</p><div className="mt-6 flex flex-wrap gap-3"><Button asChild className="bg-[#5eead4] text-[#0b1623] hover:bg-[#99f6e4]"><Link href="/central/zones">Explore command structure<ArrowRight /></Link></Button><Button asChild variant="outline" className="border-white/25 text-white hover:bg-white/10 hover:text-white"><Link href="/login"><BookOpen />Platform information</Link></Button></div></div>
      <div className="grid w-full shrink-0 grid-cols-2 gap-x-7 gap-y-5 border-t border-white/15 pt-5 md:w-auto md:border-l md:border-t-0 md:pl-8 md:pt-0"><div><p className="text-3xl font-light text-white">03</p><p className="mt-1 text-[10px] uppercase tracking-wider text-[#c4d6e1]">Senatorial zones</p></div><div><p className="text-3xl font-light text-white">44</p><p className="mt-1 text-[10px] uppercase tracking-wider text-[#c4d6e1]">LGAs in mandate</p></div><div className="col-span-2 flex items-center gap-2 text-[11px] text-[#c4d6e1]"><span className="size-1.5 rounded-full bg-[#fcd34d]" />Geography release not imported</div></div></div>
    </section>
    <section aria-label="Statewide metrics unavailable" className="mb-6 grid grid-cols-2 gap-3 xl:grid-cols-4">{[{ label: "Registered agents", icon: Users }, { label: "Assigned polling units", icon: MapPin }, { label: "Reports received", icon: ClipboardList }, { label: "Open incidents", icon: ShieldAlert }].map((metric) => <MetricPlaceholder key={metric.label} {...metric} />)}</section>
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_330px]"><div className="min-w-0 space-y-6"><ZoneOverview /><div className="grid gap-6 md:grid-cols-2"><ActivityFeed /><IncidentSummary /></div></div><div className="space-y-6"><ReadinessPanel /><section className="rounded-xl border border-border bg-card p-5"><p className="eyebrow">Information integrity</p><h2 className="mt-3 text-sm font-semibold">Observation is not declaration.</h2><p className="mt-2 text-xs leading-relaxed text-muted-foreground">Field transcriptions, verified observations and official publications remain separate. This platform does not declare election winners.</p><Link href="/central/results" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded text-xs font-semibold text-primary">Understand result handling<ChevronRight className="size-3" /></Link></section></div></div>
  </div>;
}
