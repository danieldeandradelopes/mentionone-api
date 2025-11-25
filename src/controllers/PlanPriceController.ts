import PlanPrice from "../entities/PlanPrice";
import IPlanPriceGateway from "../gateway/PlanPriceGateway /IPlanPriceGateway";
import IController from "./IController";

interface IPlanPriceController extends IController {
  get(id: number): Promise<PlanPrice>;
  store(data: {
    plan_id: number;
    billing_cycle: "monthly" | "yearly";
    price: number;
  }): Promise<PlanPrice>;
  update(data: PlanPrice): Promise<PlanPrice>;
}

export default class PlanPriceController implements IPlanPriceController {
  constructor(readonly planPriceGateway: IPlanPriceGateway) {}

  async get(id: number) {
    return await this.planPriceGateway.getPlanPrice(id);
  }

  async list() {
    return await this.planPriceGateway.getPlanPrices();
  }

  async store(data: {
    plan_id: number;
    billing_cycle: "monthly" | "yearly";
    price: number;
  }): Promise<PlanPrice> {
    const { plan_id, billing_cycle, price } = data;
    return await this.planPriceGateway.addPlanPrice(
      new PlanPrice({ plan_id, billing_cycle, price })
    );
  }

  async update(data: PlanPrice): Promise<PlanPrice> {
    return await this.planPriceGateway.updatePlanPrice(data);
  }

  async destroy(id: number) {
    await this.planPriceGateway.removePlanPrice(id);
  }
}
