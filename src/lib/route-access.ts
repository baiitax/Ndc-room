import type { Workspace } from "@/lib/navigation";

/** Contract only. No authenticated identity or membership provider exists in Phase 1. */
export type AccessDecision =
  | { kind: "redirect-login"; returnTo: string }
  | { kind: "deny"; reason: "inactive-membership" | "wrong-scope" | "mfa-required" | "missing-permission" };
export interface FutureAccessContext {
  authenticated: boolean;
  membershipActive: boolean;
  workspace: Workspace;
  membershipWorkspace: Workspace;
  zoneId: string | null;
  requestedZoneId: string | null;
  mfaSatisfied: boolean;
  permissionGranted: boolean;
}
export function evaluateFutureAccess(context: FutureAccessContext, returnTo: string): AccessDecision | { kind: "allow" } {
  if (!context.authenticated) return { kind: "redirect-login", returnTo };
  if (!context.membershipActive) return { kind: "deny", reason: "inactive-membership" };
  if (context.workspace !== context.membershipWorkspace || (context.workspace === "zone" && (!context.zoneId || context.zoneId !== context.requestedZoneId))) return { kind: "deny", reason: "wrong-scope" };
  if (!context.mfaSatisfied) return { kind: "deny", reason: "mfa-required" };
  if (!context.permissionGranted) return { kind: "deny", reason: "missing-permission" };
  return { kind: "allow" };
}
