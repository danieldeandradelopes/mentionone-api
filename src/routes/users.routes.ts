import { NextFunction, Request, Response, Router } from "express";
import UserController from "../controllers/UserController";
import { Registry, container } from "../infra/ContainerRegistry";
import AdminValidate from "../middleware/AdminValidate";
import Authenticate from "../middleware/Authenticate";
import EnterpriseGetInfo from "../middleware/EnterpriseGetInfo";
import SuperAdminValidate from "../middleware/SuperAdminValidate";
import MySelfValidate from "../middleware/MySelftValidate";

const userRoutes = Router();

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Lista todos os usuários
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários
 */
userRoutes.get(
  "/users",
  Authenticate,
  SuperAdminValidate,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const userController = container.get<UserController>(
        Registry.UserController
      );

      const users = await userController.list({
        page: parseInt(request.query.page as string),
        limit: parseInt(request.query.limit as string),
      });

      return response.status(201).json(users);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /users/session:
 *   get:
 *     summary: Obtém a sessão do usuário
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sessão do usuário
 */
userRoutes.get(
  "/users/session",
  Authenticate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const userController = container.get<UserController>(
        Registry.UserController
      );

      const user = await userController.getUserSession(
        request.user_id!,
        request.enterprise_Id!
      );

      return response.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Buscar usuário por ID
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário encontrado
 */
userRoutes.get(
  "/users/:id",
  Authenticate,
  EnterpriseGetInfo,
  AdminValidate,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      // TODO DANIEL: pensar como bloquear para a barbearia só pegar os próprios clientes
      const userController = container.get<UserController>(
        Registry.UserController
      );

      const users = await userController.get(parseInt(request.params.id));

      return response.status(201).json(users);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /users:
 *   put:
 *     summary: Atualizar usuário
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *               avatar:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 */
userRoutes.put(
  "/users",
  Authenticate,
  EnterpriseGetInfo,
  MySelfValidate,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { currentPassword, name, email, phone, password, avatar } =
        request.body;
      const userController = container.get<UserController>(
        Registry.UserController
      );

      const user = await userController.update({
        currentPassword,
        name,
        email,
        phone,
        password,
        id: request.user_id!,
        avatar,
      });
      return response.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /users/phone:
 *   put:
 *     summary: Atualizar número de telefone
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 */
userRoutes.put(
  "/users/phone",
  Authenticate,
  EnterpriseGetInfo,
  MySelfValidate,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { phone } = request.body;
      const userController = container.get<UserController>(
        Registry.UserController
      );

      const user = await userController.updatePhone(request.user_id!, phone);
      return response.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     summary: Atualizar usuário (Pelo Super Admin)
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *               avatar:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 */
userRoutes.put(
  "/users/:id",
  Authenticate,
  EnterpriseGetInfo,
  SuperAdminValidate,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { id } = request.params;
      const { currentPassword, name, email, phone, password, avatar } =
        request.body;
      const userController = container.get<UserController>(
        Registry.UserController
      );

      const user = await userController.update({
        currentPassword,
        name,
        email,
        phone,
        password,
        id: parseInt(id),
        avatar,
      });
      return response.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }
);

export { userRoutes };
