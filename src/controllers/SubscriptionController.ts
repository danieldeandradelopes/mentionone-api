import Subscription, {
  SubscriptionStatus,
  SubscriptionValidateResponse,
} from "../entities/Subscription";
import ISubscriptionGateway from "../gateway/SubscriptionGateway/ISubscriptionGateway";
import IController from "./IController";
import Payment from "../entities/Payment";

interface ISubscriptionController extends IController {
  getByEnterpriseId(
    enterpriseId: number
  ): Promise<SubscriptionValidateResponse>;
  get(id: number): Promise<Subscription>;
  store(data: {
    enterprise_id: number;
    plan_price_id: number;
    status: SubscriptionStatus;
    start_date: string;
    end_date: string;
  }): Promise<Subscription>;
  update(data: Subscription): Promise<Subscription>;
  updateSubscriptionConfirmedPayment(payment: Payment): Promise<Subscription>;
}

export default class SubscriptionController implements ISubscriptionController {
  constructor(readonly subscriptionGateway: ISubscriptionGateway) {}

  async getByEnterpriseId(enterpriseId: number) {
    return await this.subscriptionGateway.getSubscriptionByEnterpriseId(
      enterpriseId
    );
  }

  async verifyAndUpdateSubscriptionStatus() {
    await this.subscriptionGateway.verifyAndUpdateSubscriptionStatus();
  }

  async updateSubscriptionConfirmedPayment(payment: Payment) {
    return await this.subscriptionGateway.updateSubscriptionConfirmedPayment(
      payment
    );
  }

  async get(id: number) {
    return await this.subscriptionGateway.getSubscription(id);
  }

  async list() {
    return await this.subscriptionGateway.getSubscriptions();
  }

  async store(data: {
    enterprise_id: number;
    plan_price_id: number;
    start_date: string;
  }): Promise<Subscription> {
    const { enterprise_id, plan_price_id, start_date } = data;
    return await this.subscriptionGateway.addSubscription(
      new Subscription({
        enterprise_id,
        plan_price_id,
        start_date,
      })
    );
  }

  async update(data: Subscription): Promise<Subscription> {
    return await this.subscriptionGateway.updateSubscription(data);
  }

  async destroy(id: number) {
    await this.subscriptionGateway.removeSubscription(id);
  }
}
