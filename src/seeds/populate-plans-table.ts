import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  console.log("📋 Populando tabela de planos...");

  // Inserir planos
  const plans = await knex("plan")
    .insert([
      {
        name: "Básico",
        description: "Plano ideal para barbearias iniciantes",
        features: JSON.stringify({
          max_barbers: 2,
          max_services: 10,
          max_products: 20,
          max_orders_per_month: 100,
          whatsapp_integration: true,
          basic_analytics: true,
          customer_management: true,
          appointment_scheduling: true,
          payment_tracking: false,
          advanced_analytics: false,
          custom_branding: false,
          priority_support: false,
        }),
      },
      {
        name: "Profissional",
        description: "Plano completo para barbearias em crescimento",
        features: JSON.stringify({
          max_barbers: 5,
          max_services: 25,
          max_products: 100,
          max_orders_per_month: 500,
          whatsapp_integration: true,
          basic_analytics: true,
          customer_management: true,
          appointment_scheduling: true,
          payment_tracking: true,
          advanced_analytics: true,
          custom_branding: true,
          priority_support: true,
        }),
      },
      {
        name: "Premium",
        description: "Plano avançado para barbearias estabelecidas",
        features: JSON.stringify({
          max_barbers: -1, // Ilimitado
          max_services: -1, // Ilimitado
          max_products: -1, // Ilimitado
          max_orders_per_month: -1, // Ilimitado
          whatsapp_integration: true,
          basic_analytics: true,
          customer_management: true,
          appointment_scheduling: true,
          payment_tracking: true,
          advanced_analytics: true,
          custom_branding: true,
          priority_support: true,
          api_access: true,
          white_label: true,
          dedicated_support: true,
        }),
      },
    ])
    .returning("*");

  console.log("✅ Planos inseridos com sucesso!");

  // Inserir preços dos planos
  const planPrices = [
    // Plano Básico
    {
      plan_id: plans[0].id,
      billing_cycle: "monthly",
      price: 2990, // R$ 29,90 em centavos
    },
    {
      plan_id: plans[0].id,
      billing_cycle: "yearly",
      price: 29900, // R$ 299,00 em centavos (2 meses grátis)
    },
    // Plano Profissional
    {
      plan_id: plans[1].id,
      billing_cycle: "monthly",
      price: 5990, // R$ 59,90 em centavos
    },
    {
      plan_id: plans[1].id,
      billing_cycle: "yearly",
      price: 59900, // R$ 599,00 em centavos (2 meses grátis)
    },
    // Plano Premium
    {
      plan_id: plans[2].id,
      billing_cycle: "monthly",
      price: 9990, // R$ 99,90 em centavos
    },
    {
      plan_id: plans[2].id,
      billing_cycle: "yearly",
      price: 99900, // R$ 999,00 em centavos (2 meses grátis)
    },
  ];

  await knex("plan_price").insert(planPrices);

  console.log("✅ Preços dos planos inseridos com sucesso!");
  console.log(
    `📊 Criados ${plans.length} planos com ${planPrices.length} preços`
  );
}
