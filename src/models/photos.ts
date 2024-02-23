import { BaseRepository } from "../repositories/base/base-repository";
import { UserModel } from "./users";

export interface PhotosModel {
  id?: number;
  url: string;
  user_id: UserModel;
  created_at: Date;
  updated_at: Date;
}

export interface PhotosRepositoryCustom {}

export interface Photos
  extends BaseRepository<PhotosModel>,
    PhotosRepositoryCustom {}
