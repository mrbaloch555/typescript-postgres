import { Request, Response, NextFunction } from "express";
import { Logger } from "../config/logger";
export default function (req: Request, res: Response, next: NextFunction) {
  Logger.info(`Request URL: ${req.url}`);
  Logger.info(`Request Body: ${JSON.stringify(req.body)}`);
  next();
}
