import Link from "next/link";
import { Building2, MapPinned, Smartphone, ChevronRight } from "lucide-react";
import { workspaceLabels, type Workspace } from "@/lib/navigation";
import { cn } from "@/lib/utils";
const workspaces = [{ id: "central", href: "/central/dashboard", icon: Building2 }, { id: "zone", href: "/zone/dashboard", icon: MapPinned }, { id: "field", href: "/field/home", icon: Smartphone }] as const;

export function WorkspaceSwitcher({ current, compact = false }: { current: Workspace; compact?: boolean }) {
  return <div className={cn(compact ? "flex flex-wrap gap-2" : "space-y-1")} aria-label="Preview workspace navigation">
    {!compact && <p className="eyebrow px-3 pb-2">Preview workspaces</p>}
    {workspaces.map(({ id, href, icon: Icon }) => <Link key={id} href={href} aria-current={current === id ? "page" : undefined} className={cn("flex min-h-11 items-center gap-2.5 rounded-lg px-3 py-2 text-xs transition-colors", compact && "border border-border", current === id ? "bg-secondary font-semibold text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground")}><Icon className="size-4 shrink-0" />{!compact && <span className="flex-1">{workspaceLabels[id]}</span>}{current === id && !compact && <ChevronRight className="size-3.5 text-primary" />}{compact && workspaceLabels[id]}</Link>)}
  </div>;
}
