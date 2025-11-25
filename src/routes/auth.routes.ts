import { NextFunction, Request, Response, Router } from "express";
import AuthenticationController from "../controllers/AuthenticationController";
import { Registry, container } from "../infra/ContainerRegistry";
import EnterpriseGetInfo from "../middleware/EnterpriseGetInfo";
import { CookieManager } from "../middleware/CookieManager";

const authRoutes = Router();

/**
 * @openapi
 * /login:
 *   post:
 *     summary: Login do usuário
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário autenticado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       400:
 *         description: Requisição inválida
 *       401:
 *         description: Credenciais inválidas
 */
authRoutes.post(
  "/login",
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const authenticationController = container.get<AuthenticationController>(
        Registry.AuthenticationController
      );

      const { email, password } = request.body;

      const user = await authenticationController.makeLogin({
        email,
        password,
        enterpriseId: request.enterprise_Id,
      });

      if (user.refreshToken) {
        CookieManager.setRefreshToken(response, user.refreshToken);
      }

      return response.status(200).json({
        token: user.token,
        user: user.user,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /login/superadmin:
 *   post:
 *     summary: Login do superadmin
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Superadmin autenticado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       400:
 *         description: Requisição inválida
 *       401:
 *         description: Credenciais inválidas
 */
authRoutes.post(
  "/login/superadmin",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const authenticationController = container.get<AuthenticationController>(
        Registry.AuthenticationController
      );

      const { email, password } = request.body;

      const user = await authenticationController.makeLogin({
        email,
        password,
      });

      return response.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
);

export { authRoutes };
