import { LoginResponse } from "../interfaces/handler-response-messages";
import { BaseRepository } from "../repositories/base/base-repository";
import { TokenModel } from "./tokens";

export interface UserModel {
  id?: number;
  username: string;
  email: string;
  password: string;
  isActive: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface UserRepositoryCustom {}

export interface User extends BaseRepository<UserModel>, UserRepositoryCustom {}
