import mongoose, { Schema, Document, models } from "mongoose";

export interface IWorkspace extends Document {
  name: string;
  url: string;
  user: mongoose.Types.ObjectId; // 🔹 owner of the workspace
  createdAt: Date;
  updatedAt: Date;
}

const WorkspaceSchema = new Schema<IWorkspace>(
  {
    name: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // 🔹
  },
  { timestamps: true }
);

export default models.Workspace ||
  mongoose.model<IWorkspace>("Workspace", WorkspaceSchema);
