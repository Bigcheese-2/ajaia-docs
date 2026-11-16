import { AlertCircle, Check, CloudUpload, Loader2 } from "lucide-react";
import { Button } from "@/design-system/primitives/button";
import type { SaveState } from "../hooks/use-autosave";

export function SaveStatus({ state, onRetry }: { state: SaveState; onRetry: () => void }) {
  return (
    <span aria-live="polite" className="flex items-center gap-1.5 text-xs text-muted-foreground">
      {state === "saving" && (
        <>
          <Loader2 className="size-3.5 animate-spin" /> Saving…
        </>
      )}
      {state === "unsaved" && (
        <>
          <CloudUpload className="size-3.5 text-warning" /> Unsaved changes
        </>
      )}
      {state === "saved" && (
        <>
          <Check className="size-3.5 text-success" /> Saved
        </>
      )}
      {state === "error" && (
        <>
          <AlertCircle className="size-3.5 text-destructive" />
          <span className="text-destructive">Couldn&apos;t save</span>
          <Button variant="link" size="xs" className="h-auto px-1" onClick={onRetry}>
            Retry
          </Button>
        </>
      )}
    </span>
  );
}
