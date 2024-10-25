import type { IUser } from "../types/types.js";

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema<IUser>({
  user: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

export default mongoose.model<IUser>("User", UserSchema);
