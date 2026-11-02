import { cn } from "@/lib/utils";
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div aria-hidden="true" className={cn("motion-safe:animate-pulse rounded-md bg-muted", className)} {...props} />;
}
