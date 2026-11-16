import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border bg-surface px-6 py-12 text-center",
        className,
      )}
    >
      <span className="mb-4 flex size-10 items-center justify-center rounded-lg border bg-background text-muted-foreground">
        <Icon className="size-5" strokeWidth={1.75} />
      </span>
      <h3 className="text-[15px] font-semibold tracking-tight">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
