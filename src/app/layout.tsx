import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Kano Election Monitor", template: "%s | Kano Election Monitor" },
  description: "Foundation preview of the Kano State election monitoring and situation room platform. No live operational data.",
  robots: { index: false, follow: false },
  applicationName: "Kano Election Monitor",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: [{ media: "(prefers-color-scheme: light)", color: "#f3f6f9" }, { media: "(prefers-color-scheme: dark)", color: "#0b1623" }] };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('kemsr.theme');var d=t==='dark'||!t||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light'}catch(e){}` }} /></head><body><ThemeProvider>{children}</ThemeProvider></body></html>;
}
