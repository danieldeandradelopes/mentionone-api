import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("plan_prices", (table) => {
    table.bigIncrements("id").primary();
    table
      .bigInteger("plan_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("plans")
      .onDelete("CASCADE");
    table.enu("billing_cycle", ["monthly", "yearly"]).notNullable();
    table.integer("price").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("plan_prices");
}
