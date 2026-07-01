import Link from "next/link";
import type { ReactNode } from "react";
import { Check, Moon, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
  className?: string;
};

const promises = [
  "Guided setup before the first story",
  "Generated narration or parent recording",
  "Private Story History for saved favorites",
];

export function AuthShell({ eyebrow, title, description, children, footer, className }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-moon px-4 py-6 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center gap-6 lg:grid-cols-[1fr_460px]">
        <section className="hidden rounded-lg border border-slate-200 bg-ink p-8 text-white shadow-soft lg:block">
          <Link href="/" className="inline-flex items-center gap-2 text-lg font-semibold">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-white text-ink">
              <Moon className="h-5 w-5" aria-hidden="true" />
            </span>
            DreamVoice AI
          </Link>
          <p className="mt-12 text-sm font-semibold uppercase tracking-[0.14em] text-skywash">Private story workspace</p>
          <h2 className="mt-3 max-w-md text-4xl font-semibold leading-tight">A quieter path from sign in to story time.</h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-200">
            DreamVoice keeps Phase 1 focused on child profiles, personalized stories, private narration, and easy story history.
          </p>
          <div className="mt-8 grid gap-3">
            {promises.map((promise) => (
              <div key={promise} className="flex items-center gap-3 rounded-md bg-white/10 px-3 py-3 text-sm text-slate-100">
                <Check className="h-4 w-4 text-skywash" aria-hidden="true" />
                {promise}
              </div>
            ))}
          </div>
        </section>

        <section className={cn("rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-7", className)}>
          <Link href="/" className="mb-8 inline-flex items-center gap-2 text-base font-semibold lg:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-ink text-white">
              <Moon className="h-4 w-4" aria-hidden="true" />
            </span>
            DreamVoice AI
          </Link>
          <div className="mb-6 rounded-md bg-skywash p-3 text-sm font-semibold text-ink">
            <Sparkles className="mr-2 inline h-4 w-4 text-moss" aria-hidden="true" />
            Private bedtime stories
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-moss">{eyebrow}</p>
          <h1 className="mt-2 text-2xl font-semibold leading-tight sm:text-3xl">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
          <div className="mt-6">{children}</div>
          <div className="mt-5 text-sm leading-6 text-slate-600">{footer}</div>
        </section>
      </div>
    </main>
  );
}

