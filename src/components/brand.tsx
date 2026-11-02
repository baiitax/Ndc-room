import Link from "next/link";
import { ScanLine } from "lucide-react";
import { cn } from "@/lib/utils";

export function Brand({ compact = false, className }: { compact?: boolean; className?: string }) {
  return <Link href="/" className={cn("flex min-h-11 items-center gap-3 rounded-lg", className)} aria-label="Kano Election Monitor home">
    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary"><ScanLine className="size-6" /></span>
    {!compact && <span className="leading-tight"><span className="block text-sm font-bold tracking-tight">KANO<span className="ml-1.5 font-normal text-primary">ELECTION MONITOR</span></span><span className="mt-1 block text-[10px] tracking-[0.14em] text-muted-foreground">SITUATION ROOM PLATFORM</span></span>}
  </Link>;
}
