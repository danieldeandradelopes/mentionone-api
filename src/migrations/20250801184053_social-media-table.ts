import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("social_medias", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("url").notNullable();
    table.string("icon").notNullable();
    table.integer("enterprise_id").references("id").inTable("enterprises");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("social_medias");
}
