import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Criar plano Free
  const [freePlan] = await knex("plans")
    .insert({
      name: "Free",
      description: "Plano gratuito com funcionalidades básicas",
      features: JSON.stringify({
        max_boxes: 1,
        max_responses_per_month: 15,
        can_access_reports: false,
        can_access_advanced_charts: false,
        can_filter_feedbacks: false,
        can_export_csv: false,
        show_mentionone_branding: true,
      }),
    })
    .returning("id");

  // Criar plan_price para Free (preço 0)
  if (freePlan) {
    await knex("plan_prices").insert({
      plan_id: freePlan.id,
      price: 0,
      billing_cycle: "monthly",
    });
  }

  // Atualizar planos existentes com features
  // Starter: 3 caixas
  await knex("plans")
    .where({ name: "Starter" })
    .update({
      features: JSON.stringify({
        max_boxes: 3,
        max_responses_per_month: null, // ilimitado
        can_access_reports: true,
        can_access_advanced_charts: true,
        can_filter_feedbacks: true,
        can_export_csv: true,
        show_mentionone_branding: false,
      }),
    });

  // Pro: 15 caixas
  await knex("plans")
    .where({ name: "Pro" })
    .update({
      features: JSON.stringify({
        max_boxes: 15,
        max_responses_per_month: null, // ilimitado
        can_access_reports: true,
        can_access_advanced_charts: true,
        can_filter_feedbacks: true,
        can_export_csv: true,
        show_mentionone_branding: false,
      }),
    });

  // Business: ilimitado (null)
  await knex("plans")
    .where({ name: "Business" })
    .update({
      features: JSON.stringify({
        max_boxes: null, // ilimitado
        max_responses_per_month: null, // ilimitado
        can_access_reports: true,
        can_access_advanced_charts: true,
        can_filter_feedbacks: true,
        can_export_csv: true,
        show_mentionone_branding: false,
      }),
    });
}

export async function down(knex: Knex): Promise<void> {
  // Remover plan_price do Free
  const freePlan = await knex("plans").where({ name: "Free" }).first();
  if (freePlan) {
    await knex("plan_prices").where({ plan_id: freePlan.id }).delete();
  }

  // Remover plano Free
  await knex("plans").where({ name: "Free" }).delete();

  // Limpar features dos planos existentes (voltar para null)
  await knex("plans")
    .whereIn("name", ["Starter", "Pro", "Business"])
    .update({ features: null });
}

