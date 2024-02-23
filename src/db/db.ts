import pgPromise, { IDatabase, IMain } from "pg-promise";
import config from "../config/config";

class Database {
  private static instance: Database;
  private pgp: IMain;
  private db: IDatabase<unknown>;

  private constructor() {
    this.pgp = pgPromise();
    console.log(config.dbName);

    const connectionOptions = {
      host: config.dbHost,
      port: config.dbPort,
      database: config.dbName,
      user: config.dbUser,
      password: config.dbPassword,
    };
    this.db = this.pgp(connectionOptions);
    this.initializeDatabase();
  }

  public async initializeDatabase(): Promise<void> {
    try {
      await this.db.connect();
      await this.createTables();
    } catch (error) {
      console.error("Error initializing database:", error);
    }
  }

  private async createTables(): Promise<void> {
    try {
      const createTableQueries = [
        `
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(50) NOT NULL,
          email VARCHAR(50) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          is_active BOOL NOT NULL,
          create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `,
        `
          CREATE TABLE IF NOT EXISTS photos (
            id SERIAL PRIMARY KEY,
            url VARCHAR(200) NOT NULL,
            user_id INTEGER REFERENCES users(id) NOT NULL,
            create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
      `,
        `
          CREATE TABLE IF NOT EXISTS comments (
            id SERIAL PRIMARY KEY,
            contents VARCHAR(200) NOT NULL,
            user_id INTEGER REFERENCES users(id) NOT NULL,
            photo_id INTEGER REFERENCES photos(id) NOT NULL,
            create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
      `,
        `
          CREATE TABLE IF NOT EXISTS tokens (
            id SERIAL PRIMARY KEY,
            refresh_token VARCHAR(500) NOT NULL,
            expires_at DATE NOT NULL,
            is_black_listed BOOL NOT NULL,
            user_id INTEGER REFERENCES users(id) NOT NULL,
            create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
      `,
      ];

      for (const query of createTableQueries) {
        await this.db.none(query);
      }
    } catch (error) {
      console.error("Error creating tables:", error);
    }
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public getDbInstance(): IDatabase<unknown> {
    return this.db;
  }

  public async closeConnection(): Promise<void> {
    this.pgp.end();
  }
}

const dbInstance = Database.getInstance();
export const getDb = dbInstance.getDbInstance.bind(dbInstance);
export const closeDbConnection = dbInstance.closeConnection.bind(dbInstance);
