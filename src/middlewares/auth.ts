import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { Logger } from "../config/logger";
import { ApiForbidden } from "../errors/forbidden.error";
import { NotAuthorizeError } from "../errors/notAuthorize.error";

type Promolve<ResT = void, RejT = Error> = {
  promise: Promise<ResT>;
  resolve: (value: ResT | PromiseLike<ResT>) => void;
  reject: (value: RejT) => void;
};
const verifyCallback =
  (
    req: Request,
    res: Response,
    resolve: any,
    reject: any,
    requiredRights: string[]
  ) =>
  async (err: Error, user: any, info: any) => {
    if (err || info || !user) {
      return reject(new NotAuthorizeError());
    }

    req.user = user;
    if (requiredRights.length) {
      Logger.info(`User Role: ${user.role}`);
      const userRights = user.rolePrivileges;
      const hasRequiredRights = requiredRights.every((requiredRight) =>
        userRights.includes(requiredRight)
      );

      if (!hasRequiredRights && req.params.userId !== user.id) {
        return reject(new ApiForbidden());
      }
    }
    resolve();
  };

const auth =
  (...requiredRights: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        "jwt",
        { session: false },
        verifyCallback(req, res, resolve, reject, requiredRights)
      )(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };

export default auth;
