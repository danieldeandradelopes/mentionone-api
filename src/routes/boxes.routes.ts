import { NextFunction, Request, Response, Router } from "express";
import { container, Registry } from "../infra/ContainerRegistry";
import EnterpriseGetInfo from "../middleware/EnterpriseGetInfo";
import Authenticate from "../middleware/Authenticate";
import { BoxesStoreData, BoxesUpdateData } from "../entities/Boxes";
import BoxesController from "../controllers/BoxesController";
import BoxBrandingController from "../controllers/BoxBrandingController";
import { BoxBrandingProps } from "../entities/BoxBranding";

const boxesRoutes = Router();

// Lista todas as boxes de uma empresa
boxesRoutes.get(
  "/boxes",
  Authenticate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const controller = container.get<BoxesController>(
        Registry.BoxesController
      );
      const boxes = await controller.list(request.enterprise_id);
      return response.json(boxes);
    } catch (error) {
      next(error);
    }
  }
);

// Obter uma box por ID
boxesRoutes.get(
  "/boxes/:id",
  Authenticate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const controller = container.get<BoxesController>(
        Registry.BoxesController
      );
      const box = await controller.get(Number(request.params.id));
      return response.json(box);
    } catch (error) {
      next(error);
    }
  }
);

// Criar uma nova box
boxesRoutes.post(
  "/boxes",
  Authenticate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const controller = container.get<BoxesController>(
        Registry.BoxesController
      );
      const { name, location } = request.body;
      const input: BoxesStoreData = {
        name,
        location,
        enterprise_id: request.enterprise_id,
      };
      const box = await controller.store(input);
      return response.status(201).json(box);
    } catch (error) {
      next(error);
    }
  }
);

// Atualizar box
boxesRoutes.put(
  "/boxes/:id",
  Authenticate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const controller = container.get<BoxesController>(
        Registry.BoxesController
      );
      const input: BoxesUpdateData = {
        ...request.body,
        id: Number(request.params.id),
      };
      const box = await controller.update(input);
      return response.json(box);
    } catch (error) {
      next(error);
    }
  }
);

// Deletar box
boxesRoutes.delete(
  "/boxes/:id",
  Authenticate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const controller = container.get<BoxesController>(
        Registry.BoxesController
      );
      const ok = await controller.destroy(Number(request.params.id));
      return response.json({ success: ok });
    } catch (error) {
      next(error);
    }
  }
);

// Buscar branding da box
boxesRoutes.get(
  "/boxes/:id/branding",
  Authenticate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const controller = container.get<BoxBrandingController>(
        Registry.BoxBrandingController
      );
      const branding = await controller.getByBoxId(Number(request.params.id));
      return response.json(branding);
    } catch (error) {
      next(error);
    }
  }
);

// Atualizar (ou criar) branding da box
boxesRoutes.put(
  "/boxes/:id/branding",
  Authenticate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const controller = container.get<BoxBrandingController>(
        Registry.BoxBrandingController
      );
      const box_id = Number(request.params.id);
      // para update, espera que branding já exista; senão, cria
      let branding = await controller.getByBoxId(box_id);
      const data = request.body as Partial<
        Omit<BoxBrandingProps, "id" | "box_id">
      >;
      if (branding) {
        branding = await controller.update(box_id, data);
      } else {
        branding = await controller.create({
          box_id,
          primary_color: data.primary_color!,
          secondary_color: data.secondary_color!,
          logo_url: data.logo_url,
          client_name: data.client_name,
        });
      }
      return response.json(branding);
    } catch (error) {
      next(error);
    }
  }
);

export { boxesRoutes };
