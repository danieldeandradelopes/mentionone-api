import BoxBranding, { BoxBrandingProps } from "../entities/BoxBranding";
import { IBoxBrandingGateway } from "../gateway/BoxBrandingGateway/IBoxBrandingGateway";
import { getPlanFeatures, getFeatureValue } from "../utils/PlanFeaturesHelper";
import KnexConfig from "../config/knex";

export interface BoxBrandingWithPlan extends BoxBranding {
  show_mentionone_branding: boolean;
}

export default class BoxBrandingController {
  constructor(private readonly gateway: IBoxBrandingGateway) {}

  async getByBoxId(box_id: number): Promise<BoxBranding | null> {
    return this.gateway.getByBoxId(box_id);
  }

  /**
   * Obtém branding com informação do plano (usado na página pública)
   */
  async getByBoxIdWithPlan(
    box_id: number,
    enterprise_id: number
  ): Promise<BoxBrandingWithPlan | null> {
    const branding = await this.gateway.getByBoxId(box_id);
    if (!branding) {
      return null;
    }

    // Buscar features do plano
    const planFeaturesResult = await getPlanFeatures(
      KnexConfig,
      enterprise_id
    );

    // Se não tem subscription, considera como plano Free (mostrar marca)
    const show_mentionone_branding = planFeaturesResult.features
      ? getFeatureValue(planFeaturesResult.features, "show_mentionone_branding", true)
      : true;

    return {
      ...branding,
      show_mentionone_branding,
    };
  }

  async create(data: Omit<BoxBrandingProps, "id">): Promise<BoxBranding> {
    return this.gateway.create(data);
  }

  async update(
    box_id: number,
    data: Partial<Omit<BoxBrandingProps, "id" | "box_id">>
  ): Promise<BoxBranding> {
    return this.gateway.update(box_id, data);
  }
}
