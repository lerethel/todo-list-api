import mongoose from "mongoose";
import { IToken } from "../../types/database.types.js";

const tokenSchema = new mongoose.Schema<IToken>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    family: { type: String, required: true },
    refreshToken: { type: String, required: true },
  },
  { versionKey: false }
);

export default mongoose.model<IToken>("Token", tokenSchema);
