import express, { NextFunction, Request, Response } from "express";
import { UserRoutes } from "../routes/user";
import { ApiNotFoundError } from "../errors/apiNotFound.error";
import { errorHandler } from "../middlewares/error.handler";
import config from "../config/config";
import { MorganErrorHandler, MorganSuccessHandler } from "../config/morgan";
import passport from "passport";
import jwtStrategy from "../config/passport";
import cors from "cors";
import { PhotosRoutes } from "../routes/photos";

class App {
  private static instance: App;
  public app: express.Application;

  private constructor() {
    this.app = express();
    this.app.use(express.json());

    if (config.env !== "test") {
      this.app.use(MorganSuccessHandler);
      this.app.use(MorganErrorHandler);
    }
    // enable cors
    this.app.use(cors());
    this.app.options("*", cors());
    // Static files
    this.app.use(express.static("public"));
    // Jwt
    this.app.use(passport.initialize());
    passport.use("jwt", jwtStrategy);

    this.app.use("/users", new UserRoutes().getInstance());
    this.app.use("/photos", new PhotosRoutes().getInstance());

    this.app.get("/", (req: Request, res: Response) => {
      return res.status(200).json({ message: "You are in SQL world server!!" });
    });

    this.app.all("*", (req: Request, res: Response, next: NextFunction) => {
      next(new ApiNotFoundError());
    });
    this.app.use(errorHandler);
  }

  public static getInstance(): App {
    if (!App.instance) {
      App.instance = new App();
    }
    return App.instance;
  }
}

export default App.getInstance().app;
