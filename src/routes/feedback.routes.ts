import { NextFunction, Request, Response, Router } from "express";
import { container, Registry } from "../infra/ContainerRegistry";
import EnterpriseGetInfo from "../middleware/EnterpriseGetInfo";
import Authenticate from "../middleware/Authenticate";
import {
  FeedbackStoreData,
  FeedbackStoreDataWithSlug,
  FeedbackUpdateData,
} from "../entities/Feedback";
import FeedbackController from "../controllers/FeedbackController";
import rateLimit from "express-rate-limit";

const feedbackRoutes = Router();

const feedbackPostLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 5, // 5 feedbacks por IP por janela
  message: {
    error:
      "Você está enviando feedbacks rápido demais. Tente novamente em alguns minutos.",
  },
});

// Lista todos os feedbacks da empresa
feedbackRoutes.get(
  "/feedbacks",
  Authenticate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const controller = container.get<FeedbackController>(
        Registry.FeedbackController
      );
      const feedbacks = await controller.list(request.enterprise_id);
      return response.json(feedbacks);
    } catch (error) {
      next(error);
    }
  }
);

// Lista feedbacks de uma box específica
feedbackRoutes.get(
  "/feedbacks/box/:box_id",
  Authenticate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const controller = container.get<FeedbackController>(
        Registry.FeedbackController
      );
      const feedbacks = await controller.listByBox(
        Number(request.params.box_id)
      );
      return response.json(feedbacks);
    } catch (error) {
      next(error);
    }
  }
);

// Obter feedback por ID
feedbackRoutes.get(
  "/feedbacks/:id",
  Authenticate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const controller = container.get<FeedbackController>(
        Registry.FeedbackController
      );
      const feedback = await controller.get(Number(request.params.id));
      return response.json(feedback);
    } catch (error) {
      next(error);
    }
  }
);

// Criar novo feedback (não autenticado, com rate limit)
feedbackRoutes.post(
  "/feedbacks",
  feedbackPostLimiter,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const controller = container.get<FeedbackController>(
        Registry.FeedbackController
      );
      // Aceita box_slug ao invés de box_id - backend resolve internamente
      const payload: FeedbackStoreDataWithSlug = {
        box_slug: request.body.box_slug || request.body.boxId, // aceita ambos para compatibilidade
        text: request.body.text,
        category: request.body.category,
        status: request.body.status,
        response: request.body.response,
        rating: request.body.rating,
        attachments: request.body.attachments,
      };
      const feedback = await controller.storeWithSlug(
        payload,
        request.enterprise_id!
      );
      return response.status(201).json(feedback);
    } catch (error) {
      next(error);
    }
  }
);

// Atualizar feedback
feedbackRoutes.put(
  "/feedbacks/:id",
  Authenticate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const controller = container.get<FeedbackController>(
        Registry.FeedbackController
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
  }
);

// Deletar feedback
feedbackRoutes.delete(
  "/feedbacks/:id",
  Authenticate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const controller = container.get<FeedbackController>(
        Registry.FeedbackController
      );
      const ok = await controller.destroy(Number(request.params.id));
      return response.json({ success: ok });
    } catch (error) {
      next(error);
    }
  }
);

export { feedbackRoutes };
