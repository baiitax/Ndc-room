import { z } from "zod";

const environmentSchema = z.object({
  APP_ENV: z.enum(["development", "staging", "production"]).default("development"),
  APP_ALLOWED_ORIGINS: z.string().default("").transform((value) => value.split(",").map((host) => host.trim().toLowerCase()).filter(Boolean)),
});

export type AppEnvironment = z.infer<typeof environmentSchema>;

export function parseEnvironment(source: Record<string, string | undefined>): AppEnvironment {
  const result = environmentSchema.safeParse(source);
  if (!result.success) throw new Error("Invalid server environment: APP_ENV must be development, staging or production.");
  if (source.APP_ALLOWED_ORIGINS?.trim() && result.data.APP_ALLOWED_ORIGINS.length !== source.APP_ALLOWED_ORIGINS.split(",").length) throw new Error("APP_ALLOWED_ORIGINS cannot contain empty entries.");
  for (const host of result.data.APP_ALLOWED_ORIGINS) {
    if (!/^[a-z0-9]+(?:[a-z0-9.-]*[a-z0-9])?(?::\d+)?$/.test(host)) throw new Error("APP_ALLOWED_ORIGINS must contain exact hostnames, not URLs or wildcards.");
  }
  return result.data;
}

export function getEnvironment(): AppEnvironment {
  return parseEnvironment({ APP_ENV: process.env.APP_ENV, APP_ALLOWED_ORIGINS: process.env.APP_ALLOWED_ORIGINS });
}
