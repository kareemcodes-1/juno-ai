import mongoose, { Mongoose } from "mongoose";

// Define interface for cached connection
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Extend the global object to include `mongoose` cache
declare global {
  // This augments the globalThis object in Node.js
  var mongoose: MongooseCache | undefined;
}

// Use a globally cached connection (helpful in dev mode)
let cached = globalThis.mongoose;

if (!cached) {
  cached = globalThis.mongoose = { conn: null, promise: null };
}

async function connectDB(): Promise<Mongoose> {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
  }

  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => mongoose);
  }

  try {
    cached!.conn = await cached!.promise;
    console.log("✅ MongoDB connection successful");
  } catch (e) {
    cached!.promise = null;
    console.error("❌ MongoDB connection error:", e);
    throw e;
  }

  return cached!.conn;
}

export default connectDB;
