import { IDatabase } from "pg-promise";
import { getDb, closeDbConnection } from "./db";

export async function RunQuery<T>(
  operation: (db: IDatabase<unknown>) => Promise<T>
): Promise<T> {
  const db = getDb();
  try {
    const result = await operation(db);
    return result;
  } finally {
    // await closeDbConnection();
  }
}
