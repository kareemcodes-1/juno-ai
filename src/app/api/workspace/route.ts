import { NextResponse } from "next/server";
import connectDB from "@/config/connectDB";
import Workspace from "@/models/Workspace";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { name, url, user } = await req.json();

    if (!name || !url || !user) {
      return NextResponse.json(
        { error: "Name, URL, and User are required" },
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
      user, // 👈 save user
      createdAt: new Date(),
    });

    return NextResponse.json(workspace, { status: 201 });
  } catch (error) {
    console.error("Error creating workspace:", error);
    return NextResponse.json(
      { error: "Failed to create workspace" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const workspaces = await Workspace.find({}).populate("user", "name email"); // 👈 include user info
    return NextResponse.json(workspaces);
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    return NextResponse.json(
      { error: "Failed to fetch workspaces" },
      { status: 500 }
    );
  }
}
