import { NextFunction, Request, Response } from "express";
import EnterpriseController from "../controllers/EnterpriseController";
import { container, Registry } from "../infra/ContainerRegistry";

const EnterpriseGetInfoWithSuperAdmin = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const subdomain =
      process.env.NODE_ENV === "production"
        ? request.headers.origin?.split(".")[0].split("//")[1]
        : request.body.domain;

    if (!subdomain)
      return response.status(401).json({ message: "Unauthorized!" });

    const EnterpriseController = container.get<EnterpriseController>(
      Registry.EnterpriseController
    );
    const Enterprise = await EnterpriseController.getBySubdomain(subdomain);

    if (!Enterprise)
      return response.status(401).json({ message: "Unauthorized!" });

    request.enterprise_id = Enterprise.id;

    return next();
  } catch (error) {
    return response.status(401).json({ message: "Unauthorized!" });
  }
};

export default EnterpriseGetInfoWithSuperAdmin;
