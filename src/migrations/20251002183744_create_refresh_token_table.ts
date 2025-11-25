import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("refresh_tokens", function (table) {
    table.increments("id");
    table.string("token").notNullable().unique();
    table
      .integer("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.timestamp("expires_at").notNullable();
    table.boolean("is_revoked").defaultTo(false);
    table.timestamps(true, true);

    table.index(["user_id"]);
    table.index(["token"]);
    table.index(["expires_at"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("refresh_tokens");
}
