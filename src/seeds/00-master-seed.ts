import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  console.log("🚀 Iniciando população completa do banco de dados...");
  console.log("=".repeat(60));

  try {
    // 1. Usuários (base para tudo)
    console.log("👤 1/8 - Criando usuários...");
    await knex.seed.run({ specific: "populate-users-table.ts" });
    console.log("✅ Usuários criados\n");

    // 2. Planos e Preços (independente)
    console.log("📋 2/8 - Criando planos e preços...");
    await knex.seed.run({ specific: "populate-plans-table.ts" });
    console.log("✅ Planos e preços criados\n");

    // 3. Barbearias (depende de usuários e planos)
    console.log("🏪 3/8 - Criando barbearias...");
    await knex.seed.run({ specific: "populate-Enterprises-table.ts" });
    console.log("✅ Barbearias criadas\n");

    // 4. Barbeiros (depende de usuários e barbearias)
    console.log("💇 4/8 - Criando barbeiros...");
    await knex.seed.run({ specific: "populate-barbers-table.ts" });
    console.log("✅ Barbeiros criados\n");

    // 5. Clientes (depende de usuários e barbearias)
    console.log("👥 5/8 - Criando clientes...");
    await knex.seed.run({ specific: "populate-customers-table.ts" });
    console.log("✅ Clientes criados\n");

    // 6. Serviços (depende de barbearias)
    console.log("💇 6/9 - Criando serviços...");
    await knex.seed.run({ specific: "populate-services-table.ts" });
    console.log("✅ Serviços criados\n");

    // 7. Produtos (depende de barbearias)
    console.log("📦 7/9 - Criando produtos...");
    await knex.seed.run({ specific: "populate-products-table.ts" });
    console.log("✅ Produtos criados\n");

    // 8. Pedidos (depende de produtos, usuários e barbearias)
    console.log("🛒 8/9 - Criando pedidos...");
    await knex.seed.run({ specific: "populate-orders-table.ts" });
    console.log("✅ Pedidos criados\n");

    // 9. Branding (depende de barbearias)
    console.log("🎨 9/9 - Criando branding...");
    await knex.seed.run({ specific: "populate-branding-table.ts" });
    console.log("✅ Branding criado\n");

    // 10. Assinaturas (depende de barbearias e planos)
    console.log("💳 10/10 - Criando assinaturas...");
    await knex.seed.run({ specific: "populate-subscriptions-table.ts" });
    console.log("✅ Assinaturas criadas\n");

    // 11. Horários de funcionamento (depende de barbearias)
    console.log("⏰ 11/11 - Criando horários de funcionamento...");
    await knex.seed.run({ specific: "populate-working-hours-table.ts" });
    console.log("✅ Horários de funcionamento criados\n");

    console.log("=".repeat(60));
    console.log("🎉 BANCO DE DADOS POPULADO COM SUCESSO!");
    console.log("=".repeat(60));

    // Resumo final
    const counts = await Promise.all([
      knex("users").count("* as count").first(),
      knex("Enterprise").count("* as count").first(),
      knex("barbers").count("* as count").first(),
      knex("customers").count("* as count").first(),
      knex("services").count("* as count").first(),
      knex("products").count("* as count").first(),
      knex("orders").count("* as count").first(),
      knex("branding").count("* as count").first(),
      knex("subscription").count("* as count").first(),
      knex("working_hours").count("* as count").first(),
    ]);

    console.log("📊 RESUMO FINAL:");
    console.log(`👤 Usuários: ${counts[0]?.count || 0}`);
    console.log(`🏪 Barbearias: ${counts[1]?.count || 0}`);
    console.log(`💇 Barbeiros: ${counts[2]?.count || 0}`);
    console.log(`👥 Clientes: ${counts[3]?.count || 0}`);
    console.log(`💇 Serviços: ${counts[4]?.count || 0}`);
    console.log(`📦 Produtos: ${counts[5]?.count || 0}`);
    console.log(`🛒 Pedidos: ${counts[6]?.count || 0}`);
    console.log(`🎨 Branding: ${counts[7]?.count || 0}`);
    console.log(`💳 Assinaturas: ${counts[8]?.count || 0}`);
    console.log(`⏰ Horários: ${counts[9]?.count || 0}`);
    console.log("=".repeat(60));
  } catch (error) {
    console.error("❌ Erro ao popular o banco de dados:", error);
    throw error;
  }
}
