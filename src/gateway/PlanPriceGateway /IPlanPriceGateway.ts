import PlanPrice from "../../entities/PlanPrice";

export default interface IPlanPriceGateway {
  getPlanPrice(id: number): Promise<PlanPrice>;
  getPlanPrices(): Promise<PlanPrice[]>;
  addPlanPrice(data: PlanPrice): Promise<PlanPrice>;
  updatePlanPrice(data: PlanPrice): Promise<PlanPrice>;
  removePlanPrice(id: number): Promise<void>;
}
