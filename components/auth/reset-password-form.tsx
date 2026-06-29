"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, fieldControlClass } from "@/components/ui/field";
import { StatusMessage } from "@/components/ui/status-message";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [messageTone, setMessageTone] = useState<"success" | "error" | "info">("info");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setIsSubmitting(true);

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.updateUser({ password });

    setIsSubmitting(false);

    if (error) {
      setMessageTone("error");
      setMessage(error.message);
      return;
    }

    setMessageTone("success");
    setMessage("Password updated. You can log in with your new password.");
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <Field label="New password" helperText="Use at least 6 characters.">
        <input
          className={fieldControlClass}
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
          minLength={6}
          required
        />
      </Field>
      {message ? <StatusMessage tone={messageTone}>{message}</StatusMessage> : null}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Updating..." : "Reset password"}
      </Button>
      <Button asChild variant="ghost">
        <Link href="/login">Back to login</Link>
      </Button>
    </form>
  );
}
