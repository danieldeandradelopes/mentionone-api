import { Knex } from "knex";
import IRefreshTokenGateway, { RefreshToken } from "./IRefreshTokenGateway";

export default class KnexRefreshTokenGateway implements IRefreshTokenGateway {
  constructor(private connection: Knex) {}

  async create(token: string, userId: number): Promise<RefreshToken> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const [refreshToken] = await this.connection("refresh_tokens")
      .insert({
        token,
        user_id: userId,
        expires_at: expiresAt,
        is_revoked: false,
      })
      .returning("*");

    return refreshToken;
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    const refreshToken = await this.connection("refresh_tokens")
      .where({ token, is_revoked: false })
      .first();

    return refreshToken || null;
  }

  async revokeToken(token: string): Promise<void> {
    await this.connection("refresh_tokens")
      .where({ token })
      .update({ is_revoked: true });
  }

  async revokeAllUserTokens(userId: number): Promise<void> {
    await this.connection("refresh_tokens")
      .where({ user_id: userId })
      .update({ is_revoked: true });
  }

  async deleteExpiredTokens(): Promise<void> {
    await this.connection("refresh_tokens")
      .where("expires_at", "<", new Date())
      .del();
  }
}
