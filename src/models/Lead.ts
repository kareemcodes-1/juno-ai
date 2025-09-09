// models/Lead.ts
import mongoose, { Schema, Document, models } from "mongoose";

export interface ILead extends Document {
  name?: string;
  email?: string;
  phone?: string;
  notes?: string; // e.g. conversation snippet or extra details
  source: string; // e.g. "chat-widget"
  device?: string; // e.g. "mobile", "desktop"
  term?: string; // e.g. campaign, keyword, etc.
  workspace: mongoose.Types.ObjectId;
  createdAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    notes: { type: String },
    source: { type: String, default: "chat-widget" },
    device: { type: String },
    term: { type: String },
    workspace: { type: Schema.Types.ObjectId, ref: "Workspace", required: true },
  },
  { timestamps: true }
);

export default models.Lead || mongoose.model<ILead>("Lead", LeadSchema);
