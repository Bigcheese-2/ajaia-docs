import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/design-system/primitives/button";
import { EmptyState } from "@/design-system/patterns/empty-state";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <EmptyState
        icon={Compass}
        title="Page not found"
        description="The page you're looking for doesn't exist."
        action={
          <Button render={<Link href="/" />} nativeButton={false}>
            Go to documents
          </Button>
        }
        className="w-full max-w-md"
      />
    </main>
  );
}
