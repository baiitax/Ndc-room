import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Brand } from "@/components/brand";
import { ThemeControl } from "@/components/theme-control";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-dvh flex-col"><header className="flex min-h-20 flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3 sm:px-10"><Brand /><nav aria-label="Public navigation" className="flex items-center gap-1"><Link href="/central/dashboard" className="hidden min-h-11 items-center gap-1 rounded-lg px-3 text-xs font-medium text-muted-foreground hover:bg-muted sm:inline-flex">Explore preview<ArrowUpRight className="size-3" /></Link><ThemeControl /></nav></header><main id="main-content" className="flex-1">{children}</main><footer className="flex flex-wrap justify-between gap-4 border-t border-border px-5 py-6 text-xs text-muted-foreground sm:px-10"><span>Kano Election Monitor · Foundation preview</span><nav aria-label="Legal navigation" className="flex gap-5"><Link className="inline-flex min-h-11 items-center rounded hover:underline" href="/privacy">Privacy draft</Link><Link className="inline-flex min-h-11 items-center rounded hover:underline" href="/terms">Terms draft</Link></nav></footer></div>;
}
