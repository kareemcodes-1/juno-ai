import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/config/connectDB";
import Lead from "@/models/Lead";
import Workspace from "@/models/Workspace";

export async function GET(
  req: NextRequest,
  { params }: { params: { url: string } }
) {
  await connectDB();

  try {
    const { url } = params;

    // 1. Find workspace by URL
    const workspace = await Workspace.findOne({ url });
    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    // 2. Get leads by workspace ID
    const leads = await Lead.find({ workspace: workspace._id });

    return NextResponse.json(leads, { status: 200 });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}
