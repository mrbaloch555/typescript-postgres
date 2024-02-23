import joi from "joi";

export class UserValidation {
  private static instance: UserValidation;

  /**
   *
   * @returns JoiSchema
   */
  public create() {
    return {
      body: joi.object().keys({
        username: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required(),
      }),
    };
  }

  /**
   *
   * @returns JoiSchema
   */
  public login() {
    return {
      body: joi.object().keys({
        email: joi.string().email().required(),
        password: joi.string().required(),
      }),
    };
  }

  /**
   *
   * @returns JoiSchema
   */
  public getOne() {
    return {
      params: joi.object().keys({
        id: joi.number().required(),
      }),
    };
  }

  /**
   *
   * @returns JoiSchema
   */
  public updateOne() {
    return {
      params: joi.object().keys({
        id: joi.number().required(),
      }),
      body: joi.object().keys({
        username: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required(),
      }),
    };
  }

  /**
   *
   * @returns JoiSchema
   */
  public deleteOne() {
    return {
      params: joi.object().keys({
        id: joi.number().required(),
      }),
    };
  }

  /**
   *
   * @returns JoiSchema
   */
  public static getInstance(): UserValidation {
    if (!UserValidation.instance) {
      return new UserValidation();
    }
    return this.instance;
  }
}
