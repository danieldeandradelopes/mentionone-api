import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 50,
  message: "Você excedeu o limite de 30 requisições por minuto.",
  headers: true,
});
