import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("user_enterprises", function (table) {
    table.increments("id").primary();
    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .integer("enterprise_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("enterprises")
      .onDelete("CASCADE");
    table.string("role", 24).notNullable().defaultTo("member");
    table.timestamps(true, true);
    table.unique(["user_id", "enterprise_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("user_enterprises");
}
