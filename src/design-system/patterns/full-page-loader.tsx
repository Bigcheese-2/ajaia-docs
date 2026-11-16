import { Logo } from "./logo";
import { cn } from "@/lib/utils";

/**
 * Minimal branded loader for whole-page waits (signing in, opening the
 * workspace or a document). Section-level waits use skeletons instead.
 */
export function FullPageLoader({ message, className }: { message: string; className?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex min-h-screen flex-col items-center justify-center gap-6 bg-background animate-in fade-in-0 duration-200",
        className,
      )}
    >
      <Logo />
      <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
        <span
          aria-hidden
          className="size-4 animate-spin rounded-full border-2 border-border border-t-primary"
        />
        {message}
      </div>
    </div>
  );
}
