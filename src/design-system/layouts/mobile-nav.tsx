"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Menu, X } from "lucide-react";
import { Logo } from "@/design-system/patterns/logo";
import { Button } from "@/design-system/primitives/button";
import { SidebarNav, type NavItem } from "./sidebar-nav";

/** Below `md` the sidebar becomes a slide-in drawer opened from the header. */
export function MobileNav({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger
        render={<Button variant="ghost" size="icon" className="md:hidden" aria-label="Open navigation" />}
      >
        <Menu />
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/30 duration-200 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 dark:bg-black/60" />
        <DialogPrimitive.Popup className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col gap-6 border-r bg-sidebar px-3 py-4 shadow-lg outline-none duration-200 data-open:animate-in data-open:slide-in-from-left data-closed:animate-out data-closed:slide-out-to-left">
          <DialogPrimitive.Title className="sr-only">Navigation</DialogPrimitive.Title>
          <div className="flex items-center justify-between px-1">
            <Link href="/" onClick={() => setOpen(false)} className="px-1.5">
              <Logo />
            </Link>
            <DialogPrimitive.Close render={<Button variant="ghost" size="icon-sm" aria-label="Close navigation" />}>
              <X />
            </DialogPrimitive.Close>
          </div>
          <Suspense>
            <SidebarNav items={items} onNavigate={() => setOpen(false)} />
          </Suspense>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
