import { readFile, writeFile, mkdir } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import { resolve } from "node:path";

// Route-reference manifest accounting, not a network performance/Lighthouse claim.
const root = process.cwd();
const budgetKiB = 350;
const routes = ["/central/dashboard", "/zone/dashboard", "/field/home", "/login"];
const shared = JSON.parse(await readFile(resolve(root, ".next/build-manifest.json"), "utf8"));
const results = [];
for (const route of routes) {
  const source = await readFile(resolve(root, `.next/server/app${route}/page_client-reference-manifest.js`), "utf8");
  const objectStart = source.indexOf(" = {") + 3;
  const manifest = JSON.parse(source.slice(objectStart, source.lastIndexOf("}") + 1));
  const files = [...new Set([...shared.rootMainFiles, ...Object.values(manifest.clientModules).flatMap((entry) => entry.chunks)])].filter((file) => file.endsWith(".js"));
  if (!files.length) throw new Error(`No build manifest entry for ${route}`);
  let rawBytes = 0;
  let gzipBytes = 0;
  for (const file of files) { const bytes = await readFile(resolve(root, ".next", file.replace(/^\/_next\//, ""))); rawBytes += bytes.length; gzipBytes += gzipSync(bytes).length; }
  results.push({ route, files: files.length, rawBytes, gzipBytes, withinBudget: gzipBytes <= budgetKiB * 1024 });
}
const report = { methodology: "Shared Next root JS plus unique client-reference chunks per route; gzip per file. Excludes polyfills, CSS, fonts, HTML, RSC, dynamic imports and network latency. Not a measured transfer size or performance result.", budgetKiB, results };
await mkdir(resolve(root, "docs/phase-1"), { recursive: true });
await writeFile(resolve(root, "docs/phase-1/bundle-baseline.json"), `${JSON.stringify(report, null, 2)}\n`);
console.table(results);
if (results.some((result) => !result.withinBudget)) process.exitCode = 1;
