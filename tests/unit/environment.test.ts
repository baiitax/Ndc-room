import { describe, expect, it, vi } from "vitest";
import { parseEnvironment } from "@/lib/environment";
import { evaluateFutureAccess, type FutureAccessContext } from "@/lib/route-access";
import { logEvent } from "@/lib/logger";
import { cn } from "@/lib/utils";

describe("environment validation", () => {
  it("defaults to development with no origins", () => expect(parseEnvironment({})).toEqual({ APP_ENV: "development", APP_ALLOWED_ORIGINS: [] }));
  it("normalizes exact allowed hosts", () => expect(parseEnvironment({ APP_ALLOWED_ORIGINS: " Example.Org , app.example.org:3000 " }).APP_ALLOWED_ORIGINS).toEqual(["example.org", "app.example.org:3000"]));
  it.each(["https://example.org", "*.e2b.app", "example.org/path", "bad host", ""])("rejects invalid individual origin %s in a nonempty list", (host) => expect(() => parseEnvironment({ APP_ALLOWED_ORIGINS: `example.org,${host}` })).toThrow());
  it("rejects an invalid environment", () => expect(() => parseEnvironment({ APP_ENV: "prod" })).toThrow("APP_ENV"));
});
describe("future route access contract (not active middleware)", () => {
  const context: FutureAccessContext = { authenticated: true, membershipActive: true, workspace: "zone", membershipWorkspace: "zone", zoneId: "test-scope-a", requestedZoneId: "test-scope-a", mfaSatisfied: true, permissionGranted: true };
  it("preserves the requested destination for unauthenticated requests", () => expect(evaluateFutureAccess({ ...context, authenticated: false }, "/zone/reports")).toEqual({ kind: "redirect-login", returnTo: "/zone/reports" }));
  it.each([{ membershipActive: false }, { membershipWorkspace: "central" as const }, { requestedZoneId: "test-scope-b" }, { zoneId: null }, { mfaSatisfied: false }, { permissionGranted: false }])("denies insufficient authorization %o", (change) => expect(evaluateFutureAccess({ ...context, ...change }, "/zone/reports").kind).toBe("deny"));
  it("allows only when every future condition holds", () => expect(evaluateFutureAccess(context, "/zone/reports").kind).toBe("allow"));
});
describe("utility boundaries", () => {
  it("merges conditional classes", () => { expect(cn("p-2", false && "hidden", "p-4")).toBe("p-4"); });
  it("emits allowlisted structured log fields only", () => { const spy = vi.spyOn(console, "info").mockImplementation(() => {}); logEvent("info", "application.started", { requestId: "test-request", code: "OK" }); const entry = JSON.parse(spy.mock.calls[0]![0] as string); expect(entry).toMatchObject({ event: "application.started", requestId: "test-request", code: "OK", level: "info" }); expect(Object.keys(entry).sort()).toEqual(["code", "event", "level", "requestId", "timestamp"]); });
});
