import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.API_BASE_URL ?? "https://drivesync-backend.onrender.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      console.error("[waitlist] Invalid JSON:", e);
      return NextResponse.json(
        { detail: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    console.log("[waitlist] Sending to:", `${BACKEND_URL}/api/v1/waitlist`);
    console.log("[waitlist] Body:", body);

    const upstream = await fetch(`${BACKEND_URL}/api/v1/waitlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    console.log("[waitlist] Upstream status:", upstream.status);

    const responseText = await upstream.text();
    console.log("[waitlist] Upstream response (raw):", responseText);

    let data;
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
      console.error("[waitlist] Failed to parse JSON, returning raw response");
      data = { raw_response: responseText };
    }

    console.log("[waitlist] Parsed data:", data);

    return NextResponse.json(data, { status: upstream.status });
  } catch (error) {
    console.error("[waitlist] Error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { detail: "Internal server error", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
