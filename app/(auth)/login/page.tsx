import Link from "next/link";

import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Log in"
      description="Open your dashboard, choose a child, and continue tonight's story flow."
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link className="font-semibold text-moss" href="/forgot-password">Forgot password?</Link>
          <span>
            New to DreamVoice? <Link className="font-semibold text-moss" href="/signup">Create an account</Link>
          </span>
        </div>
      }
    >
      <AuthForm mode="login" />
    </AuthShell>
  );
}
