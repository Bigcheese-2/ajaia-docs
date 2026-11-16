"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, TriangleAlert } from "lucide-react";
import { Button } from "@/design-system/primitives/button";
import { EmptyState } from "@/design-system/patterns/empty-state";

/**
 * Catches unexpected failures (e.g. the database being unreachable) anywhere
 * below the root layout, so users get a way forward instead of a blank page.
 */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <EmptyState
        icon={TriangleAlert}
        title="Something went wrong"
        description="We couldn't load this page. Your saved work is safe. Try again in a moment."
        action={
          <div className="flex gap-2">
            <Button onClick={reset}>
              <RotateCcw /> Try again
            </Button>
            <Button variant="outline" render={<Link href="/" />} nativeButton={false}>
              Go to documents
            </Button>
          </div>
        }
        className="w-full max-w-md"
      />
      {error.digest && <p className="sr-only">Error reference: {error.digest}</p>}
    </main>
  );
}
