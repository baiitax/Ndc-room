"use client";
import Link from "next/link";
import { UserRound, ShieldCheck, Bell, History, LogIn, CircleUserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { accountRoutes } from "@/lib/navigation";
const icons = [UserRound, Bell, ShieldCheck, History];

export function AccountMenu() {
  return <DropdownMenu>
    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label="Open account menu"><CircleUserRound /></Button></DropdownMenuTrigger>
    <DropdownMenuContent align="end"><DropdownMenuLabel>Preview · not signed in</DropdownMenuLabel><DropdownMenuSeparator />
      {accountRoutes.map((route, index) => { const Icon = icons[index] ?? UserRound; return <DropdownMenuItem key={route.path} asChild><Link href={route.path}><Icon />{route.title}</Link></DropdownMenuItem>; })}
      <DropdownMenuSeparator /><DropdownMenuItem asChild><Link href="/login"><LogIn />Authentication information</Link></DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>;
}
