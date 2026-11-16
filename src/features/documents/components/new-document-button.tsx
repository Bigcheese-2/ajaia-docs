"use client";

import { Loader2, Plus } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "@/design-system/primitives/button";
import { createDocumentAction } from "../actions";

function SubmitButton({ className }: { className?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending} className={className}>
      {pending ? <Loader2 className="animate-spin" /> : <Plus />}
      New document
    </Button>
  );
}

export function NewDocumentButton({ className }: { className?: string }) {
  return (
    <form action={createDocumentAction}>
      <SubmitButton className={className} />
    </form>
  );
}
