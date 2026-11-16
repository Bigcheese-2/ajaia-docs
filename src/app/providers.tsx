"use client";

import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/design-system/primitives/tooltip";
import { Toaster } from "@/design-system/primitives/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <TooltipProvider>
        {children}
        <Toaster richColors position="bottom-right" />
      </TooltipProvider>
    </ThemeProvider>
  );
}
