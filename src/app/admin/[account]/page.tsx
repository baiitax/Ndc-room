import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { accountRoutes } from "@/lib/navigation";
import { ModuleShell } from "@/components/module-shell";
export const dynamicParams = false;
export function generateStaticParams() { return accountRoutes.map((route) => ({ account: route.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ account: string }> }): Promise<Metadata> { const { account } = await params; return { title: accountRoutes.find((route) => route.slug === account)?.title ?? "Account not found" }; }
export default async function Page({ params }: { params: Promise<{ account: string }> }) { const { account } = await params; const route = accountRoutes.find((item) => item.slug === account); if (!route) notFound(); return <ModuleShell route={route} />; }
