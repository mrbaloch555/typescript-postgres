import { IDatabase } from "pg-promise";
import { RunQuery } from "../db/query-runner";
import {
  CreateResponse,
  GetAllResponse,
  GetOneResponse,
  UpdateOneResponse,
  DeleteOneResponse,
  LoginResponse,
} from "../interfaces/handler-response-messages";
import { User, UserModel } from "../models/users";
import { TokenModel } from "../models/tokens";

export class UserRepository implements User {
  private static instance: UserRepository;
  async create(data: UserModel): Promise<CreateResponse> {
    const createQuery = `
      INSERT INTO users (username, email, password, is_active) 
      VALUES ($1, $2, $3, $4)
      RETURNING *;`;

    return RunQuery(async (db: IDatabase<unknown>) => {
      const result = await db.one(createQuery, [
        data.username,
        data.email,
        data.password,
        true,
      ]);
      return { success: true, data: result };
    });
  }
  async getAll(filter: Partial<UserModel>): Promise<GetAllResponse<UserModel>> {
    const getAllQuery = `SELECT * FROM users`;

    return RunQuery(async (db: IDatabase<unknown>) => {
      const result = await db.any(getAllQuery, []);
      return { success: true, data: result };
    });
  }
  public async getOne(
    filter: Partial<UserModel>
  ): Promise<GetOneResponse<UserModel>> {
    const filterKey = Object.keys(filter)[0];
    const filterValue = Object.values(filter)[0];

    const getOneQuery = `SELECT * FROM users WHERE $1:name = $2`;

    try {
      const result = await RunQuery(async (db: IDatabase<unknown>) => {
        return await db.one(getOneQuery, [filterKey, filterValue]);
      });

      return { success: true, data: result };
    } catch (error: any) {
      if (
        error instanceof Error &&
        error.message.includes("No data returned from the query")
      ) {
        return {
          success: false,
          message: "No data found for the specified filter",
        };
      } else {
        return {
          success: false,
          message: "An error occurred during the query execution",
        };
      }
    }
  }
  public async updateOne(
    filter: Partial<UserModel>,
    data: Partial<UserModel>
  ): Promise<UpdateOneResponse<UserModel>> {
    const updateQuery = `
      UPDATE users
      SET username = $1, email = $2, password = $3
      WHERE id = $4
      RETURNING *;`;

    return RunQuery(async (db: IDatabase<unknown>) => {
      const result = await db.oneOrNone(updateQuery, [
        data.username,
        data.email,
        data.password,
        filter.id,
      ]);
      return { success: true, data: result };
    });
  }
  async deleteOne(
    filter: Partial<UserModel>
  ): Promise<DeleteOneResponse<UserModel>> {
    const deleteQuery = `
      DELETE FROM users
      WHERE id = $1
      RETURNING *;`;

    return RunQuery(async (db: IDatabase<unknown>) => {
      const result = await db.oneOrNone(deleteQuery, [filter.id]);
      return { success: true, data: result };
    });
  }
  public static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      return new UserRepository();
    }
    return UserRepository.instance;
  }
}
