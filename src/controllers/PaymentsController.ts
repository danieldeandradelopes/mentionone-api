import Payment, { PaymentResponse } from "../entities/Payment";
import ISubscriptionGateway from "../gateway/SubscriptionGateway/ISubscriptionGateway";
import IPaymentsGateway from "../gateway/PaymentsGateway/IPaymentsGateway";
import IPlanPriceGateway from "../gateway/PlanPriceGateway /IPlanPriceGateway";

interface IPaymentsController {
  registerPayment(enterprise_id: number): Promise<void>;
  getPayment(id: number): Promise<Payment | null>;
  getPayments(): Promise<Payment[]>;
  addPayment(
    enterprise_id: number,
    planId: number,
    trx: any
  ): Promise<PaymentResponse>;
  updatePayment(data: Payment): Promise<Payment>;
  removePayment(id: number): Promise<void>;
  createPaymentLink(subscriptionId: number): Promise<string>;
}

export default class PaymentsController implements IPaymentsController {
  constructor(
    readonly paymentGateway: IPaymentsGateway,
    readonly subscriptionGateway: ISubscriptionGateway,
    readonly planPriceGateway: IPlanPriceGateway
  ) {}

  async registerPayment(enterprise_id: number): Promise<void> {
    await this.paymentGateway.registerPayment(enterprise_id);
  }

  async getPayment(id: number): Promise<Payment | null> {
    return await this.paymentGateway.getPayment(id);
  }

  async getPayments(): Promise<Payment[]> {
    return await this.paymentGateway.getPayments();
  }

  async addPayment(
    enterprise_id: number,
    planId: number,
    trx: any
  ): Promise<PaymentResponse> {
    return await this.paymentGateway.addPayment(enterprise_id, planId, trx);
  }

  async updatePayment(data: Payment): Promise<Payment> {
    return await this.paymentGateway.updatePayment(data);
  }

  async updatePaymentTransactionId(
    paymentId: number,
    transactionId: string,
    trx: any
  ): Promise<Payment> {
    return await this.paymentGateway.updatePaymentTransactionId(
      paymentId,
      transactionId,
      trx
    );
  }

  async removePayment(id: number): Promise<void> {
    await this.paymentGateway.removePayment(id);
  }

  async createPaymentLink(subscriptionId: number): Promise<string> {
    const subscription = await this.subscriptionGateway.getSubscription(
      subscriptionId
    );

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    if (subscription.status === "canceled") {
      throw new Error("Subscription is canceled");
    }

    const planPrice = await this.planPriceGateway.getPlanPrice(
      subscription.plan_price_id
    );

    if (!planPrice) {
      throw new Error("Plan price not found");
    }

    return "";
  }
}
