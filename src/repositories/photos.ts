import { IDatabase } from "pg-promise";
import { RunQuery } from "../db/query-runner";
import {
  CreateResponse,
  GetAllResponse,
  GetOneResponse,
  UpdateOneResponse,
  DeleteOneResponse,
} from "../interfaces/handler-response-messages";
import { Photos, PhotosModel } from "../models/photos";
import { UserModel } from "../models/users";

export class PhotosRepository implements Photos {
  private static instance: PhotosRepository;

  async create(data: Partial<PhotosModel>): Promise<CreateResponse> {
    const createQuery = `
      INSERT INTO photos (url, user_id) 
      VALUES ($1, $2)
      RETURNING *;`;

    return RunQuery(async (db: IDatabase<unknown>) => {
      const result = await db.one(createQuery, [data.url, data.user_id!.id]);
      return { success: true, data: result };
    });
  }

  async getAll(
    filter: Partial<PhotosModel>
  ): Promise<GetAllResponse<PhotosModel>> {
    const getAllQuery = `
        SELECT 
        photos.id,
        photos.url,
        photos.created_at,
        photos.updated_at,
        users.id as user_id,
        users.username,
        users.email,
        users.isActive as is_active,
        users.created_at as user_created_at,
        users.updated_at as user_updated_at
        FROM photos
        JOIN users ON users.id = photos.user_id
  `;

    return RunQuery(async (db: IDatabase<unknown>) => {
      const result = await db.any(getAllQuery, []);
      const transformedResult = result.map((row: any) => {
        return {
          id: row.id,
          url: row.url,
          user_id: {
            id: row.user_id,
            username: row.username,
            email: row.email,
            isActive: row.is_active,
            created_at: row.user_created_at,
            updated_at: row.user_updated_at,
            password: row.password,
          },
          created_at: row.created_at,
          updated_at: row.updated_at,
        };
      });

      return { success: true, data: transformedResult };
    });
  }

  public async getOne(
    filter: Partial<PhotosModel>
  ): Promise<GetOneResponse<PhotosModel>> {
    const filterKey = Object.keys(filter)[0];
    const filterValue = Object.values(filter)[0];

    const getOneQuery = `SELECT 
        photos.id,
        photos.url,
        photos.created_at,
        photos.updated_at,
        users.id as user_id,
        users.username,
        users.email,
        users.isActive as is_active,
        users.created_at as user_created_at,
        users.updated_at as user_updated_at
        FROM photos WHERE $1:name = $2 JOIN users ON user.id = photos.user_id`;

    try {
      const result = await RunQuery(async (db: IDatabase<unknown>) => {
        const result = await db.one(getOneQuery, [filterKey, filterValue]);
        return {
          id: result.id,
          url: result.url,
          user_id: {
            id: result.user_id,
            username: result.username,
            email: result.email,
            isActive: result.is_active,
            created_at: result.user_created_at,
            updated_at: result.user_updated_at,
            password: result.password,
          },
          created_at: result.created_at,
          updated_at: result.updated_at,
        };
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
    filter: Partial<PhotosModel>,
    data: Partial<PhotosModel>
  ): Promise<UpdateOneResponse<PhotosModel>> {
    const updateQuery = `
      UPDATE photos
      SET url = $1,
      WHERE id = $2
      RETURNING *;`;

    return RunQuery(async (db: IDatabase<unknown>) => {
      const result = await db.oneOrNone(updateQuery, [data.url, filter.id]);
      return { success: true, data: result };
    });
  }
  public deleteOne(
    filter: Partial<PhotosModel>
  ): Promise<DeleteOneResponse<PhotosModel>> {
    const deleteQuery = `
      DELETE FROM photos
      WHERE id = $1
      RETURNING *;`;

    return RunQuery(async (db: IDatabase<unknown>) => {
      const result = await db.oneOrNone(deleteQuery, [filter.id]);
      return { success: true, data: result };
    });
  }

  public static getInstance(): PhotosRepository {
    if (!PhotosRepository.instance) {
      return new PhotosRepository();
    }
    return this.instance;
  }
}
