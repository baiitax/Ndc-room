import { AppShell } from "@/components/layout/app-shell";
export default function AdminLayout({ children }: { children: React.ReactNode }) { return <AppShell workspace="central" section="Account & preferences">{children}</AppShell>; }
