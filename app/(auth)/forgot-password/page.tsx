import Link from "next/link";

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-moon px-6 py-10 text-ink">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-moss">Account recovery</p>
        <h1 className="mt-2 text-2xl font-semibold">Reset your password</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Enter your email and we will send a secure reset link.</p>
        <div className="mt-6">
          <ForgotPasswordForm />
        </div>
        <p className="mt-5 text-sm text-slate-600">
          Remembered it? <Link className="font-semibold text-moss" href="/login">Log in</Link>
        </p>
      </section>
    </main>
  );
}
