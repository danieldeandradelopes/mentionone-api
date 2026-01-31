import Payment from "../../entities/Payment";
import Subscription, {
  SubscriptionValidateResponse,
} from "../../entities/Subscription";

export default interface ISubscriptionGateway {
  getSubscription(id: number): Promise<Subscription>;
  getSubscriptions(): Promise<Subscription[]>;
  addSubscription(data: Subscription): Promise<Subscription>;
  updateSubscription(data: Subscription): Promise<Subscription>;
  removeSubscription(id: number): Promise<void>;
  getSubscriptionByEnterpriseId(
    enterpriseId: number
  ): Promise<SubscriptionValidateResponse>;
  getSubscriptionByEnterpriseIdRaw(
    enterpriseId: number
  ): Promise<Subscription | null>;
  verifyAndUpdateSubscriptionStatus(): Promise<void>;
  updateSubscriptionConfirmedPayment(payment: Payment): Promise<Subscription>;
}
