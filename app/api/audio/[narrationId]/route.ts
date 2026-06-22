import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type AudioRouteProps = {
  params: Promise<{ narrationId: string }>;
};

export async function GET(_request: Request, { params }: AudioRouteProps) {
  const { narrationId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    return new Response("Authentication required.", { status: 401 });
  }

  const { data: narration } = await supabase
    .from("narrations")
    .select("id,parent_id,storage_bucket,storage_path")
    .eq("id", narrationId)
    .eq("parent_id", authData.user.id)
    .single();

  if (!narration) {
    return new Response("Audio not found.", { status: 404 });
  }

  const { data, error } = await supabase.storage
    .from(narration.storage_bucket)
    .createSignedUrl(narration.storage_path, 60 * 10);

  if (error || !data?.signedUrl) {
    return new Response("Audio unavailable.", { status: 404 });
  }

  redirect(data.signedUrl);
}