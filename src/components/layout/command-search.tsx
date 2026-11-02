"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowUpRight, CornerDownLeft } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";
import { ModuleIcon } from "@/components/layout/icon";
import { searchRoutes, workspaceLabels, type Workspace } from "@/lib/navigation";
import Link from "next/link";

export function CommandSearch({ workspace }: { workspace?: Workspace }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const results = searchRoutes(query, workspace);
  useEffect(() => {
    const down = (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setOpen((value) => !value); } };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, []);
  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild><Button variant="outline" className="hidden h-10 min-w-60 justify-between gap-6 text-muted-foreground md:inline-flex"><span className="flex items-center gap-2"><Search className="size-4" />Search modules…</span><kbd className="rounded border border-border px-1.5 py-0.5 text-[10px]">⌘ K</kbd></Button></DialogTrigger>
    <Button variant="ghost" size="icon" className="md:hidden" aria-label="Search modules" onClick={() => setOpen(true)}><Search /></Button>
    <DialogContent className="top-[12%] max-w-xl translate-y-0 p-0">
      <DialogHeader className="mb-0 p-5 pb-3"><DialogTitle>Find a module</DialogTitle><DialogDescription>Search navigation only. Operational records require authentication in a later phase.</DialogDescription></DialogHeader>
      <div className="px-5"><Input autoFocus aria-label="Search navigation" placeholder="Try reports, evidence or security…" value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && results[0]) { setOpen(false); router.push(results[0].path); } }} /></div>
      <div className="mt-3 max-h-[55dvh] overflow-y-auto p-3" aria-live="polite">
        {results.length ? results.map((item) => <Link key={item.path} href={item.path} onClick={() => setOpen(false)} className="flex min-h-16 items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted"><ModuleIcon name={item.icon} /></span>
          <span className="min-w-0 flex-1"><span className="block text-sm font-medium">{item.title}</span><span className="block truncate text-xs text-muted-foreground">{workspace ? item.description : workspaceLabels[item.path.split("/")[1] as Workspace]}</span></span>
          <Badge>Phase {item.phase}</Badge><ArrowUpRight className="size-3.5 text-muted-foreground" />
        </Link>) : <EmptyState icon={Search} title="No matching modules" description="Try a module name. This preview does not search people, reports or evidence." />}
      </div>
      <div className="flex items-center gap-2 border-t border-border px-5 py-3 text-[10px] text-muted-foreground"><CornerDownLeft className="size-3" />Enter opens the first result · Tab moves through results · Esc closes</div>
    </DialogContent>
  </Dialog>;
}
