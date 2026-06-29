import Link from "next/link";

import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-moon px-6 py-10 text-ink">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-moss">Welcome back</p>
        <h1 className="mt-2 text-2xl font-semibold">Log in</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Open your dashboard, choose a child, and continue tonight&apos;s story flow.</p>
        <div className="mt-6">
          <AuthForm mode="login" />
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
          <Link className="font-semibold text-moss" href="/forgot-password">Forgot password?</Link>
          <span>
            New to DreamVoice? <Link className="font-semibold text-moss" href="/signup">Create an account</Link>
          </span>
        </div>
      </section>
    </main>
  );
}

