import { NextFunction, Request, Response, Router } from "express";

import PaymentsController from "../controllers/PaymentsController";
import SubscriptionController from "../controllers/SubscriptionController";
import { container, Registry } from "../infra/ContainerRegistry";
import { PaymentGatewayAdapter } from "../services/payments/PaymentGatewayAdapter";
import AsaasAdapter from "../services/payments/AsaasAdapter";
import AsaasWebhookValidate from "../middleware/AsaasWebhookValidate";
import MercadoPagoWebhookValidate from "../middleware/MercadoPagoWebhookValidate";
import UserController from "../controllers/UserController";
import IUserGateway from "../gateway/UserGateway/IUserGateway";
import { RequirePayment } from "../middleware/RequirePayment";
import Authenticate from "../middleware/Authenticate";
import { limiter } from "../utils/limit";
import { authRoutes } from "./auth.routes";
import { boxesRoutes } from "./boxes.routes";
import { boxesBrandingRoutes } from "./branding.routes";
import customerRoutes from "./customer.routes";
import { enterpriseRoutes } from "./enterprise.routes";
import { feedbackRoutes } from "./feedback.routes";
import { feedbackOptionsRoutes } from "./feedback-options.routes";
import { branchesRoutes } from "./branches.routes";
import { npsCampaignsRoutes } from "./nps-campaigns.routes";
import { publicRoutes } from "./public.routes";
import { manifestRoutes } from "./manifest.routes";
import { paymentsRoutes } from "./payments.routes";
import { planPriceRoutes } from "./plan-price.routes";
import { planRoutes } from "./plan.routes";
import refreshTokenRoutes from "./refresh-token.routes";
import { subscriptionValidateRoutes } from "./subscription-validate.routes";
import { subscriptionRoutes } from "./subscription.routes";
import uploadRoutes from "./upload.routes";
import { userAdminsRoutes } from "./users-admins.routes";
import { userRoutes } from "./users.routes";

const routes = Router();

routes.use(limiter);

routes.use(publicRoutes);

routes.get("/uptimerobot", (request: Request, response: Response) => {
  response.status(200).send("OK");
});

routes.post(
  "/webhook-mp-payments",
  MercadoPagoWebhookValidate,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const adapter = container.get<PaymentGatewayAdapter>(
        Registry.PaymentGatewayAdapter,
      );
      const result = await adapter.parseWebhook(request.body);

      if (!result) {
        return response.sendStatus(200);
      }

      const paymentsController = container.get<PaymentsController>(
        Registry.PaymentsController,
      );

      const currentPayment = await paymentsController.getPayment(
        result.paymentId,
      );

      if (!currentPayment) {
        throw new Error("Payment not found");
      }

      if (result.status === "paid") {
        await paymentsController.updatePayment({
          ...currentPayment,
          status: "paid",
          transaction_id: currentPayment.transaction_id || result.transactionId,
          payment_date: new Date().toISOString(),
        });

        const subscriptionController = container.get<SubscriptionController>(
          Registry.SubscriptionController,
        );

        await subscriptionController.updateSubscriptionConfirmedPayment(
          currentPayment,
        );
      } else if (result.status === "failed") {
        await paymentsController.updatePayment({
          ...currentPayment,
          status: "failed",
          transaction_id: currentPayment.transaction_id || result.transactionId,
        });
      } else if (result.status === "refunded") {
        await paymentsController.updatePayment({
          ...currentPayment,
          status: "refunded",
          transaction_id: currentPayment.transaction_id || result.transactionId,
        });
      }

      return response.sendStatus(200);
    } catch (error) {
      next(error);
    }
  },
);

routes.post(
  "/webhook-asaas-payments",
  AsaasWebhookValidate,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const adapter = new AsaasAdapter(container.get(Registry.HttpClient));
      const result = await adapter.parseWebhook(request.body);

      if (!result) {
        return response.sendStatus(200);
      }

      const paymentsController = container.get<PaymentsController>(
        Registry.PaymentsController,
      );

      const currentPayment = await paymentsController.getPayment(
        result.paymentId,
      );

      if (!currentPayment) {
        throw new Error("Payment not found");
      }

      if (result.status === "paid") {
        await paymentsController.updatePayment({
          ...currentPayment,
          status: "paid",
          transaction_id: result.transactionId || currentPayment.transaction_id,
          payment_date: new Date().toISOString(),
        });

        const subscriptionController = container.get<SubscriptionController>(
          Registry.SubscriptionController,
        );

        await subscriptionController.updateSubscriptionConfirmedPayment(
          currentPayment,
        );
      } else if (result.status === "failed") {
        await paymentsController.updatePayment({
          ...currentPayment,
          status: "failed",
          transaction_id: result.transactionId || currentPayment.transaction_id,
        });
      } else if (result.status === "refunded") {
        await paymentsController.updatePayment({
          ...currentPayment,
          status: "refunded",
          transaction_id: result.transactionId || currentPayment.transaction_id,
        });
      }

      return response.sendStatus(200);
    } catch (error) {
      next(error);
    }
  },
);

routes.use(authRoutes);
routes.use(refreshTokenRoutes);
routes.use(boxesBrandingRoutes);
routes.use(manifestRoutes);
routes.use(subscriptionValidateRoutes);
routes.use(customerRoutes);
routes.use(planRoutes);
routes.use(planPriceRoutes);
routes.use(paymentsRoutes);

// Concluir onboarding antes do RequirePayment (não exige subdomínio/pagamento)
routes.put(
  "/users/onboarding",
  Authenticate,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      let enterpriseId: number | null | undefined = request.enterprise_id;
      if (enterpriseId == null) {
        const userGateway = container.get<IUserGateway>(Registry.UserGateway);
        enterpriseId = await userGateway.getFirstEnterpriseIdByUserId(
          request.user_id!,
        );
      }

      if (enterpriseId == null) {
        return response.status(400).json({
          message: "Nenhuma empresa vinculada ao usuário.",
        });
      }
      const enterpriseIdToUse: number = enterpriseId;
      const userController = container.get<UserController>(
        Registry.UserController,
      );
      await userController.completeOnboarding(
        request.user_id!,
        enterpriseIdToUse,
      );
      return response.status(200).json({ ok: true });
    } catch (error) {
      next(error);
    }
  },
);

routes.use(RequirePayment);

routes.use(userRoutes);
routes.use(userAdminsRoutes);
routes.use(uploadRoutes);
routes.use(enterpriseRoutes);
routes.use(subscriptionRoutes);
routes.use(boxesRoutes);
routes.use(feedbackRoutes);
routes.use(feedbackOptionsRoutes);
routes.use(branchesRoutes);
routes.use(npsCampaignsRoutes);

export default routes;
