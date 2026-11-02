import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNavigation, FieldBottomNavigation } from "@/components/layout/mobile-navigation";
import { CommandSearch } from "@/components/layout/command-search";
import { NotificationCenter } from "@/components/layout/notification-center";
import { AccountMenu } from "@/components/layout/account-menu";
import { ThemeControl } from "@/components/theme-control";
import { FoundationNotice } from "@/components/foundation-notice";
import { ConnectivityStatus } from "@/components/connectivity-status";
import { Badge } from "@/components/ui/badge";
import { workspaceLabels, type Workspace } from "@/lib/navigation";

export function AppShell({ workspace, children, section = "Overview" }: { workspace: Workspace; children: ReactNode; section?: string }) {
  return <div className="flex min-h-dvh">
    <a href="#main-content" className="skip-link">Skip to main content</a>
    <Sidebar workspace={workspace} />
    <div className="min-w-0 flex-1">
      <FoundationNotice />
      <header className="glass-panel sticky top-0 z-30 flex h-[72px] items-center justify-between gap-3 border-b border-border px-3 sm:px-7">
        <div className="flex min-w-0 items-center gap-2"><MobileNavigation workspace={workspace} /><div className="hidden min-w-0 items-center gap-2 text-xs sm:flex"><span className="truncate text-muted-foreground">{workspaceLabels[workspace]}</span><ChevronRight className="size-3 shrink-0 text-muted-foreground" /><span className="truncate font-medium">{section}</span></div><Badge variant="accent" className="sm:hidden">Preview</Badge></div>
        <div className="flex shrink-0 items-center gap-0.5 sm:gap-2"><CommandSearch workspace={workspace} /><span className="mx-1 hidden h-6 w-px bg-border sm:block" /><ThemeControl /><NotificationCenter /><AccountMenu /></div>
      </header>
      <main id="main-content" tabIndex={-1} className={workspace === "field" ? "pb-24 lg:pb-0" : ""}>{children}</main>
      <footer className="mx-auto flex max-w-[1600px] flex-col justify-between gap-3 border-t border-border px-4 py-5 text-[10px] text-muted-foreground sm:flex-row sm:px-7"><span>Kano Election Monitor · Independent observation, accountable operations.</span><ConnectivityStatus /></footer>
    </div>
    {workspace === "field" && <FieldBottomNavigation />}
  </div>;
}
