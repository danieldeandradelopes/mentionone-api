import Plan from "../../entities/Plan";
import { PlanResponse } from "../../entities/Plan";
import IPlanGateway from "./IPlanGateway";

export default class KnexPlanGateway implements IPlanGateway {
  constructor(readonly connection: any) {}
  async getPlan(id: number): Promise<PlanResponse> {
    const plan: PlanResponse = await this.connection("plan")
      .where("plan.id", id)
      .leftJoin("plan_price", "plan.id", "plan_price.plan_id")
      .groupBy("plan.id")
      .select(
        "plan.id",
        "plan.name",
        "plan.description",
        "plan.features",
        "plan.created_at",
        this.connection.raw(`
        COALESCE(
          json_agg(
            json_build_object(
              'billing_cycle', plan_price.billing_cycle,
              'price', plan_price.price
            )
          ) FILTER (WHERE plan_price.id IS NOT NULL),
          '[]'
        ) as plan_price
      `)
      )
      .first();

    if (!plan) {
      throw new Error("Plan not found");
    }

    return plan;
  }

  async getPlans(): Promise<PlanResponse[]> {
    const plans: PlanResponse[] = await this.connection("plan")
      .leftJoin("plan_price", "plan.id", "plan_price.plan_id")
      .groupBy("plan.id")
      .select(
        "plan.id",
        "plan.name",
        "plan.description",
        "plan.features",
        "plan.created_at",
        this.connection.raw(`
      COALESCE(
        json_agg(
          json_build_object(
            'id', plan_price.id,
            'billing_cycle', plan_price.billing_cycle,
            'price', plan_price.price
          )
        ) FILTER (WHERE plan_price.id IS NOT NULL),
        '[]'
      ) as plan_price
    `)
      );

    return plans;
  }
  async addPlan(data: Plan): Promise<Plan> {
    const currentPlan = await this.connection("plan")
      .where({ name: data.name })
      .first();

    if (currentPlan) {
      throw new Error("Plan already exists");
    }

    const createdPlan = await this.connection("plan")
      .insert(data)
      .returning("*");

    return new Plan(createdPlan);
  }
  async updatePlan(data: Plan): Promise<Plan> {
    const currentPlan = await this.connection("plan")
      .where({ id: data.id })
      .first();

    if (!currentPlan) {
      throw new Error("Plan not found");
    }

    const updatedPlan: Plan = await this.connection("plan")
      .update(data)
      .where({ id: data.id })
      .returning("*");

    return new Plan(updatedPlan);
  }
  async removePlan(id: number): Promise<void> {
    const currentPlan = await this.connection("plan").where({ id }).first();

    if (!currentPlan) {
      throw new Error("Plan not found");
    }

    await this.connection("plan").where({ id }).delete();
  }
}
