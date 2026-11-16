import { Suspense } from "react";
import Link from "next/link";
import { Logo } from "@/design-system/patterns/logo";
import { ThemeToggle } from "@/design-system/patterns/theme-toggle";
import { SidebarNav, type NavItem } from "./sidebar-nav";

/**
 * Workspace layout: fixed sidebar on desktop, compact top bar on mobile.
 * Feature code fills the slots; the shell owns no data.
 */
export function AppShell({
  nav,
  sidebarActions,
  userMenu,
  children,
}: {
  nav: NavItem[];
  sidebarActions?: React.ReactNode;
  userMenu?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col gap-6 border-r bg-sidebar px-3 py-4 md:flex">
        <Link href="/" className="px-2.5">
          <Logo />
        </Link>
        {sidebarActions && <div className="flex flex-col gap-2">{sidebarActions}</div>}
        <Suspense>
          <SidebarNav items={nav} />
        </Suspense>
        <p className="mt-auto px-2.5 text-xs text-muted-foreground">Demo workspace</p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur md:px-8">
          <Link href="/" className="md:hidden">
            <Logo showText={false} />
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            {userMenu}
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}
