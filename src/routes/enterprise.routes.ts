import { NextFunction, Request, Response, Router } from "express";
import { Registry, container } from "../infra/ContainerRegistry";
import AdminValidate from "../middleware/AdminValidate";
import Authenticate from "../middleware/Authenticate";

import EnterpriseController from "../controllers/EnterpriseController";
import EnterpriseGetInfo from "../middleware/EnterpriseGetInfo";
import SuperAdminValidate from "../middleware/SuperAdminValidate";

const enterpriseRoutes = Router();

/**
 * @openapi
 * /barber-shop/{id}:
 *   delete:
 *     summary: Remove uma barbearia pelo ID
 *     tags:
 *       - Barbearias
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Barbearia removida com sucesso
 */

enterpriseRoutes.delete(
  "/barber-shop/:id",
  Authenticate,
  SuperAdminValidate,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const EnterpriseController = container.get<EnterpriseController>(
        Registry.EnterpriseController
      );

      const { id } = request.params;
      await EnterpriseController.destroy(parseInt(id));
      return response.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /barber-shop/default-template:
 *   post:
 *     summary: Cria uma barbearia com template padrão
 *     tags:
 *       - Barbearias
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
 *               - address
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               cover:
 *                 type: string
 *               description:
 *                 type: string
 *               subdomain:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *     responses:
 *       201:
 *         description: Barbearia criada com sucesso
 */

enterpriseRoutes.post(
  "/barber-shop/default-template",
  Authenticate,
  SuperAdminValidate,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const EnterpriseController = container.get<EnterpriseController>(
        Registry.EnterpriseController
      );

      const {
        name,
        address,
        phone,
        cover,
        description,
        subdomain,
        latitude,
        longitude,
        email,
        document,
        document_type,
        plan_price_id,
      } = request.body;
      const Enterprise = await EnterpriseController.storeWithDefaultTemplate({
        name,
        address,
        phone,
        cover,
        description,
        subdomain,
        latitude,
        longitude,
        email,
        document,
        document_type,
        plan_price_id,
      });
      return response.status(201).json(Enterprise);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /barber-shop:
 *   get:
 *     summary: Lista todas as barbearias
 *     tags:
 *       - Barbearias
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de barbearias
 */

enterpriseRoutes.get(
  "/barber-shop",
  Authenticate,
  AdminValidate,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const EnterpriseController = container.get<EnterpriseController>(
        Registry.EnterpriseController
      );

      const Enterprises = await EnterpriseController.list();

      return response.status(201).json(Enterprises);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /barber-shop/configs:
 *   get:
 *     summary: Obtém detalhes de uma barbearia
 *     tags:
 *       - Barbearias
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Detalhes da barbearia
 */

enterpriseRoutes.get(
  "/barber-shop/settings",
  Authenticate,
  AdminValidate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const EnterpriseController = container.get<EnterpriseController>(
        Registry.EnterpriseController
      );

      const Enterprise = await EnterpriseController.get(request.enterprise_Id!);

      return response.status(201).json(Enterprise);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /barber-shop/{id}:
 *   get:
 *     summary: Obtém detalhes de uma barbearia
 *     tags:
 *       - Barbearias
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Detalhes da barbearia
 */

enterpriseRoutes.get(
  "/barber-shop/:id",
  Authenticate,
  SuperAdminValidate,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const EnterpriseController = container.get<EnterpriseController>(
        Registry.EnterpriseController
      );

      const Enterprise = await EnterpriseController.get(
        parseInt(request.params.id)
      );

      return response.status(201).json(Enterprise);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /barber-shop/{id}:
 *   put:
 *     summary: Atualiza dados da barbearia
 *     tags:
 *       - Barbearias
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
 *     responses:
 *       200:
 *         description: Barbearia atualizada com sucesso
 */

enterpriseRoutes.put(
  "/barber-shop/:id",
  Authenticate,
  SuperAdminValidate,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { id } = request.params;

      const EnterpriseController = container.get<EnterpriseController>(
        Registry.EnterpriseController
      );

      const Enterprise = await EnterpriseController.update({
        ...request.body,
        id,
      });

      return response.status(201).json(Enterprise);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /barber-shop/settings/by-barber-shop:
 *   put:
 *     summary: Atualiza dados da barbearia
 *     tags:
 *       - Barbearias
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
 *     responses:
 *       200:
 *         description: Barbearia atualizada com sucesso
 */

enterpriseRoutes.put(
  "/barber-shop/settings/by-barber-shop",
  Authenticate,
  AdminValidate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const EnterpriseController = container.get<EnterpriseController>(
        Registry.EnterpriseController
      );

      const Enterprise = await EnterpriseController.update({
        ...request.body,
        id: request.enterprise_Id!,
      });

      return response.status(201).json(Enterprise);
    } catch (error) {
      next(error);
    }
  }
);

export { enterpriseRoutes };
