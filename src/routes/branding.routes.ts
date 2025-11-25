import { NextFunction, Request, Response, Router } from "express";
import BrandingController from "../controllers/BrandingController";
import { Registry, container } from "../infra/ContainerRegistry";
import AdminValidate from "../middleware/AdminValidate";
import Authenticate from "../middleware/Authenticate";
import EnterpriseGetInfo from "../middleware/EnterpriseGetInfo";

const brandingRoutes = Router();

/**
 * @openapi
 * /branding:
 *   post:
 *     summary: Cria um novo tema de branding para a barbearia
 *     tags:
 *       - Branding
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               primary_color:
 *                 type: string
 *               secondary_color:
 *                 type: string
 *               tertiary_color:
 *                 type: string
 *               quaternary_color:
 *                 type: string
 *               background_color:
 *                 type: string
 *               surface_color:
 *                 type: string
 *               text_primary_color:
 *                 type: string
 *               text_secondary_color:
 *                 type: string
 *               theme:
 *                 type: string
 *                 default: "light"
 *
 *     responses:
 *       201:
 *         description: Branding criado com sucesso
 */
brandingRoutes.post(
  "/branding",
  Authenticate,
  AdminValidate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const brandingController = container.get<BrandingController>(
        Registry.BrandingController
      );

      const {
        name,
        primary_color,
        secondary_color,
        tertiary_color,
        quaternary_color,
        background_color,
        surface_color,
        text_primary_color,
        text_secondary_color,
        border_color,
        error_color,
        success_color,
        btn_primary_bg,
        btn_primary_text,
        btn_secondary_bg,
        btn_secondary_text,
        btn_tertiary_bg,
        btn_tertiary_text,
        btn_quaternary_bg,
        btn_quaternary_text,
        heading_color,
        subheading_color,
        text_default,
        text_muted,
        link_color,
        link_hover_color,
        input_bg,
        input_text,
        input_border,
        input_placeholder,
        input_focus_border,
        app_background,
        card_background,
        card_border,
        card_shadow,
        drawer_bg,
        drawer_text,
        drawer_border,
        drawer_hover_bg,
        drawer_active_bg,
        logo,
        favicon,
        theme,
      } = request.body;

      const branding = await brandingController.store({
        name,
        primary_color,
        secondary_color,
        tertiary_color,
        quaternary_color,
        background_color,
        surface_color,
        text_primary_color,
        text_secondary_color,
        border_color,
        error_color,
        success_color,
        btn_primary_bg,
        btn_primary_text,
        btn_secondary_bg,
        btn_secondary_text,
        btn_tertiary_bg,
        btn_tertiary_text,
        btn_quaternary_bg,
        btn_quaternary_text,
        heading_color,
        subheading_color,
        text_default,
        text_muted,
        link_color,
        link_hover_color,
        input_bg,
        input_text,
        input_border,
        input_placeholder,
        input_focus_border,
        app_background,
        card_background,
        card_border,
        card_shadow,
        drawer_bg,
        drawer_text,
        drawer_border,
        drawer_hover_bg,
        drawer_active_bg,
        logo,
        favicon,
        enterprise_id: request.enterprise_id,
        theme,
      });

      return response.status(201).json(branding);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /branding:
 *   get:
 *     summary: Obtém o branding atual da barbearia
 *     tags:
 *       - Branding
 *     parameters: []
 *     responses:
 *       201:
 *         description: Branding retornado com sucesso
 */
brandingRoutes.get(
  "/branding",
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const brandingController = container.get<BrandingController>(
        Registry.BrandingController
      );

      const branding = await brandingController.get(request.enterprise_id);

      return response.status(201).json(branding);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /branding:
 *   put:
 *     summary: Atualiza o branding da barbearia
 *     tags:
 *       - Branding
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               primary_color:
 *                 type: string
 *               theme:
 *                 type: string
 *     responses:
 *       201:
 *         description: Branding atualizado com sucesso
 */
brandingRoutes.put(
  "/branding",
  Authenticate,
  AdminValidate,
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const brandingController = container.get<BrandingController>(
        Registry.BrandingController
      );

      const {
        name,
        primary_color,
        secondary_color,
        tertiary_color,
        quaternary_color,
        background_color,
        surface_color,
        text_primary_color,
        text_secondary_color,
        border_color,
        error_color,
        success_color,
        btn_primary_bg,
        btn_primary_text,
        btn_secondary_bg,
        btn_secondary_text,
        btn_tertiary_bg,
        btn_tertiary_text,
        btn_quaternary_bg,
        btn_quaternary_text,
        heading_color,
        subheading_color,
        text_default,
        text_muted,
        link_color,
        link_hover_color,
        input_bg,
        input_text,
        input_border,
        input_placeholder,
        input_focus_border,
        app_background,
        card_background,
        card_border,
        card_shadow,
        drawer_bg,
        drawer_text,
        drawer_border,
        drawer_hover_bg,
        drawer_active_bg,
        logo,
        favicon,
        theme,
      } = request.body;

      const branding = await brandingController.update({
        name,
        primary_color,
        secondary_color,
        tertiary_color,
        quaternary_color,
        background_color,
        surface_color,
        text_primary_color,
        text_secondary_color,
        border_color,
        error_color,
        success_color,
        btn_primary_bg,
        btn_primary_text,
        btn_secondary_bg,
        btn_secondary_text,
        btn_tertiary_bg,
        btn_tertiary_text,
        btn_quaternary_bg,
        btn_quaternary_text,
        heading_color,
        subheading_color,
        text_default,
        text_muted,
        link_color,
        link_hover_color,
        input_bg,
        input_text,
        input_border,
        input_placeholder,
        input_focus_border,
        app_background,
        card_background,
        card_border,
        card_shadow,
        drawer_bg,
        drawer_text,
        drawer_border,
        drawer_hover_bg,
        drawer_active_bg,
        logo,
        favicon,
        enterprise_id: request.enterprise_id,
        theme,
      });

      return response.status(201).json(branding);
    } catch (error) {
      next(error);
    }
  }
);

export { brandingRoutes };
