import { cn } from "@/lib/utils";

type StatusTone = "success" | "error" | "info" | "warning";

type StatusMessageProps = {
  tone?: StatusTone;
  children: React.ReactNode;
  className?: string;
};

const toneClasses: Record<StatusTone, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  error: "border-red-200 bg-red-50 text-red-900",
  info: "border-sky-200 bg-sky-50 text-sky-950",
  warning: "border-amber-200 bg-amber-50 text-amber-950",
};

export function StatusMessage({ tone = "info", children, className }: StatusMessageProps) {
  const role = tone === "error" ? "alert" : "status";

  return (
    <p role={role} className={cn("rounded-md border px-3 py-2 text-sm leading-6", toneClasses[tone], className)}>
      {children}
    </p>
  );
}
