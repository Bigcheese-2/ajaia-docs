import { Skeleton } from "@/design-system/primitives/skeleton";

/** Mirrors DocumentEditor's header, toolbar and page while a document loads. */
export function EditorSkeleton() {
  return (
    <div className="min-h-screen bg-muted/40" aria-busy="true" aria-label="Loading document">
      <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
        <div className="flex h-14 items-center justify-between gap-3 px-3 sm:px-4">
          <div className="flex items-center gap-3">
            <Skeleton className="size-8" />
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="size-8 rounded-full" />
          </div>
        </div>
      </header>
      <div className="flex justify-center px-3 pt-3">
        <Skeleton className="h-10 w-full max-w-lg rounded-lg" />
      </div>
      <main className="px-3 pt-4 pb-24">
        <div className="mx-auto w-full max-w-[816px] space-y-4 rounded-lg border bg-background px-6 py-10 shadow-sm sm:px-16 sm:py-16">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </main>
    </div>
  );
}
