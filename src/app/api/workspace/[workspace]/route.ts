import { NextResponse } from "next/server";
import connectDB from "@/config/connectDB";
import Workspace from "@/models/Workspace";

// GET a single workspace
export async function GET(
  req: Request,
  { params }: { params: { workspace: string } }
) {
  try {
    await connectDB();
    const { workspace: workspaceSlug } = await params;
    const workspace = await Workspace.findOne({ url: workspaceSlug });

    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    return NextResponse.json(workspace);
  } catch (error) {
    console.error("Error fetching workspace:", error);
    return NextResponse.json({ error: "Failed to fetch workspace" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { workspace: string } }
) {
  try {
    await connectDB();
    const { workspace: workspaceSlug } = params;
    const workspace = await Workspace.findOne({ url: workspaceSlug });

    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    const { name, url } = await req.json();
    if (!name || !url) {
      return NextResponse.json({ error: "Name and URL are required" }, { status: 400 });
    }

    workspace.name = name;
    workspace.url = url;
    await workspace.save();

    return NextResponse.json({ workspace, message: "Workspace updated successfully" });
  } catch (error) {
    console.error("Error updating workspace:", error);
    return NextResponse.json({ error: "Failed to update workspace" }, { status: 500 });
  }
}

// DELETE a workspace
export async function DELETE(
  req: Request,
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

    return NextResponse.json({ deletedWorkspace, message: "Workspace deleted successfully" });
  } catch (error) {
    console.error("Error deleting workspace:", error);
    return NextResponse.json({ error: "Failed to delete workspace" }, { status: 500 });
  }
}

// OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
