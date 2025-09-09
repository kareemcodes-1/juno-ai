// models/Chat.ts
import mongoose, { Schema, Document, Types } from "mongoose";

interface IMessage {
  role: "user" | "bot";
  content: string;
  createdAt: Date;
}

export interface IChat extends Document {
  workspace: Types.ObjectId;   // workspaceId
  agent: Types.ObjectId;       // agentId
  sessionId: string;   // can be userId or random uuid
  messages: IMessage[];
}

const ChatSchema = new Schema<IChat>({
 workspace: { type: Schema.Types.ObjectId, ref: "Workspace", required: true },
 agent: { type: Schema.Types.ObjectId, ref: "Agent", required: true },
  sessionId: { type: String, required: true },
  messages: [
    {
      role: { type: String, enum: ["user", "bot"], required: true },
      content: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.models.Chat || mongoose.model<IChat>("Chat", ChatSchema);
