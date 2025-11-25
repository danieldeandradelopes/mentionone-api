import PlanPrice from "../../entities/PlanPrice";
import IPlanPriceGateway from "./IPlanPriceGateway";

export default class KnexPlanPriceGateway implements IPlanPriceGateway {
  constructor(readonly connection: any) {}
  async getPlanPrice(id: number): Promise<PlanPrice> {
    return await this.connection("plan_price").where({ id }).first();
  }
  async getPlanPrices(): Promise<PlanPrice[]> {
    return await this.connection("plan_price");
  }
  async addPlanPrice(data: PlanPrice): Promise<PlanPrice> {
    const plans = await this.connection("plan")
      .where({ id: data.plan_id })
      .first();

    if (!plans) {
      throw new Error("Plan not found");
    }

    return await this.connection("plan_price")
      .insert({ ...data, plan_id: plans.id })
      .returning("*");
  }
  async updatePlanPrice(data: PlanPrice): Promise<PlanPrice> {
    return await this.connection("plan_price")
      .update(data)
      .where({ id: data.id })
      .returning("*");
  }
  async removePlanPrice(id: number): Promise<void> {
    await this.connection("plan_price").where({ id }).delete();
  }
}
