"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, fieldControlClass } from "@/components/ui/field";
import { StatusMessage } from "@/components/ui/status-message";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [messageTone, setMessageTone] = useState<"success" | "error" | "info">("info");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setIsSubmitting(true);

    const supabase = createSupabaseBrowserClient();
    const resetUrl = new URL("/reset-password", window.location.origin);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: resetUrl.toString(),
    });

    setIsSubmitting(false);

    if (error) {
      setMessageTone("error");
      setMessage(error.message);
      return;
    }

    setMessageTone("success");
    setMessage("Check your email for a password reset link.");
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <Field label="Email" helperText="Use the email address connected to your DreamVoice account.">
        <input
          className={fieldControlClass}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />
      </Field>
      {message ? <StatusMessage tone={messageTone}>{message}</StatusMessage> : null}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send reset email"}
      </Button>
    </form>
  );
}
