import { Activity, ArrowUpRight, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";

export function ActivityFeed() {
  return <Card><CardHeader><CardTitle>Operational activity</CardTitle><CardDescription>Server-confirmed events, never simulated.</CardDescription></CardHeader><CardContent><EmptyState icon={Activity} title="The activity stream is not connected" description="Check-ins, submissions and response updates will appear here after real-time services and authorization are implemented." action={<Button asChild variant="outline" size="sm"><Link href="/central/audit">Explore audit module<ArrowUpRight /></Link></Button>} /></CardContent></Card>;
}
export function IncidentSummary() {
  return <Card><CardHeader><CardTitle>Incident watch</CardTitle><CardDescription>Allegations are not confirmed findings.</CardDescription></CardHeader><CardContent><EmptyState icon={ShieldAlert} title="Incident service not connected" description="Open, critical and resolved counts are unavailable. No incident data is being monitored by this preview." action={<Button asChild variant="outline" size="sm"><Link href="/central/incidents">View response workflow<ArrowUpRight /></Link></Button>} /></CardContent></Card>;
}
