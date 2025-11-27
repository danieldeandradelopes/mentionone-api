import { NextFunction, Request, Response, Router } from "express";
import { Registry, container } from "../infra/ContainerRegistry";
import AdminValidate from "../middleware/AdminValidate";
import Authenticate from "../middleware/Authenticate";
import EnterpriseGetInfo from "../middleware/EnterpriseGetInfo";
import BoxBrandingController from "../controllers/BoxBrandingController";
import BoxesController from "../controllers/BoxesController";

const boxesBrandingRoutes = Router();

// Criar/atualizar branding da box
boxesBrandingRoutes.post(
  "/boxes/:id/branding",
  Authenticate,
  AdminValidate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const controller = container.get<BoxBrandingController>(
        Registry.BoxBrandingController
      );
      const box_id = Number(request.params.id);
      const { primary_color, secondary_color, logo_url, client_name } =
        request.body;
      let branding = await controller.getByBoxId(box_id);
      if (branding) {
        branding = await controller.update(box_id, {
          primary_color,
          secondary_color,
          logo_url,
          client_name,
        });
      } else {
        branding = await controller.create({
          box_id,
          primary_color,
          secondary_color,
          logo_url,
          client_name,
        });
      }
      return response.status(201).json(branding);
    } catch (error) {
      next(error);
    }
  }
);

// Obter branding da box
boxesBrandingRoutes.get(
  "/boxes/:id/branding",
  Authenticate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const controller = container.get<BoxBrandingController>(
        Registry.BoxBrandingController
      );
      const box_id = Number(request.params.id);
      const branding = await controller.getByBoxId(box_id);
      return response.json(branding);
    } catch (error) {
      next(error);
    }
  }
);

// Obter branding da box por SLUG (público, sem autenticação)
boxesBrandingRoutes.get(
  "/boxes/slug/:slug/branding",
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    console.log("request.params.slug", request.params.slug);
    try {
      const boxesController = container.get<BoxesController>(
        Registry.BoxesController
      );
      const brandingController = container.get<BoxBrandingController>(
        Registry.BoxBrandingController
      );
      // Busca a box pelo slug para pegar o ID (gateway lança erro se não encontrar)
      const box = await boxesController.getBySlug(request.params.slug);
      // Busca o branding pelo box_id (gateway lança erro se não encontrar)
      const branding = await brandingController.getByBoxId(box.id);
      return response.json(branding);
    } catch (error) {
      next(error);
    }
  }
);

export { boxesBrandingRoutes };
