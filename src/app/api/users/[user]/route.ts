import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import connectDB from "@/config/connectDB";

// UPDATE USER
export async function PUT(request: NextRequest, {  params }: { params: { user: string } }) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email, currentPassword, newPassword } = body;
    const { user: id } = params;

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Optional password update
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Current password is required to change password" }, { status: 400 });
      }

      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!passwordMatch) {
        return NextResponse.json({ error: "Incorrect current password" }, { status: 401 });
      }

      user.password = await bcrypt.hash(newPassword, 10);
    }

    // Update name/email if provided
    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE USER
export async function DELETE( { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
