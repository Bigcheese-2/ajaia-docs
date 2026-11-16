import { EditorSkeleton } from "@/features/editor/components/editor-skeleton";

// The editor's own geometry, so nothing shifts when the document arrives.
export default function Loading() {
  return <EditorSkeleton />;
}
