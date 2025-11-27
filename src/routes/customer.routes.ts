import { NextFunction, Request, Response, Router } from "express";
import rateLimit from "express-rate-limit";
import EnterpriseGetInfo from "../middleware/EnterpriseGetInfo";
import { FeedbackStoreDataWithSlug } from "../entities/Feedback";
import FeedbackController from "../controllers/FeedbackController";
import { container, Registry } from "../infra/ContainerRegistry";
import BoxesController from "../controllers/BoxesController";
import FeedbackOptionController from "../controllers/FeedbackOptionController";

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

// Obter opções de feedback por SLUG da box (público, sem autenticação)
customerRoutes.get(
  "/customers/feedback-options/box/slug/:slug",
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const boxesController = container.get<BoxesController>(
        Registry.BoxesController
      );
      const feedbackOptionController = container.get<FeedbackOptionController>(
        Registry.FeedbackOptionController
      );
      // Busca a box pelo slug para pegar o ID
      const box = await boxesController.getBySlug(request.params.slug);
      // Busca as opções de feedback desta box
      const options = await feedbackOptionController.list(box.enterprise_id);
      // Filtra apenas as opções desta box específica
      const boxOptions = options.filter((option) => option.box_id === box.id);
      return response.json(boxOptions);
    } catch (error) {
      next(error);
    }
  }
);

export default customerRoutes;
