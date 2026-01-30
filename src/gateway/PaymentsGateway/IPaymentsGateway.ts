import Payment, { PaymentResponse } from "../../entities/Payment";

export default interface IPaymentsGateway {
  registerPayment(enterprise_id: number): Promise<void>;
  getPaymentBySubscriptionId(subscriptionId: number): Promise<Payment | null>;
  getPayment(id: number): Promise<Payment | null>;
  getPayments(): Promise<Payment[]>;
  getPaymentsByEnterpriseId(enterpriseId: number): Promise<Payment[]>;
  addPayment(
    enterprise_id: number,
    planId: number,
    trx: any,
  ): Promise<PaymentResponse>;
  addPaymentByPlanPrice(
    enterprise_id: number,
    planPriceId: number,
  ): Promise<PaymentResponse>;
  updatePayment(data: Payment): Promise<Payment>;
  removePayment(id: number): Promise<void>;
  updatePaymentTransactionId(
    paymentId: number,
    transactionId: string,
    trx: any,
  ): Promise<Payment>;
}
