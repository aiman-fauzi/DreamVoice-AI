import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EmptyStateAction = {
  href: string;
  label: string;
};

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description: string;
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  className?: string;
};

export function EmptyState({ icon: Icon, title, description, primaryAction, secondaryAction, className }: EmptyStateProps) {
  return (
    <div className={cn("rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center", className)}>
      {Icon ? (
        <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-moss/10 text-moss">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      ) : null}
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">{description}</p>
      {(primaryAction || secondaryAction) ? (
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {secondaryAction ? (
            <Button asChild variant="secondary">
              <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
            </Button>
          ) : null}
          {primaryAction ? (
            <Button asChild>
              <Link href={primaryAction.href}>{primaryAction.label}</Link>
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
