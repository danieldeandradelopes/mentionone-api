import PlanPrice from "./PlanPrice";
import Subscription from "./Subscription";

export interface PaymentProps {
  id?: number;
  subscription_id: number;
  amount: number;
  status: "pending" | "paid" | "failed" | "refunded";
  transaction_id?: string;
  items?: any;
  payment_date?: string;
  due_date?: string;
  created_at?: string;
}

export interface PaymentResponse {
  id: number;
  subscription_id: number;
  amount: number;
  status: "pending" | "paid" | "failed" | "refunded";
  transaction_id?: string;
  created_at: string;
  subscription: Subscription;
  plan_price: PlanPrice;
  name: string;
  description: string;
}

export default class Payment {
  readonly id?: number;
  readonly subscription_id: number;
  readonly amount: number;
  readonly status: "pending" | "paid" | "failed" | "refunded";
  readonly transaction_id?: string;
  readonly items?: any;
  readonly payment_date?: string;
  readonly due_date?: string;
  readonly created_at?: string;

  constructor({
    id,
    subscription_id,
    amount,
    status,
    transaction_id,
    payment_date,
    due_date,
    created_at,
  }: PaymentProps) {
    this.id = id;
    this.subscription_id = subscription_id;
    this.amount = amount;
    this.status = status;
    this.transaction_id = transaction_id;
    this.payment_date = payment_date;
    this.due_date = due_date;
    this.created_at = created_at;
  }
}
