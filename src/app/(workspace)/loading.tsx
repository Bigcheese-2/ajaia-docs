import { DocumentsSkeleton } from "@/features/documents/components/documents-skeleton";

// Inside the workspace shell, e.g. when switching filters.
export default function Loading() {
  return <DocumentsSkeleton />;
}
