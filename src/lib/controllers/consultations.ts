import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ConsultationRequest } from "@/lib/cms-types";
import { runAction, type ActionResult } from "./result";

export async function listRecentConsultationRequests(
  limit = 10
): Promise<ActionResult<ConsultationRequest[]>> {
  return runAction(async () => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("consultation_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as ConsultationRequest[];
  });
}
