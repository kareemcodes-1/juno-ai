import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'
import connectDB from "@/config/connectDB"
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json()
    await connectDB()

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Name, Email and password are required' }, { status: 400 })
    }

    const existingUser = await User.findOne({ email }).exec()
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const newUser = await User.create({
      email,
      password: hashedPassword,
      name // optional
    })

    await newUser.save()

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 })
  } catch (error) {
    console.error('[REGISTER_ERROR]', error)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
