import express from "express";
import { bindControllerMethods } from "../utils/binder";
import { Validate } from "../middlewares/vaidate";
import { AsyncHandler } from "../utils/AsyncHandler";
import auth from "../middlewares/auth";
import { PhotoController } from "../controllers/phtos";
import { PhotoValidation } from "../validations/photo";

export class PhotosRoutes {
  private controller: PhotoController;
  private validate: PhotoValidation;
  private router: express.Router;

  constructor() {
    this.controller = bindControllerMethods(PhotoController.getInstance());
    this.validate = PhotoValidation.getInstance();
    this.router = express.Router();
    this.routes();
  }

  private routes() {
    this.router
      .route("/")
      .post(
        auth(),
        Validate(this.validate.create()),
        AsyncHandler(this.controller.create)
      );
  }

  public getInstance(): express.Router {
    return this.router;
  }
}
