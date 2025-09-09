import { NextResponse } from "next/server"
import connectDB from "../../../../../config/connectDB"
import Workspace from "@/models/Workspace"
import Agent from "@/models/Agent"

// CREATE AGENT
export async function POST(
  req: Request,
  { params }: { params: Promise<{ workspace: string }> } // 👈 params is a Promise
) {
  try {
    await connectDB()
    const {
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
    } = await req.json()

    if (!name || !role || !message || !instructions || !label || !position) {
      return NextResponse.json(
        { error: "Name role, message, instructions, and position are required" },
        { status: 400 }
      )
    }

    // ✅ await params before using
    const { workspace: workspaceSlug } = await params
    const workspace = await Workspace.findOne({ url: workspaceSlug })
    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 })
    }

    const agent = await Agent.create({
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
    })

    return NextResponse.json(agent, { status: 201 })
  } catch (error) {
    console.error("Error creating agent:", error)
    return NextResponse.json({ error: "Failed to create agent" }, { status: 500 })
  }
}

// VIEW ALL AGENTS
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ workspace: string }> }
) {
  try {
    await connectDB()

    const { workspace: workspaceSlug } = await params
    const workspace = await Workspace.findOne({ url: workspaceSlug })
    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 })
    }

    const agents = await Agent.find({ workspace: workspace._id })
    return NextResponse.json(agents)
  } catch (error) {
    console.error("Error fetching agents:", error)
    return NextResponse.json({ error: "Failed to fetch agents" }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
