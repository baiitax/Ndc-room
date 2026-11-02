import { getEnvironment } from "@/lib/environment";
export const dynamic = "force-dynamic";
export function GET() {
  const env = getEnvironment();
  return Response.json({ status: "ok", scope: "application-process-only", phase: 1, environment: env.APP_ENV, build: process.env.NEXT_PUBLIC_BUILD_LABEL ?? "local", database: "not_configured", authentication: "not_configured", operationalModules: "not_enabled" }, { headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
}
