import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  console.log("🧹 Limpando banco de dados...");
  console.log("=".repeat(50));

  try {
    // Ordem de limpeza (respeitando foreign keys)
    const tablesToClean = [
      "working_hours_time_slots",
      "working_hours",
      "payment",
      "subscription",
      "branding",
      "order_items",
      "orders",
      "products",
      "services",
      "customers",
      "barbers",
      "social_media",
      "phones",
      "Enterprise",
      "plan_price",
      "plan",
      "users",
    ];

    for (const table of tablesToClean) {
      try {
        const count = await knex(table).count("* as count").first();
        const recordCount = count?.count || 0;

        if (Number(recordCount) > 0) {
          await knex(table).del();
          console.log(`🗑️  Limpou ${recordCount} registros da tabela ${table}`);
        } else {
          console.log(`✅ Tabela ${table} já estava vazia`);
        }
      } catch (error) {
        console.log(
          `⚠️  Tabela ${table} não existe ou erro ao limpar: ${
            error instanceof Error ? error.message : "Erro desconhecido"
          }`
        );
      }
    }

    console.log("=".repeat(50));
    console.log("✅ Banco de dados limpo com sucesso!");
    console.log("=".repeat(50));
  } catch (error) {
    console.error("❌ Erro ao limpar o banco de dados:", error);
    throw error;
  }
}
