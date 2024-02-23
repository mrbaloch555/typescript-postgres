import config from "../config/config";
import {
  CreateResponse,
  DeleteOneResponse,
  GetOneResponse,
} from "../interfaces/handler-response-messages";
import { TokenTypes } from "../interfaces/token-type";
import { TokenModel } from "../models/tokens";
import { UserModel } from "../models/users";
import { TokensRepository } from "../repositories/tokenst";
import jwt from "jsonwebtoken";
import { createDateForToken } from "../utils/date";

export class TokenService {
  private static instance: TokenService;
  private tokenRepo: TokensRepository;

  constructor(tokenRepo: TokensRepository) {
    this.tokenRepo = tokenRepo;
  }

  /**
   *
   * @param data Partial<TokenModel>
   * @returns Promise<CreateResponse>
   */
  public async create(data: Partial<TokenModel>): Promise<CreateResponse> {
    return await this.tokenRepo.create(data);
  }

  /**
   *
   * @param filter Partial<TokenModel>
   * @returns Promise<GetOneResponse<TokenModel>>
   */
  public async getOne(
    filter: Partial<TokenModel>
  ): Promise<GetOneResponse<TokenModel>> {
    return await this.tokenRepo.getOne(filter);
  }

  /**
   *
   * @param filter Partial<TokenModel>
   * @returns Promise<DeleteOneResponse<TokenModel>>
   */

  public async deleteOne(
    filter: Partial<TokenModel>
  ): Promise<DeleteOneResponse<TokenModel>> {
    return await this.tokenRepo.deleteOne(filter);
  }

  public async createJwtToken({
    userId,
    expiresIn,
    type,
    secret,
  }: {
    userId: number;
    expiresIn: string;
    type: TokenTypes;
    secret: string;
  }): Promise<string> {
    const payload = {
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      expiresIn: expiresIn,
      type,
    };

    return jwt.sign(payload, secret);
  }

  public async generateAuthTokens(user: UserModel) {
    let accessTokenExpires = config.jwtExpirationAccess;
    let refreshTokenExpires = config.jwtExpirationRefresh;
    let acessTokenExpiresTimestamp: Date = new Date();
    let refreshTokenExpiresTimestamp: Date = new Date();
    if (
      typeof config.jwtExpirationAccess === "string" &&
      config.jwtExpirationAccess.includes("d")
    ) {
      acessTokenExpiresTimestamp = new Date(
        acessTokenExpiresTimestamp.getTime() +
          createDateForToken(accessTokenExpires)
      );
      refreshTokenExpiresTimestamp = new Date(
        refreshTokenExpiresTimestamp.getTime() +
          createDateForToken(refreshTokenExpires)
      );
    }

    const accessToken = await this.createJwtToken({
      userId: user.id!,
      expiresIn: accessTokenExpires,
      type: TokenTypes.access,
      secret: config.jwtScret,
    });

    const refreshToken = await this.createJwtToken({
      userId: user.id!,
      expiresIn: refreshTokenExpires,
      type: TokenTypes.refresh,
      secret: config.jwtScret,
    });

    await this.create({
      refresh_token: refreshToken,
      user_id: user.id,
      expires_at: refreshTokenExpiresTimestamp!,
      is_black_listed: false,
    });
    return {
      access: {
        token: accessToken,
        expires: acessTokenExpiresTimestamp!,
      },
      refresh: {
        token: refreshToken,
        expires: refreshTokenExpiresTimestamp!,
      },
    };
  }

  public static getInstance(): TokenService {
    if (!TokenService.instance) {
      const tokenRepo = TokensRepository.getInstance();
      return new TokenService(tokenRepo);
    }
    return this.instance;
  }
}
