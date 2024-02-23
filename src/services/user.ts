import { BadRequestError } from "../errors/badRequest.error";
import { NotAuthorizeError } from "../errors/notAuthorize.error";
import {
  CreateResponse,
  DeleteOneResponse,
  GetAllResponse,
  GetOneResponse,
  LoginResponse,
  UpdateOneResponse,
} from "../interfaces/handler-response-messages";
import { TokenModel } from "../models/tokens";
import { User, UserModel } from "../models/users";
import { UserRepository } from "../repositories/users";
import { Password } from "../utils/password";
import { TokenService } from "./tokens";

export class UserService {
  private static instance: UserService;
  private userRepo: User;
  private tokenService: TokenService;

  constructor(userRepo: User, tokenService: TokenService) {
    this.userRepo = userRepo;
    this.tokenService = tokenService;
  }

  /**
   *
   * @param body Partial<UserModel>
   * @returns Promise<CreateResponse>
   */
  public async create(body: Partial<UserModel>): Promise<CreateResponse> {
    if ((await this.userRepo.getOne({ email: body.email })).success) {
      throw new BadRequestError("email already exists!");
    }
    body.password = await Password.toHash(body.password!);
    const user = await this.userRepo.create(body);
    return user;
  }

  /**
   *
   * @param body Partial<UserModel>
   * @returns Promise<LoginResponse<UserModel, TokenModel>>
   */
  public async login(
    body: Partial<UserModel>
  ): Promise<LoginResponse<UserModel, TokenModel>> {
    const user = await this.userRepo.getOne({ email: body.email });

    if (!user.success) {
      throw new BadRequestError("invalid credentials");
    }

    if (!(await Password.compare(user.data?.password!, body.password!))) {
      throw new BadRequestError("invalid credentials");
    }

    const token = await this.tokenService.generateAuthTokens(user.data!);
    return {
      success: true,
      message: "logged in successfully",
      data: {
        user: user.data!,
        tokens: token,
      },
    };
  }

  /**
   *
   * @param filter Partial<UserModel>
   * @returns
   */
  public async getAll(
    filter: Partial<UserModel>
  ): Promise<GetAllResponse<UserModel>> {
    return await this.userRepo.getAll(filter);
  }

  /**
   *
   * @param filter Partial<UserModel>
   * @returns Promise<GetOneResponse<UserModel>>
   */
  public async getOne(
    filter: Partial<UserModel>
  ): Promise<GetOneResponse<UserModel>> {
    return await this.userRepo.getOne(filter);
  }

  /**
   *
   * @param filter Partial<UserModel>
   * @param data Promise<UpdateOneResponse<UserModel>>
   * @returns
   */
  public async updateOne(
    filter: Partial<UserModel>,
    data: Partial<UserModel>
  ): Promise<UpdateOneResponse<UserModel>> {
    if (!(await this.userRepo.getOne(filter)).success) {
      throw new BadRequestError("No resource found!!");
    }
    return await this.userRepo.updateOne(filter, data);
  }

  /**
   *
   * @param filter Partial<UserModel>
   * @returns Promise<DeleteOneResponse<UserModel>>
   */
  public async deleteOne(
    filter: Partial<UserModel>
  ): Promise<DeleteOneResponse<UserModel>> {
    return await this.userRepo.deleteOne(filter);
  }

  /**
   *
   * @returns UserService
   */
  public static getInstance(): UserService {
    if (!UserService.instance) {
      const userRepo = UserRepository.getInstance();
      const tokenService = TokenService.getInstance();
      return new UserService(userRepo, tokenService);
    }

    return UserService.instance;
  }
}
