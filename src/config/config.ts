import env from "env-var";
import Env from "./enums/env.enum.js";

const config = {
  ENV: env.get("NODE_ENV").default(Env.Development).asEnum(Object.values(Env)),
  PORT: env.get("PORT").default(3000).asPortNumber(),
  ACCESS_TOKEN_SECRET: env.get("ACCESS_TOKEN_SECRET").required().asString(),
  REFRESH_TOKEN_SECRET: env.get("REFRESH_TOKEN_SECRET").required().asString(),
  MONGODB_URI: env.get("MONGODB_URI").required().asUrlString(),
} as const;

export default config;
