require("dotenv").config();
import { app } from "./app";
import "./cron/subscriptionCheck";

app.listen(process.env.PORT, () =>
  console.log(`Server is connected on port ${process.env.PORT}`),
);
