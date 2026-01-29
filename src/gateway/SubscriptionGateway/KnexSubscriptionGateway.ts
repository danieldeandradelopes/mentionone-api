import { Knex } from "knex";
import PlanPrice from "../../entities/PlanPrice";
import Subscription, {
  SubscriptionValidateResponse,
} from "../../entities/Subscription";
import ISubscriptionGateway from "./ISubscriptionGateway";
import Payment from "../../entities/Payment";
import { PlanFeatures } from "../../entities/Plan";

export default class KnexSubscriptionGateway implements ISubscriptionGateway {
  constructor(readonly connection: any) {}

  async verifyAndUpdateSubscriptionStatus(): Promise<void> {
    const now = new Date();

    await this.connection("subscriptions")
      .where("status", "active")
      .andWhere((builder: Knex.QueryBuilder) => {
        builder
          .where((b) => {
            // Se existe trial_end_date e já passou
            b.whereNotNull("trial_end_date").andWhere(
              "trial_end_date",
              "<",
              now
            );
          })
          .orWhere((b) => {
            // Se não existe trial_end_date, mas end_date já passou
            b.whereNull("trial_end_date")
              .whereNotNull("end_date")
              .andWhere("end_date", "<", now);
          })
          .orWhere((b) => {
            // Se trial_end_date existe e já passou, e end_date também já passou
            b.whereNotNull("trial_end_date")
              .andWhere("trial_end_date", "<", now)
              .whereNotNull("end_date")
              .andWhere("end_date", "<", now);
          });
      })
      .update({ status: "past_due" });
  }

  async getSubscriptionByEnterpriseId(
    enterpriseId: number
  ): Promise<SubscriptionValidateResponse> {
    let subscription = await this.connection("subscriptions")
      .where({ enterprise_id: enterpriseId })
      .whereRaw(
        `
    (
      (subscriptions.start_date <= NOW() 
       AND (subscriptions.end_date IS NULL OR subscriptions.end_date >= NOW()))
      OR (subscriptions.trial_end_date IS NOT NULL AND subscriptions.trial_end_date >= NOW())
    )
  `
      )
      .join("plan_prices", "subscriptions.plan_price_id", "plan_prices.id")
      .join("plans", "plan_prices.plan_id", "plans.id")
      .orderByRaw(
        "COALESCE(subscriptions.end_date, subscriptions.trial_end_date) DESC"
      )
      .first();

    if (!subscription) {
      subscription = await this.connection("subscriptions")
        .where({ enterprise_id: enterpriseId })
        .join("plan_prices", "subscriptions.plan_price_id", "plan_prices.id")
        .join("plans", "plan_prices.plan_id", "plans.id")
        .orderBy("subscriptions.end_date", "desc")
        .first();
    }

    if (!subscription) {
      return {
        status: "past_due",
        expires_at: "",
        trial_end_date: "",
        plan_name: "",
        plan_description: "",
        plan_price: "",
        features: null,
      };
    }

    // Parse do JSON features
    const features = subscription.features
      ? JSON.parse(subscription.features)
      : null;

    return {
      status: subscription.status || "active",
      expires_at: subscription.end_date || "",
      trial_end_date: subscription.trial_end_date,
      plan_name: subscription.name,
      plan_description: subscription.description,
      plan_price: subscription.price,
      features,
    };
  }

  async getSubscription(id: number): Promise<Subscription> {
    return await this.connection("subscriptions").where({ id }).first();
  }

  async getSubscriptions(): Promise<Subscription[]> {
    return await this.connection("subscriptions");
  }

  async addSubscription(data: Subscription): Promise<Subscription> {
    const planPrice: PlanPrice = await this.connection("plan_prices")
      .where({ id: data.plan_price_id })
      .first();

    if (!planPrice) {
      throw new Error("Plan price not found");
    }

    let end_date: Date;

    if (planPrice.billing_cycle === "monthly") {
      end_date = new Date(
        new Date(data.start_date).getTime() + 30 * 24 * 60 * 60 * 1000
      );
    } else {
      end_date = new Date(
        new Date(data.start_date).getTime() + 365 * 24 * 60 * 60 * 1000
      );
    }

    const subscription: Subscription[] = await this.connection("subscriptions")
      .insert({ ...data, end_date: end_date.toISOString() })
      .returning("*");

    return new Subscription(subscription[0]);
  }

  async updateSubscription(data: Subscription): Promise<Subscription> {
    return await this.connection("subscriptions")
      .update(data)
      .where({ id: data.id })
      .returning("*");
  }

  async removeSubscription(id: number): Promise<void> {
    await this.connection("subscriptions").where({ id }).delete();
    return undefined;
  }

  async updateSubscriptionConfirmedPayment(
    payment: Payment
  ): Promise<Subscription> {
    const currentSubscription: Subscription = await this.connection(
      "subscriptions"
    )
      .where({
        id: payment.subscription_id,
      })
      .first();

    if (!currentSubscription) {
      throw new Error("Subscription not found");
    }

    const currentPlanPrice: PlanPrice = await this.connection("plan_prices")
      .where({
        id: currentSubscription.plan_price_id,
      })
      .first();

    if (!currentPlanPrice) {
      throw new Error("Plan Price not found");
    }

    const newDueDate =
      currentPlanPrice.billing_cycle === "monthly"
        ? this.addMonths(new Date(), 1)
        : this.addYears(new Date(), 1);

    await this.connection("payments")
      .where({ id: payment.id })
      .update({
        status: "paid",
      })
      .returning("*");

    const updatedSubscription = await this.connection("subscriptions")
      .where({ id: currentSubscription.id })
      .update({
        end_date: newDueDate.toISOString(),
        status: "active",
      })
      .returning("*");

    return new Subscription(updatedSubscription[0]);
  }

  /**
   * Adiciona meses a uma data, lidando corretamente com diferentes números de dias nos meses
   */
  private addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);

    // Se o dia do mês mudou (ex: 31 de janeiro + 1 mês = 3 de março),
    // ajustar para o último dia do mês anterior
    if (result.getDate() !== date.getDate()) {
      result.setDate(0); // Vai para o último dia do mês anterior
    }

    return result;
  }

  /**
   * Adiciona anos a uma data, lidando corretamente com anos bissextos
   */
  private addYears(date: Date, years: number): Date {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + years);
    return result;
  }
}
