type LogLevel = "info" | "warn" | "error";

/** Structural logging contract: never pass request bodies, tokens or personal data. */
export function logEvent(level: LogLevel, event: string, context: { requestId?: string; code?: string } = {}) {
  const entry = { timestamp: new Date().toISOString(), level, event, ...context };
  console[level](JSON.stringify(entry));
}
