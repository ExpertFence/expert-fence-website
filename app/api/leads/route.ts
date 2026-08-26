import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const service = typeof body.service === "string" ? body.service.trim() : "";
  const zip = typeof body.zip === "string" ? body.zip.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  // Honeypot field — bots tend to fill every input, humans never see this one.
  const company = typeof body.company === "string" ? body.company.trim() : "";

  if (company) {
    // Silently accept so bots don't learn the honeypot worked.
    return NextResponse.json({ ok: true });
  }

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "Lead storage isn't connected yet. Set SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL." },
      { status: 503 }
    );
  }

  const { error } = await admin.from("leads").insert({
    name,
    email,
    phone,
    service,
    zip,
    message,
    source: "website-contact-form",
  });

  if (error) {
    console.error("Supabase insert error:", error.message);
    return NextResponse.json({ error: "Could not save your request. Please call us instead." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
