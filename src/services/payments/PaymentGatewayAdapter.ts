import Subscription from "../../entities/Subscription";
import PlanPrice from "../../entities/PlanPrice";
import Enterprise from "../../entities/Enterprise";

export type GatewayPaymentStatus = "paid" | "failed" | "refunded";

export interface GatewayWebhookResult {
  paymentId: number;
  status: GatewayPaymentStatus;
  transactionId?: string;
}

export interface CreditCardInput {
  holderName: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
  ccv: string;
}

export interface CardHolderInfoInput {
  name: string;
  email: string;
  cpfCnpj: string;
  phone: string;
  postalCode: string;
  address: string;
  addressNumber: string;
  complement?: string;
  province?: string;
}

export interface TransparentCheckoutRequest {
  paymentId: number;
  billingCycle: "monthly" | "yearly";
  value: number;
  description: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerDocument: string;
  card: CreditCardInput;
  holderInfo: CardHolderInfoInput;
}

export interface TransparentCheckoutResponse {
  transactionId: string;
  status: "pending" | "paid";
  customerId?: string;
}

export interface PaymentGatewayAdapter {
  createPaymentLink(params: {
    subscription: Subscription;
    planPrice: PlanPrice;
    enterprise: Enterprise;
  }): Promise<string>;
  createTransparentCheckout(
    params: TransparentCheckoutRequest
  ): Promise<TransparentCheckoutResponse>;
  cancelSubscription(externalId: string): Promise<void>;
  parseWebhook(payload: any): Promise<GatewayWebhookResult | null>;
}
