import { Suspense } from "react";
import Link from "next/link";
import { Logo } from "@/design-system/patterns/logo";
import { ThemeMenu } from "@/design-system/patterns/theme-menu";
import { MobileNav } from "./mobile-nav";
import { SidebarNav, type NavItem } from "./sidebar-nav";

const SIDEBAR = "sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r bg-sidebar md:flex";
const HEADER = "sticky top-0 z-30 flex h-16 items-center gap-2 border-b bg-background px-4 md:px-8";
const MAIN = "mx-auto w-full max-w-5xl flex-1 px-4 py-8 md:px-8 md:py-10";

/**
 * Workspace layout: fixed sidebar on desktop, drawer navigation on mobile.
 * Feature code fills the slots; the shell owns no data.
 */
export function AppShell({
  nav,
  userMenu,
  children,
}: {
  nav: NavItem[];
  userMenu?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className={SIDEBAR}>
        <div className="flex h-16 items-center px-5">
          <Link href="/" className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
            <Logo />
          </Link>
        </div>
        <div className="flex flex-1 flex-col gap-1 px-3 py-4">
          <p className="px-2.5 pb-1 text-xs font-medium text-subtle-foreground">Documents</p>
          <Suspense>
            <SidebarNav items={nav} />
          </Suspense>
        </div>
        <p className="border-t px-5 py-4 text-xs text-subtle-foreground">Demo workspace</p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className={HEADER}>
          <MobileNav items={nav} />
          <Link href="/" className="md:hidden">
            <Logo />
          </Link>
          <div className="ml-auto flex items-center gap-1.5">
            <ThemeMenu />
            {userMenu}
          </div>
        </header>
        <main className={MAIN}>{children}</main>
      </div>
    </div>
  );
}
