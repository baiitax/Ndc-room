import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { accountRoutes, navigation, type Workspace } from "../../src/lib/navigation";

async function expectNoCriticalAxe(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(results.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })) }))).toEqual([]);
}

test("central shell, truthful metrics and security headers", async ({ page, request }) => {
  const response = await page.goto("/central/dashboard"); expect(response?.status()).toBe(200); expect(response?.headers()["x-content-type-options"]).toBe("nosniff");
  await expect(page.getByRole("heading", { name: "Central command", exact: true })).toBeVisible(); await expect(page.getByText("Foundation preview.", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Open incidents: unavailable")).toBeVisible(); await expect(page.getByText("Geography release not imported")).toBeVisible();
  const health = await request.get("/api/health"); expect(health.ok()).toBeTruthy(); expect(await health.json()).toMatchObject({ scope: "application-process-only", database: "not_configured", authentication: "not_configured" });
  await expectNoCriticalAxe(page);
});

test("navigation and route shells are reachable without horizontal overflow", async ({ page }, testInfo) => {
  const workspace: Workspace = testInfo.project.name === "mobile" ? "field" : testInfo.project.name === "tablet" ? "zone" : "central";
  for (const route of navigation[workspace]) {
    const response = await page.goto(route.path); expect(response?.status(), route.path).toBe(200); await expect(page.locator("h1")).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1); expect(overflow, `Overflow at ${route.path}`).toBe(false);
    if (route.slug !== "dashboard" && route.slug !== "home") { await expect(page.getByText("No operational service connected", { exact: true })).toBeVisible(); await expect(page.getByText(`Planned · Phase ${route.phase}`, { exact: true }).first()).toBeVisible(); }
  }
});

test("cross-workspace and account routes render", async ({ page }) => {
  for (const route of [...navigation.central, ...navigation.zone, ...navigation.field, ...accountRoutes]) { const response = await page.goto(route.path); expect(response?.status(), route.path).toBe(200); await expect(page.locator("h1")).toBeVisible(); }
});

test("keyboard skip link, global search, empty search and escape", async ({ page }) => {
  await page.goto("/central/dashboard"); await expect(page.getByRole("contentinfo").getByText("Browser online · services not connected")).toBeVisible(); await page.evaluate(() => { if (document.activeElement instanceof HTMLElement) document.activeElement.blur(); }); await page.keyboard.press("Tab"); await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused(); await page.keyboard.press("Enter"); await expect(page.locator("#main-content")).toBeFocused();
  await page.keyboard.press("Control+k"); await expect(page.getByRole("dialog")).toBeVisible(); const input = page.getByRole("textbox", { name: "Search navigation" }); await input.fill("evidence"); await expect(page.getByRole("link", { name: /Evidence repository/ })).toBeVisible();
  await input.fill("not-a-real-module"); await expect(page.getByRole("heading", { name: "No matching modules" })).toBeVisible(); await page.keyboard.press("Escape"); await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.getByRole("button", { name: "Search modules" }).click(); await page.getByRole("textbox", { name: "Search navigation" }).fill("reports"); await page.getByRole("textbox", { name: "Search navigation" }).press("Enter"); await expect(page).toHaveURL(/\/central\/reports$/);
});

test("notification and account shells expose no fake identity or records", async ({ page }) => {
  await page.goto("/zone/dashboard"); await page.getByRole("button", { name: "Open notification center" }).click(); await expect(page.getByRole("dialog")).toBeVisible(); await expect(page.getByRole("heading", { name: "No notification service connected" })).toBeVisible(); await expectNoCriticalAxe(page); await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Open account menu" }).click(); await expect(page.getByText("Preview · not signed in")).toBeVisible(); await page.getByRole("menuitem", { name: "Account security", exact: true }).click(); await expect(page).toHaveURL(/\/admin\/security$/); await expect(page.getByRole("heading", { name: "Account security", exact: true })).toBeVisible();
});

test("zone labels support pointer and keyboard without authorizing data", async ({ page }) => {
  await page.goto("/zone/dashboard"); await page.getByRole("tab", { name: "Kano South" }).click(); await expect(page.getByRole("heading", { name: "Kano South situation room" })).toBeVisible(); await page.getByRole("tab", { name: "Kano South" }).press("ArrowLeft"); await expect(page.getByRole("tab", { name: "Kano Central" })).toBeFocused(); await page.keyboard.press("Enter"); await expect(page.getByRole("heading", { name: "Kano Central situation room" })).toBeVisible();
});

test("theme persists and both themes pass WCAG A/AA automated checks", async ({ page }) => {
  await page.goto("/central/dashboard"); await page.getByRole("button", { name: "Change color theme" }).click(); await page.getByRole("menuitem", { name: "Light", exact: true }).click(); await expect(page.locator("html")).not.toHaveClass("dark"); await expectNoCriticalAxe(page); await page.reload(); await expect(page.locator("html")).not.toHaveClass("dark");
  await page.getByRole("button", { name: "Change color theme" }).click(); await page.getByRole("menuitem", { name: "Dark", exact: true }).click(); await expect(page.locator("html")).toHaveClass("dark"); await expectNoCriticalAxe(page);
});

test("mobile navigation, field shell and focus restoration", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "desktop", "Mobile shell on tablet/mobile projects");
  await page.goto("/field/home"); await expect(page.getByRole("navigation", { name: "Field quick navigation" })).toBeVisible(); await page.getByRole("button", { name: "Open navigation menu" }).click(); await expect(page.getByRole("dialog")).toBeVisible(); await page.getByRole("navigation", { name: "Mobile workspace navigation" }).getByRole("link", { name: "Submission history" }).click(); await expect(page).toHaveURL(/\/field\/history$/); await expect(page.getByRole("dialog")).not.toBeVisible(); await expect(page.getByRole("button", { name: "Open navigation menu" })).toBeFocused(); await expectNoCriticalAxe(page);
});

test("reduced motion, zoom and public legal boundaries", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" }); await page.goto("/field/home"); await expect(page.getByRole("heading", { name: "Your field desk" })).toBeVisible();
  await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; }); await expect(page.getByRole("heading", { name: "Your field desk" })).toBeVisible();
  for (const path of ["/login", "/privacy", "/terms", "/forgot-password", "/reset-password"]) { await page.goto(path); await expect(page.locator("h1")).toBeVisible(); if (path === "/privacy" || path === "/terms") await expect(page.getByText("DRAFT · NOT LEGALLY APPROVED")).toBeVisible(); }
  await page.goto("/login"); await expect(page.getByRole("heading", { name: "Secure sign-in is not enabled" })).toBeVisible(); await expect(page.locator("input")).toHaveCount(0); await expectNoCriticalAxe(page);
});

test("offline hint is explicitly not a backend health or offline-storage claim", async ({ page, context }) => {
  await page.goto("/field/home"); await context.setOffline(true); await expect(page.getByRole("contentinfo").getByText("Offline · browser network unavailable")).toBeVisible(); await expect(page.getByText("Offline storage is not enabled in this preview")).toBeVisible(); await context.setOffline(false); await expect(page.getByRole("contentinfo").getByText("Browser online · services not connected")).toBeVisible();
});

test("missing routes return a helpful not-found page", async ({ page }) => { const response = await page.goto("/central/does-not-exist"); expect(response?.status()).toBe(404); await expect(page.getByRole("heading", { name: "This workspace route doesn’t exist" })).toBeVisible(); });


test("320px reflow and visible control target baseline", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  for (const path of ["/central/dashboard", "/zone/dashboard", "/field/home"]) {
    await page.goto(path); await expect(page.locator("h1")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1), `320px overflow at ${path}`).toBe(false);
    const smallTargets = await page.locator("button:visible").evaluateAll((buttons) => buttons.filter((button) => { const box = button.getBoundingClientRect(); return box.width < 43.9 || box.height < 43.9; }).map((button) => button.getAttribute("aria-label") ?? button.textContent));
    expect(smallTargets, `Undersized buttons at ${path}`).toEqual([]);
  }
  await expectNoCriticalAxe(page);
});
