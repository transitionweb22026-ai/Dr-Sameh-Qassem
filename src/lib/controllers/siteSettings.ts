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

export type SiteSettingsInput = {
  phone_display: string;
  facebook_url: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
};

// Admins type the phone number however they like (local "01147886551",
// with a leading "00", or already international). The call and WhatsApp
// buttons only work with a full international number, so this always
// derives phone_href/whatsapp_number with a country code rather than
// trusting the raw input — defaulting to Egypt (20) when none is given.
function normalizePhone(rawDisplay: string, defaultCountryCode = "20") {
  const digits = rawDisplay.replace(/[^\d+]/g, "");
  if (!digits) return { phone_href: "tel:", whatsapp_number: "" };

  let international: string;
  if (digits.startsWith("+")) {
    international = digits.slice(1);
  } else if (digits.startsWith("00")) {
    international = digits.slice(2);
  } else if (digits.startsWith("0")) {
    international = defaultCountryCode + digits.slice(1);
  } else if (digits.startsWith(defaultCountryCode)) {
    international = digits;
  } else {
    international = defaultCountryCode + digits;
  }

  return { phone_href: `tel:+${international}`, whatsapp_number: international };
}

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

    const { phone_href, whatsapp_number } = normalizePhone(input.phone_display);

    const { data, error } = await supabase
      .from("site_settings")
      .update({ ...input, phone_href, whatsapp_number })
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
