import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("subscriptions", (table) => {
    table.bigIncrements("id").primary();
    table
      .bigInteger("enterprise_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("enterprises")
      .onDelete("CASCADE");
    table
      .bigInteger("plan_price_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("plan_prices")
      .onDelete("RESTRICT");
    table
      .enu("status", ["active", "past_due", "canceled"])
      .defaultTo("past_due");
    table.date("start_date").notNullable();
    table.date("end_date").notNullable();
    table.date("trial_end_date").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("subscriptions");
}
