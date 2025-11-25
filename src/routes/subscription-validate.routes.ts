import { NextFunction, Request, Response, Router } from "express";
import SubscriptionController from "../controllers/SubscriptionController";
import { container, Registry } from "../infra/ContainerRegistry";
import EnterpriseGetInfo from "../middleware/EnterpriseGetInfo";

const subscriptionValidateRoutes = Router();

/**
 * @swagger
 * /subscription/validate-status:
 *   get:
 *     summary: Verifica se o usuário está com a assinatura ativa
 *     tags: [Subscription]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuário com assinatura ativa
 */
subscriptionValidateRoutes.get(
  "/subscription/validate-status",
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const subscriptionController = container.get<SubscriptionController>(
        Registry.SubscriptionController
      );

      const subscription = await subscriptionController.getByEnterpriseId(
        request.enterprise_id
      );

      return response.status(200).json(subscription);
    } catch (error) {
      next(error);
    }
  }
);

export { subscriptionValidateRoutes };
