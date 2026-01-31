import HttpClient from "../../infra/Http/HttpClient";
import Subscription from "../../entities/Subscription";
import PlanPrice from "../../entities/PlanPrice";
import Enterprise from "../../entities/Enterprise";
import {
  GatewayWebhookResult,
  PaymentGatewayAdapter,
  TransparentCheckoutRequest,
  TransparentCheckoutResponse,
} from "./PaymentGatewayAdapter";

export default class MercadoPagoAdapter implements PaymentGatewayAdapter {
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
    void params;
    throw new Error("Checkout transparente não disponível para Mercado Pago");
  }

  async cancelSubscription(): Promise<void> {
    throw new Error("Cancelamento não disponível para Mercado Pago");
  }

  async parseWebhook(payload: any): Promise<GatewayWebhookResult | null> {
    const { type, data } = payload || {};
    if (type !== "payment" || !data?.id) {
      return null;
    }

    const paymentId = data.id;
    const responseData = await this.httpClient.get(
      `${process.env.MERCADO_PAGO_API_URL}/payments/${paymentId}`,
      {
        Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
      },
    );

    if (responseData.status !== "approved") {
      throw new Error("Payment not approved");
    }

    if (!responseData.external_reference) {
      throw new Error("Payment external reference not found");
    }

    return {
      paymentId: Number(responseData.external_reference),
      status: "paid",
      transactionId: paymentId.toString(),
    };
  }
}
