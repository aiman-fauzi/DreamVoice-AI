import Link from "next/link";

import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-moon px-6 py-10 text-ink">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
        <h1 className="text-2xl font-semibold">Log in</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Open your child profiles, saved stories, and narration library.</p>
        <div className="mt-6">
          <AuthForm mode="login" />
        </div>
        <p className="mt-5 text-sm text-slate-600">
          New to DreamVoice? <Link className="font-semibold text-moss" href="/signup">Create an account</Link>
        </p>
      </section>
    </main>
  );
}