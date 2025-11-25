import { Knex } from "knex";
import BCryptAdapter from "../infra/Encrypt/BCryptAdapter";

export async function seed(knex: Knex): Promise<void> {
  console.log("👤 Populando tabela de usuários...");

  const bcryptAdapter = new BCryptAdapter();
  const hashedPassword = await bcryptAdapter.encrypt("123456");

  // Verificar se já existem usuários
  const existingUsers = await knex("users").count("* as count").first();
  if (Number(existingUsers?.count) > 0) {
    console.log("⚠️  Usuários já existem. Pulando criação.");
    return;
  }

  const users = [
    // Superadmin
    {
      name: "Daniel de Andrade Lopes",
      email: "danieldeandradelopes@gmail.com",
      password: hashedPassword,
      access_level: "superadmin",
      avatar: "https://via.placeholder.com/150x150/FF6B6B/FFFFFF?text=DA",
      phone: "11999999999",
    },
    // Barbeiros
    {
      name: "João Silva",
      email: "joao.silva@example.com",
      password: hashedPassword,
      access_level: "barber",
      avatar: "https://via.placeholder.com/150x150/4ECDC4/FFFFFF?text=JS",
      phone: "11988888888",
    },
    {
      name: "Carlos Santos",
      email: "carlos.santos@example.com",
      password: hashedPassword,
      access_level: "barber",
      avatar: "https://via.placeholder.com/150x150/45B7D1/FFFFFF?text=CS",
      phone: "11977777777",
    },
    {
      name: "Roberto Lima",
      email: "roberto.lima@example.com",
      password: hashedPassword,
      access_level: "barber",
      avatar: "https://via.placeholder.com/150x150/96CEB4/FFFFFF?text=RL",
      phone: "11966666666",
    },
    {
      name: "Marcos Oliveira",
      email: "marcos.oliveira@example.com",
      password: hashedPassword,
      access_level: "barber",
      avatar: "https://via.placeholder.com/150x150/FFEAA7/FFFFFF?text=MO",
      phone: "11955555555",
    },
    // Clientes
    {
      name: "Ana Silva",
      email: "ana.silva@example.com",
      password: hashedPassword,
      access_level: "client",
      avatar: "https://via.placeholder.com/150x150/FF6347/FFFFFF?text=AS",
      phone: "11991112221",
    },
    {
      name: "Bruno Costa",
      email: "bruno.costa@example.com",
      password: hashedPassword,
      access_level: "client",
      avatar: "https://via.placeholder.com/150x150/4682B4/FFFFFF?text=BC",
      phone: "11991112222",
    },
    {
      name: "Carla Dias",
      email: "carla.dias@example.com",
      password: hashedPassword,
      access_level: "client",
      avatar: "https://via.placeholder.com/150x150/32CD32/FFFFFF?text=CD",
      phone: "11991112223",
    },
    {
      name: "Daniel Rocha",
      email: "daniel.rocha@example.com",
      password: hashedPassword,
      access_level: "client",
      avatar: "https://via.placeholder.com/150x150/FFD700/FFFFFF?text=DR",
      phone: "11991112224",
    },
    {
      name: "Eduarda Lima",
      email: "eduarda.lima@example.com",
      password: hashedPassword,
      access_level: "client",
      avatar: "https://via.placeholder.com/150x150/DA70D6/FFFFFF?text=EL",
      phone: "11991112225",
    },
  ];

  await knex("users").insert(users);

  console.log("✅ Usuários inseridos com sucesso!");
  console.log(`👤 Criados ${users.length} usuários`);
  console.log(`👑 Superadmin: 1`);
  console.log(`💇 Barbeiros: 4`);
  console.log(`👥 Clientes: 5`);
}
