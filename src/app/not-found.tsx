import Link from "next/link";
import { ArrowLeft, MapPinOff } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function NotFound() { return <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center px-6 text-center"><MapPinOff className="mb-6 size-12 text-primary" /><p className="eyebrow">404 · Route not found</p><h1 className="mt-3 text-3xl font-semibold">This workspace route doesn’t exist</h1><p className="mt-4 text-sm leading-relaxed text-muted-foreground">Check the address or return to the central command preview. No operational data is available at this route.</p><Button asChild className="mt-7"><Link href="/central/dashboard"><ArrowLeft />Return to central command</Link></Button></main>; }
