import mongoose from "mongoose";
import { IUser } from "../../types/database.types.js";

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
  },
  { versionKey: false }
);

export default mongoose.model<IUser>("User", userSchema);
