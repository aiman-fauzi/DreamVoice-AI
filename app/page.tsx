import Link from "next/link";
import { History, Mic, Moon, Sparkles, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";

const steps = [
  { icon: UserPlus, label: "Set up parent and child profiles", text: "One guided setup step after registration." },
  { icon: Sparkles, label: "Generate a bedtime story", text: "Choose a child and one of six gentle themes." },
  { icon: History, label: "Return to Story History", text: "Read again, play narration, or download the text." },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-moon text-ink">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-6 md:px-10">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-ink text-white">
              <Moon className="h-5 w-5" aria-hidden="true" />
            </span>
            DreamVoice AI
          </Link>
          <nav className="flex items-center gap-2" aria-label="Public navigation">
            <Button asChild variant="ghost">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Create first story</Link>
            </Button>
          </nav>
        </header>

        <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold text-moss">Personalized bedtime stories</p>
            <h1 className="text-4xl font-bold leading-tight text-ink md:text-6xl">
              Make tonight&apos;s story feel like it was written just for your child.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-700 md:text-lg">
              Register, complete one guided setup step, generate a gentle story, then return to Story History whenever bedtime needs a familiar favorite.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/signup">Create first story</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/login">Open dashboard</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
            <div className="rounded-md bg-skywash p-5">
              <p className="text-sm font-medium text-slate-600">Tonight&apos;s story</p>
              <h2 className="mt-3 text-2xl font-semibold text-ink">The Kind Lantern Quest</h2>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                A calm adventure for Aina, age 6, who loves stars, cats, and brave little choices before bedtime.
              </p>
            </div>
            <div className="mt-5 grid gap-3">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.label} className="flex items-start gap-3 rounded-md border border-slate-200 p-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-moss/10 text-moss">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-slate-900">{step.label}</span>
                      <span className="mt-1 block text-xs leading-5 text-slate-600">{step.text}</span>
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 flex items-center gap-2 rounded-md bg-moon px-3 py-2 text-sm text-slate-700">
              <Mic className="h-4 w-4 text-moss" aria-hidden="true" />
              Generated narration or parent recording stays private.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

