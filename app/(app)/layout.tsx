import Link from "next/link";
import { redirect } from "next/navigation";
import { Moon } from "lucide-react";

import { AppNav } from "@/components/app/app-nav";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-moon text-ink">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-5 px-4 py-4 md:grid-cols-[248px_1fr] md:px-6">
        <aside className="hidden rounded-lg border border-slate-200 bg-white p-4 shadow-soft md:sticky md:top-4 md:flex md:h-[calc(100vh-2rem)] md:flex-col">
          <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-ink text-white">
              <Moon className="h-5 w-5" aria-hidden="true" />
            </span>
            DreamVoice AI
          </Link>
          <div className="mt-6">
            <AppNav />
          </div>
          <div className="mt-auto rounded-md bg-slate-50 p-3 text-xs leading-5 text-slate-600">
            Free-first Phase 1 workspace. Generate short stories, add narration, and keep audio private.
          </div>
        </aside>

        <div className="min-w-0">
          <header className="mb-4 rounded-lg border border-slate-200 bg-white p-3 shadow-soft md:hidden">
            <div className="mb-3 flex items-center justify-between gap-3">
              <Link href="/dashboard" className="flex items-center gap-2 text-base font-semibold">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-ink text-white">
                  <Moon className="h-4 w-4" aria-hidden="true" />
                </span>
                DreamVoice
              </Link>
            </div>
            <AppNav compact />
          </header>

          <section className="min-w-0 py-2">{children}</section>
          <footer className="mt-8 border-t border-slate-200 py-5 text-xs leading-5 text-slate-500">
            DreamVoice AI keeps Phase 1 focused: child profiles, story generation, private narration, and story history.
          </footer>
        </div>
      </div>
    </main>
  );
}
