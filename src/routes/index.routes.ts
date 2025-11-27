import { NextFunction, Request, Response, Router } from "express";

import PaymentsController from "../controllers/PaymentsController";
import SubscriptionController from "../controllers/SubscriptionController";
import { container, Registry } from "../infra/ContainerRegistry";
import HttpClient from "../infra/Http/HttpClient";
import MercadoPagoWebhookValidate from "../middleware/MercadoPagoWebhookValidate";
import { RequirePayment } from "../middleware/RequirePayment";
import { limiter } from "../utils/limit";
import { authRoutes } from "./auth.routes";
import { boxesRoutes } from "./boxes.routes";
import { boxesBrandingRoutes } from "./branding.routes";
import customerRoutes from "./customer.routes";
import { enterpriseRoutes } from "./enterprise.routes";
import { feedbackRoutes } from "./feedback.routes";
import { feedbackOptionsRoutes } from "./feedback-options.routes";
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

routes.get("/uptimerobot", (request: Request, response: Response) => {
  response.status(200).send("OK");
});

routes.post(
  "/webhook-mp-payments",
  MercadoPagoWebhookValidate,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      console.log("📩 Notificação recebida:", request.body);

      const httpClient = container.get<HttpClient>(Registry.HttpClient);

      const { type, data } = request.body;

      if (type === "payment") {
        const paymentId = data.id;
        const responseData = await httpClient.get(
          `${process.env.MERCADO_PAGO_API_URL}/payments/${paymentId}`,
          {
            Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
          }
        );

        console.log(responseData, "responseData");

        if (responseData.status !== "approved") {
          throw new Error("Payment not approved");
        }

        const paymentsController = container.get<PaymentsController>(
          Registry.PaymentsController
        );

        if (responseData && responseData.external_reference) {
          const currentPayment = await paymentsController.getPayment(
            responseData.external_reference
          );

          if (!currentPayment) {
            throw new Error("Payment not found");
          }

          const subscriptionController = container.get<SubscriptionController>(
            Registry.SubscriptionController
          );

          await subscriptionController.updateSubscriptionConfirmedPayment(
            currentPayment
          );
        }

        console.log("💳 Detalhes do pagamento:", responseData);
      }

      return response.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }
);

routes.use(authRoutes);
routes.use(refreshTokenRoutes);
routes.use(boxesBrandingRoutes);
routes.use(manifestRoutes);
routes.use(subscriptionValidateRoutes);
routes.use(customerRoutes);

routes.use(RequirePayment);

routes.use(userRoutes);
routes.use(userAdminsRoutes);
routes.use(uploadRoutes);
routes.use(paymentsRoutes);
routes.use(planRoutes);
routes.use(planPriceRoutes);
routes.use(enterpriseRoutes);
routes.use(subscriptionRoutes);
routes.use(boxesRoutes);
routes.use(feedbackRoutes);
routes.use(feedbackOptionsRoutes);

export default routes;
