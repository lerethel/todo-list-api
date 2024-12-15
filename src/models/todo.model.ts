import mongoose from "mongoose";
import { ITodo } from "../types/types.js";

const TodoSchema = new mongoose.Schema<ITodo>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
});

export default mongoose.model<ITodo>("Todo", TodoSchema);
