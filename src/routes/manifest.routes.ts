import { NextFunction, Request, Response, Router } from "express";
import ManifestController from "../controllers/ManifestController";
import { Registry, container } from "../infra/ContainerRegistry";
import EnterpriseGetInfo from "../middleware/EnterpriseGetInfo";

const manifestRoutes = Router();

/**
 * @openapi
 * /manifest:
 *   get:
 *     summary: Obtém o manifest atual do place
 *     tags:
 *       - Manifest
 *     parameters: []
 *     responses:
 *       201:
 *         description: Manifest retornado com sucesso
 */
manifestRoutes.get(
  "/manifest",
  EnterpriseGetInfo,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const manifestController = container.get<ManifestController>(
        Registry.ManifestController
      );

      const manifest = await manifestController.get(request.enterprise_Id);

      const manifestData = {
        name: manifest.name,
        short_name: manifest.short_name || manifest.name,
        start_url: "/",
        display: "standalone",
        background_color: manifest.background_color || "#ffffff",
        theme_color: manifest.theme_color || "#000000",
        icons: [
          {
            src: manifest.icons ? manifest.icons[0].src : "/icon.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: manifest.icons ? manifest.icons[1].src : "/icon.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      };

      return response.status(201).json(manifestData);
    } catch (error) {
      next(error);
    }
  }
);

export { manifestRoutes };
