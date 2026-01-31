import knex from "knex";

const getEnvBoolean = (key: string, defaultValue = false): boolean => {
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  return ["1", "true", "yes"].includes(value.toLowerCase());
};

export default knex({
  client: "postgres",
  connection: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!, 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: getEnvBoolean(
      "DB_SSL",
      (process.env.NODE_ENV ?? "development") !== "development",
    )
      ? { rejectUnauthorized: false }
      : undefined,
  },
});
