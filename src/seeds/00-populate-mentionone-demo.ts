import { Knex } from "knex";
import bcrypt from "bcryptjs";

// Todos os dados como variáveis para facilitar referência etc.
const plans = [
  {
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
  },
  {
    name: "Starter",
    description: "Plano básico",
    features: JSON.stringify({
      max_boxes: 3,
      max_responses_per_month: null,
      can_access_reports: true,
      can_access_advanced_charts: true,
      can_filter_feedbacks: true,
      can_export_csv: true,
      show_mentionone_branding: false,
    }),
  },
  {
    name: "Pro",
    description: "Plano para empresas",
    features: JSON.stringify({
      max_boxes: 15,
      max_responses_per_month: null,
      can_access_reports: true,
      can_access_advanced_charts: true,
      can_filter_feedbacks: true,
      can_export_csv: true,
      show_mentionone_branding: false,
    }),
  },
  {
    name: "Business",
    description: "Plano para empresas maiores",
    features: JSON.stringify({
      max_boxes: null,
      max_responses_per_month: null,
      can_access_reports: true,
      can_access_advanced_charts: true,
      can_filter_feedbacks: true,
      can_export_csv: true,
      show_mentionone_branding: false,
    }),
  },
];

// plan_prices será criado dinamicamente após inserir os plans

const users = [
  {
    email: "superadmin@mentionone.com",
    password: bcrypt.hashSync("123456", 8),
    name: "SuperAdmin",
    access_level: "superadmin",
  },
  {
    email: "admin1@mentionone.com",
    password: bcrypt.hashSync("admin123", 8),
    name: "Admin One",
    access_level: "admin",
  },
  {
    email: "admin2@mentionone.com",
    password: bcrypt.hashSync("admin456", 8),
    name: "Admin Two",
    access_level: "admin",
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
  // ==========================================
  // RESTART: Limpa todas as tabelas na ordem correta
  // (respeitando foreign keys)
  // ==========================================

  console.log("🔄 Iniciando restart do banco de dados...");

  // 1. Tabelas dependentes (com foreign keys) - ordem inversa das dependências
  await knex("payments")
    .del()
    .catch(() => {}); // Pode não existir ainda
  await knex("feedbacks")
    .del()
    .catch(() => {});
  await knex("boxes_branding")
    .del()
    .catch(() => {});
  await knex("boxes")
    .del()
    .catch(() => {});
  await knex("subscriptions")
    .del()
    .catch(() => {});
  await knex("user_enterprises")
    .del()
    .catch(() => {});
  await knex("refresh_tokens")
    .del()
    .catch(() => {});
  await knex("manifests")
    .del()
    .catch(() => {});
  await knex("phones")
    .del()
    .catch(() => {});
  await knex("social_medias")
    .del()
    .catch(() => {});
  await knex("branches")
    .del()
    .catch(() => {});

  // 2. Tabelas principais (referenciadas por outras)
  await knex("plan_prices")
    .del()
    .catch(() => {});
  await knex("plans")
    .del()
    .catch(() => {});
  await knex("users")
    .del()
    .catch(() => {});
  await knex("enterprises")
    .del()
    .catch(() => {});

  // 3. Resetar sequências de auto-increment (PostgreSQL)
  const tables = [
    "payments",
    "feedbacks",
    "boxes_branding",
    "boxes",
    "subscriptions",
    "user_enterprises",
    "refresh_tokens",
    "manifests",
    "phones",
    "social_medias",
    "branches",
    "plan_prices",
    "plans",
    "users",
    "enterprises",
  ];

  for (const table of tables) {
    try {
      await knex.raw(
        `SELECT setval(pg_get_serial_sequence('${table}', 'id'), 1, false)`,
      );
    } catch (error) {
      // Ignora erros se a tabela não existir ou não tiver sequência
    }
  }

  console.log("✅ Banco de dados limpo e sequências resetadas");

  // 1. Plans
  const createdPlans = await knex("plans")
    .insert(plans)
    .returning(["id", "name"]);

  // 2. Plan Prices (usando os IDs retornados dos plans)
  // Encontrar os planos pelo nome
  const freePlan = createdPlans.find((p) => p.name === "Free");
  const starterPlan = createdPlans.find((p) => p.name === "Starter");
  const proPlan = createdPlans.find((p) => p.name === "Pro");
  const businessPlan = createdPlans.find((p) => p.name === "Business");

  const planPricesToInsert: Array<{
    plan_id: number;
    price: number;
    billing_cycle: string;
  }> = [];

  if (freePlan) {
    planPricesToInsert.push({
      plan_id: freePlan.id,
      price: 0,
      billing_cycle: "monthly",
    });
  }

  if (starterPlan) {
    planPricesToInsert.push({
      plan_id: starterPlan.id,
      price: 50,
      billing_cycle: "monthly",
    });
  }

  if (proPlan) {
    planPricesToInsert.push({
      plan_id: proPlan.id,
      price: 130,
      billing_cycle: "monthly",
    });
  }

  if (businessPlan) {
    planPricesToInsert.push({
      plan_id: businessPlan.id,
      price: 250,
      billing_cycle: "monthly",
    });
  }

  const createdPlanPrices = await knex("plan_prices")
    .insert(planPricesToInsert)
    .returning(["id"]);

  // 3. Users (superadmin, 2 admins)
  const createdUsers = await knex("users")
    .insert(users)
    .returning(["id", "email"]);

  // 4. Enterprises
  const createdEnterprises = await knex("enterprises")
    .insert(enterprises)
    .returning(["id", "name"]);

  // 4.1 Filiais (branches) – algumas por enterprise
  const now = new Date();
  await knex("branches").insert([
    {
      enterprise_id: createdEnterprises[0].id,
      name: "Filial Centro",
      slug: "filial-centro",
      address: "Av. Central, 100",
      created_at: now,
      updated_at: now,
    },
    {
      enterprise_id: createdEnterprises[0].id,
      name: "Filial Zona Sul",
      slug: "filial-zona-sul",
      address: "Rua das Flores, 50",
      created_at: now,
      updated_at: now,
    },
    {
      enterprise_id: createdEnterprises[1].id,
      name: "Filial Matriz",
      slug: "filial-matriz",
      address: "Av. Sugestões, 321",
      created_at: now,
      updated_at: now,
    },
    {
      enterprise_id: createdEnterprises[1].id,
      name: "Filial Norte",
      slug: "filial-norte",
      address: "Rua do Comércio, 200",
      created_at: now,
      updated_at: now,
    },
  ]);

  // 4.2 Manifests (um por enterprise)
  await knex("manifests").insert([
    {
      enterprise_id: createdEnterprises[0].id,
      name: "MentionOne Alpha",
      short_name: "Alpha",
      start_url: "/",
      display: "standalone",
      theme_color: "#3477E8",
      background_color: "#ffffff",
      icons: JSON.stringify([
        { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ]),
      extra: JSON.stringify({}),
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      enterprise_id: createdEnterprises[1].id,
      name: "MentionOne Beta",
      short_name: "Beta",
      start_url: "/",
      display: "standalone",
      theme_color: "#34E877",
      background_color: "#ffffff",
      icons: JSON.stringify([
        { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ]),
      extra: JSON.stringify({}),
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);

  // 5. Vínculo user_enterprises: admin1→alpha, admin2→beta
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

  // 6. Subscription: uma para cada enterprise (usando os IDs retornados dos plan_prices)
  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 1); // 1 mês a partir de hoje

  // Encontrar plan_price_id para Starter e Pro
  const starterPlanPrice = await knex("plan_prices")
    .join("plans", "plan_prices.plan_id", "plans.id")
    .where("plans.name", "Starter")
    .first();

  const proPlanPrice = await knex("plan_prices")
    .join("plans", "plan_prices.plan_id", "plans.id")
    .where("plans.name", "Pro")
    .first();

  await knex("subscriptions").insert([
    {
      enterprise_id: createdEnterprises[0].id,
      plan_price_id: starterPlanPrice?.id || createdPlanPrices[0].id,
      status: "active",
      start_date: startDate,
      end_date: endDate,
    },
    {
      enterprise_id: createdEnterprises[1].id,
      plan_price_id: proPlanPrice?.id || createdPlanPrices[1].id,
      status: "active",
      start_date: startDate,
      end_date: endDate,
    },
  ]);

  // 7. Cada enterprise com uma box (com slug único global)
  const boxesInput = [
    {
      enterprise_id: createdEnterprises[0].id,
      name: "Caixa Recepção",
      location: "Recepção",
      slug: "caixa-recepcao-alpha",
    },
    {
      enterprise_id: createdEnterprises[1].id,
      name: "Caixa Central",
      location: "Entrada Principal",
      slug: "caixa-central-beta",
    },
  ];

  const boxes = await knex("boxes")
    .insert(boxesInput)
    .returning(["id", "enterprise_id", "slug"]);

  // 8. Adicionar branding das boxes (opcional)
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

  // 9. Cada box com 2 feedbacks
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

  console.log("✅ Seed concluído com sucesso!");
  console.log(`   - ${createdPlans.length} plan(s) criado(s)`);
  console.log(`   - ${createdPlanPrices.length} preço(s) de plano criado(s)`);
  console.log(`   - ${createdUsers.length} usuário(s) criado(s)`);
  console.log(`   - ${createdEnterprises.length} empresa(s) criada(s)`);
  console.log(`   - 4 filial(is) criada(s)`);
  console.log(`   - ${boxes.length} caixa(s) criada(s)`);
  console.log(`   - 4 feedback(s) criado(s)`);
}
