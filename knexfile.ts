import type { Knex } from "knex";

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "postgresql",
    connection: {
      host: "localhost",
      port: 5444,
      user: "postgres",
      password: "postgres",
      database: "mentionone",
    },
    pool: {
      min: 2,
      max: 10,
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
    pool: {
      min: 2,
      max: 10,
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
      host: "195.200.4.224",
      port: 5432,
      user: "agende7danieluser",
      password: "@ptInstallKKh!@#*(5)DeCSudoNov@Fas3",
      database: "agende7",
    },
    pool: {
      min: 2,
      max: 10,
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
