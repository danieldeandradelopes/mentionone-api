import { Knex } from "knex";
import BCryptAdapter from "../infra/Encrypt/BCryptAdapter";

export async function seed(knex: Knex): Promise<void> {
  console.log("👥 Populando usuários clientes e tabela customers...");

  // Verificar se já existem usuários clientes
  const existingClients = await knex("users")
    .where("access_level", "client")
    .select("id");

  if (existingClients.length > 0) {
    console.log("⚠️  Usuários clientes já existem. Pulando criação.");
    return;
  }

  // Hash da senha padrão
  const bcryptAdapter = new BCryptAdapter();
  const hashedPassword = await bcryptAdapter.encrypt("123456");

  // Criar usuários clientes
  const clientUsers = await knex("users")
    .insert([
      {
        name: "João Silva",
        email: "joao.silva@email.com",
        password: hashedPassword,
        access_level: "client",
        phone: "11987654321",
        avatar: "https://via.placeholder.com/150x150/4A90E2/FFFFFF?text=JS",
      },
      {
        name: "Maria Santos",
        email: "maria.santos@email.com",
        password: hashedPassword,
        access_level: "client",
        phone: "11987654322",
        avatar: "https://via.placeholder.com/150x150/7ED321/FFFFFF?text=MS",
      },
      {
        name: "Pedro Oliveira",
        email: "pedro.oliveira@email.com",
        password: hashedPassword,
        access_level: "client",
        phone: "11987654323",
        avatar: "https://via.placeholder.com/150x150/F5A623/FFFFFF?text=PO",
      },
      {
        name: "Ana Costa",
        email: "ana.costa@email.com",
        password: hashedPassword,
        access_level: "client",
        phone: "11987654324",
        avatar: "https://via.placeholder.com/150x150/BD10E0/FFFFFF?text=AC",
      },
      {
        name: "Carlos Ferreira",
        email: "carlos.ferreira@email.com",
        password: hashedPassword,
        access_level: "client",
        phone: "11987654325",
        avatar: "https://via.placeholder.com/150x150/50C878/FFFFFF?text=CF",
      },
      {
        name: "Lucia Alves",
        email: "lucia.alves@email.com",
        password: hashedPassword,
        access_level: "client",
        phone: "11987654326",
        avatar: "https://via.placeholder.com/150x150/FF6B6B/FFFFFF?text=LA",
      },
      {
        name: "Roberto Lima",
        email: "roberto.lima@email.com",
        password: hashedPassword,
        access_level: "client",
        phone: "11987654327",
        avatar: "https://via.placeholder.com/150x150/4ECDC4/FFFFFF?text=RL",
      },
      {
        name: "Fernanda Rocha",
        email: "fernanda.rocha@email.com",
        password: hashedPassword,
        access_level: "client",
        phone: "11987654328",
        avatar: "https://via.placeholder.com/150x150/45B7D1/FFFFFF?text=FR",
      },
    ])
    .returning("*");

  console.log(`✅ Criados ${clientUsers.length} usuários clientes`);

  // Buscar barbearias para associar aos clientes
  const Enterprises = await knex("Enterprise").select("id");

  if (Enterprises.length === 0) {
    console.log(
      "⚠️  Nenhuma barbearia encontrada. Execute primeiro o seed de barbearias."
    );
    return;
  }

  // Criar registros na tabela customers
  const customersData = clientUsers.map((user, index) => {
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
