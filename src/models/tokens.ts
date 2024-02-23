export interface TokenModel {
  id?: number;
  refresh_token: string;
  expires_at: Date;
  is_black_listed: boolean;
  user_id: number;
  created_at: Date;
  updated_at: Date;
}
