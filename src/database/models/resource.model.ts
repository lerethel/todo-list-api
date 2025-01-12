import mongoose from "mongoose";
import { IResource } from "../../types/database.types.js";

const resourceSchema = new mongoose.Schema<IResource>(
  {
    token: { type: String, required: true, unique: true },
    text: { type: String, required: true },
  },
  { versionKey: false }
);

export default mongoose.model<IResource>("Resource", resourceSchema);
