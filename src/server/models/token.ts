import type { IToken } from "../types/types.js";

import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema<IToken>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  family: { type: String, required: true },
  refreshToken: { type: String, required: true },
});

export default mongoose.model<IToken>("Token", TokenSchema);
