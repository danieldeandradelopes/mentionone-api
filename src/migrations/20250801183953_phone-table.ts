import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("phones", (table) => {
    table.increments("id").primary();
    table.string("phone_number").notNullable();
    table.boolean("is_whatsapp").notNullable().defaultTo(false);
    table.boolean("is_cellphone").notNullable().defaultTo(false);
    table.integer("enterprise_id").references("id").inTable("enterprises");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("phones");
}
