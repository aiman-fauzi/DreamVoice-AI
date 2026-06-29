"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, History, Sparkles, Users } from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: BookOpen, match: ["/dashboard"] },
  { href: "/stories/new", label: "New Story", icon: Sparkles, match: ["/stories/new"] },
  { href: "/library", label: "Story History", icon: History, match: ["/library", "/stories/"] },
  { href: "/children", label: "Children", icon: Users, match: ["/children", "/onboarding"] },
];

function isActive(pathname: string, item: (typeof navItems)[number]) {
  if (item.href === "/library") {
    return pathname === "/library" || (pathname.startsWith("/stories/") && !pathname.startsWith("/stories/new"));
  }

  return item.match.some((match) => (match.endsWith("/") ? pathname.startsWith(match) : pathname === match));
}

type AppNavProps = {
  compact?: boolean;
};

export function AppNav({ compact = false }: AppNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation" className={compact ? "grid grid-cols-4 gap-1" : "grid gap-2 text-sm font-medium"}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(pathname, item);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
              compact ? "justify-center px-2 text-xs" : "",
              active ? "bg-ink text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-ink",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className={compact ? "sr-only sm:not-sr-only" : ""}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
