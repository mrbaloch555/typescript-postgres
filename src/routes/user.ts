import express from "express";
import { UserController } from "../controllers/user";
import { bindControllerMethods } from "../utils/binder";
import { UserValidation } from "../validations/user";
import { Validate } from "../middlewares/vaidate";
import { AsyncHandler } from "../utils/AsyncHandler";

export class UserRoutes {
  private controller: UserController;
  private validate: UserValidation;
  private router: express.Router;

  constructor() {
    this.controller = bindControllerMethods(UserController.getInstance());
    this.validate = UserValidation.getInstance();
    this.router = express.Router();
    this.routes();
  }

  private routes() {
    this.router
      .route("/login")
      .post(
        Validate(this.validate.login()),
        AsyncHandler(this.controller.login)
      );

    this.router
      .route("/")
      .get(AsyncHandler(this.controller.getAll))
      .post(
        Validate(this.validate.create()),
        AsyncHandler(this.controller.create)
      );

    this.router
      .route("/:id")
      .get(
        Validate(this.validate.getOne()),
        AsyncHandler(this.controller.getOne)
      )
      .patch(
        Validate(this.validate.updateOne()),
        AsyncHandler(this.controller.updateOne)
      )
      .delete(Validate(this.validate.deleteOne()), this.controller.deleteOne);
  }

  public getInstance(): express.Router {
    return this.router;
  }
}
