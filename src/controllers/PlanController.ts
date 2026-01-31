import Plan from "../entities/Plan";
import IPlanGateway from "../gateway/PlanGateway/IPlanGateway";
import IController from "./IController";

import { PlanResponse } from "../entities/Plan";

interface IPlanController extends IController {
  get(id: number): Promise<PlanResponse>;
  store(data: { name: string; description: string }): Promise<Plan>;
  update(data: Plan): Promise<Plan>;
}

export default class PlanController implements IPlanController {
  constructor(readonly planGateway: IPlanGateway) {}

  async get(id: number): Promise<PlanResponse> {
    return await this.planGateway.getPlan(id);
  }

  async list() {
    return await this.planGateway.getPlans();
  }

  async store(data: { name: string; description: string }): Promise<Plan> {
    const { name, description } = data;
    return await this.planGateway.addPlan(new Plan({ name, description }));
  }

  async update(data: Plan): Promise<Plan> {
    return await this.planGateway.updatePlan(data);
  }

  async destroy(id: number) {
    await this.planGateway.removePlan(id);
  }
}
