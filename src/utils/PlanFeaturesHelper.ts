import { PlanFeatures } from "../entities/Plan";

export interface PlanFeaturesResult {
  features: PlanFeatures | null;
  planName: string;
  planId: number | null;
}

/**
 * Busca as features do plano atual de uma empresa
 * @param connection - Conexão Knex
 * @param enterpriseId - ID da empresa
 * @returns Features do plano ou null se não houver subscription
 */
export async function getPlanFeatures(
  connection: any,
  enterpriseId: number
): Promise<PlanFeaturesResult> {
  // Busca subscription ativa
  let subscription = await connection("subscriptions")
    .where({ enterprise_id: enterpriseId })
    .whereRaw(
      `
      (
        (subscriptions.start_date <= NOW() 
         AND (subscriptions.end_date IS NULL OR subscriptions.end_date >= NOW()))
        OR (subscriptions.trial_end_date IS NOT NULL AND subscriptions.trial_end_date >= NOW())
      )
    `
    )
    .join("plan_prices", "subscriptions.plan_price_id", "plan_prices.id")
    .join("plans", "plan_prices.plan_id", "plans.id")
    .orderByRaw(
      "COALESCE(subscriptions.end_date, subscriptions.trial_end_date) DESC"
    )
    .first();

  // Se não encontrou subscription ativa, busca a mais recente
  if (!subscription) {
    subscription = await connection("subscriptions")
      .where({ enterprise_id: enterpriseId })
      .join("plan_prices", "subscriptions.plan_price_id", "plan_prices.id")
      .join("plans", "plan_prices.plan_id", "plans.id")
      .orderBy("subscriptions.end_date", "desc")
      .first();
  }

  if (!subscription) {
    return {
      features: null,
      planName: "",
      planId: null,
    };
  }

  // Parse do JSON features
  const features: PlanFeatures | null = subscription.features
    ? JSON.parse(subscription.features)
    : null;

  return {
    features,
    planName: subscription.name || "",
    planId: subscription.plan_id || null,
  };
}

/**
 * Obtém o valor de uma feature específica com valor padrão
 */
export function getFeatureValue<K extends keyof PlanFeatures>(
  features: PlanFeatures | null,
  key: K,
  defaultValue: PlanFeatures[K]
): PlanFeatures[K] {
  if (!features) {
    return defaultValue;
  }
  return features[key] ?? defaultValue;
}

