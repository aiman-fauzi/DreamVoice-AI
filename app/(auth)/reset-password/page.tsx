import Link from "next/link";

import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Choose a new password"
      description="Set a new password, then return to login to open your stories."
      footer={
        <span>
          Need another reset email? <Link className="font-semibold text-moss" href="/forgot-password">Send reset link</Link>
        </span>
      }
    >
      <ResetPasswordForm />
    </AuthShell>
  );
}
