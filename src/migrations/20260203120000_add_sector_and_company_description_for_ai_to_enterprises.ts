import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("enterprises", (table) => {
    table.string("sector", 120).nullable();
    table.text("company_description_for_ai").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("enterprises", (table) => {
    table.dropColumn("sector");
    table.dropColumn("company_description_for_ai");
  });
}
