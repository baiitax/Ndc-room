import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRoute, navigation } from "@/lib/navigation";
import { ModuleShell } from "@/components/module-shell";
export const dynamicParams = false;
export function generateStaticParams() { return navigation.central.filter((route) => route.slug !== "dashboard").map((route) => ({ module: route.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ module: string }> }): Promise<Metadata> { const { module } = await params; return { title: getRoute("central", module)?.title ?? "Module not found" }; }
export default async function Page({ params }: { params: Promise<{ module: string }> }) { const { module } = await params; const route = getRoute("central", module); if (!route || module === "dashboard") notFound(); return <ModuleShell route={route} />; }
