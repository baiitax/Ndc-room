import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

export function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
    <div><p className="eyebrow mb-2">{eyebrow}</p><h1 className="text-2xl font-semibold tracking-tight sm:text-[28px]">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p></div>
    {action ?? <Badge className="mt-1 shrink-0">Not connected</Badge>}
  </div>;
}
