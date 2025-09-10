import { NextResponse, NextRequest } from "next/server";
import connectDB from "../../../../../config/connectDB";
import Workspace from "@/models/Workspace";
import Agent from "@/models/Agent";

// CREATE AGENT
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ url: string }> }
) {
  try {
    await connectDB();

    const {
      user, // 👈 add user from frontend
      name,
      role,
      message,
      instructions,
      label,
      placeholder,
      icon,
      position,
      accentColor,
      font,
      autoOpen,
      devices,
      pages,
    } = await req.json();

    if (!user || !name || !role || !message || !instructions || !label || !position) {
      return NextResponse.json(
        { error: "User, name, role, message, instructions, label, and position are required" },
        { status: 400 }
      );
    }

    const { url } = await context.params; // ✅ await params
    const workspace = await Workspace.findOne({ url });
    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    const agent = await Agent.create({
      user, // 👈 store user ID here
      name,
      role,
      message,
      instructions,
      label,
      placeholder,
      icon,
      position,
      accentColor,
      font,
      autoOpen,
      devices,
      pages,
      workspace: workspace._id,
      createdAt: new Date(),
    });

    return NextResponse.json(agent, { status: 201 });
  } catch (error) {
    console.error("Error creating agent:", error);
    return NextResponse.json({ error: "Failed to create agent" }, { status: 500 });
  }
}

// VIEW ALL AGENTS
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ url: string }> }
) {
  try {
    await connectDB();

    const { url } = await context.params; // ✅ await params
    const workspace = await Workspace.findOne({ url });
    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    // 👇 also populate user details if needed
    const agents = await Agent.find({ workspace: workspace._id }).populate("user", "name email");
    return NextResponse.json(agents);
  } catch (error) {
    console.error("Error fetching agents:", error);
    return NextResponse.json({ error: "Failed to fetch agents" }, { status: 500 });
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
