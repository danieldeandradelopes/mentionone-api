import Payment, { PaymentResponse } from "../entities/Payment";
import ISubscriptionGateway from "../gateway/SubscriptionGateway/ISubscriptionGateway";
import IPaymentsGateway from "../gateway/PaymentsGateway/IPaymentsGateway";
import IPlanPriceGateway from "../gateway/PlanPriceGateway /IPlanPriceGateway";
import IEnterpriseGateway from "../gateway/EnterpriseGateway/IEnterpriseGateway";
import {
  CardHolderInfoInput,
  CreditCardInput,
  PaymentGatewayAdapter,
  TransparentCheckoutResponse,
} from "../services/payments/PaymentGatewayAdapter";

interface IPaymentsController {
  registerPayment(enterprise_id: number): Promise<void>;
  getPayment(id: number): Promise<Payment | null>;
  getPayments(): Promise<Payment[]>;
  getPaymentsByEnterpriseId(enterprise_id: number): Promise<Payment[]>;
  addPayment(
    enterprise_id: number,
    planId: number,
    trx: any,
  ): Promise<PaymentResponse>;
  updatePayment(data: Payment): Promise<Payment>;
  removePayment(id: number): Promise<void>;
  createPaymentLink(subscriptionId: number): Promise<string>;
  createTransparentCheckout(params: {
    enterprise_id: number;
    plan_price_id: number;
    card: CreditCardInput;
    holder: CardHolderInfoInput;
  }): Promise<{
    payment: PaymentResponse;
    gateway: TransparentCheckoutResponse;
  }>;
  cancelSubscription(enterprise_id: number): Promise<void>;
}

export default class PaymentsController implements IPaymentsController {
  constructor(
    readonly paymentGateway: IPaymentsGateway,
    readonly subscriptionGateway: ISubscriptionGateway,
    readonly planPriceGateway: IPlanPriceGateway,
    readonly paymentGatewayAdapter: PaymentGatewayAdapter,
    readonly enterpriseGateway: IEnterpriseGateway,
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

  async getPaymentsByEnterpriseId(enterprise_id: number): Promise<Payment[]> {
    return await this.paymentGateway.getPaymentsByEnterpriseId(enterprise_id);
  }

  async addPayment(
    enterprise_id: number,
    planId: number,
    trx: any,
  ): Promise<PaymentResponse> {
    return await this.paymentGateway.addPayment(enterprise_id, planId, trx);
  }

  async updatePayment(data: Payment): Promise<Payment> {
    return await this.paymentGateway.updatePayment(data);
  }

  async updatePaymentTransactionId(
    paymentId: number,
    transactionId: string,
    trx: any,
  ): Promise<Payment> {
    return await this.paymentGateway.updatePaymentTransactionId(
      paymentId,
      transactionId,
      trx,
    );
  }

  async removePayment(id: number): Promise<void> {
    await this.paymentGateway.removePayment(id);
  }

  async createPaymentLink(subscriptionId: number): Promise<string> {
    const subscription =
      await this.subscriptionGateway.getSubscription(subscriptionId);

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    if (subscription.status === "canceled") {
      throw new Error("Subscription is canceled");
    }

    const planPrice = await this.planPriceGateway.getPlanPrice(
      subscription.plan_price_id,
    );

    if (!planPrice) {
      throw new Error("Plan price not found");
    }

    const enterprise = await this.enterpriseGateway.getEnterprise(
      subscription.enterprise_id,
    );

    return this.paymentGatewayAdapter.createPaymentLink({
      subscription,
      planPrice,
      enterprise,
    });
  }

  async createTransparentCheckout(params: {
    enterprise_id: number;
    plan_price_id: number;
    card: CreditCardInput;
    holder: CardHolderInfoInput;
  }): Promise<{
    payment: PaymentResponse;
    gateway: TransparentCheckoutResponse;
  }> {
    const { enterprise_id, plan_price_id, card, holder } = params;

    if (!plan_price_id) {
      throw new Error("Plan price not informed");
    }

    if (
      !card?.holderName ||
      !card?.number ||
      !card?.expiryMonth ||
      !card?.expiryYear ||
      !card?.ccv
    ) {
      throw new Error("Card data missing");
    }

    if (
      !holder?.name ||
      !holder?.email ||
      !holder?.cpfCnpj ||
      !holder?.phone ||
      !holder?.postalCode ||
      !holder?.address ||
      !holder?.addressNumber
    ) {
      throw new Error("Card holder data missing");
    }

    const enterprise =
      await this.enterpriseGateway.getEnterprise(enterprise_id);

    if (!enterprise) {
      throw new Error("Enterprise not found");
    }

    if (!enterprise.document) {
      throw new Error("Enterprise document not found");
    }

    if (!enterprise.email) {
      throw new Error("Enterprise email not found");
    }

    const payment = await this.paymentGateway.addPaymentByPlanPrice(
      enterprise_id,
      plan_price_id,
    );

    const gateway = await this.paymentGatewayAdapter.createTransparentCheckout({
      paymentId: payment.id,
      billingCycle: payment.plan_price.billing_cycle,
      value: Number(payment.amount),
      description: payment.description || payment.name,
      customerId: enterprise.asaas_customer_id || undefined,
      customerName: enterprise.name,
      customerEmail: enterprise.email,
      customerDocument: enterprise.document,
      card,
      holderInfo: holder,
    });

    if (gateway.customerId && !enterprise.asaas_customer_id) {
      await this.enterpriseGateway.updateEnterprise({
        id: enterprise.id,
        asaas_customer_id: gateway.customerId,
      });
    }

    const currentPayment = await this.paymentGateway.getPayment(payment.id);
    if (currentPayment) {
      await this.paymentGateway.updatePayment({
        ...currentPayment,
        transaction_id: gateway.transactionId,
      });
    }

    if (gateway.status === "paid") {
      if (currentPayment) {
        await this.paymentGateway.updatePayment({
          ...currentPayment,
          status: "paid",
          transaction_id: gateway.transactionId,
          payment_date: new Date().toISOString(),
        });
        await this.subscriptionGateway.updateSubscriptionConfirmedPayment(
          currentPayment,
        );
      }
    }

    return { payment, gateway };
  }

  async cancelSubscription(enterprise_id: number): Promise<void> {
    const subscription =
      await this.subscriptionGateway.getSubscriptionByEnterpriseIdRaw(
        enterprise_id,
      );

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    const planPrice = await this.planPriceGateway.getPlanPrice(
      subscription.plan_price_id,
    );

    if (!planPrice) {
      throw new Error("Plan price not found");
    }

    if (planPrice.billing_cycle === "monthly") {
      const payment = await this.paymentGateway.getPaymentBySubscriptionId(
        subscription.id!,
      );

      if (!payment?.transaction_id) {
        throw new Error("Subscription transaction not found");
      }

      await this.paymentGatewayAdapter.cancelSubscription(
        payment.transaction_id,
      );
    }

    await this.subscriptionGateway.updateSubscription({
      ...subscription,
      status: "canceled",
      end_date: new Date().toISOString(),
    });
  }
}
