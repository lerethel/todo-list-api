import { RequestHandler } from "express";

export default ((req, res) => res.jsonStatus(404)) satisfies RequestHandler;
