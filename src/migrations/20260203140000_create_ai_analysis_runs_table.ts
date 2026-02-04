import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("ai_analysis_runs", (table) => {
    table.increments("id").primary();
    table
      .integer("enterprise_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("enterprises")
      .onDelete("CASCADE");
    table.string("type", 50).notNullable();
    table.jsonb("payload").notNullable();
    table.timestamps(true, true);
    table.index(["enterprise_id", "type"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("ai_analysis_runs");
}
