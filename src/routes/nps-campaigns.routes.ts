import { NextFunction, Request, Response, Router } from "express";
import NPSCampaignController from "../controllers/NPSCampaignController";
import { container, Registry } from "../infra/ContainerRegistry";
import Authenticate from "../middleware/Authenticate";
import EnterpriseGetInfo from "../middleware/EnterpriseGetInfo";
import AdminValidate from "../middleware/AdminValidate";

const npsCampaignsRoutes = Router();

npsCampaignsRoutes.get(
  "/nps-campaigns",
  Authenticate,
  AdminValidate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const controller = container.get<NPSCampaignController>(
        Registry.NPSCampaignController
      );
      const list = await controller.list(request.enterprise_id!);
      return response.json(list);
    } catch (error) {
      next(error);
    }
  }
);

npsCampaignsRoutes.get(
  "/nps-campaigns/:id",
  Authenticate,
  AdminValidate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const controller = container.get<NPSCampaignController>(
        Registry.NPSCampaignController
      );
      const id = Number(request.params.id);
      const campaign = await controller.getWithQuestions(
        id,
        request.enterprise_id!
      );
      if (!campaign) {
        return response.status(404).json({ message: "Campaign not found." });
      }
      return response.json(campaign);
    } catch (error) {
      next(error);
    }
  }
);

npsCampaignsRoutes.post(
  "/nps-campaigns",
  Authenticate,
  AdminValidate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const controller = container.get<NPSCampaignController>(
        Registry.NPSCampaignController
      );
      const { name, slug, active, questions } = request.body;
      if (!name || typeof name !== "string" || !name.trim()) {
        return response
          .status(400)
          .json({ message: "Campaign name is required." });
      }
      const campaign = await controller.store(request.enterprise_id!, {
        name: name.trim(),
        slug: slug?.trim(),
        active: active,
        questions: Array.isArray(questions) ? questions : undefined,
      });
      const withQuestions = await controller.getWithQuestions(
        campaign.id,
        request.enterprise_id!
      );
      return response.status(201).json(withQuestions ?? campaign);
    } catch (error) {
      next(error);
    }
  }
);

npsCampaignsRoutes.put(
  "/nps-campaigns/:id",
  Authenticate,
  AdminValidate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const controller = container.get<NPSCampaignController>(
        Registry.NPSCampaignController
      );
      const id = Number(request.params.id);
      const { name, slug, active, questions } = request.body;
      const campaign = await controller.update(
        request.enterprise_id!,
        id,
        {
          name: name?.trim(),
          slug: slug?.trim(),
          active: active,
          questions: Array.isArray(questions) ? questions : undefined,
        }
      );
      if (!campaign) {
        return response.status(404).json({ message: "Campaign not found." });
      }
      const withQuestions = await controller.getWithQuestions(
        campaign.id,
        request.enterprise_id!
      );
      return response.json(withQuestions ?? campaign);
    } catch (error) {
      next(error);
    }
  }
);

npsCampaignsRoutes.delete(
  "/nps-campaigns/:id",
  Authenticate,
  AdminValidate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const controller = container.get<NPSCampaignController>(
        Registry.NPSCampaignController
      );
      const id = Number(request.params.id);
      const deleted = await controller.destroy(id, request.enterprise_id!);
      if (!deleted) {
        return response.status(404).json({ message: "Campaign not found." });
      }
      return response.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export { npsCampaignsRoutes };
