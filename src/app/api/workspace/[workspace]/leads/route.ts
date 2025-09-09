import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/config/connectDB";
import Lead from "@/models/Lead";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ workspace: string }> }
) {
  await connectDB();

  try {
    const { workspace } = await context.params;
    const leads = await Lead.find({ workspace });
    return NextResponse.json(leads, { status: 200 });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}
