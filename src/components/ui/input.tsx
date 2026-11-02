import * as React from "react";
import { cn } from "@/lib/utils";
export function Input({ className, type = "text", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input type={type} data-slot="input" className={cn("flex min-h-12 w-full rounded-lg border border-input bg-background px-3 py-2 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50", className)} {...props} />;
}
