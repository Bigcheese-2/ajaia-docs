"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

/** `icon` is a rendered element (e.g. <Users />) so it can cross the server/client boundary. */
export type NavItem = { href: string; label: string; icon: React.ReactNode; count?: number };

export function SidebarNav({ items, onNavigate }: { items: NavItem[]; onNavigate?: () => void }) {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const current = search ? `${pathname}?${search}` : pathname;

  return (
    <nav aria-label="Documents" className="flex flex-col gap-0.5">
      {items.map(({ href, label, icon, count }) => {
        const active = current === href;
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex h-8 items-center gap-2.5 rounded-md px-2.5 text-sm text-muted-foreground transition-colors duration-150 outline-none hover:bg-sidebar-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50",
              active && "bg-sidebar-accent font-medium text-foreground",
            )}
          >
            <span className={cn("[&_svg]:size-4", active && "text-primary")}>{icon}</span>
            <span className="flex-1 truncate">{label}</span>
            {count !== undefined && (
              <span className="text-xs text-subtle-foreground tabular-nums">{count}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
