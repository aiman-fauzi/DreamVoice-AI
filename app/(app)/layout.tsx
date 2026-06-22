import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpen, Library, Users } from "lucide-react";

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
      <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-6 px-4 py-4 md:grid-cols-[240px_1fr] md:px-6">
        <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft md:sticky md:top-4 md:h-[calc(100vh-2rem)]">
          <Link href="/dashboard" className="text-lg font-semibold">DreamVoice AI</Link>
          <nav className="mt-6 grid gap-2 text-sm font-medium">
            <Link className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-skywash" href="/dashboard"><BookOpen className="h-4 w-4" /> Dashboard</Link>
            <Link className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-skywash" href="/children"><Users className="h-4 w-4" /> Children</Link>
            <Link className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-skywash" href="/library"><Library className="h-4 w-4" /> Library</Link>
          </nav>
        </aside>
        <section className="min-w-0 py-2">{children}</section>
      </div>
    </main>
  );
}