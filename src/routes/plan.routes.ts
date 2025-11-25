import { NextFunction, Request, Response, Router } from "express";
import PlanController from "../controllers/PlanController";
import { Registry, container } from "../infra/ContainerRegistry";
import Authenticate from "../middleware/Authenticate";
import EnterpriseGetInfo from "../middleware/EnterpriseGetInfo";
import SuperAdminValidate from "../middleware/SuperAdminValidate";

const planRoutes = Router();

/**
 * @swagger
 * /plans:
 *   post:
 *     summary: Cria um novo plano
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               features:
 *                 type: number
 *               duration:
 *                 type: number
 *     responses:
 *       201:
 *         description: Plano criado com sucesso
 */
planRoutes.post(
  "/plans",
  Authenticate,
  SuperAdminValidate,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const planController = container.get<PlanController>(
        Registry.PlanController
      );

      const { name, description, features } = request.body;

      const plan = await planController.store({
        name,
        description,
        features,
      });
      return response.status(201).json(plan);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /plans:
 *   get:
 *     summary: Lista todos os planos de uma barbearia
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de planos
 */
planRoutes.get(
  "/plans",
  Authenticate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const planController = container.get<PlanController>(
        Registry.PlanController
      );

      const plans = await planController.list();

      return response.status(200).json(plans);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /plans/{id}:
 *   get:
 *     summary: Busca detalhes de um plano específico
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do plano
 *     responses:
 *       201:
 *         description: Detalhes do plano
 */
planRoutes.get(
  "/plans/:id",
  Authenticate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const planController = container.get<PlanController>(
        Registry.PlanController
      );

      const plan = await planController.get(parseInt(request.params.id));

      return response.status(201).json(plan);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /plans/{id}:
 *   put:
 *     summary: Atualiza um plano existente
 *     tags: [Plans]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               features:
 *                 type: number
 *     responses:
 *       201:
 *         description: Plano atualizado com sucesso
 */
planRoutes.put(
  "/plans/:id",
  Authenticate,
  SuperAdminValidate,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { id } = request.params;

      const planController = container.get<PlanController>(
        Registry.PlanController
      );

      const plan = await planController.update({
        ...request.body,
        id,
      });

      return response.status(201).json(plan);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /plans/{id}:
 *   delete:
 *     summary: Remove um plano
 *     tags: [Plans]
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
 *         description: Plano removido com sucesso
 */
planRoutes.delete(
  "/plans/:id",
  Authenticate,
  SuperAdminValidate,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { id } = request.params;

      const planController = container.get<PlanController>(
        Registry.PlanController
      );

      await planController.destroy(parseInt(id));

      return response.status(201).json({ message: "Plan deleted" });
    } catch (error) {
      next(error);
    }
  }
);

export { planRoutes };
