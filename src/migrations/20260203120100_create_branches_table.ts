import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("branches", (table) => {
    table.increments("id").primary();
    table
      .integer("enterprise_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("enterprises")
      .onDelete("CASCADE");
    table.string("name", 100).notNullable();
    table.string("slug", 100).notNullable();
    table.string("address", 255).nullable();
    table.timestamps(true, true);
    table.unique(["enterprise_id", "slug"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("branches");
}
