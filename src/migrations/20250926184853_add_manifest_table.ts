import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("manifests", (table) => {
    table.increments("id").primary();

    table.string("name").notNullable();
    table.string("short_name").notNullable();
    table.string("start_url").defaultTo("/");
    table.string("display").defaultTo("standalone");
    table.string("theme_color").defaultTo("#000000");
    table.string("background_color").defaultTo("#ffffff");

    table.json("icons");
    table.json("extra");

    table
      .integer("enterprise_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("enterprises")
      .onDelete("CASCADE");

    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("manifests");
}
