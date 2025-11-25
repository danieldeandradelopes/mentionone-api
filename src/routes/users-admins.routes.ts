import { NextFunction, Request, Response, Router } from "express";
import UserController from "../controllers/UserController";
import { Registry, container } from "../infra/ContainerRegistry";
import AdminValidate from "../middleware/AdminValidate";
import Authenticate from "../middleware/Authenticate";
import EnterpriseGetInfo from "../middleware/EnterpriseGetInfo";

const userAdminsRoutes = Router();

/**
 * @openapi
 * /users/admins:
 *   post:
 *     summary: Criação de um administrador
 *     tags:
 *       - Admins
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Administrador criado com sucesso
 */
userAdminsRoutes.post(
  "/users/admins",
  Authenticate,
  AdminValidate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const userController = container.get<UserController>(
        Registry.UserController
      );

      const { name, email, password, phone } = request.body;
      const user = await userController.storeUser({
        name,
        email,
        password,
        accessLevel: "admin",
        phone,
        enterpriseId: request.enterprise_Id,
      });

      return response.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /users/admins:
 *   get:
 *     summary: Lista todos os administradores
 *     tags:
 *       - Admins
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de administradores
 */
userAdminsRoutes.get(
  "/users/admins",
  Authenticate,
  AdminValidate,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const userController = container.get<UserController>(
        Registry.UserController
      );

      const users = await userController.listAdmins();

      return response.status(201).json(users);
    } catch (error) {
      next(error);
    }
  }
);

export { userAdminsRoutes };
