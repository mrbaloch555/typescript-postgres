import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom/custom.error";
import { Logger } from "../config/logger";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof CustomError) {
    if (process.env.NODE_ENV == "pod") {
      delete error.stack;
    }
    return res.status(error.statusCode).send({
      errors: error.serializeError(),
    });
  }
  Logger.error(error);
  res.status(400).send({
    errors: [{ message: "Something went wrong!" }],
  });
};
