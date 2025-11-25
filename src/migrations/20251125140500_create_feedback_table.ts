import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("feedbacks", function (table) {
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
      .notNullable()
      .references("id")
      .inTable("boxes")
      .onDelete("CASCADE");
    table.text("text").notNullable();
    table.string("category", 80).notNullable();
    table.string("status", 40).notNullable().defaultTo("pending");
    table.text("response").nullable();
    table.float("rating").nullable();
    table.jsonb("attachments").nullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("feedbacks");
}
