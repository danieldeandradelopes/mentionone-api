import Plan from "../../entities/Plan";
import { PlanResponse } from "../../entities/Plan";
import IPlanGateway from "./IPlanGateway";

export default class KnexPlanGateway implements IPlanGateway {
  constructor(readonly connection: any) {}
  async getPlan(id: number): Promise<PlanResponse> {
    const plan: any = await this.connection("plans")
      .where("plans.id", id)
      .leftJoin("plan_prices", "plans.id", "plan_prices.plan_id")
      .groupBy("plans.id")
      .select(
        "plans.id",
        "plans.name",
        "plans.description",
        "plans.features",
        "plans.created_at",
        this.connection.raw(`
        COALESCE(
          json_agg(
            json_build_object(
              'billing_cycle', plan_prices.billing_cycle,
              'price', plan_prices.price
            )
          ) FILTER (WHERE plan_prices.id IS NOT NULL),
          '[]'
        ) as plan_price
      `)
      )
      .first();

    if (!plan) {
      throw new Error("Plan not found");
    }

    return {
      ...plan,
      features: plan.features ? JSON.parse(plan.features) : null,
    };
  }

  async getPlans(): Promise<PlanResponse[]> {
    const plans: any[] = await this.connection("plans")
      .leftJoin("plan_prices", "plans.id", "plan_prices.plan_id")
      .groupBy("plans.id")
      .select(
        "plans.id",
        "plans.name",
        "plans.description",
        "plans.features",
        "plans.created_at",
        this.connection.raw(`
      COALESCE(
        json_agg(
          json_build_object(
            'id', plan_prices.id,
            'billing_cycle', plan_prices.billing_cycle,
            'price', plan_prices.price
          )
        ) FILTER (WHERE plan_prices.id IS NOT NULL),
        '[]'
      ) as plan_price
    `)
      );

    return plans.map((plan) => ({
      ...plan,
      features: plan.features ? JSON.parse(plan.features) : null,
    }));
  }
  async addPlan(data: Plan): Promise<Plan> {
    const currentPlan = await this.connection("plans")
      .where({ name: data.name })
      .first();

    if (currentPlan) {
      throw new Error("Plan already exists");
    }

    const createdPlan = await this.connection("plans")
      .insert(data)
      .returning("*");

    return new Plan(createdPlan);
  }
  async updatePlan(data: Plan): Promise<Plan> {
    const currentPlan = await this.connection("plans")
      .where({ id: data.id })
      .first();

    if (!currentPlan) {
      throw new Error("Plan not found");
    }

    const updatedPlan: Plan = await this.connection("plans")
      .update(data)
      .where({ id: data.id })
      .returning("*");

    return new Plan(updatedPlan);
  }
  async removePlan(id: number): Promise<void> {
    const currentPlan = await this.connection("plans").where({ id }).first();

    if (!currentPlan) {
      throw new Error("Plan not found");
    }

    await this.connection("plans").where({ id }).delete();
  }
}
