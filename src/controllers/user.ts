import { UserService } from "../services/user";
import { Request, Response } from "express";

export class UserController {
  private static instance: UserController;
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  /**
   *
   * @param req Request
   * @param res Response
   */
  public async create(req: Request, res: Response) {
    const { body } = req;
    const response = await this.userService.create(body);
    res.status(200).send(response);
  }

  /**
   *
   * @param req Request
   * @param res Response
   */
  public async login(req: Request, res: Response) {
    const { body } = req;
    const response = await this.userService.login(body);
    res.status(200).send(response);
  }

  /**
   *
   * @param req Request
   * @param res Response
   */
  public async getAll(req: Request, res: Response) {
    const filter = {};
    res.status(200).send(await this.userService.getAll(filter));
  }

  /**
   *
   * @param req Request
   * @param res Response
   */
  public async getOne(req: Request, res: Response) {
    const filter = { id: parseInt(req.params.id) };
    res.status(200).send(await this.userService.getOne(filter));
  }

  /**
   *
   * @param req Request
   * @param res Response
   */
  public async updateOne(req: Request, res: Response) {
    const filter = { id: parseInt(req.params.id) };
    const { body } = req;
    res.status(200).send(await this.userService.updateOne(filter, body));
  }

  /**
   *
   * @param req Request
   * @param res Response
   */
  public async deleteOne(req: Request, res: Response) {
    const filter = { id: parseInt(req.params.id) };
    res.status(200).send(await this.userService.deleteOne(filter));
  }

  /**
   *
   * @returns UserController
   */
  public static getInstance(): UserController {
    if (!UserController.instance) {
      const userService = UserService.getInstance();
      return new UserController(userService);
    }

    return UserController.instance;
  }
}
