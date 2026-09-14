"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { runAction, type ActionResult } from "./result";

export type SiteSettings = {
  phone_display: string;
  phone_href: string;
  whatsapp_number: string;
  facebook_url: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
};

export type SiteSettingsInput = SiteSettings;

export async function getSiteSettings(): Promise<ActionResult<SiteSettings>> {
  return runAction(async () => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).single();

    if (error) throw error;
    return data as SiteSettings;
  });
}

export async function updateSiteSettings(input: SiteSettingsInput): Promise<ActionResult<SiteSettings>> {
  return runAction(async () => {
    await requireAdmin();
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("site_settings")
      .update(input)
      .eq("id", 1)
      .select("*")
      .single();

    if (error) throw error;

    // Phone/social links show up on every page (footer, floating actions,
    // hero booking card, contact page) — revalidate the whole site rather
    // than a single route.
    revalidatePath("/", "layout");
    revalidatePath("/admin/dashboard/settings");

    return data as SiteSettings;
  });
}
