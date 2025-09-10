import connectDB from "@/config/connectDB";
import Agent from "@/models/Agent";
import Workspace from "@/models/Workspace";
import { NextResponse } from "next/server";

function withCORS<T>(json: T, status = 200) {
  return NextResponse.json(json, {
    status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

// GET single agent
export async function GET(
  _req: Request,
  { params }: { params: { url: string; id: string } }
) {
  try {
    await connectDB();

    const { url, id } = params;
    const workspace = await Workspace.findOne({ url });
    if (!workspace) {
      return withCORS({ error: "Workspace not found" }, 404);
    }

    const agent = await Agent.findOne({ _id: id, workspace: workspace._id });
    if (!agent) {
      return withCORS({ error: "Agent not found" }, 404);
    }

    return withCORS(agent);
  } catch (error) {
    console.error("Error fetching agent:", error);
    return withCORS({ error: "Failed to fetch agent" }, 500);
  }
}

// UPDATE agent
export async function PATCH(
  req: Request,
  { params }: { params: { url: string; id: string } }
) {
  try {
    await connectDB();

    const { url, id } = params;
    const workspace = await Workspace.findOne({ url });
    if (!workspace) {
      return withCORS({ error: "Workspace not found" }, 404);
    }

    const data = await req.json();
    const agent = await Agent.findOneAndUpdate(
      { _id: id, workspace: workspace._id },
      data,
      { new: true }
    );

    if (!agent) {
      return withCORS({ error: "Agent not found" }, 404);
    }

    return withCORS(agent);
  } catch (error) {
    console.error("Error updating agent:", error);
    return withCORS({ error: "Failed to update agent" }, 500);
  }
}

// DELETE agent
export async function DELETE(
  _req: Request,
  { params }: { params: { url: string; id: string } }
) {
  try {
    await connectDB();

    const { url, id } = params;
    const workspace = await Workspace.findOne({ url });
    if (!workspace) {
      return withCORS({ error: "Workspace not found" }, 404);
    }

    const agent = await Agent.findOneAndDelete({
      _id: id,
      workspace: workspace._id,
    });
    if (!agent) {
      return withCORS({ error: "Agent not found" }, 404);
    }

    return withCORS({ message: "Agent deleted successfully" });
  } catch (error) {
    console.error("Error deleting agent:", error);
    return withCORS({ error: "Failed to delete agent" }, 500);
  }
}

export async function OPTIONS() {
  return withCORS({}, 200);
}
