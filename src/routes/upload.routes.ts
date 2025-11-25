import { NextFunction, Request, Response, Router } from "express";
import FileController from "../controllers/FileController";
import { Registry, container } from "../infra/ContainerRegistry";
import Authenticate from "../middleware/Authenticate";
import upload from "../utils/multer";

const uploadRoutes = Router();

/**
 * @openapi
 * /upload:
 *   post:
 *     summary: Upload de arquivos
 *     tags:
 *       - Arquivos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Arquivo enviado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 path:
 *                   type: string
 *       400:
 *         description: Requisição inválida
 *       401:
 *         description: Não autorizado (token inválido ou ausente)
 */
uploadRoutes.post(
  "/upload",
  upload.single("file"),
  Authenticate,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const fileController = container.get<FileController>(
        Registry.FileController
      );

      const file = await fileController.upload({
        name: request.file?.filename!,
        path: request.file?.path!,
      });

      return response.status(201).json(file);
    } catch (error) {
      next(error);
    }
  }
);

export default uploadRoutes;
