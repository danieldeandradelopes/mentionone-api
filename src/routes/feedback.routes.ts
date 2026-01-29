import { NextFunction, Request, Response, Router } from "express";
import FeedbackController from "../controllers/FeedbackController";
import { FeedbackUpdateData } from "../entities/Feedback";
import { container, Registry } from "../infra/ContainerRegistry";
import Authenticate from "../middleware/Authenticate";
import EnterpriseGetInfo from "../middleware/EnterpriseGetInfo";
import { CheckPlanFeature } from "../middleware/CheckPlanFeature";

const feedbackRoutes = Router();

// Lista todos os feedbacks da empresa
feedbackRoutes.get(
  "/feedbacks",
  Authenticate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const controller = container.get<FeedbackController>(
        Registry.FeedbackController,
      );
      const result = await controller.list(request.enterprise_id);
      // Se retornou array, é plano sem limite. Se retornou objeto, tem paginação
      return response.json(result);
    } catch (error) {
      next(error);
    }
  },
);

// Lista feedbacks de uma box específica
feedbackRoutes.get(
  "/feedbacks/box/:box_id",
  Authenticate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const controller = container.get<FeedbackController>(
        Registry.FeedbackController,
      );
      const feedbacks = await controller.listByBox(
        Number(request.params.box_id),
      );
      return response.json(feedbacks);
    } catch (error) {
      next(error);
    }
  },
);

// Obter feedbacks com filtros
feedbackRoutes.get(
  "/feedbacks/filtered",
  Authenticate,
  EnterpriseGetInfo,
  CheckPlanFeature("can_filter_feedbacks"),
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const controller = container.get<FeedbackController>(
        Registry.FeedbackController,
      );
      const filters = {
        boxId: request.query.boxId ? Number(request.query.boxId) : undefined,
        category: request.query.category as string | undefined,
        startDate: request.query.startDate as string | undefined,
        endDate: request.query.endDate as string | undefined,
      };
      const feedbacks = await controller.listWithFilters(
        request.enterprise_id,
        filters,
      );
      return response.json(feedbacks);
    } catch (error) {
      next(error);
    }
  },
);

// Obter relatório de feedbacks
feedbackRoutes.get(
  "/feedbacks/report",
  Authenticate,
  EnterpriseGetInfo,
  CheckPlanFeature("can_access_reports"),
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const controller = container.get<FeedbackController>(
        Registry.FeedbackController,
      );
      const filters = {
        boxId: request.query.boxId ? Number(request.query.boxId) : undefined,
        category: request.query.category as string | undefined,
        startDate: request.query.startDate as string | undefined,
        endDate: request.query.endDate as string | undefined,
      };
      const report = await controller.getReport(request.enterprise_id, filters);
      return response.json(report);
    } catch (error) {
      next(error);
    }
  },
);

// Obter feedback por ID com informações relacionadas
feedbackRoutes.get(
  "/feedbacks/:id",
  Authenticate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const controller = container.get<FeedbackController>(
        Registry.FeedbackController,
      );
      const feedback = await controller.getWithDetails(
        Number(request.params.id),
        request.enterprise_id!,
      );
      if (!feedback) {
        return response.status(404).json({
          message: "Feedback não encontrado.",
        });
      }
      return response.json(feedback);
    } catch (error) {
      next(error);
    }
  },
);

// Atualizar feedback
feedbackRoutes.put(
  "/feedbacks/:id",
  Authenticate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const controller = container.get<FeedbackController>(
        Registry.FeedbackController,
      );
      const input: FeedbackUpdateData = {
        ...request.body,
        id: Number(request.params.id),
      };
      const feedback = await controller.update(input);
      return response.json(feedback);
    } catch (error) {
      next(error);
    }
  },
);

// Deletar feedback
feedbackRoutes.delete(
  "/feedbacks/:id",
  Authenticate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const controller = container.get<FeedbackController>(
        Registry.FeedbackController,
      );
      const ok = await controller.destroy(Number(request.params.id));
      return response.json({ success: ok });
    } catch (error) {
      next(error);
    }
  },
);

export { feedbackRoutes };
