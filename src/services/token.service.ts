import { randomUUID } from "crypto";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config/config.js";
import TokenRepository from "../database/repositories/token.repository.js";
import Inject from "../decorators/inject.decorator.js";
import Injectable from "../decorators/injectable.decorator.js";
import { HttpException } from "../exceptions/http.exception.js";
import { IRepository, IToken } from "../types/database.types.js";

@Injectable()
export default class TokenService {
  @Inject(TokenRepository) protected tokenRepository: IRepository<IToken>;

  get config() {
    return {
      // Both ages are in seconds.
      accessTokenMaxAge: 300,
      refreshTokenMaxAge: 60 * 60 * 24 * 180,
    } as const;
  }

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

    await this.tokenRepository.create({ user, family, refreshToken });

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
    const storedToken = await this.tokenRepository.findOne({ refreshToken });

    // If a refresh token is in the cookies but not in the database,
    // consider this a reuse attempt and delete the compromised family.
    if (!storedToken) {
      await this.tokenRepository.deleteOne({ family });
      throw new HttpException(403);
    }

    if (storedToken.user !== user) {
      throw new HttpException(403);
    }

    const newRefreshToken = this.createRefresh(user, family);

    // Replace the refresh token with a new one.
    await this.tokenRepository.update(
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

    await this.tokenRepository.deleteOne({ refreshToken });
  }
}
