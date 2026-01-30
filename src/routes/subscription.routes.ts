import { NextFunction, Request, Response, Router } from "express";
import SubscriptionController from "../controllers/SubscriptionController";
import PaymentsController from "../controllers/PaymentsController";
import { Registry, container } from "../infra/ContainerRegistry";
import Authenticate from "../middleware/Authenticate";
import EnterpriseGetInfo from "../middleware/EnterpriseGetInfo";
import SuperAdminValidate from "../middleware/SuperAdminValidate";
const subscriptionRoutes = Router();

/**
 * @swagger
 * /subscriptions:
 *   post:
 *     summary: Cria um novo subscription
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               enterprise_id:
 *                 type: string
 *               plan_price_id:
 *                 type: number
 *               status:
 *                 type: string
 *               start_date:
 *                 type: string
 *               end_date:
 *                 type: string
 *     responses:
 *       201:
 *         description: Subscription criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 start_date:
 *                   type: string
 */
subscriptionRoutes.post(
  "/subscriptions/cancel",
  Authenticate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const paymentsController = container.get<PaymentsController>(
        Registry.PaymentsController
      );

      await paymentsController.cancelSubscription(request.enterprise_id);

      return response.status(200).json({ message: "Subscription canceled" });
    } catch (error) {
      next(error);
    }
  }
);

subscriptionRoutes.post(
  "/subscriptions",
  Authenticate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const subscriptionController = container.get<SubscriptionController>(
        Registry.SubscriptionController
      );

      const { plan_price_id, start_date } = request.body;

      const subscription = await subscriptionController.store({
        enterprise_id: request.enterprise_id,
        plan_price_id,
        start_date,
      });
      return response.status(201).json(subscription);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /subscriptions:
 *   get:
 *     summary: Lista todos os subscriptions de uma barbearia
 *     tags: [S]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de subscriptions
 */
subscriptionRoutes.get(
  "/subscriptions",
  Authenticate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const subscriptionController = container.get<SubscriptionController>(
        Registry.SubscriptionController
      );

      const subscriptions = await subscriptionController.list();

      return response.status(200).json(subscriptions);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /subscriptions/{id}:
 *   get:
 *     summary: Busca detalhes de um subscription específico
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do subscription
 *     responses:
 *       201:
 *         description: Detalhes do subscription
 */
subscriptionRoutes.get(
  "/subscriptions/:id",
  Authenticate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const subscriptionController = container.get<SubscriptionController>(
        Registry.SubscriptionController
      );

      const subscription = await subscriptionController.get(
        parseInt(request.params.id)
      );

      return response.status(201).json(subscription);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /subscriptions/{id}:
 *   put:
 *     summary: Atualiza um subscription existente
 *     tags: [Subscriptions]
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
 *         description: Subscription atualizado com sucesso
 */
subscriptionRoutes.put(
  "/subscriptions/:id",
  Authenticate,
  SuperAdminValidate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { id } = request.params;

      const subscriptionController = container.get<SubscriptionController>(
        Registry.SubscriptionController
      );

      const subscription = await subscriptionController.update({
        ...request.body,
        id,
      });

      return response.status(201).json(subscription);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /subscriptions/{id}:
 *   delete:
 *     summary: Remove um subscription
 *     tags: [Subscriptions]
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
 *         description: Subscription removido com sucesso
 */
subscriptionRoutes.delete(
  "/subscriptions/:id",
  Authenticate,
  SuperAdminValidate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { id } = request.params;

      const subscriptionController = container.get<SubscriptionController>(
        Registry.SubscriptionController
      );

      await subscriptionController.destroy(parseInt(id));

      return response.status(201).json({ message: "Subscription deleted" });
    } catch (error) {
      next(error);
    }
  }
);

export { subscriptionRoutes };
