import { Schema, model, Document, models } from "mongoose";
import { User } from "../../types";


export interface UserDocument extends User, Document {}

const userSchema = new Schema<UserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
}, { timestamps: true });

export default models.User || model<User>("User", userSchema);