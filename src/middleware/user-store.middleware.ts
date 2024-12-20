import { RequestHandler } from "express";
import userStore from "../stores/user.store.js";

export default ((req, res, next) =>
  userStore.init(next)) satisfies RequestHandler;
