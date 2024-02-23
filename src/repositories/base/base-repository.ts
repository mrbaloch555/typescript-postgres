import {
  CreateResponse,
  DeleteOneResponse,
  GetAllResponse,
  GetOneResponse,
  UpdateOneResponse,
} from "../../interfaces/handler-response-messages";

export interface BaseRepository<T> {
  create(data: Partial<T>): Promise<CreateResponse>;
  getAll(filter: Partial<T>): Promise<GetAllResponse<T>>;
  getOne(filter: Partial<T>): Promise<GetOneResponse<T>>;
  updateOne(
    filter: Partial<T>,
    data: Partial<T>
  ): Promise<UpdateOneResponse<T>>;
  deleteOne(filter: Partial<T>): Promise<DeleteOneResponse<T>>;
}
