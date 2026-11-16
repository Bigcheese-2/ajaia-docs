import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-[15px] font-semibold tracking-tight", className)}>
      <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <FileText className="size-4" strokeWidth={2.25} />
      </span>
      {showText && <span>Ajaia Docs</span>}
    </span>
  );
}
