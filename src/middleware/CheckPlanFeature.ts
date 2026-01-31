import { NextFunction, Request, Response } from "express";
import { PlanFeatures } from "../entities/Plan";
import { getPlanFeatures, getFeatureValue } from "../utils/PlanFeaturesHelper";
import KnexConfig from "../config/knex";

/**
 * Middleware para verificar se o plano da empresa tem uma feature específica
 * @param featureName - Nome da feature a verificar
 * @returns Middleware Express
 */
export function CheckPlanFeature(
  featureName: keyof PlanFeatures
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Superadmin sempre passa
      if (request.access_level === "superadmin") {
        next();
        return;
      }

      if (!request.enterprise_id) {
        response.status(401).json({ message: "Unauthorized!" });
        return;
      }

      // Buscar features do plano usando KnexConfig diretamente
      const planFeaturesResult = await getPlanFeatures(
        KnexConfig,
        request.enterprise_id
      );

      // Se não tem subscription, considera como plano Free (features restritas)
      if (!planFeaturesResult.features) {
        // Para features booleanas, Free = false
        if (
          featureName === "can_access_reports" ||
          featureName === "can_access_advanced_charts" ||
          featureName === "can_filter_feedbacks" ||
          featureName === "can_export_csv"
        ) {
          response.status(403).json({
            message:
              "Esta funcionalidade requer upgrade do plano. Faça upgrade para acessar.",
          });
          return;
        }
        // Para show_mentionone_branding, Free = true (não bloqueia)
        next();
        return;
      }

      // Verificar se a feature está habilitada
      const featureValue = getFeatureValue(
        planFeaturesResult.features,
        featureName,
        false
      );

      if (!featureValue) {
        response.status(403).json({
          message:
            "Esta funcionalidade requer upgrade do plano. Faça upgrade para acessar.",
        });
        return;
      }

      next();
    } catch (error) {
      response.status(500).json({
        message: "Erro ao verificar permissões do plano",
      });
    }
  };
}

