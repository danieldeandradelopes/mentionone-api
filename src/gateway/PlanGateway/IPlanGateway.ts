import Plan, { PlanResponse } from "../../entities/Plan";

export default interface IPlanGateway {
  getPlan(id: number): Promise<PlanResponse>;
  getPlans(): Promise<PlanResponse[]>;
  addPlan(data: Plan): Promise<Plan>;
  updatePlan(data: Plan): Promise<Plan>;
  removePlan(id: number): Promise<void>;
}
