import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Page } from "@/lib/cms-types";
import { runAction, type ActionResult } from "./result";

export async function listPages(): Promise<ActionResult<Page[]>> {
  return runAction(async () => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) throw error;
    return data as Page[];
  });
}

export async function getPageBySlug(slug: string): Promise<ActionResult<Page | null>> {
  return runAction(async () => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw error;
    return data as Page | null;
  });
}
