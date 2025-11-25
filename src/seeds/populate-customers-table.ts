import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  console.log("👥 Populando tabela de clientes...");

  // Buscar usuários clientes existentes
  const customerUsers = await knex("users")
    .where("access_level", "client")
    .select("*");

  if (customerUsers.length === 0) {
    console.log(
      "⚠️  Nenhum usuário cliente encontrado. Execute primeiro o seed de usuários."
    );
    return;
  }

  // Buscar barbearias para associar aos clientes
  const Enterprises = await knex("Enterprise").select("id");

  if (Enterprises.length === 0) {
    console.log(
      "⚠️  Nenhuma barbearia encontrada. Execute primeiro o seed de barbearias."
    );
    return;
  }

  // Criar clientes baseados nos usuários existentes
  const customersData = customerUsers.map((user, index) => {
    const Enterprise = Enterprises[index % Enterprises.length];

    return {
      user_id: user.id,
      enterprise_id: Enterprise.id,
    };
  });

  const customers = await knex("customers")
    .insert(customersData)
    .returning("*");

  console.log("✅ Clientes inseridos com sucesso!");
  console.log(`👥 Criados ${customers.length} clientes`);
  console.log(`🏪 Associados a ${Enterprises.length} barbearias`);
}
