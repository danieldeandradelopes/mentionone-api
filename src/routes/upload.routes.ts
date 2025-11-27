import { NextFunction, Request, Response, Router } from "express";
import FileController from "../controllers/FileController";
import { Registry, container } from "../infra/ContainerRegistry";
import Authenticate from "../middleware/Authenticate";
import upload from "../utils/multer";
import { v4 as uuidv4 } from "uuid";

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

      if (!request.file) {
        return response.status(400).json({ error: "Arquivo não enviado" });
      }

      const ext = request.file.originalname.split(".").pop();
      const filename = `${uuidv4()}.${ext}`;

      const file = await fileController.upload({
        name: filename,
        buffer: request.file.buffer, // ← aqui vai o conteúdo do arquivo!
        mimetype: request.file.mimetype,
      });

      return response.status(201).json(file);
    } catch (error) {
      next(error);
    }
  }
);

export default uploadRoutes;
