import type { ITodo } from "../types.js";

import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema<ITodo>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  timestamp: { type: Number, required: true, default: Date.now },
});

export default mongoose.model<ITodo>("Todo", TodoSchema);
