import { Knex } from "knex";
import BCryptAdapter from "../infra/Encrypt/BCryptAdapter";
import Phone from "../entities/Phone";
import SocialMedia from "../entities/SocialMedia";

export async function seed(knex: Knex): Promise<void> {
  console.log("🏪 Populando tabela de barbearias...");

  const bcryptAdapter = new BCryptAdapter();
  const hashedPassword = await bcryptAdapter.encrypt("123456");

  // Buscar planos para associar às barbearias
  const plans = await knex("plan_price")
    .join("plan", "plan_price.plan_id", "plan.id")
    .where("plan_price.billing_cycle", "monthly")
    .select("plan_price.id as plan_price_id", "plan.name as plan_name");

  if (plans.length === 0) {
    console.log(
      "⚠️  Nenhum plano encontrado. Execute primeiro o seed de planos."
    );
    return;
  }

  // Criar usuários proprietários das barbearias
  const users = await knex("users")
    .insert([
      {
        name: "João Silva",
        email: "joao@barbeariaclassica.com",
        password: hashedPassword,
        access_level: "admin",
        avatar: "https://via.placeholder.com/150x150/4A90E2/FFFFFF?text=JS",
        phone: "11987654321",
      },
      {
        name: "Maria Santos",
        email: "maria@barbeariamoderna.com",
        password: hashedPassword,
        access_level: "admin",
        avatar: "https://via.placeholder.com/150x150/7ED321/FFFFFF?text=MS",
        phone: "11987654322",
      },
      {
        name: "Carlos Oliveira",
        email: "carlos@barbeariavintage.com",
        password: hashedPassword,
        access_level: "admin",
        avatar: "https://via.placeholder.com/150x150/F5A623/FFFFFF?text=CO",
        phone: "11987654323",
      },
      {
        name: "Ana Costa",
        email: "ana@barbeariapremium.com",
        password: hashedPassword,
        access_level: "admin",
        avatar: "https://via.placeholder.com/150x150/BD10E0/FFFFFF?text=AC",
        phone: "11987654324",
      },
    ])
    .returning("*");

  // Criar barbearias
  const Enterprises = await knex("Enterprise")
    .insert([
      {
        name: "Barbearia Clássica",
        cover:
          "https://via.placeholder.com/800x400/4A90E2/FFFFFF?text=Barbearia+Classica",
        address: "Rua das Flores, 123 - Centro, São Paulo - SP",
        description:
          "Tradição e qualidade desde 1985. Especializada em cortes clássicos e modernos.",
        subdomain: "barbertest",
        latitude: -23.5505,
        longitude: -46.6333,
        document: "12.345.678/0001-90",
        document_type: "cnpj",
        email: "contato@barbeariaclassica.com",
        auto_approve: "false",
        min_advance_minutes: 30,
      },
      {
        name: "Barbearia Moderna",
        cover:
          "https://via.placeholder.com/800x400/7ED321/FFFFFF?text=Barbearia+Moderna",
        address: "Av. Paulista, 1000 - Bela Vista, São Paulo - SP",
        description:
          "Cortes modernos e tendências atuais. Ambiente descontraído e profissional.",
        subdomain: "moderna",
        latitude: -23.5613,
        longitude: -46.6565,
        document: "98.765.432/0001-10",
        document_type: "cnpj",
        email: "contato@barbeariamoderna.com",
        auto_approve: "true",
        min_advance_minutes: 15,
      },
      {
        name: "Barbearia Vintage",
        cover:
          "https://via.placeholder.com/800x400/F5A623/FFFFFF?text=Barbearia+Vintage",
        address: "Rua Augusta, 456 - Consolação, São Paulo - SP",
        description:
          "Estilo retrô e clássico. Especializada em bigodes e barbas tradicionais.",
        subdomain: "vintage",
        latitude: -23.5475,
        longitude: -46.6361,
        document: "11.222.333/0001-44",
        document_type: "cnpj",
        email: "contato@barbeariavintage.com",
        auto_approve: "false",
        min_advance_minutes: 60,
      },
      {
        name: "Barbearia Premium",
        cover:
          "https://via.placeholder.com/800x400/BD10E0/FFFFFF?text=Barbearia+Premium",
        address: "Rua Oscar Freire, 789 - Jardins, São Paulo - SP",
        description:
          "Luxo e sofisticação. Atendimento personalizado e produtos de alta qualidade.",
        subdomain: "premium",
        latitude: -23.5679,
        longitude: -46.6736,
        document: "55.666.777/0001-88",
        document_type: "cnpj",
        email: "contato@barbeariapremium.com",
        auto_approve: "true",
        min_advance_minutes: 10,
      },
    ])
    .returning("*");

  // Criar telefones para as barbearias
  const phones: any[] = [];
  Enterprises.forEach((shop, index) => {
    phones.push(
      {
        enterprise_Id: shop.id,
        phone_number: `1198765432${index + 1}`,
        is_whatsapp: false,
        is_cellphone: true,
      },
      {
        enterprise_Id: shop.id,
        phone_number: `113333444${index + 1}`,
        is_whatsapp: false,
        is_cellphone: true,
      }
    );
  });

  await knex("phones").insert(phones);

  // Criar redes sociais para as barbearias
  const socialMedias: any[] = [];
  Enterprises.forEach((shop, index) => {
    const socials = [
      {
        name: "instagram",
        url: `https://instagram.com/barbearia${shop.subdomain}`,
      },
      {
        name: "facebook",
        url: `https://facebook.com/barbearia${shop.subdomain}`,
      },
      {
        name: "whatsapp",
        url: `https://wa.me/551198765432${index + 1}`,
      },
    ];

    socials.forEach((social) => {
      socialMedias.push({
        enterprise_Id: shop.id,
        name: social.name,
        url: social.url,
        icon: "instagram",
      });
    });
  });

  await knex("social_media").insert(socialMedias);

  console.log("✅ Barbearias inseridas com sucesso!");
  console.log(`🏪 Criadas ${Enterprises.length} barbearias`);
  console.log(`📞 Criados ${phones.length} telefones`);
  console.log(`📱 Criadas ${socialMedias.length} redes sociais`);
}
