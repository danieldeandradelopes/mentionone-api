import cron from "node-cron";
import SubscriptionController from "../controllers/SubscriptionController";
import { container, Registry } from "../infra/ContainerRegistry";

cron.schedule("0 3 * * *", async () => {
  try {
    const subscriptionController = container.get<SubscriptionController>(
      Registry.SubscriptionController
    );

    await subscriptionController.verifyAndUpdateSubscriptionStatus();
  } catch (error) {
    console.error("Erro ao atualizar assinaturas:", error);
  }
});
