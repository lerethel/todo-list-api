import { randomUUID } from "crypto";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config/config.js";
import { HttpException } from "../exceptions/http.exception.js";
import tokenRepository from "../repositories/token.repository.js";
import { IRepository, IToken } from "../types/database.types.js";

class TokenService {
  constructor(
    private readonly tokenRepo: IRepository<IToken> = tokenRepository
  ) {}

  readonly config = {
    // Both ages are in seconds.
    accessTokenMaxAge: 300,
    refreshTokenMaxAge: 60 * 60 * 24 * 180,
  } as const;

  private createAccess(user: unknown) {
    return jwt.sign({ user }, config.ACCESS_TOKEN_SECRET, {
      expiresIn: this.config.accessTokenMaxAge,
    });
  }

  private createRefresh(user: unknown, family: string) {
    return jwt.sign({ user, family }, config.REFRESH_TOKEN_SECRET, {
      expiresIn: this.config.refreshTokenMaxAge,
    });
  }

  async create(user: unknown) {
    const family = randomUUID();
    const refreshToken = this.createRefresh(user, family);

    await this.tokenRepo.create({ user, family, refreshToken });

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
    const storedToken = await this.tokenRepo.findOne({ refreshToken });

    // If a refresh token is in the cookies but not in the database,
    // consider this a reuse attempt and delete the compromised family.
    if (!storedToken) {
      await this.tokenRepo.deleteOne({ family });
      throw new HttpException(403);
    }

    if (storedToken.user !== user) {
      throw new HttpException(403);
    }

    const newRefreshToken = this.createRefresh(user, family);

    // Replace the refresh token with a new one.
    await this.tokenRepo.update(
      { refreshToken },
      { refreshToken: newRefreshToken }
    );

    return {
      accessToken: this.createAccess(user),
      refreshToken: newRefreshToken,
    };
  }

  async delete(refreshToken?: string) {
    if (!refreshToken) {
      return;
    }

    await this.tokenRepo.deleteOne({ refreshToken });
  }
}

export default new TokenService();
