import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/design-system/primitives/button";
import { EmptyState } from "@/design-system/patterns/empty-state";

export default function DocumentNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <EmptyState
        icon={FileQuestion}
        title="Document not found"
        description="It may have been deleted, or you don't have access to it."
        action={
          <Button render={<Link href="/" />} nativeButton={false}>
            Back to documents
          </Button>
        }
        className="w-full max-w-md"
      />
    </main>
  );
}
