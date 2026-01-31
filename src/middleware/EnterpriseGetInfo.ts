import { NextFunction, Request, Response } from "express";
import EnterpriseController from "../controllers/EnterpriseController";
import { container, Registry } from "../infra/ContainerRegistry";
import { subdomainSkip } from "../config/subdomain.skip";

const getSubdomain = (origin?: string) => {
  if (!origin) return null;

  const hostname = new URL(origin).hostname;

  const parts = hostname.split(".");

  if (parts.length < 3) return null;

  return parts[0];
};

const EnterpriseGetInfo = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const subdomain =
      process.env.NODE_ENV === "production"
        ? getSubdomain(request.headers.origin)
        : process.env.ENTERPRISE_SUBDOMAIN;

    console.log(subdomain);

    // Se o subdomain estiver na lista de skip (ex: "admin"), permite continuar sem enterprise_id
    // Isso permite login de superadmin
    if (subdomainSkip.includes(subdomain ?? "")) {
      return next();
    }

    // Em desenvolvimento, se não houver subdomain configurado, permite continuar
    // O controller vai verificar se é superadmin ou não
    if (!subdomain && process.env.NODE_ENV !== "production") {
      return next();
    }

    // Se não houver subdomain em produção, retorna erro
    if (!subdomain) {
      return response.status(401).json({ message: "Unauthorized!" });
    }

    const EnterpriseController = container.get<EnterpriseController>(
      Registry.EnterpriseController
    );
    const enterprise = await EnterpriseController.getBySubdomain(subdomain);

    if (!enterprise)
      return response.status(401).json({ message: "Unauthorized!" });

    request.enterprise_id = enterprise.id;

    return next();
  } catch (error) {
    return response.status(401).json({ message: "Unauthorized!" });
  }
};

export default EnterpriseGetInfo;
