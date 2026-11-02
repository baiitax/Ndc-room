import { describe, expect, it } from "vitest";
import { accountRoutes, allRoutes, getModule, navigation, searchRoutes } from "@/lib/navigation";
import { workflows } from "@/lib/workflows";

describe("navigation contract", () => {
  it("defines all three workspace structures without inventing records", () => { expect(Object.keys(navigation)).toEqual(["central", "zone", "field"]); expect(navigation.central).toHaveLength(16); expect(navigation.zone).toHaveLength(12); expect(navigation.field).toHaveLength(12); });
  it("has unique paths and a complete description, permission and workflow", () => {
    const routes = [...allRoutes, ...accountRoutes]; expect(new Set(routes.map((route) => route.path)).size).toBe(routes.length);
    for (const route of routes) { expect(route.path).toMatch(/^\/(central|zone|field|admin)\/[a-z-]+$/); expect(route.permission.length).toBeGreaterThan(0); expect(workflows[route.icon].length).toBeGreaterThanOrEqual(3); }
  });
  it("resolves known routes only", () => { expect(getModule("field", "report")?.path).toBe("/field/report"); expect(getModule("zone", "not-real")).toBeUndefined(); });
  it("searches navigation case-insensitively and does not cross workspace scope", () => { expect(searchRoutes(" EVIDENCE ", "central").map((r) => r.slug)).toContain("evidence"); expect(searchRoutes("evidence", "zone").every((r) => r.workspace === "zone")).toBe(true); expect(searchRoutes("xyznoresult")).toEqual([]); });
  it("limits results and handles blank input", () => { expect(searchRoutes(" ")).toHaveLength(8); expect(searchRoutes("e").length).toBeLessThanOrEqual(12); });
});
