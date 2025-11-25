import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("payments", (table) => {
    table.bigIncrements("id").primary();
    table
      .bigInteger("subscription_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("subscriptions")
      .onDelete("CASCADE");
    table.integer("amount").notNullable();
    table
      .enu("status", ["pending", "paid", "failed", "refunded"])
      .defaultTo("pending");
    table.timestamp("payment_date").nullable();
    table.date("due_date").notNullable();
    table.string("transaction_id", 255).nullable();
    table.json("items").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("payments");
}
