import type { Knex } from "knex";

/**
 * Move onboarding_completed_at de user_enterprises para enterprises.
 * A informação de onboarding fica na empresa, não no vínculo usuário-empresa.
 */
export async function up(knex: Knex): Promise<void> {
  // Adiciona coluna na tabela enterprises
  await knex.schema.alterTable("enterprises", (table) => {
    table.timestamp("onboarding_completed_at").nullable();
  });

  // Remove coluna de user_enterprises (se existir, ex.: da migration anterior)
  const hasColumn = await knex.schema.hasColumn(
    "user_enterprises",
    "onboarding_completed_at",
  );
  if (hasColumn) {
    await knex.schema.alterTable("user_enterprises", (table) => {
      table.dropColumn("onboarding_completed_at");
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  // Restaura coluna em user_enterprises
  await knex.schema.alterTable("user_enterprises", (table) => {
    table.timestamp("onboarding_completed_at").nullable();
  });

  // Remove coluna de enterprises
  await knex.schema.alterTable("enterprises", (table) => {
    table.dropColumn("onboarding_completed_at");
  });
}
