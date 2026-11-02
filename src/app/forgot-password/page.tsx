import Link from "next/link";
import { KeyRound, ArrowLeft } from "lucide-react";
import { PublicShell } from "@/components/public/public-shell";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
export const metadata = { title: "Account recovery information" };
export default function Page() { return <PublicShell><div className="mx-auto max-w-lg px-5 py-20"><Card><CardHeader><KeyRound className="mb-4 size-8 text-primary" /><Badge variant="warning" className="mb-2">Not connected · Phase 2</Badge><h1 className="text-2xl font-semibold tracking-tight">Account recovery</h1><CardDescription>Password reset requests are not available in this foundation preview. No email address is collected and no reset message will be sent.</CardDescription></CardHeader><CardContent><p className="mb-6 text-sm leading-relaxed text-muted-foreground">After authentication is implemented, use the approved recovery process or contact your authorized platform administrator. Never share a password or MFA code in a field report or message.</p><Button asChild className="w-full"><Link href="/login"><ArrowLeft />Back to access information</Link></Button></CardContent></Card></div></PublicShell>; }
