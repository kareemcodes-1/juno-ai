import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/config/connectDB";
import Workspace from "@/models/Workspace";

// GET a single workspace
export async function GET(
  _req: NextRequest,
  { params }: { params: { url: string } }
) {
  try {
    await connectDB();
    const { url } = params;

    const workspace = await Workspace.findOne({ url });

    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    return NextResponse.json(workspace);
  } catch (error) {
    console.error("Error fetching workspace:", error);
    return NextResponse.json({ error: "Failed to fetch workspace" }, { status: 500 });
  }
}

// UPDATE workspace
export async function PATCH(
  req: NextRequest,
  { params }: { params: { url: string } }
) {
  try {
    await connectDB();
    const { url } = params;

    const workspace = await Workspace.findOne({ url });

    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    const { name } = await req.json();
    if (!name || !url) {
      return NextResponse.json({ error: "Name and URL are required" }, { status: 400 });
    }

    workspace.name = name;
    workspace.url = url;
    await workspace.save();

    return NextResponse.json({
      workspace,
      message: "Workspace updated successfully",
    });
  } catch (error) {
    console.error("Error updating workspace:", error);
    return NextResponse.json({ error: "Failed to update workspace" }, { status: 500 });
  }
}

// DELETE workspace
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { workspace: string } }
) {
  try {
    await connectDB();
    const { workspace: workspaceSlug } = params;

    const workspace = await Workspace.findOne({ url: workspaceSlug });

    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    const deletedWorkspace = await Workspace.findByIdAndDelete(workspace._id);

    return NextResponse.json({
      deletedWorkspace,
      message: "Workspace deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting workspace:", error);
    return NextResponse.json({ error: "Failed to delete workspace" }, { status: 500 });
  }
}

// OPTIONS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
