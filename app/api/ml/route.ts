import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: "No file uploaded" });
    }

    // Send the file to FastAPI backend
    const mlResponse = await fetch("NEXT_PUBLIC_API_URL", {
      method: "POST",
      body: formData, // sending the PDF file directly
    });

    if (!mlResponse.ok) {
      const errorText = await mlResponse.text();
      return NextResponse.json({ success: false, error: errorText });
    }

    const mlData = await mlResponse.json();

    return NextResponse.json({ success: true, ...mlData });
  } catch (err) {
    console.error("ML route error:", err);
    return NextResponse.json({ success: false, error: "ML prediction failed" });
  }
}

export async function GET() {
  // Optional: return last analysis or a default response
  return NextResponse.json({
    success: true,
    predictions: [
      { career: "Mobile App Developer", confidence: 0.67 },
      { career: "AI Engineer", confidence: 0.16 },
      { career: "Data Scientist", confidence: 0.04 },
    ],
  });
}
