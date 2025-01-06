import mongoose from "mongoose";
import { IUser } from "../../types/database.types.js";
import todoModel from "./todo.model.js";
import tokenModel from "./token.model.js";

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
  },
  { versionKey: false }
);

userSchema.post("deleteOne", async function () {
  const { _id } = this.getFilter();
  await Promise.all([
    todoModel.deleteMany({ user: _id }),
    tokenModel.deleteMany({ user: _id }),
  ]);
});

export default mongoose.model<IUser>("User", userSchema);
