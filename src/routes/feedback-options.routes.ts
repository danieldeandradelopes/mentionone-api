import { NextFunction, Request, Response, Router } from "express";
import { container, Registry } from "../infra/ContainerRegistry";
import EnterpriseGetInfo from "../middleware/EnterpriseGetInfo";
import Authenticate from "../middleware/Authenticate";
import AdminValidate from "../middleware/AdminValidate";
import FeedbackOptionController from "../controllers/FeedbackOptionController";
import BoxesController from "../controllers/BoxesController";
import FeedbackOption, {
  FeedbackOptionProps,
} from "../entities/FeedbackOption";

const feedbackOptionsRoutes = Router();

// Lista todas as opções de feedback da empresa
feedbackOptionsRoutes.get(
  "/feedback-options",
  Authenticate,
  AdminValidate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const controller = container.get<FeedbackOptionController>(
        Registry.FeedbackOptionController
      );
      const options = await controller.list(request.enterprise_id!);
      return response.json(options);
    } catch (error) {
      next(error);
    }
  }
);

// Obter uma opção de feedback por ID
feedbackOptionsRoutes.get(
  "/feedback-options/:id",
  Authenticate,
  AdminValidate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const controller = container.get<FeedbackOptionController>(
        Registry.FeedbackOptionController
      );
      const option = await controller.get(Number(request.params.id));
      if (!option) {
        return response
          .status(404)
          .json({ message: "Opção de feedback não encontrada." });
      }
      return response.json(option);
    } catch (error) {
      next(error);
    }
  }
);

// Obter uma opção de feedback por slug
feedbackOptionsRoutes.get(
  "/feedback-options/slug/:slug",
  Authenticate,
  AdminValidate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const controller = container.get<FeedbackOptionController>(
        Registry.FeedbackOptionController
      );
      const option = await controller.getBySlug(
        request.enterprise_id!,
        request.params.slug
      );
      if (!option) {
        return response
          .status(404)
          .json({ message: "Opção de feedback não encontrada." });
      }
      return response.json(option);
    } catch (error) {
      next(error);
    }
  }
);

// Criar uma nova opção de feedback
feedbackOptionsRoutes.post(
  "/feedback-options",
  Authenticate,
  AdminValidate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const controller = container.get<FeedbackOptionController>(
        Registry.FeedbackOptionController
      );
      const { name, type, box_id } = request.body;

      if (!name || !type) {
        return response.status(400).json({
          message: "Name e type são obrigatórios.",
        });
      }

      if (!["criticism", "suggestion", "praise"].includes(type)) {
        return response.status(400).json({
          message: "Type deve ser: criticism, suggestion ou praise.",
        });
      }

      // Gera slug a partir do name
      const slug = name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const option = await controller.store({
        enterprise_id: request.enterprise_id!,
        box_id: box_id || null,
        slug,
        name,
        type,
      });

      return response.status(201).json(option);
    } catch (error) {
      next(error);
    }
  }
);

// Atualizar uma opção de feedback
feedbackOptionsRoutes.put(
  "/feedback-options/:id",
  Authenticate,
  AdminValidate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const controller = container.get<FeedbackOptionController>(
        Registry.FeedbackOptionController
      );
      const { name, type, box_id } = request.body;

      if (type && !["criticism", "suggestion", "praise"].includes(type)) {
        return response.status(400).json({
          message: "Type deve ser: criticism, suggestion ou praise.",
        });
      }

      let updateData: any = {
        type,
        box_id: box_id !== undefined ? box_id : undefined,
      };

      // Se name foi fornecido, gera novo slug
      if (name) {
        const slug = name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        updateData.slug = slug;
        updateData.name = name;
      }

      const option = await controller.update(
        Number(request.params.id),
        updateData
      );

      if (!option) {
        return response
          .status(404)
          .json({ message: "Opção de feedback não encontrada." });
      }

      return response.json(option);
    } catch (error) {
      next(error);
    }
  }
);

// Deletar uma opção de feedback
feedbackOptionsRoutes.delete(
  "/feedback-options/:id",
  Authenticate,
  AdminValidate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const controller = container.get<FeedbackOptionController>(
        Registry.FeedbackOptionController
      );
      const deleted = await controller.destroy(Number(request.params.id));
      if (!deleted) {
        return response
          .status(404)
          .json({ message: "Opção de feedback não encontrada." });
      }
      return response.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export { feedbackOptionsRoutes };
