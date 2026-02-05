import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("enterprises", (table) => {
    table.timestamp("terms_accepted_at").nullable();
    table.string("terms_accepted_ip", 45).nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("enterprises", (table) => {
    table.dropColumn("terms_accepted_at");
    table.dropColumn("terms_accepted_ip");
  });
}
