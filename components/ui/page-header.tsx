import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PageHeaderAction = {
  href: string;
  label: string;
};

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  primaryAction?: PageHeaderAction;
  secondaryAction?: PageHeaderAction;
  className?: string;
};

export function PageHeader({ eyebrow, title, description, primaryAction, secondaryAction, className }: PageHeaderProps) {
  return (
    <header className={cn("flex flex-wrap items-start justify-between gap-4", className)}>
      <div className="max-w-2xl">
        {eyebrow ? <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-moss">{eyebrow}</p> : null}
        <h1 className="text-3xl font-semibold leading-tight text-ink md:text-4xl">{title}</h1>
        {description ? <p className="mt-2 text-sm leading-6 text-slate-600 md:text-base">{description}</p> : null}
      </div>
      {(primaryAction || secondaryAction) ? (
        <div className="flex flex-wrap gap-2">
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
    </header>
  );
}
