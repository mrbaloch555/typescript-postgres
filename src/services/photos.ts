import { BadRequestError } from "../errors/badRequest.error";
import {
  CreateResponse,
  GetAllResponse,
} from "../interfaces/handler-response-messages";
import { Photos, PhotosModel } from "../models/photos";
import { PhotosRepository } from "../repositories/photos";
import { UserRepository } from "../repositories/users";
import { UserService } from "./user";

export class PhotoService {
  private static instance: PhotoService;
  private photoRepo!: PhotosRepository;
  private userService!: UserService;

  constructor(phtoRepo: PhotosRepository, userService: UserService) {
    this.photoRepo = phtoRepo;
    this.userService = userService;
  }

  public async create(body: Partial<PhotosModel>): Promise<CreateResponse> {
    console.log(body);

    // if (!(await this.userService.getOne({ id: body.user_id?.id })).success) {
    //   throw new BadRequestError("No user exists for this usr!!!");
    // }
    return await this.photoRepo.create(body);
  }

  public static getInstance(): PhotoService {
    if (!PhotoService.instance) {
      const photoRepo = PhotosRepository.getInstance();
      const userService = UserService.getInstance();
      return new PhotoService(photoRepo, userService);
    }
    return this.instance;
  }
}
