"use client";
import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";

export function ThemeControl() {
  const { theme, setTheme } = useTheme();
  return <DropdownMenu>
    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label="Change color theme" title="Change color theme"><Sun className="dark:hidden" /><Moon className="hidden dark:block" /></Button></DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Appearance · {theme}</DropdownMenuLabel>
      <DropdownMenuItem onSelect={() => setTheme("light")}><Sun />Light</DropdownMenuItem>
      <DropdownMenuItem onSelect={() => setTheme("dark")}><Moon />Dark</DropdownMenuItem>
      <DropdownMenuItem onSelect={() => setTheme("system")}><Monitor />System preference</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>;
}
