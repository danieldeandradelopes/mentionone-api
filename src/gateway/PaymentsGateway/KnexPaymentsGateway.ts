import Payment, { PaymentResponse } from "../../entities/Payment";
import IPaymentsGateway from "./IPaymentsGateway";

const trialEndDate = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);

export default class KnexPaymentsGateway implements IPaymentsGateway {
  constructor(readonly connection: any) {}

  async getPayment(id: number): Promise<Payment | null> {
    return await this.connection("payments").where({ id }).first();
  }
  async getPayments(): Promise<Payment[]> {
    return await this.connection("payments");
  }
  async addPayment(
    enterprise_id: number,
    planId: number,
    trx: any
  ): Promise<PaymentResponse> {
    const plan = await trx("plans").where({ id: planId }).first();

    if (!plan) throw new Error("Plan not found");

    const planPrice = await this.connection("plan_prices")
      .where({ plan_id: plan.id })
      .first();

    if (!planPrice) throw new Error("Plan price not found");

    let subscription = await this.connection("subscriptions")
      .where({ enterprise_id, plan_price_id: planPrice.id })
      .first();

    if (subscription) {
      const result = await trx("subscriptions")
        .update({
          plan_price_id: planPrice.id,
        })
        .where({ id: subscription.id })
        .returning("*");

      subscription = result[0];
    }

    if (!subscription) {
      const result = await trx("subscriptions")
        .insert({
          enterprise_id,
          plan_price_id: planPrice.id,
          start_date: new Date().toISOString(),
          end_date: new Date().toISOString(),
        })
        .returning("*");

      subscription = result[0];
    }

    const payment = await trx("payments")
      .insert({
        subscription_id: subscription.id,
        amount: planPrice.price,
        payment_date: new Date().toISOString(),
        due_date: new Date(
          new Date().getTime() + 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
        transaction_id: "",
        items: JSON.stringify([
          {
            id: planPrice.id.toString(),
            title: plan.name,
            description: plan.description,
          },
        ]),
      })
      .returning("*");

    if (!payment.length) throw new Error("Payment not created");

    const currentPayment = payment[0];

    return {
      id: currentPayment.id,
      subscription_id: currentPayment.subscription_id,
      amount: Number(planPrice.price),
      status: currentPayment.status,
      transaction_id: currentPayment.transaction_id,
      created_at: currentPayment.created_at,
      subscription: subscription,
      plan_price: planPrice,
      name: plan.name,
      description: plan.description,
    };
  }

  async updatePaymentTransactionId(
    paymentId: number,
    transactionId: string,
    trx: any
  ): Promise<Payment> {
    const payment = await trx("payment").where({ id: paymentId }).first();

    if (!payment) throw new Error("Payment not found");

    const updatedPayment = await trx("payment")
      .update({ transaction_id: transactionId })
      .where({ id: paymentId })
      .returning("*")
      .transacting(trx);

    return updatedPayment;
  }

  async updatePayment(data: Payment): Promise<Payment> {
    const payment = await this.connection("payments")
      .update(data)
      .where({ id: data.id })
      .returning("*");
    return new Payment(payment);
  }
  async removePayment(id: number): Promise<void> {
    await this.connection("payments").where({ id }).delete();
    return undefined;
  }
  async getPaymentBySubscriptionId(
    subscriptionId: number
  ): Promise<Payment | null> {
    return await this.connection("payments")
      .where({ subscription_id: subscriptionId })
      .first();
  }

  async registerPayment(enterprise_id: number): Promise<void> {
    const Enterprise = await this.connection("Enterprise")
      .where({
        enterprise_id: enterprise_id,
      })
      .first();

    if (!Enterprise) throw new Error("User not found");

    await this.connection("payments")
      .insert({ user_id: Enterprise.id, payment_date: new Date() })
      .returning("*");

    await this.connection("Enterprise")
      .where("id", Enterprise.id)
      .update({
        ...Enterprise,
        status: "payed",
      })
      .returning("*");
  }
}
