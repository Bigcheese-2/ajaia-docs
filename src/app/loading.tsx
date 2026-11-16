import { FullPageLoader } from "@/design-system/patterns/full-page-loader";

// Shown while the workspace layout loads the user and their documents.
export default function Loading() {
  return <FullPageLoader message="Loading your workspace…" />;
}
