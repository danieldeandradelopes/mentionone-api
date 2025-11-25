import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("enterprises", function (table) {
    table.increments("id");
    table.string("name", 40).notNullable();
    table.string("cover");
    table.string("address");
    table.string("description");
    table.string("subdomain").nullable();
    table.timestamp("deleted_at").nullable();
    table.string("timezone", 100).notNullable().defaultTo("America/Sao_Paulo");
    table.string("document").nullable();
    table.enum("document_type", ["cpf", "cnpj"]).nullable();
    table.string("email").nullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("enterprises");
}
