export interface PlanPriceProps {
  id?: number;
  plan_id: number;
  billing_cycle: "monthly" | "yearly";
  price: number;
  created_at?: string;
}

export default class PlanPrice {
  readonly id?: number;
  readonly plan_id: number;
  readonly billing_cycle: "monthly" | "yearly";
  readonly price: number;
  readonly created_at?: string;

  constructor({
    id,
    plan_id,
    billing_cycle,
    price,
    created_at,
  }: PlanPriceProps) {
    this.id = id;
    this.plan_id = plan_id;
    this.billing_cycle = billing_cycle;
    this.price = price;
    this.created_at = created_at;
  }
}
