import { NextFunction, Request, Response, Router } from "express";
import BranchController from "../controllers/BranchController";
import { container, Registry } from "../infra/ContainerRegistry";
import Authenticate from "../middleware/Authenticate";
import EnterpriseGetInfo from "../middleware/EnterpriseGetInfo";
import AdminValidate from "../middleware/AdminValidate";

const branchesRoutes = Router();

branchesRoutes.get(
  "/branches",
  Authenticate,
  AdminValidate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const controller = container.get<BranchController>(
        Registry.BranchController
      );
      const branches = await controller.list(request.enterprise_id!);
      return response.json(branches);
    } catch (error) {
      next(error);
    }
  }
);

branchesRoutes.get(
  "/branches/:id",
  Authenticate,
  AdminValidate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const controller = container.get<BranchController>(
        Registry.BranchController
      );
      const id = Number(request.params.id);
      const branch = await controller.get(id, request.enterprise_id!);
      if (!branch) {
        return response.status(404).json({ message: "Filial não encontrada." });
      }
      return response.json(branch);
    } catch (error) {
      next(error);
    }
  }
);

branchesRoutes.post(
  "/branches",
  Authenticate,
  AdminValidate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const controller = container.get<BranchController>(
        Registry.BranchController
      );
      const { name, slug, address } = request.body;
      if (!name || typeof name !== "string" || !name.trim()) {
        return response
          .status(400)
          .json({ message: "Nome da filial é obrigatório." });
      }
      const branch = await controller.store(request.enterprise_id!, {
        name: name.trim(),
        slug: slug?.trim() || undefined,
        address: address ?? null,
      });
      return response.status(201).json(branch);
    } catch (error) {
      next(error);
    }
  }
);

branchesRoutes.put(
  "/branches/:id",
  Authenticate,
  AdminValidate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const controller = container.get<BranchController>(
        Registry.BranchController
      );
      const id = Number(request.params.id);
      const { name, slug, address } = request.body;
      const branch = await controller.update(request.enterprise_id!, {
        id,
        name: name?.trim(),
        slug: slug?.trim(),
        address: address !== undefined ? address : undefined,
      });
      if (!branch) {
        return response.status(404).json({ message: "Filial não encontrada." });
      }
      return response.json(branch);
    } catch (error) {
      next(error);
    }
  }
);

branchesRoutes.delete(
  "/branches/:id",
  Authenticate,
  AdminValidate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const controller = container.get<BranchController>(
        Registry.BranchController
      );
      const id = Number(request.params.id);
      const deleted = await controller.destroy(id, request.enterprise_id!);
      if (!deleted) {
        return response.status(404).json({ message: "Filial não encontrada." });
      }
      return response.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export { branchesRoutes };
