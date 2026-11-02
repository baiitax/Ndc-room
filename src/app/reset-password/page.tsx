import Link from "next/link";
import { ShieldQuestion, ArrowLeft } from "lucide-react";
import { PublicShell } from "@/components/public/public-shell";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
export const metadata = { title: "Password reset unavailable" };
export default function Page() { return <PublicShell><div className="mx-auto max-w-lg px-5 py-20"><Card><CardHeader><ShieldQuestion className="mb-4 size-8 text-primary" /><Badge variant="warning" className="mb-2">Not connected · Phase 2</Badge><h1 className="text-2xl font-semibold tracking-tight">Password reset unavailable</h1><CardDescription>This route reserves the future recovery destination. No recovery token is validated and no password can be changed here.</CardDescription></CardHeader><CardContent><p className="mb-6 text-sm leading-relaxed text-muted-foreground">Do not enter credentials on this preview. Secure token handling, expiry, rate limits and account recovery will be implemented and tested in Phase 2.</p><Button asChild className="w-full"><Link href="/login"><ArrowLeft />Back to access information</Link></Button></CardContent></Card></div></PublicShell>; }
