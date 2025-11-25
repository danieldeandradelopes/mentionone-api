import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("plans", (table) => {
    table.bigIncrements("id").primary();
    table.string("name", 100).notNullable();
    table.text("description").nullable();
    table.jsonb("features").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("plans");
}
