// Em development usar .env.development (igual knexfile), senão .env — assim API e migrations usam o mesmo banco
require("dotenv").config();
if (process.env.NODE_ENV === "development") {
  require("dotenv").config({
    path: require("path").resolve(process.cwd(), ".env.development"),
    override: true,
  });
}
import { app } from "./app";
import "./cron/subscriptionCheck";

app.listen(process.env.PORT, () =>
  console.log(`Server is connected on port ${process.env.PORT}`)
);
