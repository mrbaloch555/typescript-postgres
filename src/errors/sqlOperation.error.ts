import { Logger } from "../config/logger";
import { CustomError } from "./custom/custom.error";

export class SqlOperationError extends CustomError {
  public statusCode: number = 422;

  constructor(
    message: string,
    public sqlOperationDetails?: string,
    stack: string = ""
  ) {
    super(message, stack);
    Object.setPrototypeOf(this, SqlOperationError.prototype);
  }

  logSqlOperationDetails() {
    Logger.error(this.stack);
  }

  serializeError(): {
    message: string;
    feild?: string | undefined;
    stack?: string | undefined;
  }[] {
    return [{ message: this.message, stack: this.stack }];
  }
}
