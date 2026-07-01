import Link from "next/link";

import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Reset your password"
      description="Enter your email and we will send a secure reset link."
      footer={
        <span>
          Remembered it? <Link className="font-semibold text-moss" href="/login">Log in</Link>
        </span>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
