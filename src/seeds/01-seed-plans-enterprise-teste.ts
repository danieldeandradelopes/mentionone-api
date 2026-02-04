import { Knex } from "knex";
import bcrypt from "bcryptjs";

type PlanInput = {
  name: string;
  description: string;
  features: {
    max_boxes: number | null;
    max_responses_per_month: number | null;
    can_access_reports: boolean;
    can_access_advanced_charts: boolean;
    can_filter_feedbacks: boolean;
    can_export_csv: boolean;
    show_mentionone_branding: boolean;
  };
  monthly_price: number;
};

type IdName = { id: number; name: string };
type IdEmail = { id: number; email: string };
type EnterpriseRow = { id: number; name: string; subdomain: string | null };
type PlanPriceRow = { id: number; plan_id: number };
type BoxRow = { id: number; slug: string; enterprise_id: number };
type BranchRow = { id: number; enterprise_id: number; slug: string };

const planInputs: PlanInput[] = [
  {
    name: "Free",
    description: "Plano gratuito com 15 respostas por mes e 1 caixa",
    features: {
      max_boxes: 1,
      max_responses_per_month: 15,
      can_access_reports: false,
      can_access_advanced_charts: false,
      can_filter_feedbacks: false,
      can_export_csv: false,
      show_mentionone_branding: true,
    },
    monthly_price: 0,
  },
  {
    name: "Plano 9,90",
    description: "Plano com 1 caixa e respostas ilimitadas",
    features: {
      max_boxes: 1,
      max_responses_per_month: null,
      can_access_reports: true,
      can_access_advanced_charts: true,
      can_filter_feedbacks: true,
      can_export_csv: true,
      show_mentionone_branding: false,
    },
    monthly_price: 990,
  },
  {
    name: "Plano 49,90",
    description: "Plano com ate 5 caixas e respostas ilimitadas",
    features: {
      max_boxes: 5,
      max_responses_per_month: null,
      can_access_reports: true,
      can_access_advanced_charts: true,
      can_filter_feedbacks: true,
      can_export_csv: true,
      show_mentionone_branding: false,
    },
    monthly_price: 4990,
  },
];

const superadminEmail = "danieldeandradelopes@gmail.com";
const superadminPassword = "SudoNov@Fas3";
const adminEmail = "admin1@mentionone.com";
const adminPassword = "admin123";
const enterpriseName = "teste";
const enterpriseSubdomain = "teste";

async function upsertPlan(knex: Knex, plan: PlanInput): Promise<IdName> {
  const features = JSON.stringify(plan.features);
  const existing = await knex("plans").where({ name: plan.name }).first();

  if (!existing) {
    const [created] = (await knex("plans")
      .insert({
        name: plan.name,
        description: plan.description,
        features,
      })
      .returning(["id", "name"])) as IdName[];
    return created;
  }

  await knex("plans").where({ id: existing.id }).update({
    description: plan.description,
    features,
  });

  return existing;
}

async function upsertPlanPrice(
  knex: Knex,
  planId: number,
  monthlyPrice: number,
): Promise<PlanPriceRow> {
  const existing = await knex("plan_prices")
    .where({ plan_id: planId, billing_cycle: "monthly" })
    .first();

  if (!existing) {
    const [created] = (await knex("plan_prices")
      .insert({
        plan_id: planId,
        billing_cycle: "monthly",
        price: monthlyPrice,
      })
      .returning(["id", "plan_id"])) as PlanPriceRow[];
    return created;
  }

  if (existing.price !== monthlyPrice) {
    await knex("plan_prices")
      .where({ id: existing.id })
      .update({ price: monthlyPrice });
  }

  return existing;
}

async function upsertUser(knex: Knex): Promise<IdEmail> {
  const passwordHash = bcrypt.hashSync(superadminPassword, 8);
  const existing = await knex("users")
    .where({ email: superadminEmail })
    .first();

  if (!existing) {
    const [created] = (await knex("users")
      .insert({
        name: "Daniel de Andrade Lopes",
        email: superadminEmail,
        password: passwordHash,
        access_level: "superadmin",
      })
      .returning(["id", "email"])) as IdEmail[];
    return created;
  }

  await knex("users").where({ id: existing.id }).update({
    name: "Daniel de Andrade Lopes",
    password: passwordHash,
    access_level: "superadmin",
  });

  return existing;
}

async function upsertAdminUser(knex: Knex): Promise<IdEmail> {
  const passwordHash = bcrypt.hashSync(adminPassword, 8);
  const existing = await knex("users").where({ email: adminEmail }).first();

  if (!existing) {
    const [created] = (await knex("users")
      .insert({
        name: "Admin MentionOne",
        email: adminEmail,
        password: passwordHash,
        access_level: "admin",
      })
      .returning(["id", "email"])) as IdEmail[];
    return created;
  }

  await knex("users").where({ id: existing.id }).update({
    name: "Admin MentionOne",
    password: passwordHash,
    access_level: "admin",
  });

  return existing;
}

async function upsertEnterprise(knex: Knex): Promise<EnterpriseRow> {
  let existing = await knex("enterprises")
    .where({ subdomain: enterpriseSubdomain })
    .first();

  if (!existing) {
    existing = await knex("enterprises")
      .where({ name: enterpriseName })
      .first();
  }

  const payload = {
    name: enterpriseName,
    cover: null,
    address: "Rua das Caixas, 999",
    description: "Enterprise de teste",
    subdomain: enterpriseSubdomain,
    document: "12345678000191",
    document_type: "cnpj",
    email: "contato@teste.com",
    timezone: "America/Sao_Paulo",
    updated_at: new Date(),
  };

  if (!existing) {
    const [created] = (await knex("enterprises")
      .insert({
        ...payload,
        created_at: new Date(),
      })
      .returning(["id", "name", "subdomain"])) as EnterpriseRow[];
    return created;
  }

  await knex("enterprises").where({ id: existing.id }).update(payload);

  return existing;
}

async function ensureUserEnterprise(
  knex: Knex,
  userId: number,
  enterpriseId: number,
) {
  const existing = await knex("user_enterprises")
    .where({
      user_id: userId,
      enterprise_id: enterpriseId,
    })
    .first();

  if (!existing) {
    await knex("user_enterprises").insert({
      user_id: userId,
      enterprise_id: enterpriseId,
      role: "admin",
    });
    return;
  }

  if (existing.role !== "admin") {
    await knex("user_enterprises")
      .where({ id: existing.id })
      .update({ role: "admin" });
  }
}

async function upsertSubscription(
  knex: Knex,
  enterpriseId: number,
  planPriceId: number,
) {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setFullYear(endDate.getFullYear() + 1);

  const existing = await knex("subscriptions")
    .where({ enterprise_id: enterpriseId, status: "active" })
    .first();

  if (!existing) {
    await knex("subscriptions").insert({
      enterprise_id: enterpriseId,
      plan_price_id: planPriceId,
      status: "active",
      start_date: startDate,
      end_date: endDate,
    });
    return;
  }

  await knex("subscriptions").where({ id: existing.id }).update({
    plan_price_id: planPriceId,
    start_date: startDate,
    end_date: endDate,
  });
}

async function upsertBranch(
  knex: Knex,
  input: {
    enterprise_id: number;
    name: string;
    slug: string;
    address?: string | null;
  },
): Promise<BranchRow> {
  const existing = await knex("branches")
    .where({ enterprise_id: input.enterprise_id, slug: input.slug })
    .first();

  if (!existing) {
    const [created] = (await knex("branches")
      .insert({
        enterprise_id: input.enterprise_id,
        name: input.name,
        slug: input.slug,
        address: input.address ?? null,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning(["id", "enterprise_id", "slug"])) as BranchRow[];
    return created;
  }

  await knex("branches")
    .where({ id: existing.id })
    .update({
      name: input.name,
      address: input.address ?? null,
      updated_at: new Date(),
    });

  return existing;
}

async function upsertBox(
  knex: Knex,
  input: {
    enterprise_id: number;
    name: string;
    location: string;
    slug: string;
  },
): Promise<BoxRow> {
  const existing = await knex("boxes").where({ slug: input.slug }).first();

  if (!existing) {
    const [created] = (await knex("boxes")
      .insert(input)
      .returning(["id", "slug", "enterprise_id"])) as BoxRow[];
    return created;
  }

  await knex("boxes").where({ id: existing.id }).update({
    name: input.name,
    location: input.location,
    enterprise_id: input.enterprise_id,
    updated_at: new Date(),
  });

  return existing;
}

async function upsertBoxBranding(
  knex: Knex,
  input: {
    box_id: number;
    primary_color: string;
    secondary_color: string;
    logo_url: string;
    client_name: string;
  },
) {
  const existing = await knex("boxes_branding")
    .where({ box_id: input.box_id })
    .first();

  if (!existing) {
    await knex("boxes_branding").insert({
      ...input,
      created_at: new Date(),
      updated_at: new Date(),
    });
    return;
  }

  await knex("boxes_branding").where({ id: existing.id }).update({
    primary_color: input.primary_color,
    secondary_color: input.secondary_color,
    logo_url: input.logo_url,
    client_name: input.client_name,
    updated_at: new Date(),
  });
}

export async function seed(knex: Knex) {
  console.log("Iniciando seed de planos e enterprise teste...");

  const createdPlans: IdName[] = [];
  for (const plan of planInputs) {
    const created = await upsertPlan(knex, plan);
    createdPlans.push(created);
  }

  const planPriceByName: Record<string, number> = {};
  for (const plan of planInputs) {
    const created = createdPlans.find((item) => item.name === plan.name);
    if (!created) continue;
    const planPrice = await upsertPlanPrice(
      knex,
      created.id,
      plan.monthly_price,
    );
    planPriceByName[plan.name] = planPrice.id;
  }

  const user = await upsertUser(knex);
  const adminUser = await upsertAdminUser(knex);
  const enterprise = await upsertEnterprise(knex);

  await ensureUserEnterprise(knex, user.id, enterprise.id);
  await ensureUserEnterprise(knex, adminUser.id, enterprise.id);

  const paidPlanPriceId = planPriceByName["Plano 49,90"];
  if (paidPlanPriceId) {
    await upsertSubscription(knex, enterprise.id, paidPlanPriceId);
  }

  const boxes = [
    {
      enterprise_id: enterprise.id,
      name: "Caixa 1",
      location: "Recepcao",
      slug: "teste-caixa-1",
    },
    {
      enterprise_id: enterprise.id,
      name: "Caixa 2",
      location: "Entrada",
      slug: "teste-caixa-2",
    },
  ];

  const createdBoxes: BoxRow[] = [];
  for (const box of boxes) {
    const created = await upsertBox(knex, box);
    createdBoxes.push(created);
  }

  const branches = [
    {
      enterprise_id: enterprise.id,
      name: "Filial Teste Centro",
      slug: "teste-filial-centro",
      address: "Rua das Caixas, 999",
    },
    {
      enterprise_id: enterprise.id,
      name: "Filial Teste Norte",
      slug: "teste-filial-norte",
      address: "Av. Exemplo, 100",
    },
  ];
  for (const branch of branches) {
    await upsertBranch(knex, branch);
  }

  for (const [index, box] of createdBoxes.entries()) {
    await upsertBoxBranding(knex, {
      box_id: box.id,
      primary_color: index === 0 ? "#111111" : "#222222",
      secondary_color: index === 0 ? "#F5F5F5" : "#EDEDED",
      logo_url: "mentionone-logo.png",
      client_name: "teste",
    });
  }

  console.log("Seed finalizado com sucesso.");
}
