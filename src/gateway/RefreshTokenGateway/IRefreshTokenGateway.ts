export interface RefreshToken {
  id: number;
  token: string;
  user_id: number;
  expires_at: Date;
  is_revoked: boolean;
  created_at: Date;
  updated_at: Date;
}

export default interface IRefreshTokenGateway {
  create(token: string, userId: number): Promise<RefreshToken>;
  findByToken(token: string): Promise<RefreshToken | null>;
  revokeToken(token: string): Promise<void>;
  revokeAllUserTokens(userId: number): Promise<void>;
  deleteExpiredTokens(): Promise<void>;
}
