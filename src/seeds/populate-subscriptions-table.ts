import { Knex } from "knex";
import Payment from "../entities/Payment";

export async function seed(knex: Knex): Promise<void> {
  console.log("💳 Populando tabela de assinaturas...");

  // Buscar barbearias e planos existentes
  const Enterprises = await knex("Enterprise").select("id", "name");
  const planPrices = await knex("plan_price")
    .join("plan", "plan_price.plan_id", "plan.id")
    .select(
      "plan_price.id",
      "plan.name as plan_name",
      "plan_price.billing_cycle"
    );

  if (Enterprises.length === 0 || planPrices.length === 0) {
    console.log(
      "⚠️  Barbearias ou planos não encontrados. Execute primeiro os seeds correspondentes."
    );
    return;
  }

  // Criar assinaturas para as barbearias
  const subscriptions: any[] = [];
  const now = new Date();

  Enterprises.forEach((shop, index) => {
    const planPrice = planPrices[index % planPrices.length];
    if (!planPrice) return;

    // Calcular datas baseadas no ciclo de cobrança
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - index * 30); // Diferentes datas de início

    let endDate = new Date(startDate);
    let trialEndDate = new Date(startDate);

    if (planPrice.billing_cycle === "monthly") {
      endDate.setMonth(endDate.getMonth() + 1);
      trialEndDate.setDate(trialEndDate.getDate() + 7); // 7 dias de trial
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
      trialEndDate.setDate(trialEndDate.getDate() + 14); // 14 dias de trial
    }

    // Diferentes status para demonstrar cenários
    let status = "active";
    if (index === 1) status = "past_due"; // Barbearia Moderna em atraso
    if (index === 2) status = "canceled"; // Barbearia Vintage cancelada

    subscriptions.push({
      enterprise_id: shop.id,
      plan_price_id: planPrice.id,
      status: status,
      start_date: startDate.toISOString().split("T")[0],
      end_date: endDate.toISOString().split("T")[0],
      trial_end_date: trialEndDate.toISOString().split("T")[0],
    });
  });

  const insertedSubscriptions = await knex("subscription")
    .insert(subscriptions)
    .returning("*");

  // Criar alguns pagamentos para as assinaturas ativas
  const activeSubscriptions = insertedSubscriptions.filter(
    (sub) => sub.status === "active"
  );
  const payments: any[] = [];

  activeSubscriptions.forEach((subscription, index) => {
    const Enterprise = Enterprises.find(
      (bs) => bs.id === subscription.enterprise_id
    );
    const planPrice = planPrices.find(
      (pp) => pp.id === subscription.plan_price_id
    );

    if (!Enterprise || !planPrice) return;

    // Criar pagamentos para os últimos 3 meses
    for (let i = 0; i < 3; i++) {
      const paymentDate = new Date(subscription.start_date);
      paymentDate.setMonth(paymentDate.getMonth() - i);

      payments.push({
        subscription_id: subscription.id,
        amount: planPrice.price || 99.9, // Valor padrão se não houver preço
        status: "paid",
        payment_date: paymentDate.toISOString().split("T")[0],
        due_date: paymentDate.toISOString().split("T")[0],
        created_at: paymentDate.toISOString(),
      });
    }
  });

  if (payments.length > 0) {
    await knex("payment").insert(payments);
  }

  console.log("✅ Assinaturas inseridas com sucesso!");
  console.log(`💳 Criadas ${subscriptions.length} assinaturas`);
  console.log(`💰 Criados ${payments.length} pagamentos`);
  console.log(`📊 Status das assinaturas:`);
  console.log(
    `   - Ativas: ${subscriptions.filter((s) => s.status === "active").length}`
  );
  console.log(
    `   - Em atraso: ${
      subscriptions.filter((s) => s.status === "past_due").length
    }`
  );
  console.log(
    `   - Canceladas: ${
      subscriptions.filter((s) => s.status === "canceled").length
    }`
  );
}
