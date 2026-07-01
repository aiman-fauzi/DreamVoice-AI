"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, fieldControlClass } from "@/components/ui/field";
import { StatusMessage } from "@/components/ui/status-message";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type AuthMode = "login" | "signup";
type MessageTone = "info" | "error" | "success";

type AuthFormProps = {
  mode: AuthMode;
};

export function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [messageTone, setMessageTone] = useState<MessageTone>("info");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setMessageTone("info");
    setIsSubmitting(true);

    const supabase = createSupabaseBrowserClient();
    const signupRedirectUrl = new URL("/auth/callback", window.location.origin);
    signupRedirectUrl.searchParams.set("next", "/onboarding");

    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: signupRedirectUrl.toString(),
            },
          });

    setIsSubmitting(false);

    if (result.error) {
      setMessageTone("error");
      setMessage(result.error.message);
      return;
    }

    if (mode === "signup" && !result.data.session) {
      setMessageTone("success");
      setMessage("Check your email to confirm your account, then log in.");
      return;
    }

    window.location.assign(mode === "signup" ? "/onboarding" : "/dashboard");
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <Field label="Email" helperText={mode === "signup" ? "Use the email address where you want confirmation and reset links." : undefined}>
        <input
          className={fieldControlClass}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />
      </Field>
      <Field label="Password" helperText={mode === "signup" ? "Use at least 6 characters. You can change this later from account recovery." : undefined}>
        <input
          className={fieldControlClass}
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          minLength={6}
          required
        />
      </Field>
      {message ? <StatusMessage tone={messageTone}>{message}</StatusMessage> : null}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Working..." : mode === "login" ? "Log in" : "Create account"}
      </Button>
    </form>
  );
}
