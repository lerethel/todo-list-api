import { randomUUID } from "crypto";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config/config.js";
import { HttpException } from "../exceptions/http.exception.js";
import Token from "../models/token.model.js";

class TokenService {
  readonly config = {
    // Both ages are in seconds.
    accessTokenMaxAge: 300,
    refreshTokenMaxAge: 60 * 60 * 24 * 180,
  } as const;

  private createAccess(user: string) {
    return jwt.sign({ user }, config.ACCESS_TOKEN_SECRET, {
      expiresIn: this.config.accessTokenMaxAge,
    });
  }

  private createRefresh(user: string, family: string) {
    return jwt.sign({ user, family }, config.REFRESH_TOKEN_SECRET, {
      expiresIn: this.config.refreshTokenMaxAge,
    });
  }

  async create(user: string) {
    const family = randomUUID();
    const refreshToken = this.createRefresh(user, family);

    await Token.create({ user, family, refreshToken });

    return { accessToken: this.createAccess(user), refreshToken };
  }

  async refresh(refreshToken?: string) {
    if (!refreshToken) {
      throw new HttpException(401);
    }

    let payload: JwtPayload;

    try {
      payload = jwt.verify(
        refreshToken,
        config.REFRESH_TOKEN_SECRET
      ) as JwtPayload;
    } catch {
      throw new HttpException(403);
    }

    const { user, family } = payload;
    const storedToken = await Token.findOne({ refreshToken }).lean().exec();

    // If a refresh token is in the cookies but not in the database,
    // consider this a reuse attempt and delete the compromised family.
    if (!storedToken) {
      await Token.deleteOne({ family }).exec();
      throw new HttpException(403);
    }

    if (storedToken.user.toString() !== user) {
      throw new HttpException(403);
    }

    const newRefreshToken = this.createRefresh(user, family);

    // Replace the refresh token with a new one.
    await Token.updateOne(
      { refreshToken },
      { refreshToken: newRefreshToken }
    ).exec();

    return {
      accessToken: this.createAccess(user),
      refreshToken: newRefreshToken,
    };
  }

  async delete(refreshToken?: string) {
    if (!refreshToken) {
      return;
    }

    await Token.deleteOne({ refreshToken }).exec();
  }
}

export default new TokenService();
