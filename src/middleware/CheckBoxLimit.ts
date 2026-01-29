import { NextFunction, Request, Response } from "express";
import { getPlanFeatures, getFeatureValue } from "../utils/PlanFeaturesHelper";
import KnexConfig from "../config/knex";
import { PlanFeatures } from "../entities/Plan";

/**
 * Middleware para verificar se a empresa pode criar mais caixas
 * Verifica o limite de caixas baseado no plano
 */
export async function CheckBoxLimit(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Superadmin sempre passa
    if (request.access_level === "superadmin") {
      return next();
    }

    if (!request.enterprise_id) {
      response.status(401).json({ message: "Unauthorized!" });
      return;
    }

    // Buscar features do plano
    const planFeaturesResult = await getPlanFeatures(
      KnexConfig,
      request.enterprise_id
    );

    // Se não tem subscription, considera como plano Free (limite de 1 caixa)
    const maxBoxes = planFeaturesResult.features
      ? getFeatureValue(planFeaturesResult.features, "max_boxes", 1)
      : 1;

    // Se maxBoxes é null, significa ilimitado
    if (maxBoxes === null) {
      return next();
    }

    // Contar caixas existentes da empresa
    const boxesCount = await KnexConfig("boxes")
      .where({ enterprise_id: request.enterprise_id })
      .count("* as total")
      .first();

    const currentBoxes = parseInt(boxesCount?.total as string) || 0;

    // Verificar se já atingiu o limite
    if (currentBoxes >= maxBoxes) {
      response.status(403).json({
        message: `Você atingiu o limite de ${maxBoxes} caixa(s) do seu plano. Faça upgrade para criar mais caixas.`,
      });
      return;
    }

    next();
  } catch (error) {
    response.status(500).json({
      message: "Erro ao verificar limite de caixas",
    });
  }
}

