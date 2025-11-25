import { NextFunction, Request, Response, Router } from "express";
import { Registry, container } from "../infra/ContainerRegistry";
import Authenticate from "../middleware/Authenticate";
import EnterpriseGetInfo from "../middleware/EnterpriseGetInfo";
import PlanPriceController from "../controllers/PlanPriceController";
import SuperAdminValidate from "../middleware/SuperAdminValidate";

const planPriceRoutes = Router();

/**
 * @swagger
 * /plans-price:
 *   post:
 *     summary: Cria um novo plano de preço
 *     tags: [PlanPrice]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               plan_id:
 *                 type: string
 *               billing_cycle:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Plano de preço criado com sucesso
 */
planPriceRoutes.post(
  "/plans-price",
  Authenticate,
  SuperAdminValidate,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const planPriceController = container.get<PlanPriceController>(
        Registry.PlanPriceController
      );

      const { plan_id, billing_cycle, price } = request.body;

      const plan = await planPriceController.store({
        plan_id,
        billing_cycle,
        price,
      });
      return response.status(201).json(plan);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /plans-price :
 *   get:
 *     summary: Lista todos os planos de preço
 *     tags: [PlanPrice]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista os preços
 */
planPriceRoutes.get(
  "/plans-price",
  Authenticate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const planPriceController = container.get<PlanPriceController>(
        Registry.PlanPriceController
      );

      const plans = await planPriceController.list();

      return response.status(200).json(plans);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /plans-price/{id}:
 *   get:
 *     summary: Busca detalhes de um plano de preço específico
 *     tags: [PlanPrice]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do plano de preço
 *     responses:
 *       201:
 *         description: Detalhes do plano de preço
 */
planPriceRoutes.get(
  "/plans-price/:id",
  Authenticate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const planPriceController = container.get<PlanPriceController>(
        Registry.PlanPriceController
      );

      const plan = await planPriceController.get(parseInt(request.params.id));

      return response.status(201).json(plan);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /plans-price/{id}:
 *   put:
 *     summary: Atualiza um plano de preço existente
 *     tags: [PlanPrice]
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
 *               plan_id:
 *                 type: string
 *               billing_cycle:
 *                 type: string
 *               features:
 *                 type: number
 *     responses:
 *       201:
 *         description: Plano de preço atualizado com sucesso
 */
planPriceRoutes.put(
  "/plans-price/:id",
  Authenticate,
  SuperAdminValidate,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { id } = request.params;

      const planPriceController = container.get<PlanPriceController>(
        Registry.PlanPriceController
      );

      const plan = await planPriceController.update({
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
 * /plans-price/{id}:
 *   delete:
 *     summary: Remove um plano de preço
 *     tags: [PlanPrice]
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
 *         description: Plano de preço removido com sucesso
 */
planPriceRoutes.delete(
  "/plans-price/:id",
  Authenticate,
  SuperAdminValidate,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { id } = request.params;

      const planPriceController = container.get<PlanPriceController>(
        Registry.PlanPriceController
      );

      await planPriceController.destroy(parseInt(id));

      return response.status(201).json({ message: "Plan deleted" });
    } catch (error) {
      next(error);
    }
  }
);

export { planPriceRoutes };
