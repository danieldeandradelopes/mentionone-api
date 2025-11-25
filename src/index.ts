require("dotenv").config();
import { app } from "./app";
import "./cron/subscriptionCheck";

app.listen(process.env.APP_PORT, () => console.log("Server is connected..."));
