import { NextFunction, Request, Response, Router } from "express";
import InsightsController from "../controllers/InsightsController";
import { container, Registry } from "../infra/ContainerRegistry";
import Authenticate from "../middleware/Authenticate";
import EnterpriseGetInfo from "../middleware/EnterpriseGetInfo";
import AdminValidate from "../middleware/AdminValidate";

const insightsRoutes = Router();

insightsRoutes.get(
  "/insights/ai",
  Authenticate,
  AdminValidate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const controller = container.get<InsightsController>(
        Registry.InsightsController,
      );
      const latest = await controller.getLatest(request.enterprise_id!);
      if (!latest) {
        return response.status(404).json({ message: "No insights run found." });
      }
      return response.json(latest);
    } catch (error) {
      next(error);
    }
  },
);

insightsRoutes.get(
  "/insights/history",
  Authenticate,
  AdminValidate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const controller = container.get<InsightsController>(
        Registry.InsightsController,
      );
      const limit =
        request.query.limit != null
          ? Math.min(Number(request.query.limit) || 50, 100)
          : 50;
      const list = await controller.getHistory(request.enterprise_id!, limit);
      return response.json(list);
    } catch (error) {
      next(error);
    }
  },
);

insightsRoutes.get(
  "/insights/:id",
  Authenticate,
  AdminValidate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const controller = container.get<InsightsController>(
        Registry.InsightsController,
      );
      const id = Number(request.params.id);
      const run = await controller.getById(id, request.enterprise_id!);
      if (!run) {
        return response
          .status(404)
          .json({ message: "Insights run not found." });
      }
      return response.json(run);
    } catch (error) {
      next(error);
    }
  },
);

insightsRoutes.post(
  "/insights/ai",
  Authenticate,
  AdminValidate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const controller = container.get<InsightsController>(
        Registry.InsightsController,
      );
      const maxTokens =
        request.body?.maxTokens != null ? request.body.maxTokens : undefined;
      const result = await controller.generate(
        request.enterprise_id!,
        maxTokens,
      );
      return response.status(201).json(result);
    } catch (error: unknown) {
      const err = error as Error & { status?: number };
      const isRateLimit =
        err?.status === 429 ||
        err?.message?.includes("Limite de uso da IA") ||
        err?.message?.includes("429") ||
        err?.message?.toLowerCase().includes("quota");
      if (isRateLimit) {
        return response.status(429).json({
          message:
            err?.message ||
            "Limite de uso da IA atingido. Tente novamente mais tarde ou verifique seu plano em Google AI Studio.",
        });
      }
      next(error);
    }
  },
);

export { insightsRoutes };
