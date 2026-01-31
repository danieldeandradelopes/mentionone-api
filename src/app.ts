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

app.set("trust proxy", "loopback"); // aceita apenas localhost (127.0.0.1)

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const mentionOneRegex =
        /^https?:\/\/([a-z0-9-]+\.)*app\.mentionone\.com$/i;
      const mentionOneRootRegex = /^https?:\/\/mentionone\.com$/i;

      if (mentionOneRegex.test(origin) || mentionOneRootRegex.test(origin)) {
        return callback(null, true);
      }

      // também libera localhost para dev (Vite e Next.js)
      const allowedLocalhost = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
        "http://localhost:5173",
      ];

      if (allowedLocalhost.includes(origin)) {
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
