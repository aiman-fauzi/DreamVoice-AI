import Link from "next/link";
import { CheckCircle2, Sparkles } from "lucide-react";

import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { completeOnboardingAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const supabase = await createSupabaseServerClient();
  const [{ data: profile }, { data: children }] = await Promise.all([
    supabase.from("profiles").select("display_name").maybeSingle(),
    supabase.from("children").select("id,name").order("created_at", { ascending: false }),
  ]);

  const hasChild = (children?.length ?? 0) > 0;
  const hasDisplayName = Boolean(profile?.display_name?.trim());

  if (hasChild && hasDisplayName) {
    return (
      <div className="grid gap-6">
        <PageHeader
          eyebrow="Setup complete"
          title="You are ready for tonight's story"
          description="Your parent profile and first child profile are ready. The next best step is generating a story."
          primaryAction={{ href: "/stories/new", label: "Generate story" }}
          secondaryAction={{ href: "/dashboard", label: "Open dashboard" }}
        />
        <EmptyState
          icon={CheckCircle2}
          title="Onboarding is complete"
          description="You can add more children later, but your first story flow is ready now."
          primaryAction={{ href: "/stories/new", label: "Generate story" }}
          secondaryAction={{ href: "/children", label: "Manage children" }}
        />
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <PageHeader
        eyebrow="First-time setup"
        title="Set up your first bedtime story"
        description="Add a parent name and one child profile. After this, DreamVoice will take you straight to your dashboard."
      />
      <SectionCard className="bg-skywash/45">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-xl">
            <h2 className="text-lg font-semibold text-ink">One setup step, then story time</h2>
            <p className="mt-1 text-sm leading-6 text-slate-700">We merged parent setup and child setup so you can generate the first story with fewer clicks.</p>
          </div>
          <Button asChild variant="secondary">
            <Link href="/dashboard"><Sparkles className="h-4 w-4" aria-hidden="true" /> Skip for now</Link>
          </Button>
        </div>
      </SectionCard>
      <OnboardingForm action={completeOnboardingAction} defaultDisplayName={profile?.display_name} />
    </div>
  );
}
