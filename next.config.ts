import type { NextConfig } from "next";

const development = process.env.NODE_ENV === "development";
// Preview must be iframe-embeddable. Production rejects framing.
// Nonce-based script CSP is a Phase 2 gate before authenticated content.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${development ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${development ? " ws: wss:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  ...(development ? [] : ["frame-ancestors 'none'", "upgrade-insecure-requests"]),
].join("; ");
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  ...(development ? [] : [{ key: "X-Frame-Options", value: "DENY" }]),
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  { key: "Content-Security-Policy", value: csp },
];
const nextConfig: NextConfig = {
  env: { NEXT_TELEMETRY_DISABLED: "1" },
  reactStrictMode: true,
  poweredByHeader: false,
  devIndicators: false,
  allowedDevOrigins: ["*.e2b.app", "*.e2b.dev", "127.0.0.1", "localhost"],
  async headers() { return [{ source: "/(.*)", headers: securityHeaders }]; },
};
export default nextConfig;
