import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("boxes_branding", function (table) {
    table.increments("id").primary();
    table
      .integer("box_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("boxes")
      .onDelete("CASCADE");
    table.string("primary_color", 16).notNullable();
    table.string("secondary_color", 16).notNullable();
    table.string("logo_url", 255);
    table.string("client_name", 100);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("boxes_branding");
}
