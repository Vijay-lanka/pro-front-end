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

    // 1️⃣ Upload file to Supabase storage (resumes bucket)
    const { error: uploadError } = await supabaseServer.storage
      .from("resumes")
      .upload(`uploads/${file.name}`, file, { upsert: true });

    if (uploadError) throw uploadError;

    // 2️⃣ Insert metadata into table (resume_analysis)
    const { data: insertedRow, error: insertError } = await supabaseServer
      .from("resume_analysis")
      .insert([{ file_name: file.name }])
      .select()
      .single(); // return the inserted row

    if (insertError) throw insertError;

    // 3️⃣ Call FastAPI backend for ML analysis
    const mlResponse = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      body: formData, // send the PDF directly
    });

    if (!mlResponse.ok) {
      const text = await mlResponse.text();
      throw new Error(`FastAPI error: ${text}`);
    }

    const mlData = await mlResponse.json();

    // 4️⃣ Return both inserted row info and ML data
    return NextResponse.json({
      success: true,
      fileId: insertedRow.id,
      data: mlData.data,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      error: err instanceof Error ? err.message : "Upload or analysis failed",
    });
  }
}
