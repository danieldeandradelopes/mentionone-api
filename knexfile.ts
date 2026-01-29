import type { Knex } from "knex";
import dotenv from "dotenv";
import path from "path";

// Carrega variáveis de ambiente do arquivo .env apropriado
const env = process.env.NODE_ENV || "development";
const envFile = env === "development" ? ".env.development" : `.env.${env}`;
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

// Função auxiliar para obter variáveis de ambiente com fallback
const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (!value && !defaultValue) {
    throw new Error(`Variável de ambiente ${key} não encontrada`);
  }
  return value || defaultValue!;
};

// Função auxiliar para obter número de variável de ambiente
const getEnvNumber = (key: string, defaultValue?: number): number => {
  const value = process.env[key];
  if (!value && defaultValue === undefined) {
    throw new Error(`Variável de ambiente ${key} não encontrada`);
  }
  return value ? parseInt(value, 10) : defaultValue!;
};

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "postgresql",
    connection: {
      host: getEnv("DB_HOST", "localhost"),
      port: getEnvNumber("DB_PORT", 5432),
      user: getEnv("DB_USER", "postgres"),
      password: getEnv("DB_PASSWORD", "postgres"),
      database: getEnv("DB_DATABASE", "mentionone"),
      // ssl removido para aceitar conexões sem SSL durante o desenvolvimento
      ssl: { rejectUnauthorized: false },
    },
    pool: {
      min: getEnvNumber("DB_POOL_MIN", 2),
      max: getEnvNumber("DB_POOL_MAX", 10),
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "src/migrations",
    },
    seeds: {
      directory: "src/seeds",
    },
  },

  staging: {
    client: "postgresql",
    connection: {
      host: getEnv("DB_HOST"),
      port: getEnvNumber("DB_PORT"),
      user: getEnv("DB_USER"),
      password: getEnv("DB_PASSWORD"),
      database: getEnv("DB_DATABASE"),
      ssl: {
        rejectUnauthorized: false,
      },
    },
    pool: {
      min: getEnvNumber("DB_POOL_MIN", 2),
      max: getEnvNumber("DB_POOL_MAX", 10),
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "src/migrations",
    },
    seeds: {
      directory: "src/seeds",
    },
  },

  production: {
    client: "postgresql",
    connection: {
      host: getEnv("DB_HOST"),
      port: getEnvNumber("DB_PORT"),
      user: getEnv("DB_USER"),
      password: getEnv("DB_PASSWORD"),
      database: getEnv("DB_DATABASE"),
      ssl: {
        rejectUnauthorized: false,
      },
    },
    pool: {
      min: getEnvNumber("DB_POOL_MIN", 2),
      max: getEnvNumber("DB_POOL_MAX", 10),
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "src/migrations",
    },
    seeds: {
      directory: "src/seeds",
    },
  },
};

module.exports = config;
