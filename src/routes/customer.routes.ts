import { NextFunction, Request, Response, Router } from "express";
import rateLimit from "express-rate-limit";
import EnterpriseGetInfo from "../middleware/EnterpriseGetInfo";
import { FeedbackStoreDataWithSlug } from "../entities/Feedback";
import FeedbackController from "../controllers/FeedbackController";
import { container, Registry } from "../infra/ContainerRegistry";

const customerRoutes = Router();

const feedbackPostLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 5, // 5 feedbacks por IP por janela
  message: {
    error:
      "Você está enviando feedbacks rápido demais. Tente novamente em alguns minutos.",
  },
});

// Criar novo feedback (não autenticado, com rate limit)
customerRoutes.post(
  "/customers/feedbacks",
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

export default customerRoutes;
