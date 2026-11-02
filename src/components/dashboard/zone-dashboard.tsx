"use client";
import { useState } from "react";
import Link from "next/link";
import { Users, MapPin, ClipboardList, ShieldAlert, ArrowRight, MapPinned } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { MetricPlaceholder } from "@/components/metric-placeholder";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { ReadinessPanel } from "@/components/dashboard/readiness-panel";
import { districtNames } from "@/components/dashboard/zone-overview";

export function ZoneDashboard() {
  const [district, setDistrict] = useState<string>(districtNames[0]);
  return <div className="page-container">
    <PageHeading eyebrow="District operations" title="Senatorial command" description="A tablet-friendly workspace for district coordination. Selecting a preview label does not grant access to a real zone." />
    <Tabs value={district} onValueChange={setDistrict}><TabsList className="flex w-full flex-wrap sm:w-fit" aria-label="Preview district labels">{districtNames.map((name) => <TabsTrigger key={name} value={name} className="flex-1"><MapPinned className="size-4" />{name}</TabsTrigger>)}</TabsList>
      {districtNames.map((name) => <TabsContent key={name} value={name}><div className="mb-6 flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center"><div><div className="flex flex-wrap items-center gap-3"><h2 className="text-lg font-semibold">{name} situation room</h2><Badge variant="warning">Preview label</Badge></div><p className="mt-2 text-xs text-muted-foreground">No commander, geography release or personnel records connected.</p></div><Button asChild variant="outline"><Link href="/zone/assignments">Explore assignments<ArrowRight /></Link></Button></div>
        <section aria-label={`${name} metrics unavailable`} className="mb-6 grid grid-cols-2 gap-3 xl:grid-cols-4">{[{ label: "Assigned agents", icon: Users }, { label: "Covered polling units", icon: MapPin }, { label: "Reports received", icon: ClipboardList }, { label: "Open incidents", icon: ShieldAlert }].map((metric) => <MetricPlaceholder key={metric.label} {...metric} />)}</section>
        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_330px]"><div className="space-y-6"><Card><CardHeader><CardTitle>District response queue</CardTitle><CardDescription>Prioritized observations and assistance requests.</CardDescription></CardHeader><CardContent><EmptyState icon={ShieldAlert} title="No authorized queue connected" description="Incident counts and response ownership are unknown, not zero. Real records require district-scoped authorization." action={<Button asChild variant="outline"><Link href="/zone/incidents">View incident workflow</Link></Button>} /></CardContent></Card><Card><CardHeader><CardTitle>Coverage & personnel</CardTitle><CardDescription>Official assignments, explicit check-ins and reporting completeness.</CardDescription></CardHeader><CardContent><EmptyState icon={Users} title="Personnel not connected" description="Agents will appear only after verification and assignment within an authorized district." action={<Button asChild variant="outline"><Link href="/zone/agents">Explore agent management</Link></Button>} /></CardContent></Card></div><ReadinessPanel /></div>
      </TabsContent>)}
    </Tabs>
  </div>;
}
