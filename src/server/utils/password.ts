// https://stackoverflow.com/a/67038052/26622624
import type { BinaryLike } from "crypto";

import { randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync: (
  password: BinaryLike,
  salt: BinaryLike,
  keylen: number
) => Promise<Buffer> = promisify(scrypt);

export const hash = async (password: string) => {
  const salt = randomBytes(16).toString("hex");
  const buffer = await scryptAsync(password, salt, 64);
  return `${buffer.toString("hex")}.${salt}`;
};

export const compare = async (
  storedPassword: string,
  suppliedPassword: string
) => {
  const [hashedPassword, salt] = storedPassword.split(".");
  const hashedPasswordBuffer = Buffer.from(hashedPassword, "hex");
  const suppliedPasswordBuffer = await scryptAsync(suppliedPassword, salt, 64);

  return timingSafeEqual(hashedPasswordBuffer, suppliedPasswordBuffer);
};
