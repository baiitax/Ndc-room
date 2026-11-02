"use client";
import { Wifi, WifiOff } from "lucide-react";
import { useConnectivity } from "@/hooks/use-connectivity";
import { cn } from "@/lib/utils";

export function ConnectivityStatus({ compact = false }: { compact?: boolean }) {
  const { ready, online } = useConnectivity();
  const Icon = online ? Wifi : WifiOff;
  return <span role="status" className={cn("inline-flex items-center gap-2 text-xs", online ? "text-muted-foreground" : "text-warning")}>
    <Icon className="size-3.5 shrink-0" />
    <span>{!ready ? "Checking browser network" : online ? compact ? "Browser online" : "Browser online · services not connected" : "Offline · browser network unavailable"}</span>
  </span>;
}
