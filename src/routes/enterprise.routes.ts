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
 * /enterprise/{id}:
 *   delete:
 *     summary: Remove uma empresa pelo ID
 *     tags:
 *       - Empresas
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
  "/enterprise/:id",
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
 * /enterprise/default-template:
 *   post:
 *     summary: Cria uma empresa com template padrão
 *     tags:
 *       - Empresas
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
 *     responses:
 *       201:
 *         description: Barbearia criada com sucesso
 */

enterpriseRoutes.post(
  "/enterprise/default-template",
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
        email,
        document,
        document_type,
        plan_price_id,
      } = request.body;
      const Enterprise = await EnterpriseController.storeWithDefaultTemplate({
        name,
        address,
        phones: [phone],
        cover,
        description,
        subdomain,
        email,
        document,
        document_type,
        plan_price_id,
        timezone: "America/Sao_Paulo",
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
  "/enterprise",
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
  "/enterprise/settings",
  Authenticate,
  AdminValidate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const EnterpriseController = container.get<EnterpriseController>(
        Registry.EnterpriseController
      );

      const Enterprise = await EnterpriseController.get(request.enterprise_id!);

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
  "/enterprise/:id",
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
 * /enterprise/settings:
 *   put:
 *     summary: Atualiza dados da empresa (admin/superadmin)
 *     tags:
 *       - Empresas
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Empresa atualizada com sucesso
 */

enterpriseRoutes.put(
  "/enterprise/settings",
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
        id: request.enterprise_id!,
      });

      return response.status(201).json(Enterprise);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /enterprise/{id}:
 *   put:
 *     summary: Atualiza dados da empresa pelo ID (superadmin)
 *     tags:
 *       - Empresas
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
 *         description: Empresa atualizada com sucesso
 */

enterpriseRoutes.put(
  "/enterprise/:id",
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
        id: parseInt(id),
      });

      return response.status(201).json(Enterprise);
    } catch (error) {
      next(error);
    }
  }
);

export { enterpriseRoutes };
