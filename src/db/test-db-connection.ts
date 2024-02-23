import { getDb } from "./db";

export async function testDbConnection() {
  try {
    let db = getDb();
    await db.none("SELECT 1 WHERE false");
    console.log("Database connection is successful.");
    return;
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}
