import env from "env-var";

const config = {
  ENV: env.get("NODE_ENV").default("development").asString(),
  PORT: env.get("PORT").default(3000).asPortNumber(),
  ACCESS_TOKEN_SECRET: env.get("ACCESS_TOKEN_SECRET").required().asString(),
  REFRESH_TOKEN_SECRET: env.get("REFRESH_TOKEN_SECRET").required().asString(),
  MONGODB_URI: env.get("MONGODB_URI").required().asUrlString(),
} as const;

export default config;
