import { Knex } from "knex";
import bcrypt from "bcryptjs";

// Todos os dados como variáveis para facilitar referência etc.
const plans = [
  {
    name: "Starter",
    description: "Plano básico",
    features: "",
    is_active: true,
  },
  {
    name: "Pro",
    description: "Plano para empresas",
    features: "",
    is_active: true,
  },
];

const plan_prices = [
  { plan_id: 1, price: 49.99, duration_months: 1, billing_cycle: "monthly" },
  { plan_id: 2, price: 129.99, duration_months: 1, billing_cycle: "monthly" },
];

const users = [
  {
    email: "superadmin@mentionone.com",
    password: bcrypt.hashSync("123456", 8),
    name: "SuperAdmin",
    is_superadmin: true,
  },
  {
    email: "admin1@mentionone.com",
    password: bcrypt.hashSync("admin123", 8),
    name: "Admin One",
    is_superadmin: false,
  },
  {
    email: "admin2@mentionone.com",
    password: bcrypt.hashSync("admin456", 8),
    name: "Admin Two",
    is_superadmin: false,
  },
];

const enterprises = [
  {
    name: "Empresa Alpha",
    cover: null,
    address: "Rua das Caixas, 123",
    description: "Primeira empresa demo",
    subdomain: "alpha",
    document: "12345678000191",
    document_type: "cnpj",
    email: "contato@alpha.com",
    timezone: "America/Sao_Paulo",
    deleted_at: null,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    name: "Empresa Beta",
    cover: null,
    address: "Av. Sugestões, 321",
    description: "Empresa beta para exemplos",
    subdomain: "beta",
    document: "98765432000198",
    document_type: "cnpj",
    email: "contato@beta.com",
    timezone: "America/Sao_Paulo",
    deleted_at: null,
    created_at: new Date(),
    updated_at: new Date(),
  },
];

export async function seed(knex: Knex) {
  await knex("user_enterprises").del();
  await knex("feedbacks").del();
  await knex("boxes_branding").del();
  await knex("boxes").del();
  await knex("subscriptions").del();
  await knex("plan_prices").del();
  await knex("plans").del();
  await knex("users").del();
  await knex("enterprises").del();

  // 1. Plans
  await knex("plans").insert(plans);
  await knex("plan_prices").insert(plan_prices);

  // 2. Users (superadmin, 2 admins)
  const createdUsers = await knex("users")
    .insert(users)
    .returning(["id", "email"]);

  // 3. Enterprises
  const createdEnterprises = await knex("enterprises")
    .insert(enterprises)
    .returning(["id", "name"]);

  // 4. Vínculo user_enterprises: admin1→alpha, admin2→beta
  await knex("user_enterprises").insert([
    {
      user_id: createdUsers[1].id,
      enterprise_id: createdEnterprises[0].id,
      role: "admin",
    },
    {
      user_id: createdUsers[2].id,
      enterprise_id: createdEnterprises[1].id,
      role: "admin",
    },
  ]);

  // 5. Subscription: uma para cada enterprise
  await knex("subscriptions").insert([
    {
      enterprise_id: createdEnterprises[0].id,
      plan_price_id: 1,
      status: "active",
      start_date: new Date(),
      end_date: null,
    },
    {
      enterprise_id: createdEnterprises[1].id,
      plan_price_id: 2,
      status: "active",
      start_date: new Date(),
      end_date: null,
    },
  ]);

  // 6. Cada enterprise com uma box
  const boxes = await knex("boxes")
    .insert([
      {
        enterprise_id: createdEnterprises[0].id,
        name: "Caixa Recepção",
        location: "Recepção",
      },
      {
        enterprise_id: createdEnterprises[1].id,
        name: "Caixa Central",
        location: "Entrada Principal",
      },
    ])
    .returning(["id", "enterprise_id"]);

  // 7. Adicionar branding das boxes (opcional)
  await knex("boxes_branding").insert([
    {
      box_id: boxes[0].id,
      primary_color: "#ffffff",
      secondary_color: "#3477E8",
      logo_url: "alpha-logo.png",
      client_name: "Empresa Alpha",
    },
    {
      box_id: boxes[1].id,
      primary_color: "#ffffff",
      secondary_color: "#34E877",
      logo_url: "beta-logo.png",
      client_name: "Empresa Beta",
    },
  ]);

  // 8. Cada box com 2 feedbacks
  await knex("feedbacks").insert([
    // Para Alpha
    {
      box_id: boxes[0].id,
      enterprise_id: createdEnterprises[0].id,
      text: "Ótimo atendimento!",
      category: "elogio",
      status: "pending",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      box_id: boxes[0].id,
      enterprise_id: createdEnterprises[0].id,
      text: "Poderiam melhorar o café.",
      category: "sugestão",
      status: "pending",
      created_at: new Date(),
      updated_at: new Date(),
    },
    // Para Beta
    {
      box_id: boxes[1].id,
      enterprise_id: createdEnterprises[1].id,
      text: "Ambiente muito limpo.",
      category: "elogio",
      status: "pending",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      box_id: boxes[1].id,
      enterprise_id: createdEnterprises[1].id,
      text: "Fila de espera grande.",
      category: "reclamação",
      status: "pending",
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}
