import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ErrorPage from "@/app/error";
import Loading from "@/app/loading";
import { Skeleton } from "@/components/ui/skeleton";

vi.mock("next/link", () => ({ default: ({ children, ...props }: React.ComponentProps<"a">) => <a {...props}>{children}</a> }));

describe("application state patterns", () => {
  it("offers a working retry without claiming a submission succeeded", async () => { const reset = vi.fn(); render(<ErrorPage error={new Error("private test details")} reset={reset} />); expect(screen.getByRole("heading", { name: "This page couldn’t load" })).toBeInTheDocument(); expect(screen.queryByText("private test details")).not.toBeInTheDocument(); await userEvent.setup().click(screen.getByRole("button", { name: "Try again" })); expect(reset).toHaveBeenCalledOnce(); });
  it("announces loading without exposing decorative skeletons", () => { render(<Loading />); expect(screen.getByRole("main")).toHaveAttribute("aria-busy", "true"); expect(screen.getByRole("status")).toHaveTextContent("Loading page"); });
  it("hides purely decorative skeleton geometry", () => { const { container } = render(<Skeleton />); expect(container.firstChild).toHaveAttribute("aria-hidden", "true"); });
});
