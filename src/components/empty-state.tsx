import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function EmptyState({ icon: Icon = Inbox, title, description, action, className }: { icon?: LucideIcon; title: string; description: string; action?: ReactNode; className?: string }) {
  return <div className={cn("flex flex-col items-center justify-center px-5 py-10 text-center", className)}>
    <span className="mb-4 flex size-12 items-center justify-center rounded-xl border border-border bg-muted text-muted-foreground"><Icon className="size-5" /></span>
    <h3 className="text-sm font-semibold">{title}</h3>
    <p className="mt-2 max-w-sm text-xs leading-relaxed text-muted-foreground">{description}</p>
    {action && <div className="mt-5">{action}</div>}
  </div>;
}
