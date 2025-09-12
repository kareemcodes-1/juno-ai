import mongoose, { Schema, Document, models } from "mongoose";

export interface IAgent extends Document {
  name: string;
  role: string;
  welcomeMessage: string;
  instructions: string;
  label: string;
  placeholder: string;
  icon: string;
  position: string;
  accentColor: string;
  font: string;
  autoOpen: boolean;
  devices: {
    desktop: boolean;
    mobile: boolean;
    tablet: boolean;
  };
  pages: "all" | "specific";
  logo?: string; // base64 or URL
  workspace: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AgentSchema = new Schema<IAgent>(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    welcomeMessage: { type: String, required: true },
    instructions: { type: String, required: true },
    label: { type: String, required: true },
    placeholder: { type: String },
    icon: { type: String },
    position: { type: String, required: true },
    accentColor: { type: String },
    font: { type: String },
    autoOpen: { type: Boolean, default: false },
    devices: {
      desktop: { type: Boolean, default: false },
      mobile: { type: Boolean, default: false },
      tablet: { type: Boolean, default: false },
    },
    pages: { type: String, enum: ["all", "specific"], default: "all" },
    logo: { type: String }, // store as base64 string or URL
    workspace: { type: Schema.Types.ObjectId, ref: "Workspace", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default models.Agent || mongoose.model<IAgent>("Agent", AgentSchema);
