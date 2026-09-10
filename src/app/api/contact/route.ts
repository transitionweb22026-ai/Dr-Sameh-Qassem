import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, phone, service, clinic, message, locale } = body ?? {};

  if (!name || !phone) {
    return NextResponse.json(
      { ok: false, error: "Missing required fields" },
      { status: 400 }
    );
  }

  if (!isSupabaseConfigured || !supabase) {
    // Supabase is optional: the booking flow still works via WhatsApp
    // even if no database is configured for this deployment.
    return NextResponse.json({ ok: true, stored: false });
  }

  const { error } = await supabase.from("consultation_requests").insert({
    name,
    phone,
    service: service ?? null,
    clinic: clinic ?? null,
    message: message ?? null,
    locale: locale ?? null,
  });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, stored: true });
}
