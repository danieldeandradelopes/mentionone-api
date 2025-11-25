import { Request, Response } from "express";
import IRefreshTokenGateway from "../gateway/RefreshTokenGateway/IRefreshTokenGateway";
import IJwtAssign from "../infra/JwtAssign/IJwtAssign";
import { CookieManager } from "../middleware/CookieManager";

export default class RefreshTokenController {
  constructor(
    readonly refreshTokenGateway: IRefreshTokenGateway,
    readonly jsonWebTokenAdapter: IJwtAssign
  ) {}

  async refreshToken(req: Request, res: Response) {
    try {
      // Buscar refresh token nos cookies
      const refreshToken = CookieManager.getRefreshToken(req);

      if (!refreshToken) {
        return false;
      }

      // Verificar se o refresh token é válido
      if (!this.jsonWebTokenAdapter.verifyRefreshToken(refreshToken)) {
        CookieManager.clearRefreshToken(res);
        return false;
      }

      // Buscar o refresh token no banco
      const storedRefreshToken = await this.refreshTokenGateway.findByToken(
        refreshToken
      );

      if (!storedRefreshToken) {
        CookieManager.clearRefreshToken(res);
        return false;
      }

      // Verificar se o token não expirou
      if (new Date() > storedRefreshToken.expires_at) {
        await this.refreshTokenGateway.revokeToken(refreshToken);
        CookieManager.clearRefreshToken(res);
        return false;
      }

      // Decodificar o refresh token para obter os dados do usuário
      const userData =
        this.jsonWebTokenAdapter.decryptRefreshToken(refreshToken);

      if (!userData) {
        return false;
      }

      if (userData.id !== storedRefreshToken.user_id) {
        return false;
      }

      // Gerar novo access token
      const newAccessToken = this.jsonWebTokenAdapter.generate({
        id: userData.id,
        access_level: userData.access_level,
        enterprise_id: userData.enterprise_id,
      });

      // Gerar novo refresh token (rotação de tokens)
      const newRefreshToken = this.jsonWebTokenAdapter.generateRefreshToken({
        id: userData.id,
        access_level: userData.access_level,
        enterprise_id: userData.enterprise_id,
      });

      // Revogar o refresh token antigo
      await this.refreshTokenGateway.revokeToken(refreshToken);

      // Salvar o novo refresh token
      await this.refreshTokenGateway.create(newRefreshToken, userData.id);

      // Definir o novo refresh token no cookie
      CookieManager.setRefreshToken(res, newRefreshToken);

      return {
        accessToken: newAccessToken,
        user: {
          id: userData.id,
          access_level: userData.access_level,
          enterprise_id: userData.enterprise_id,
        },
      };
    } catch (error) {
      return false;
    }
  }

  async revokeToken(req: Request, res: Response) {
    try {
      const refreshToken = CookieManager.getRefreshToken(req);

      if (!refreshToken) {
        return false;
      }

      await this.refreshTokenGateway.revokeToken(refreshToken);
      CookieManager.clearRefreshToken(res);

      return {
        message: "Token revoked successfully",
      };
    } catch (error) {
      return false;
    }
  }

  async revokeAllUserTokens(userId: number, res: Response) {
    try {
      if (!userId) {
        return false;
      }

      await this.refreshTokenGateway.revokeAllUserTokens(userId);
      CookieManager.clearRefreshToken(res);

      return {
        message: "All user tokens were revoked",
      };
    } catch (error) {
      return false;
    }
  }
}
