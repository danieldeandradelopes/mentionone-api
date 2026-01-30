import { NextFunction, Request, Response, Router } from "express";
import PaymentsController from "../controllers/PaymentsController";
import { Registry, container } from "../infra/ContainerRegistry";
import Authenticate from "../middleware/Authenticate";
import EnterpriseGetInfo from "../middleware/EnterpriseGetInfo";
import SuperAdminValidate from "../middleware/SuperAdminValidate";

const paymentsRoutes = Router();

paymentsRoutes.post(
  "/payments/checkout",
  Authenticate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const paymentsController = container.get<PaymentsController>(
        Registry.PaymentsController,
      );

      const { plan_price_id, card, holder } = request.body;

      const result = await paymentsController.createTransparentCheckout({
        enterprise_id: request.enterprise_id,
        plan_price_id,
        card,
        holder,
      });

      return response.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },
);

paymentsRoutes.post(
  "/payments/create-payment-link",
  Authenticate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const paymentsController = container.get<PaymentsController>(
        Registry.PaymentsController,
      );

      const { subscription_id } = request.body;

      const user = await paymentsController.createPaymentLink(subscription_id);

      return response.status(201).json(user);
    } catch (error) {
      next(error);
    }
  },
);

/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Cria um novo pagamento
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subscription_id:
 *                 type: string
 *               description:
 *                 type: string
 *               features:
 *                 type: number
 *               duration:
 *                 type: number
 *     responses:
 *       201:
 *         description: Pagamento criado com sucesso
 */
paymentsRoutes.post(
  "/payments",
  Authenticate,
  SuperAdminValidate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const knexConfig = container.get<any>(Registry.KnexConfig);
      const trx = await knexConfig.transaction();

      const paymentsController = container.get<PaymentsController>(
        Registry.PaymentsController,
      );

      const { plan_id } = request.body;

      const payment = await paymentsController.addPayment(
        request.enterprise_id,
        plan_id,
        trx,
      );

      return response.status(201).json(payment);
    } catch (error) {
      next(error);
    }
  },
);

/**
 * @swagger
 * /payments:
 *   get:
 *     summary: Lista todos os pagamentos de uma barbearia
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pagamentos
 */
paymentsRoutes.get(
  "/payments/history",
  Authenticate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const paymentsController = container.get<PaymentsController>(
        Registry.PaymentsController,
      );

      const payments = await paymentsController.getPaymentsByEnterpriseId(
        request.enterprise_id,
      );

      return response.status(200).json(payments);
    } catch (error) {
      next(error);
    }
  },
);

paymentsRoutes.get(
  "/payments",
  Authenticate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const paymentsController = container.get<PaymentsController>(
        Registry.PaymentsController,
      );

      const payments = await paymentsController.getPayments();

      return response.status(200).json(payments);
    } catch (error) {
      next(error);
    }
  },
);

/**
 * @swagger
 * /payments/{id}:
 *   get:
 *     summary: Busca detalhes de um pagamento específico
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do pagamento
 *     responses:
 *       201:
 *         description: Detalhes do pagamento
 */
paymentsRoutes.get(
  "/payments/:id",
  Authenticate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const paymentsController = container.get<PaymentsController>(
        Registry.PaymentsController,
      );

      const payment = await paymentsController.getPayment(
        parseInt(request.params.id),
      );

      return response.status(201).json(payment);
    } catch (error) {
      next(error);
    }
  },
);

/**
 * @swagger
 * /payments/{id}:
 *   put:
 *     summary: Atualiza um pagamento existente
 *     tags: [Payments]
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
 *               subscription_id:
 *                 type: string
 *               amount:
 *                 type: string
 *               status:
 *                 type: number
 *               transaction_id:
 *                 type: string
 *               paid_at:
 *                 type: string
 *               created_at:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pagamento atualizado com sucesso
 */
paymentsRoutes.put(
  "/payments/:id",
  Authenticate,
  SuperAdminValidate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { id } = request.params;

      const paymentsController = container.get<PaymentsController>(
        Registry.PaymentsController,
      );

      const payment = await paymentsController.updatePayment({
        ...request.body,
        id,
      });

      return response.status(201).json(payment);
    } catch (error) {
      next(error);
    }
  },
);

/**
 * @swagger
 * /payments/{id}:
 *   delete:
 *     summary: Remove um pagamento
 *     tags: [Payments]
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
 *         description: Pagamento removido com sucesso
 */
paymentsRoutes.delete(
  "/payments/:id",
  Authenticate,
  SuperAdminValidate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { id } = request.params;

      const paymentsController = container.get<PaymentsController>(
        Registry.PaymentsController,
      );

      await paymentsController.removePayment(parseInt(id));

      return response.status(201).json({ message: "Payment deleted" });
    } catch (error) {
      next(error);
    }
  },
);

export { paymentsRoutes };
