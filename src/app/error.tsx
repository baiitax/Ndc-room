"use client";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Brand } from "@/components/brand";
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center px-6 py-12 text-center"><Brand /><AlertTriangle className="mb-5 mt-12 size-10 text-warning" /><h1 className="text-2xl font-semibold">This page couldn’t load</h1><p className="mt-3 text-sm leading-relaxed text-muted-foreground">An unexpected application error occurred. No operational submission has been confirmed by this page. You can safely retry.</p><Button onClick={reset} className="mt-6"><RefreshCw />Try again</Button></main>;
}
