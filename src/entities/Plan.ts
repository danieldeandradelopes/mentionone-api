import PlanPrice from "./PlanPrice";

export interface PlanProps {
  id?: number;
  name: string;
  description?: string;
  created_at?: string;
}

export interface PlanResponse {
  id: number;
  name: string;
  description: string;
  created_at: string;
  plan_price: PlanPrice[];
}

export default class Plan {
  readonly id?: number;
  readonly name: string;
  readonly description?: string;
  readonly created_at?: string;

  constructor({ id, name, description, created_at }: PlanProps) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.created_at = created_at;
  }
}
