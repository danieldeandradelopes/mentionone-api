import Subscription from "../../entities/Subscription";
import PlanPrice from "../../entities/PlanPrice";
import Enterprise from "../../entities/Enterprise";
import HttpClient from "../../infra/Http/HttpClient";
import {
  GatewayWebhookResult,
  PaymentGatewayAdapter,
  TransparentCheckoutRequest,
  TransparentCheckoutResponse,
} from "./PaymentGatewayAdapter";

type AsaasPaymentStatus =
  | "PENDING"
  | "RECEIVED"
  | "CONFIRMED"
  | "OVERDUE"
  | "REFUNDED"
  | "CANCELED";

export default class AsaasAdapter implements PaymentGatewayAdapter {
  constructor(private readonly httpClient: HttpClient) {}

  async createPaymentLink(params: {
    subscription: Subscription;
    planPrice: PlanPrice;
    enterprise: Enterprise;
  }): Promise<string> {
    void params;
    return "";
  }

  async createTransparentCheckout(
    params: TransparentCheckoutRequest
  ): Promise<TransparentCheckoutResponse> {
    const customerId =
      params.customerId || (await this.createCustomer(params));

    if (params.billingCycle === "monthly") {
      const subscription = await this.httpClient.post(
        `${this.getBaseUrl()}/subscriptions`,
        {
          customer: customerId,
          billingType: "CREDIT_CARD",
          nextDueDate: this.getTodayDate(),
          value: params.value,
          cycle: "MONTHLY",
          description: params.description,
          externalReference: params.paymentId.toString(),
          creditCard: {
            holderName: params.card.holderName,
            number: params.card.number,
            expiryMonth: params.card.expiryMonth,
            expiryYear: params.card.expiryYear,
            ccv: params.card.ccv,
          },
          creditCardHolderInfo: {
            name: params.holderInfo.name,
            email: params.holderInfo.email,
            cpfCnpj: params.holderInfo.cpfCnpj,
            phone: params.holderInfo.phone,
            postalCode: params.holderInfo.postalCode,
            address: params.holderInfo.address,
            addressNumber: params.holderInfo.addressNumber,
            complement: params.holderInfo.complement,
            province: params.holderInfo.province,
          },
        },
        this.getHeaders()
      );

      return {
        transactionId: subscription.id,
        status: "pending",
        customerId: params.customerId ? undefined : customerId,
      };
    }

    const payment = await this.httpClient.post(
      `${this.getBaseUrl()}/payments`,
      {
        customer: customerId,
        billingType: "CREDIT_CARD",
        dueDate: this.getTodayDate(),
        value: params.value,
        description: params.description,
        externalReference: params.paymentId.toString(),
        creditCard: {
          holderName: params.card.holderName,
          number: params.card.number,
          expiryMonth: params.card.expiryMonth,
          expiryYear: params.card.expiryYear,
          ccv: params.card.ccv,
        },
        creditCardHolderInfo: {
          name: params.holderInfo.name,
          email: params.holderInfo.email,
          cpfCnpj: params.holderInfo.cpfCnpj,
          phone: params.holderInfo.phone,
          postalCode: params.holderInfo.postalCode,
          address: params.holderInfo.address,
          addressNumber: params.holderInfo.addressNumber,
          complement: params.holderInfo.complement,
          province: params.holderInfo.province,
        },
      },
      this.getHeaders()
    );

    return {
      transactionId: payment.id,
      status: this.mapPaymentStatus(payment.status),
      customerId: params.customerId ? undefined : customerId,
    };
  }

  async cancelSubscription(externalId: string): Promise<void> {
    await this.httpClient.delete(
      `${this.getBaseUrl()}/subscriptions/${externalId}`,
      this.getHeaders(),
    );
  }

  async parseWebhook(payload: any): Promise<GatewayWebhookResult | null> {
    const event = payload?.event;
    const payment = payload?.payment;

    if (!event || !payment?.externalReference) {
      return null;
    }

    const status = this.mapWebhookEventToStatus(event);
    if (!status) {
      return null;
    }

    return {
      paymentId: Number(payment.externalReference),
      status,
      transactionId: payment.id,
    };
  }

  private async createCustomer(
    params: TransparentCheckoutRequest
  ): Promise<string> {
    try {
      const customer = await this.httpClient.post(
        `${this.getBaseUrl()}/customers`,
        {
          name: params.customerName,
          email: params.customerEmail,
          cpfCnpj: params.customerDocument,
        },
        this.getHeaders()
      );

      if (!customer?.id) {
        throw new Error("Não foi possível criar cliente no Asaas");
      }

      return customer.id;
    } catch (error: any) {
      console.log(JSON.stringify(error?.response?.data, null, 2));
      throw error;
    }
  }

  private mapWebhookEventToStatus(
    event: string
  ): GatewayWebhookResult["status"] | null {
    const paidEvents = ["PAYMENT_RECEIVED", "PAYMENT_CONFIRMED"];
    const refundedEvents = ["PAYMENT_REFUNDED", "PAYMENT_CHARGEBACK"];
    const failedEvents = [
      "PAYMENT_FAILED",
      "PAYMENT_CANCELED",
      "PAYMENT_OVERDUE",
      "PAYMENT_DELETED",
    ];

    if (paidEvents.includes(event)) {
      return "paid";
    }

    if (refundedEvents.includes(event)) {
      return "refunded";
    }

    if (failedEvents.includes(event)) {
      return "failed";
    }

    return null;
  }

  private mapPaymentStatus(status?: AsaasPaymentStatus): "pending" | "paid" {
    if (status === "RECEIVED" || status === "CONFIRMED") {
      return "paid";
    }
    return "pending";
  }

  private getHeaders() {
    const token = process.env.ASAAS_ACCESS_TOKEN;
    if (!token) {
      throw new Error("ASAAS_ACCESS_TOKEN não configurado");
    }

    return {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "mentionone-api",
        access_token: token,
      },
    };
  }

  private getBaseUrl() {
    return process.env.ASAAS_API_URL || "https://api.asaas.com/v3";
  }

  private getTodayDate() {
    return new Date().toISOString().split("T")[0];
  }
}
