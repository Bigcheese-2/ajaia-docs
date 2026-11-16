"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

/** `icon` is a rendered element (e.g. <Users />) so it can cross the server/client boundary. */
export type NavItem = { href: string; label: string; icon: React.ReactNode; count?: number };

export function SidebarNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const current = search ? `${pathname}?${search}` : pathname;

  return (
    <nav className="flex flex-col gap-0.5">
      {items.map(({ href, label, icon, count }) => {
        const active = current === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              active && "bg-muted font-medium text-foreground",
            )}
          >
            <span className="[&_svg]:size-4">{icon}</span>
            <span className="flex-1">{label}</span>
            {count !== undefined && <span className="text-xs tabular-nums">{count}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
