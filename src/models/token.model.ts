import mongoose from "mongoose";
import { IToken } from "../types/types.js";

const TokenSchema = new mongoose.Schema<IToken>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  family: { type: String, required: true },
  refreshToken: { type: String, required: true },
});

export default mongoose.model<IToken>("Token", TokenSchema);
