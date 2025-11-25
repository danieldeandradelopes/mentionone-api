import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  console.log("💇 Populando tabela de serviços...");

  // Buscar barbearias existentes
  const Enterprises = await knex("Enterprise").select("id", "name");

  if (Enterprises.length === 0) {
    console.log(
      "⚠️  Nenhuma barbearia encontrada. Execute primeiro o seed de barbearias."
    );
    return;
  }

  // Verificar se já existem serviços
  const existingServices = await knex("services")
    .whereIn(
      "enterprise_id",
      Enterprises.map((shop) => shop.id)
    )
    .select("id");

  if (existingServices.length > 0) {
    console.log("⚠️  Serviços já existem. Pulando criação.");
    return;
  }

  // Diferentes tipos de serviços para cada barbearia
  const serviceTemplates = [
    // Barbearia Clássica - Serviços tradicionais
    [
      {
        title: "Corte Clássico",
        description: "Corte tradicional masculino com tesoura e navalha",
        price: 2500, // R$ 25,00 em centavos
        duration: 30,
      },
      {
        title: "Barba Completa",
        description: "Aparar e modelar barba com navalha quente",
        price: 2000, // R$ 20,00 em centavos
        duration: 25,
      },
      {
        title: "Corte + Barba",
        description: "Corte clássico + barba completa",
        price: 4000, // R$ 40,00 em centavos
        duration: 50,
      },
      {
        title: "Bigode",
        description: "Aparar e modelar bigode",
        price: 1500, // R$ 15,00 em centavos
        duration: 15,
      },
      {
        title: "Sobrancelha",
        description: "Design e limpeza de sobrancelhas",
        price: 1200, // R$ 12,00 em centavos
        duration: 10,
      },
    ],
    // Barbearia Moderna - Serviços contemporâneos
    [
      {
        title: "Corte Moderno",
        description: "Corte com técnicas modernas e acabamento perfeito",
        price: 3500, // R$ 35,00 em centavos
        duration: 40,
      },
      {
        title: "Fade",
        description: "Degradê moderno com máquina e navalha",
        price: 3000, // R$ 30,00 em centavos
        duration: 35,
      },
      {
        title: "Barba Estilizada",
        description: "Design de barba com técnicas avançadas",
        price: 2500, // R$ 25,00 em centavos
        duration: 30,
      },
      {
        title: "Corte + Fade",
        description: "Corte moderno + fade",
        price: 5000, // R$ 50,00 em centavos
        duration: 60,
      },
      {
        title: "Tratamento Capilar",
        description: "Hidratação e tratamento dos cabelos",
        price: 2000, // R$ 20,00 em centavos
        duration: 20,
      },
      {
        title: "Design de Barba",
        description: "Criação de desenhos e formas na barba",
        price: 4000, // R$ 40,00 em centavos
        duration: 45,
      },
    ],
    // Barbearia Vintage - Serviços retrô
    [
      {
        title: "Corte Vintage",
        description: "Corte clássico com estilo retrô dos anos 50",
        price: 3000, // R$ 30,00 em centavos
        duration: 35,
      },
      {
        title: "Barba Vintage",
        description: "Barba tradicional com acabamento clássico",
        price: 2200, // R$ 22,00 em centavos
        duration: 25,
      },
      {
        title: "Bigode Vintage",
        description: "Bigode estilo clássico e elegante",
        price: 1800, // R$ 18,00 em centavos
        duration: 20,
      },
      {
        title: "Corte + Barba Vintage",
        description: "Pacote completo com estilo vintage",
        price: 4500, // R$ 45,00 em centavos
        duration: 55,
      },
      {
        title: "Pompadour",
        description: "Corte pompadour clássico",
        price: 3500, // R$ 35,00 em centavos
        duration: 40,
      },
    ],
    // Barbearia Premium - Serviços de luxo
    [
      {
        title: "Corte Premium",
        description: "Corte de luxo com técnicas exclusivas",
        price: 6000, // R$ 60,00 em centavos
        duration: 60,
      },
      {
        title: "Barba de Luxo",
        description: "Tratamento completo da barba com produtos premium",
        price: 4500, // R$ 45,00 em centavos
        duration: 45,
      },
      {
        title: "Pacote VIP",
        description: "Corte + barba + tratamento facial completo",
        price: 12000, // R$ 120,00 em centavos
        duration: 90,
      },
      {
        title: "Design Artístico",
        description: "Criação de cortes e barbas artísticas únicas",
        price: 8000, // R$ 80,00 em centavos
        duration: 75,
      },
      {
        title: "Tratamento Facial",
        description: "Limpeza e hidratação facial completa",
        price: 3500, // R$ 35,00 em centavos
        duration: 30,
      },
      {
        title: "Massagem Capilar",
        description: "Massagem relaxante no couro cabeludo",
        price: 2500, // R$ 25,00 em centavos
        duration: 20,
      },
      {
        title: "Consultoria de Estilo",
        description: "Análise e recomendação de estilo personalizado",
        price: 5000, // R$ 50,00 em centavos
        duration: 30,
      },
    ],
  ];

  const servicesData: any[] = [];

  Enterprises.forEach((shop, shopIndex) => {
    const shopServices = serviceTemplates[shopIndex % serviceTemplates.length];

    shopServices.forEach((service) => {
      servicesData.push({
        ...service,
        enterprise_id: shop.id,
      });
    });
  });

  const services = await knex("services").insert(servicesData).returning("*");

  console.log("✅ Serviços inseridos com sucesso!");
  console.log(`💇 Criados ${services.length} serviços`);
  console.log(`🏪 Distribuídos em ${Enterprises.length} barbearias`);

  // Mostrar resumo por barbearia
  Enterprises.forEach((shop, index) => {
    const shopServices = services.filter(
      (service) => service.enterprise_id === shop.id
    );
    const totalPriceCents = shopServices.reduce(
      (sum, service) => sum + service.price,
      0
    );
    const avgPriceCents = totalPriceCents / shopServices.length;
    const avgPrice = (avgPriceCents / 100).toFixed(2);

    console.log(
      `   - ${shop.name}: ${shopServices.length} serviços (média: R$ ${avgPrice})`
    );
  });
}
