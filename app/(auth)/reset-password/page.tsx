import Link from "next/link";

import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-moon px-6 py-10 text-ink">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-moss">Account recovery</p>
        <h1 className="mt-2 text-2xl font-semibold">Choose a new password</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Set a new password, then return to login to open your stories.</p>
        <div className="mt-6">
          <ResetPasswordForm />
        </div>
        <p className="mt-5 text-sm text-slate-600">
          Need another reset email? <Link className="font-semibold text-moss" href="/forgot-password">Send reset link</Link>
        </p>
      </section>
    </main>
  );
}
