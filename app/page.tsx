import Link from "next/link";
import { BookOpen, Check, History, Mic, Moon, Sparkles, UserPlus, Volume2 } from "lucide-react";

import { Button } from "@/components/ui/button";

const proofItems = [
  { icon: UserPlus, label: "Guided setup", text: "Parent and child details stay focused on the first story." },
  { icon: Sparkles, label: "Six story themes", text: "Pick a gentle direction without writing a prompt." },
  { icon: Mic, label: "Private listening", text: "Use generated narration or record your own voice." },
];

const storySteps = [
  "Create a child profile",
  "Choose tonight's theme",
  "Read or listen from history",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-moon text-ink">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-5 sm:px-6 md:px-10">
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

        <div className="grid flex-1 items-center gap-9 py-10 lg:grid-cols-[1.02fr_0.98fr] lg:py-14">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-moss">DreamVoice AI</p>
            <h1 className="text-4xl font-bold leading-tight text-ink sm:text-5xl md:text-6xl">
              Personalized bedtime stories, ready before the lights go out.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-700 md:text-lg">
              Create a child profile, choose a gentle theme, and save a private story with generated narration or your own recording.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/signup">Create first story</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/login">Open dashboard</Link>
              </Button>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {proofItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-lg border border-slate-200 bg-white/70 p-3">
                    <Icon className="h-4 w-4 text-moss" aria-hidden="true" />
                    <p className="mt-2 text-sm font-semibold text-ink">{item.label}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-600">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft" aria-label="Tonight's story preview">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-moss">Tonight&apos;s story preview</p>
                <h2 className="mt-2 text-2xl font-semibold leading-tight text-ink">The Kind Lantern Quest</h2>
              </div>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-coral/10 text-coral">
                <BookOpen className="h-5 w-5" aria-hidden="true" />
              </span>
            </div>

            <div className="py-5">
              <p className="text-sm leading-6 text-slate-700">
                A calm adventure for Aina, age 6, who loves stars, cats, and brave little choices before bedtime.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
                <span className="rounded-md bg-skywash px-2.5 py-1">Calm Bedtime</span>
                <span className="rounded-md bg-moss/10 px-2.5 py-1 text-moss">English</span>
                <span className="rounded-md bg-coral/10 px-2.5 py-1 text-coral">Private</span>
              </div>
            </div>

            <div className="grid gap-2 border-t border-slate-200 pt-4">
              {storySteps.map((step) => (
                <div key={step} className="flex items-center gap-3 text-sm text-slate-700">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-moss/10 text-moss">
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  {step}
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-ink p-4 text-white">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Volume2 className="h-4 w-4 text-skywash" aria-hidden="true" />
                  Generated narration
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-200">Use a Google TTS voice when quota allows.</p>
              </div>
              <div className="rounded-lg bg-skywash p-4 text-ink">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <History className="h-4 w-4 text-moss" aria-hidden="true" />
                  Story History
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-700">Return later to read or listen again.</p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}


