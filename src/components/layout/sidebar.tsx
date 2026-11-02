"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocalPreference } from "@/hooks/use-local-preference";
import { PanelLeftClose, PanelLeftOpen, CircleHelp } from "lucide-react";
import { Brand } from "@/components/brand";
import { WorkspaceSwitcher } from "@/components/layout/workspace-switcher";
import { ModuleIcon } from "@/components/layout/icon";
import { Button } from "@/components/ui/button";
import { navigation, type Workspace } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function Sidebar({ workspace }: { workspace: Workspace }) {
  const pathname = usePathname();
  const [storedCollapsed, setStoredCollapsed] = useLocalPreference("kemsr.sidebar", "expanded", ["expanded", "collapsed"]);
  const collapsed = storedCollapsed === "collapsed";
  function toggle() { setStoredCollapsed(collapsed ? "expanded" : "collapsed"); }
  const groups = [...new Set(navigation[workspace].map((item) => item.group))];
  return <aside className={cn("sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-border bg-sidebar transition-[width] lg:flex", collapsed ? "w-[78px]" : "w-[254px]")}>
    <div className={cn("flex h-[82px] shrink-0 items-center border-b border-border", collapsed ? "justify-center px-2" : "px-5")}><Brand compact={collapsed} /></div>
    <div className={cn("shrink-0 border-b border-border py-4", collapsed ? "px-3" : "px-3")}>
      {!collapsed && <WorkspaceSwitcher current={workspace} />}
      {collapsed && <div className="mt-2 space-y-1">{(["central", "zone", "field"] as const).map((id) => <Link key={id} href={id === "field" ? "/field/home" : `/${id}/dashboard`} aria-label={`Preview ${id} workspace`} className={cn("flex size-11 items-center justify-center rounded-lg", workspace === id ? "bg-accent text-primary" : "text-muted-foreground hover:bg-muted")}><ModuleIcon name={id === "field" ? "profile" : id === "zone" ? "zones" : "dashboard"} /></Link>)}</div>}
    </div>
    <nav aria-label={`${workspace} navigation`} className="min-h-0 flex-1 overflow-y-auto px-3 py-5">
      {groups.map((group) => <div key={group} className="mb-5">{!collapsed && <p className="eyebrow mb-2 px-3">{group}</p>}<div className="space-y-0.5">{navigation[workspace].filter((item) => item.group === group).map((item) => <Link key={item.path} href={item.path} title={collapsed ? item.title : undefined} aria-current={pathname === item.path ? "page" : undefined} className={cn("nav-link", pathname === item.path && "nav-link-active", collapsed && "justify-center px-0")}><ModuleIcon name={item.icon} />{collapsed ? <span className="sr-only">{item.title}</span> : <span className="flex-1">{item.title}</span>}</Link>)}</div></div>)}
    </nav>
    <div className="shrink-0 border-t border-border p-3"><Link href="/login" className={cn("nav-link", collapsed && "justify-center px-0")} title="Platform information"><CircleHelp className="size-4" />{collapsed ? <span className="sr-only">Platform information</span> : "Platform information"}</Link><Button variant="ghost" size={collapsed ? "icon" : "default"} onClick={toggle} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} aria-expanded={!collapsed} className="mt-1 w-full justify-start text-xs">{collapsed ? <PanelLeftOpen /> : <><PanelLeftClose />Collapse sidebar</>}</Button></div>
  </aside>;
}
