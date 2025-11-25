import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", function (table) {
    table.increments("id");
    table.string("name", 40).notNullable();
    table.string("email", 100).notNullable().unique();
    table.string("password").notNullable();
    table
      .enu("access_level", ["superadmin", "admin", "employee", "customer"])
      .notNullable()
      .defaultTo("customer");
    table.string("avatar");
    table.boolean("is_deleted").defaultTo(false);
    table.timestamp("deleted_at").nullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("users");
}
