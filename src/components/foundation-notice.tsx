import { FlaskConical, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function FoundationNotice() {
  return <aside aria-label="Foundation preview notice" className="border-b border-border bg-accent/60 px-4 py-2 sm:px-7">
    <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 text-[11px] leading-relaxed text-accent-foreground">
      <p className="flex items-center gap-2"><FlaskConical className="size-3.5 shrink-0" /><span><strong>Foundation preview.</strong> No live data, authentication or operational actions.</span></p>
      <Link href="/login" className="hidden min-h-11 shrink-0 items-center gap-1 rounded font-semibold underline-offset-4 hover:underline sm:inline-flex">Access information<ArrowUpRight className="size-3" /></Link>
    </div>
  </aside>;
}
