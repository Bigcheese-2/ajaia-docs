import { cn } from "@/lib/utils";

/** App mark: a folded page on an accent tile. Same artwork as src/app/icon.svg (the favicon). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn("size-7 shrink-0", className)}>
      <rect width="32" height="32" rx="8" fill="#2563EB" />
      <rect x="12" y="5" width="13" height="16.5" rx="2.25" fill="#FFFFFF" fillOpacity="0.35" />
      <path
        d="M9.25 9.5h7.25l4.5 4.5v10.25a2.25 2.25 0 0 1-2.25 2.25h-9.5a2.25 2.25 0 0 1-2.25-2.25v-12.5a2.25 2.25 0 0 1 2.25-2.25z"
        fill="#FFFFFF"
      />
      <path d="M16.5 9.5v3a1.5 1.5 0 0 0 1.5 1.5h3z" fill="#A9C3F7" />
      <g stroke="#2563EB" strokeWidth="1.6" strokeLinecap="round">
        <path d="M10 17h6.5M10 20.25h6.5M10 23.5h3" />
        <path d="M15.5 22v3" />
      </g>
    </svg>
  );
}

export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-[15px] font-semibold tracking-tight", className)}>
      <LogoMark />
      {showText && (
        <span>
          Ajaia <span className="font-normal text-muted-foreground">Docs</span>
        </span>
      )}
    </span>
  );
}
