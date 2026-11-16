import { Skeleton } from "@/design-system/primitives/skeleton";

/** Mirrors DocumentsDashboard + DocumentList so the page doesn't jump when data lands. */
export function DocumentsSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading documents">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-36" />
        </div>
      </div>
      <div className="flex flex-wrap justify-between gap-3">
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-9 w-64" />
      </div>
      <section className="space-y-3">
        <Skeleton className="h-4 w-32" />
        <div className="divide-y overflow-hidden rounded-lg border bg-surface">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <Skeleton className="size-8" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-1/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="hidden h-3 w-24 md:block" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
