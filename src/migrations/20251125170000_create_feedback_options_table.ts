import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("feedback_options", function (table) {
    table.increments("id").primary();
    table
      .integer("enterprise_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("enterprises")
      .onDelete("CASCADE");
    table
      .integer("box_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("boxes")
      .onDelete("CASCADE");
    table.string("slug", 100).notNullable();
    table.string("name", 100).notNullable();
    table.enum("type", ["criticism", "suggestion", "praise"]).notNullable();
    table.timestamps(true, true);

    // Índice único para slug por enterprise
    table.unique(["enterprise_id", "slug"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("feedback_options");
}
