import { IDatabase } from "pg-promise";
import { RunQuery } from "../db/query-runner";
import {
  CreateResponse,
  GetAllResponse,
  GetOneResponse,
  UpdateOneResponse,
  DeleteOneResponse,
} from "../interfaces/handler-response-messages";
import { TokenModel } from "../models/tokens";
import { BaseRepository } from "./base/base-repository";

export class TokensRepository implements BaseRepository<TokenModel> {
  private static instance: TokensRepository;

  /**
   *
   * @param data Partial<TokenModel>
   * @returns Promise<CreateResponse>
   */
  async create(data: Partial<TokenModel>): Promise<CreateResponse> {
    const createQuery = `
      INSERT INTO tokens (refresh_token, expires_at, is_black_listed, user_id) 
      VALUES ($1, $2, $3, $4)
      RETURNING *;`;

    return RunQuery(async (db: IDatabase<unknown>) => {
      const result = await db.one(createQuery, [
        data.refresh_token,
        data.expires_at,
        data.is_black_listed,
        data.user_id,
      ]);
      return { success: true, data: result };
    });
  }

  /**
   *
   * @param filter Partial<TokenModel>
   * @unimplemented
   */
  getAll(filter: Partial<TokenModel>): Promise<GetAllResponse<TokenModel>> {
    throw new Error("Method not implemented.");
  }

  /**
   *
   * @param filter Partial<TokenModel>
   * @returns Promise<GetOneResponse<TokenModel>>
   */
  public async getOne(
    filter: Partial<TokenModel>
  ): Promise<GetOneResponse<TokenModel>> {
    const filterKey = Object.keys(filter)[0];
    const filterValue = Object.values(filter)[0];

    const getOneQuery = `SELECT 
        tokens.id,
        tokens.refresh_token,
        tokens.expires_at,
        tokens.is_black_listed,
        tokens.user_id,
        tokens.created_at,
        tokens.updated_at
        FROM tokens WHERE $1:name = $2`;

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
  /**
   *
   * @param filter
   * @param data
   * @unimplemented
   */
  updateOne(
    filter: Partial<TokenModel>,
    data: Partial<TokenModel>
  ): Promise<UpdateOneResponse<TokenModel>> {
    throw new Error("Method not implemented.");
  }

  /**
   *
   * @param filter Partial<TokenModel>
   * @returns Promise<DeleteOneResponse<TokenModel>>
   */
  public deleteOne(
    filter: Partial<TokenModel>
  ): Promise<DeleteOneResponse<TokenModel>> {
    const deleteQuery = `
      DELETE FROM tokens
      WHERE id = $1
      RETURNING *;`;

    return RunQuery(async (db: IDatabase<unknown>) => {
      const result = await db.oneOrNone(deleteQuery, [filter.id]);
      return { success: true, data: result };
    });
  }

  public static getInstance(): TokensRepository {
    if (!TokensRepository.instance) {
      return new TokensRepository();
    }
    return this.instance;
  }
}
