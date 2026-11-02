import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";
import { MetricPlaceholder } from "@/components/metric-placeholder";
import { ModuleShell } from "@/components/module-shell";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeControl } from "@/components/theme-control";
import { FieldBottomNavigation } from "@/components/layout/mobile-navigation";
import { getModule } from "@/lib/navigation";

vi.mock("next/navigation", () => ({ usePathname: () => "/field/home", useRouter: () => ({ push: vi.fn() }) }));
vi.mock("next/link", () => ({ default: ({ children, ...props }: React.ComponentProps<"a">) => <a {...props}>{children}</a> }));

describe("foundation components", () => {
  it("provides native button semantics and working action", async () => { const action = vi.fn(); const user = userEvent.setup(); render(<Button onClick={action}>Review</Button>); await user.click(screen.getByRole("button", { name: "Review" })); expect(action).toHaveBeenCalledOnce(); });
  it("does not invoke disabled actions", async () => { const action = vi.fn(); render(<Button disabled onClick={action}>Unavailable</Button>); await userEvent.setup().click(screen.getByRole("button", { name: "Unavailable" })); expect(action).not.toHaveBeenCalled(); });
  it("renders truthful empty state with optional action", () => { render(<EmptyState icon={Inbox} title="Not connected" description="No records were fetched." action={<Button>Information</Button>} />); expect(screen.getByRole("heading", { name: "Not connected" })).toBeInTheDocument(); expect(screen.getByRole("button", { name: "Information" })).toBeInTheDocument(); });
  it("uses unavailable rather than fabricated zero metrics", () => { render(<MetricPlaceholder label="Open incidents" icon={Inbox} />); expect(screen.getByLabelText("Open incidents: unavailable")).toHaveTextContent("—"); expect(screen.queryByText("0")).not.toBeInTheDocument(); });
  it("exposes operational boundaries and future permission", () => { render(<ModuleShell route={getModule("field", "report")!} />); expect(screen.getByRole("heading", { name: "Situation report", level: 1 })).toBeInTheDocument(); expect(screen.getByText("No operational service connected")).toBeInTheDocument(); expect(screen.getByText("self.report.create")).toBeInTheDocument(); expect(screen.getByText(/not an authorization check active/)).toBeInTheDocument(); });
  it("marks current field navigation for assistive technology", () => { render(<FieldBottomNavigation />); expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page"); expect(screen.getByRole("navigation", { name: "Field quick navigation" })).toBeInTheDocument(); });
  it("changes and persists appearance using accessible menu controls", async () => { localStorage.clear(); render(<ThemeProvider><ThemeControl /></ThemeProvider>); const user = userEvent.setup(); await user.click(screen.getByRole("button", { name: "Change color theme" })); await user.click(await screen.findByRole("menuitem", { name: "Light" })); expect(document.documentElement).not.toHaveClass("dark"); expect(localStorage.getItem("kemsr.theme")).toBe("light"); });
  it("does not invent user identity in a badge", () => { render(<Badge>Not signed in</Badge>); expect(screen.getByText("Not signed in")).toBeInTheDocument(); });
});
