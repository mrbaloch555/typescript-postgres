import { PhotoService } from "../services/photos";
import { Request, Response } from "express";

export class PhotoController {
  private static instance: PhotoController;
  private photoService: PhotoService;

  constructor(photoService: PhotoService) {
    this.photoService = photoService;
  }

  public async create(req: Request, res: Response) {
    const { body } = req;
    res.status(200).send(await this.photoService.create(body));
  }

  public static getInstance(): PhotoController {
    if (!PhotoController.instance) {
      const photoService = PhotoService.getInstance();
      return new PhotoController(photoService);
    }
    return this.instance;
  }
}
