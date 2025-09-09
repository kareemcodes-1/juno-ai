import { NextResponse } from "next/server"
import connectDB from "@/config/connectDB"
import Lead from "@/models/Lead"

export async function GET(
  req: Request,
  { params }: { params: { url: string } }
) {
  await connectDB()

  try {
    const leads = await Lead.find({ workspace: params.url })
    return NextResponse.json(leads, { status: 200 })
  } catch (err) {
    console.error("API error:", err)
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 })
  }
}
