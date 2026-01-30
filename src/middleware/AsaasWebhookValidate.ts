import { Request, Response, NextFunction } from "express";

const AsaasWebhookValidate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const expectedToken = process.env.ASAAS_WEBHOOK_TOKEN;
    const receivedToken = req.headers["asaas-access-token"] as string;

    if (!expectedToken || !receivedToken || receivedToken !== expectedToken) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

export default AsaasWebhookValidate;
