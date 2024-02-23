import Joi from "joi";

export class PhotoValidation {
  private static instance: PhotoValidation;
  public create() {
    return {
      body: Joi.object().keys({
        url: Joi.string().required(),
      }),
    };
  }

  public static getInstance(): PhotoValidation {
    if (!PhotoValidation.instance) {
      return new PhotoValidation();
    }
    return this.instance;
  }
}
