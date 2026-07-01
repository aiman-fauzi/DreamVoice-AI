import Link from "next/link";

import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";

export default function SignupPage() {
  return (
    <AuthShell
      eyebrow="Start bedtime stories"
      title="Create account"
      description="After signup, we will guide you through parent and child setup before your first story."
      footer={
        <span>
          Already have an account? <Link className="font-semibold text-moss" href="/login">Log in</Link>
        </span>
      }
    >
      <AuthForm mode="signup" />
    </AuthShell>
  );
}
