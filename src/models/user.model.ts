import mongoose from "mongoose";
import { IUser } from "../types/types.js";

const UserSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

export default mongoose.model<IUser>("User", UserSchema);
