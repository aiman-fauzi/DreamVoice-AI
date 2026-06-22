import Link from "next/link";

import { AuthForm } from "@/components/auth/auth-form";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-moon px-6 py-10 text-ink">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
        <h1 className="text-2xl font-semibold">Create account</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Start with child profiles and free-first personalized bedtime stories.</p>
        <div className="mt-6">
          <AuthForm mode="signup" />
        </div>
        <p className="mt-5 text-sm text-slate-600">
          Already have an account? <Link className="font-semibold text-moss" href="/login">Log in</Link>
        </p>
      </section>
    </main>
  );
}