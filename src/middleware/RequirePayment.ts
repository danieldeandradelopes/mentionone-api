import { NextFunction, Request, Response } from "express";
import EnterpriseController from "../controllers/EnterpriseController";
import SubscriptionController from "../controllers/SubscriptionController";
import { container, Registry } from "../infra/ContainerRegistry";
import JsonWebTokenAdapter from "../infra/JwtAssign/JsonWebTokenAdapter";

export async function RequirePayment(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return response.status(401).json({ message: "Unset token!" });
    }

    const jsonWebTokenAdapter = new JsonWebTokenAdapter();

    const [, token] = authHeader.split(" ");

    const result = jsonWebTokenAdapter.decrypt(token);

    if (result.access_level === "superadmin") {
      return next();
    }

    const subdomain =
      process.env.NODE_ENV === "production"
        ? request.headers.origin?.split(".")[0].split("//")[1]
        : process.env.ENTERPRISE_SUBDOMAIN;

    if (!subdomain)
      return response.status(401).json({ message: "Unauthorized!" });

    if (subdomain === "backoffice") {
      return next();
    }

    const subscriptionController = container.get<SubscriptionController>(
      Registry.SubscriptionController,
    );
    const EnterpriseController = container.get<EnterpriseController>(
      Registry.EnterpriseController,
    );

    const Enterprise = await EnterpriseController.getBySubdomain(subdomain);

    const subscription = await subscriptionController.getByEnterpriseId(
      Enterprise.id,
    );

    if (!Enterprise)
      return response.status(401).json({ message: "Unauthorized!" });

    if (subscription && subscription.status !== "active") {
      return response.status(402).json({ message: "Payment required" });
    }

    next();
  } catch (error) {
    return response.status(401).json({ message: "Unauthorized!" });
  }
}
