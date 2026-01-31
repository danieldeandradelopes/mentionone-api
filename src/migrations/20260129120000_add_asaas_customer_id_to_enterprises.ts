import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("enterprises", (table) => {
    table.string("asaas_customer_id", 64).nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("enterprises", (table) => {
    table.dropColumn("asaas_customer_id");
  });
}
