import { NextFunction, Request, Response, Router } from "express";
import { container, Registry } from "../infra/ContainerRegistry";
import EnterpriseController from "../controllers/EnterpriseController";
import UserController from "../controllers/UserController";
import PaymentsController from "../controllers/PaymentsController";
import PlanController from "../controllers/PlanController";
import MailService from "../services/MailService";

const publicRoutes = Router();

const sanitizeSubdomain = (value: string) => {
  const cleaned = value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  if (cleaned) return cleaned;
  return `empresa-${Date.now()}`;
};

publicRoutes.get(
  "/public/plans",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const planController = container.get<PlanController>(
        Registry.PlanController,
      );
      const plans = await planController.list();
      return response.status(200).json(plans);
    } catch (error) {
      next(error);
    }
  },
);

publicRoutes.post(
  "/public/signup-notification",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { email, subdomain, name } = request.body;

      if (!email || !subdomain || !name) {
        return response.status(400).json({
          message: "email, subdomain e name sao obrigatorios",
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return response.status(400).json({ message: "Email invalido" });
      }

      const domain = process.env.FRONTEND_DOMAIN || "mentionone.com";
      const appUrl = `https://${subdomain}.${domain}`;

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #0C2F5C; border-bottom: 2px solid #0C2F5C; padding-bottom: 10px;">
            Sua conta MentionOne esta pronta
          </h2>
          <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0; color: #333; font-size: 16px;">
              Ola!
            </p>
            <p style="margin: 10px 0; color: #666; line-height: 1.6;">
              A empresa <strong style="color: #333;">${name}</strong> foi configurada com sucesso e ja esta disponivel.
            </p>
            <p style="margin: 20px 0; text-align: center;">
              <a href="${appUrl}" style="background-color: #0C2F5C; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
                Acessar painel
              </a>
            </p>
            <p style="margin: 10px 0; color: #666; line-height: 1.6;">
              Ou copie e cole este link no seu navegador:
            </p>
            <p style="margin: 10px 0; color: #0C2F5C; word-break: break-all;">
              ${appUrl}
            </p>
          </div>
          <div style="background-color: #fff; border-left: 4px solid #0C2F5C; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 5px 0; color: #333; font-weight: bold;">
              Informacoes de acesso:
            </p>
            <p style="margin: 5px 0; color: #666;">
              <strong>E-mail:</strong> ${email}
            </p>
            <p style="margin: 5px 0; color: #666;">
              <strong>URL da sua empresa:</strong> ${appUrl}
            </p>
          </div>
        </div>
      `;

      const mailService = new MailService();
      await mailService.sendMail({
        to: email,
        subject: `Sua conta MentionOne esta pronta - ${name}`,
        html,
      });

      return response.status(200).json({ message: "E-mail enviado com sucesso" });
    } catch (error) {
      next(error);
    }
  },
);

publicRoutes.post(
  "/public/signup-free",
  async (request: Request, response: Response, next: NextFunction) => {
    const knexConfig = container.get<any>(Registry.KnexConfig);
    const trx = await knexConfig.transaction();

    try {
      const enterpriseController = container.get<EnterpriseController>(
        Registry.EnterpriseController,
      );
      const userController = container.get<UserController>(
        Registry.UserController,
      );

      const {
        companyName,
        subdomain,
        name,
        email,
        phone,
        password,
        document,
        document_type,
      } = request.body;

      if (!companyName || !name || !email || !password) {
        throw new Error("Missing required fields");
      }

      const enterprise = await enterpriseController.storeWithDefaultTemplate({
        name: companyName,
        address: "",
        phone: phone || "",
        description: "",
        subdomain: subdomain
          ? sanitizeSubdomain(subdomain)
          : sanitizeSubdomain(companyName),
        email,
        document,
        document_type,
        timezone: "America/Sao_Paulo",
        trx,
      } as any);

      const auth = await userController.store({
        name,
        email,
        password,
        accessLevel: "admin",
        phone: phone || "",
        enterpriseId: enterprise.enterprise.id,
        trx,
        commitTransaction: true,
      });

      return response.status(201).json(auth);
    } catch (error) {
      if (typeof trx?.isCompleted === "function" && !trx.isCompleted()) {
        await trx.rollback();
      }
      next(error);
    }
  },
);

publicRoutes.post(
  "/public/checkout",
  async (request: Request, response: Response, next: NextFunction) => {
    const knexConfig = container.get<any>(Registry.KnexConfig);
    const trx = await knexConfig.transaction();

    try {
      const enterpriseController = container.get<EnterpriseController>(
        Registry.EnterpriseController,
      );
      const userController = container.get<UserController>(
        Registry.UserController,
      );
      const paymentsController = container.get<PaymentsController>(
        Registry.PaymentsController,
      );

      const {
        companyName,
        subdomain,
        name,
        email,
        phone,
        password,
        document,
        document_type,
        plan_price_id,
        card,
        holder,
      } = request.body;

      if (!companyName || !name || !email || !password || !plan_price_id) {
        throw new Error("Missing required fields");
      }

      const enterprise = await enterpriseController.storeWithDefaultTemplate({
        name: companyName,
        address: holder?.address || "",
        phone: phone || "",
        description: "",
        subdomain: subdomain
          ? sanitizeSubdomain(subdomain)
          : sanitizeSubdomain(companyName),
        email,
        document,
        document_type,
        plan_price_id,
        timezone: "America/Sao_Paulo",
        trx,
      } as any);

      const auth = await userController.store({
        name,
        email,
        password,
        accessLevel: "admin",
        phone: phone || "",
        enterpriseId: enterprise.enterprise.id,
        trx,
        commitTransaction: true,
      });

      const payment = await paymentsController.createTransparentCheckout({
        enterprise_id: enterprise.enterprise.id,
        plan_price_id,
        card,
        holder,
      });

      return response.status(201).json({ auth, payment });
    } catch (error) {
      if (typeof trx?.isCompleted === "function" && !trx.isCompleted()) {
        await trx.rollback();
      }
      next(error);
    }
  },
);

export { publicRoutes };
