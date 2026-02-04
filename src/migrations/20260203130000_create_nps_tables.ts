import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("nps_campaigns", (table) => {
    table.increments("id").primary();
    table
      .integer("enterprise_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("enterprises")
      .onDelete("CASCADE");
    table.string("name", 200).notNullable();
    table.string("slug", 100).notNullable();
    table.boolean("active").notNullable().defaultTo(true);
    table.timestamps(true, true);
    table.unique(["enterprise_id", "slug"]);
  });

  await knex.schema.createTable("nps_questions", (table) => {
    table.increments("id").primary();
    table
      .integer("nps_campaign_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("nps_campaigns")
      .onDelete("CASCADE");
    table.string("title", 500).notNullable();
    table
      .enu("type", ["nps", "multiple_choice"], { useNative: true, enumName: "nps_question_type" })
      .notNullable();
    table.integer("order").unsigned().notNullable().defaultTo(0);
    table.timestamps(true, true);
  });

  await knex.schema.createTable("nps_question_options", (table) => {
    table.increments("id").primary();
    table
      .integer("nps_question_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("nps_questions")
      .onDelete("CASCADE");
    table.string("label", 255).notNullable();
    table.integer("order").unsigned().notNullable().defaultTo(0);
    table.timestamps(true, true);
  });

  await knex.schema.createTable("nps_responses", (table) => {
    table.increments("id").primary();
    table
      .integer("nps_campaign_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("nps_campaigns")
      .onDelete("CASCADE");
    table
      .integer("branch_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("branches")
      .onDelete("SET NULL");
    table.integer("nps_score").unsigned().nullable(); // 0-10
    table.timestamps(true, true);
  });

  await knex.schema.createTable("nps_response_answers", (table) => {
    table.increments("id").primary();
    table
      .integer("nps_response_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("nps_responses")
      .onDelete("CASCADE");
    table
      .integer("nps_question_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("nps_questions")
      .onDelete("CASCADE");
    table
      .integer("nps_question_option_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("nps_question_options")
      .onDelete("CASCADE");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("nps_response_answers");
  await knex.schema.dropTableIfExists("nps_responses");
  await knex.schema.dropTableIfExists("nps_question_options");
  await knex.schema.dropTableIfExists("nps_questions");
  await knex.schema.dropTableIfExists("nps_campaigns");
  await knex.raw("DROP TYPE IF EXISTS nps_question_type");
}
