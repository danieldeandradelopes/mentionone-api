import crypto from "crypto";
import { Request, Response, NextFunction } from "express";

const MercadoPagoWebhookValidate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const signatureHeader = req.headers["x-signature"] as string;
    const requestId = req.headers["x-request-id"] as string;
    const secret = process.env.WEBHOOK_SECRET_MERCADO_PAGO as string; // Obtido em "Suas Integrações" no painel do Mercado Pago

    if (!signatureHeader || !secret) {
      console.error("Webhook inválido: x-signature ou segredo ausente.");
      return res.status(401).json({ error: "Unauthorized" });
    }

    // --- 1️⃣ Extrair ts e hash (v1) do header ---
    // Exemplo: "ts=1704908010,v1=618c85345248dd820d5fd456117c2ab2ef8eda45a0282ff693eac24131a5e839"
    const parts = signatureHeader.split(",");
    let ts: string | null = null;
    let v1: string | null = null;

    for (const part of parts) {
      const [key, value] = part.trim().split("=");
      if (key === "ts") ts = value;
      if (key === "v1") v1 = value;
    }

    if (!ts || !v1) {
      console.error("Header x-signature inválido:", signatureHeader);
      return res.status(401).json({ error: "Invalid signature" });
    }

    // --- 2️⃣ Extrair ID do evento dos query params ---
    // Exemplo: https://meusite.com/webhook?data.id=12345&type=payment
    const dataId = (req.query["data.id"] as string) || "";
    const lowerId = /^[a-zA-Z0-9]+$/.test(dataId)
      ? dataId.toLowerCase()
      : dataId;

    // --- 3️⃣ Montar a string do template ---
    // id:[data.id_url];request-id:[x-request-id_header];ts:[ts_header];
    const template = `id:${lowerId};request-id:${requestId};ts:${ts};`;

    // --- 4️⃣ Gerar HMAC usando o segredo ---
    const generatedHash = crypto
      .createHmac("sha256", secret)
      .update(template)
      .digest("hex");

    // --- 5️⃣ Comparar com o hash recebido ---
    if (generatedHash !== v1) {
      console.error(
        "Assinatura inválida! Esperado:",
        generatedHash,
        "Recebido:",
        v1
      );
      return res.status(401).json({ error: "Signature mismatch" });
    }

    // --- 6️⃣ (Opcional) Validar timestamp ---
    const now = Math.floor(Date.now() / 1000);
    const tolerance = 5 * 60; // 5 minutos
    // if (Math.abs(now - parseInt(ts)) > tolerance) {
    //   console.warn("Timestamp fora do limite de tolerância.");
    //   return res.status(401).json({ error: "Stale signature" });
    // }

    // ✅ Assinatura válida
    next();
  } catch (err) {
    console.error("Erro ao validar webhook do Mercado Pago:", err);
    return res.status(401).json({ error: "Unauthorized" });
  }
};

export default MercadoPagoWebhookValidate;
