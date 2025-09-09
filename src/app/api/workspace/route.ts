import { NextResponse } from "next/server";
import connectDB from "@/config/connectDB";
import Workspace from "@/models/Workspace";

// CREATE WORKSPACE
export async function POST(req: Request) {
  try {
    await connectDB();

    const { name, url } = await req.json();

    if (!name || !url) {
      return NextResponse.json(
        { error: "Name and URL are required" },
        { status: 400 }
      );
    }

    const existing = await Workspace.findOne({ url });
    if (existing) {
      return NextResponse.json(
        { error: "Workspace URL already exists" },
        { status: 400 }
      );
    }

    const workspace = await Workspace.create({
      name,
      url,
      createdAt: new Date(),
    });

    return NextResponse.json(workspace, { status: 201 });
  } catch (error) {
    console.error("Error creating workspace:", error);
    return NextResponse.json({ error: "Failed to create workspace" }, { status: 500 });
  }
}

// VIEW ALL WORKSPACES
export async function GET() {
  try {
    await connectDB();
    const workspaces = await Workspace.find({});
    return NextResponse.json(workspaces);
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    return NextResponse.json({ error: "Failed to fetch workspaces" }, { status: 500 });
  }
}

// OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
