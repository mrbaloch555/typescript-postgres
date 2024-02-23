export interface CreateResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export interface GetAllResponse<T> {
  success: boolean;
  message?: string;
  data: Array<T>;
}

export interface GetOneResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface UpdateOneResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface DeleteOneResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface LoginResponse<T, U> {
  success: boolean;
  message: string;
  data: {
    user: T;
    tokens: {
      access: {
        token: string;
        expires: Date;
      };
      refresh: {
        token: string;
        expires: Date;
      };
    };
  };
}
