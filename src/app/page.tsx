import { FileText } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

// Temporary landing page; replaced by the dashboard in Phase 6.
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <FileText className="size-6" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">Ajaia Docs</h1>
      <p className="text-muted-foreground">Scaffold ready. Dashboard coming next.</p>
    </main>
  );
}
