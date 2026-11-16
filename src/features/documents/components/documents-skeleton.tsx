import { Skeleton } from "@/design-system/primitives/skeleton";

/** Mirrors DocumentsDashboard + DocumentCard so the page doesn't jump when data lands. */
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
      <Skeleton className="h-9 w-72 rounded-lg" />
      <section className="space-y-3">
        <Skeleton className="h-4 w-32" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="overflow-hidden rounded-xl border bg-card">
              <div className="bg-muted/50 px-5 pt-5">
                <div className="h-28 space-y-2 rounded-t-md border border-b-0 bg-background px-4 pt-3">
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-2 w-full" />
                  <Skeleton className="h-2 w-4/5" />
                </div>
              </div>
              <div className="space-y-2 p-4">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
