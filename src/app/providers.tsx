"use client";

import { ThemeProvider } from "next-themes";
import { MotionProvider } from "@/design-system/motion/fade-in";
import { TooltipProvider } from "@/design-system/primitives/tooltip";
import { Toaster } from "@/design-system/primitives/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <MotionProvider>
        <TooltipProvider delay={300}>
          {children}
          <Toaster position="bottom-right" />
        </TooltipProvider>
      </MotionProvider>
    </ThemeProvider>
  );
}
