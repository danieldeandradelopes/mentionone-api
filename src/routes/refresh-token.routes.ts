import { NextFunction, Request, Response, Router } from "express";
import { container, Registry } from "../infra/ContainerRegistry";
import Authenticate from "../middleware/Authenticate";
import RefreshTokenController from "../controllers/RefreshTokenController";

const refreshTokenRoutes = Router();

/**
 * @openapi
 * /refresh-token:
 *   post:
 *     summary: Renovar access token usando refresh token
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tokens renovados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 user:
 *                   type: object
 *       400:
 *         description: Requisição inválida
 *       401:
 *         description: Refresh token inválido ou expirado
 */
refreshTokenRoutes.post(
  "/refresh-token",
  async (request: Request, response: Response, next: NextFunction) => {
    const refreshTokenController = container.get<RefreshTokenController>(
      Registry.RefreshTokenController
    );

    const result = await refreshTokenController.refreshToken(request, response);

    if (!result) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    return response.status(200).json(result);
  }
);

/**
 * @openapi
 * /revoke-token:
 *   post:
 *     summary: Revogar um refresh token específico
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token revogado com sucesso
 *       400:
 *         description: Requisição inválida
 */
refreshTokenRoutes.post(
  "/revoke-token",
  async (request: Request, response: Response, next: NextFunction) => {
    const refreshTokenController = container.get<RefreshTokenController>(
      Registry.RefreshTokenController
    );

    const result = await refreshTokenController.revokeToken(request, response);

    if (!result) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    return response.status(200).json(result);
  }
);

/**
 * @openapi
 * /revoke-all-tokens:
 *   post:
 *     summary: Revogar todos os refresh tokens do usuário
 *     tags:
 *       - Autenticação
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Todos os tokens revogados com sucesso
 *       401:
 *         description: Usuário não autenticado
 */
refreshTokenRoutes.post(
  "/revoke-all-tokens",
  Authenticate,
  async (request: Request, response: Response, next: NextFunction) => {
    const refreshTokenController = container.get<RefreshTokenController>(
      Registry.RefreshTokenController
    );

    const result = await refreshTokenController.revokeAllUserTokens(
      request.user_id!,
      response
    );

    if (!result) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    return response.status(200).json({
      message: "Todos os tokens do usuário foram revogados",
    });
  }
);

export default refreshTokenRoutes;
