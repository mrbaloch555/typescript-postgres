import { IDatabase } from "pg-promise";
import { getDb } from "./db";
import { BadRequestError } from "../errors/badRequest.error";
import { SqlOperationError } from "../errors/sqlOperation.error";

export async function RunQuery<T>(
  operation: (db: IDatabase<unknown>) => Promise<T>
): Promise<T> {
  const db = getDb();
  try {
    const result = await operation(db);
    return result;
  } catch (err) {
    console.error(err);

    let errorMessage = "SQL error";
    if (err instanceof Error && err.message) {
      errorMessage = err.message;
    }

    throw new SqlOperationError(errorMessage);
  } finally {
    // await closeDbConnection();
  }
}
