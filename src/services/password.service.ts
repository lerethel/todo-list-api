// https://stackoverflow.com/a/67038052/26622624
import { BinaryLike, randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";
import Injectable from "../decorators/injectable.decorator.js";
import { IPasswordService } from "../types/service.types.js";

type AsyncScrypt = (
  password: BinaryLike,
  salt: BinaryLike,
  keylen: number
) => Promise<Buffer>;

@Injectable()
export default class PasswordService implements IPasswordService {
  private readonly scrypt: AsyncScrypt = promisify(scrypt);

  async hash(password: string): Promise<string> {
    const salt = randomBytes(16).toString("hex");
    const buffer = await this.scrypt(password, salt, 64);
    return `${buffer.toString("hex")}.${salt}`;
  }

  async compare(
    storedPassword: string,
    suppliedPassword: string
  ): Promise<boolean> {
    const [hashedPassword, salt] = storedPassword.split(".");
    const hashedPasswordBuffer = Buffer.from(hashedPassword, "hex");
    const suppliedPasswordBuffer = await this.scrypt(
      suppliedPassword,
      salt,
      64
    );

    return timingSafeEqual(hashedPasswordBuffer, suppliedPasswordBuffer);
  }
}
