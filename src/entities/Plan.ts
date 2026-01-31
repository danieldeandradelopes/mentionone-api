import PlanPrice from "./PlanPrice";

export interface PlanFeatures {
  max_boxes: number | null; // null = ilimitado
  max_responses_per_month: number | null; // null = ilimitado
  can_access_reports: boolean;
  can_access_advanced_charts: boolean;
  can_filter_feedbacks: boolean;
  can_export_csv: boolean;
  show_mentionone_branding: boolean;
}

export interface PlanProps {
  id?: number;
  name: string;
  description?: string;
  features?: PlanFeatures | null;
  created_at?: string;
}

export interface PlanResponse {
  id: number;
  name: string;
  description: string;
  features: PlanFeatures | null;
  created_at: string;
  plan_price: PlanPrice[];
}

export default class Plan {
  readonly id?: number;
  readonly name: string;
  readonly description?: string;
  readonly features?: PlanFeatures | null;
  readonly created_at?: string;

  constructor({
    id,
    name,
    description,
    features,
    created_at,
  }: PlanProps) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.features = features;
    this.created_at = created_at;
  }

  /**
   * Obtém o valor de uma feature específica com valor padrão
   */
  getFeature<K extends keyof PlanFeatures>(
    key: K,
    defaultValue: PlanFeatures[K]
  ): PlanFeatures[K] {
    if (!this.features) {
      return defaultValue;
    }
    return this.features[key] ?? defaultValue;
  }

  /**
   * Verifica se uma feature booleana está habilitada
   */
  hasFeature(key: keyof Pick<PlanFeatures, "can_access_reports" | "can_access_advanced_charts" | "can_filter_feedbacks" | "can_export_csv" | "show_mentionone_branding">): boolean {
    return this.getFeature(key, false);
  }

  /**
   * Verifica se o plano tem limite de caixas
   */
  hasBoxLimit(): boolean {
    return this.getFeature("max_boxes", null) !== null;
  }

  /**
   * Obtém o limite de caixas (retorna null se ilimitado)
   */
  getMaxBoxes(): number | null {
    return this.getFeature("max_boxes", null);
  }

  /**
   * Verifica se o plano tem limite de respostas por mês
   */
  hasResponseLimit(): boolean {
    return this.getFeature("max_responses_per_month", null) !== null;
  }

  /**
   * Obtém o limite de respostas por mês (retorna null se ilimitado)
   */
  getMaxResponsesPerMonth(): number | null {
    return this.getFeature("max_responses_per_month", null);
  }
}
