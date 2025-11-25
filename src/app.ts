import Sentry from "@sentry/node";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { RequestHandler } from "express";
import "./instrument";
import { errorHandler } from "./middleware/error";
import { SentryMiddleware } from "./middleware/Sentry";
import routes from "./routes/index.routes";
import { swaggerSpec, swaggerUi } from "./swagger";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const regex = /^https?:\/\/([a-z0-9-]+)\.agende7\.com$/i;

      if (regex.test(origin)) {
        return callback(null, true);
      }

      // também libera localhost para dev
      if (origin === "http://localhost:5173") {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(cookieParser() as unknown as RequestHandler);

app.use(express.json());

app.use(routes);

app.use(errorHandler);

Sentry.setupExpressErrorHandler(app);

app.use(SentryMiddleware);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export { app };
