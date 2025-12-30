 import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: "No file uploaded" });
    }

    // 1️⃣ Upload to Supabase Storage
    const { error: uploadError } = await supabaseServer.storage
      .from("resumes")
      .upload(`uploads/${file.name}`, file, { upsert: true });

    if (uploadError) throw uploadError;

    // 2️⃣ Insert metadata into DB
    const { data: insertedRow, error: insertError } = await supabaseServer
      .from("resume_analysis")
      .insert([{ file_name: file.name }])
      .select()
      .single();

    if (insertError) throw insertError;

    // 3️⃣ Call Railway ML API (PRODUCTION)
    console.log("ML_API_URL USED =", process.env.ML_API_URL);
    const mlResponse = await fetch(process.env.ML_API_URL!, {
      method: "POST",
      body: formData,
      signal: AbortSignal.timeout(60_000),
    });

    if (!mlResponse.ok) {
      const text = await mlResponse.text();
      throw new Error(`ML API error: ${text}`);
    }

    const mlData = await mlResponse.json();

    return NextResponse.json({
      success: true,
      fileId: insertedRow.id,
      data: mlData.data,
    });

  } catch (err) {
    console.error("Upload/ML Error:", err);
    return NextResponse.json({
      success: false,
      error: err instanceof Error ? err.message : "Upload or analysis failed",
    });
  }
}
