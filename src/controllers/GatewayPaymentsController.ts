import { ItemsPayment } from "../entities/GatewayPayment";
import { PaymentResponse } from "../entities/Payment";
import IPaymentsGateway from "../gateway/PaymentsGateway/IPaymentsGateway";
import ISubscriptionGateway from "../gateway/SubscriptionGateway/ISubscriptionGateway";

interface IGatewayPaymentsController {
  createNewPayment(
    enterpriseId: number,
    planId: number,
    items: ItemsPayment[]
  ): Promise<PaymentResponse>;
}

export default class GatewayPaymentsController
  implements IGatewayPaymentsController
{
  constructor(
    readonly subscriptionGateway: ISubscriptionGateway,
    readonly paymentsGateway: IPaymentsGateway
  ) {}

  async createNewPayment(
    enterpriseId: number,
    planId: number,
    trx: any
  ): Promise<PaymentResponse> {
    const payment = await this.paymentsGateway.addPayment(
      enterpriseId,
      planId,
      trx
    );

    return payment;
  }
}
