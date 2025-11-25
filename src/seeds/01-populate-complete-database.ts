import { Knex } from "knex";
import BCryptAdapter from "../infra/Encrypt/BCryptAdapter";
import Phone from "../entities/Phone";
import SocialMedia from "../entities/SocialMedia";

export async function seed(knex: Knex): Promise<void> {
  console.log("🌱 Iniciando população completa do banco de dados...\n");

  try {
    const bcryptAdapter = new BCryptAdapter();
    const hashedPassword = await bcryptAdapter.encrypt("123456");

    // 1. USUÁRIOS ADMINISTRADORES
    console.log("👤 Criando usuários administradores...");
    const existingUsers = await knex("users").count("* as count").first();

    if (Number(existingUsers?.count) === 0) {
      await knex("users").insert([
        {
          name: "Daniel de Andrade Lopes",
          email: "danieldeandradelopes@gmail.com",
          password: hashedPassword,
          access_level: "superadmin",
          avatar: "https://via.placeholder.com/150x150/4A90E2/FFFFFF?text=DL",
          phone: "11999999999",
        },
        {
          name: "Admin Sistema",
          email: "admin@sistema.com",
          password: hashedPassword,
          access_level: "superadmin",
          avatar: "https://via.placeholder.com/150x150/7ED321/FFFFFF?text=AS",
          phone: "11999999998",
        },
      ]);
      console.log("✅ Usuários administradores criados");
    } else {
      console.log("⚠️  Usuários já existem, pulando...");
    }

    // 2. PLANOS E PREÇOS
    console.log("\n📋 Criando planos e preços...");
    const existingPlans = await knex("plan").count("* as count").first();

    if (Number(existingPlans?.count) === 0) {
      const plans = await knex("plan")
        .insert([
          {
            name: "Básico",
            description: "Plano ideal para barbearias iniciantes",
            features: JSON.stringify({
              max_barbers: 2,
              max_services: 10,
              max_products: 20,
              max_orders_per_month: 100,
              whatsapp_integration: true,
              basic_analytics: true,
              customer_management: true,
              appointment_scheduling: true,
              payment_tracking: false,
              advanced_analytics: false,
              custom_branding: false,
              priority_support: false,
            }),
          },
          {
            name: "Profissional",
            description: "Plano completo para barbearias em crescimento",
            features: JSON.stringify({
              max_barbers: 5,
              max_services: 25,
              max_products: 100,
              max_orders_per_month: 500,
              whatsapp_integration: true,
              basic_analytics: true,
              customer_management: true,
              appointment_scheduling: true,
              payment_tracking: true,
              advanced_analytics: true,
              custom_branding: true,
              priority_support: true,
            }),
          },
          {
            name: "Premium",
            description: "Plano avançado para barbearias estabelecidas",
            features: JSON.stringify({
              max_barbers: -1,
              max_services: -1,
              max_products: -1,
              max_orders_per_month: -1,
              whatsapp_integration: true,
              basic_analytics: true,
              customer_management: true,
              appointment_scheduling: true,
              payment_tracking: true,
              advanced_analytics: true,
              custom_branding: true,
              priority_support: true,
              api_access: true,
              white_label: true,
              dedicated_support: true,
            }),
          },
        ])
        .returning("*");

      await knex("plan_price").insert([
        { plan_id: plans[0].id, billing_cycle: "monthly", price: 29.9 },
        { plan_id: plans[0].id, billing_cycle: "yearly", price: 299.0 },
        { plan_id: plans[1].id, billing_cycle: "monthly", price: 59.9 },
        { plan_id: plans[1].id, billing_cycle: "yearly", price: 599.0 },
        { plan_id: plans[2].id, billing_cycle: "monthly", price: 99.9 },
        { plan_id: plans[2].id, billing_cycle: "yearly", price: 999.0 },
      ]);
      console.log("✅ Planos e preços criados");
    } else {
      console.log("⚠️  Planos já existem, pulando...");
    }

    // 3. BARBEARIAS
    console.log("\n🏪 Criando barbearias...");
    const existingEnterprises = await knex("Enterprise")
      .count("* as count")
      .first();

    if (Number(existingEnterprises?.count) === 0) {
      const planPrices = await knex("plan_price")
        .where("billing_cycle", "monthly")
        .select("id");

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

      // Criar telefones e redes sociais
      const phones: Phone[] = [];
      const socialMedias: SocialMedia[] = [];

      Enterprises.forEach((shop, index) => {
        phones.push(
          {
            enterprise_id: shop.id,
            phone_number: `1198765432${index + 1}`,
            is_whatsapp: false,
            is_cellphone: true,
            id: 1,
          },
          {
            enterprise_id: shop.id,
            phone_number: `113333444${index + 1}`,
            is_whatsapp: false,
            is_cellphone: true,
            id: 2,
          }
        );

        socialMedias.push(
          {
            enterprise_id: shop.id,
            name: "instagram",
            url: `https://instagram.com/barbearia${shop.subdomain}`,
            icon: "instagram",
            id: 1,
          },
          {
            enterprise_id: shop.id,
            name: "facebook",
            url: `https://facebook.com/barbearia${shop.subdomain}`,
            icon: "facebook",
            id: 2,
          },
          {
            enterprise_id: shop.id,
            name: "whatsapp",
            url: `https://wa.me/551198765432${index + 1}`,
            icon: "whatsapp",
            id: 3,
          }
        );
      });

      await knex("phones").insert(phones);
      await knex("social_medias").insert(socialMedias);
      console.log("✅ Barbearias criadas");
    } else {
      console.log("⚠️  Barbearias já existem, pulando...");
    }

    // 4. BARBEIROS
    console.log("\n💇 Criando barbeiros...");
    const existingBarbers = await knex("barbers").count("* as count").first();

    if (Number(existingBarbers?.count) === 0) {
      const Enterprises = await knex("Enterprise").select("id");

      const barberUsers = await knex("users")
        .insert([
          {
            name: "Roberto Mendes",
            email: "roberto@barbeariaclassica.com",
            password: hashedPassword,
            access_level: "barber",
            avatar: "https://via.placeholder.com/150x150/4A90E2/FFFFFF?text=RM",
            phone: "11987654331",
          },
          {
            name: "Pedro Santos",
            email: "pedro@barbeariaclassica.com",
            password: hashedPassword,
            access_level: "barber",
            avatar: "https://via.placeholder.com/150x150/4A90E2/FFFFFF?text=PS",
            phone: "11987654332",
          },
          {
            name: "Lucas Ferreira",
            email: "lucas@barbeariamoderna.com",
            password: hashedPassword,
            access_level: "barber",
            avatar: "https://via.placeholder.com/150x150/7ED321/FFFFFF?text=LF",
            phone: "11987654333",
          },
          {
            name: "Diego Alves",
            email: "diego@barbeariamoderna.com",
            password: hashedPassword,
            access_level: "barber",
            avatar: "https://via.placeholder.com/150x150/7ED321/FFFFFF?text=DA",
            phone: "11987654334",
          },
          {
            name: "Antonio Barbosa",
            email: "antonio@barbeariavintage.com",
            password: hashedPassword,
            access_level: "barber",
            avatar: "https://via.placeholder.com/150x150/F5A623/FFFFFF?text=AB",
            phone: "11987654335",
          },
          {
            name: "Rafael Costa",
            email: "rafael@barbeariapremium.com",
            password: hashedPassword,
            access_level: "barber",
            avatar: "https://via.placeholder.com/150x150/BD10E0/FFFFFF?text=RC",
            phone: "11987654336",
          },
          {
            name: "Gabriel Lima",
            email: "gabriel@barbeariapremium.com",
            password: hashedPassword,
            access_level: "barber",
            avatar: "https://via.placeholder.com/150x150/BD10E0/FFFFFF?text=GL",
            phone: "11987654337",
          },
        ])
        .returning("*");

      const barbers = await knex("barbers")
        .insert([
          {
            user_id: barberUsers[0].id,
            enterprise_id: Enterprises[0].id,
            is_active: true,
            name: "Roberto Mendes",
            bio: "Especialista em cortes clássicos há mais de 15 anos.",
            phone: "11987654331",
            rate: 4.8,
            specialties: "Cortes clássicos, Barba, Bigode",
          },
          {
            user_id: barberUsers[1].id,
            enterprise_id: Enterprises[0].id,
            is_active: true,
            name: "Pedro Santos",
            bio: "Jovem talento com técnicas modernas.",
            phone: "11987654332",
            rate: 4.6,
            specialties: "Cortes modernos, Barba, Degradê",
          },
          {
            user_id: barberUsers[2].id,
            enterprise_id: Enterprises[1].id,
            is_active: true,
            name: "Lucas Ferreira",
            bio: "Especialista em tendências atuais.",
            phone: "11987654333",
            rate: 4.9,
            specialties: "Cortes modernos, Fade, Barba",
          },
          {
            user_id: barberUsers[3].id,
            enterprise_id: Enterprises[1].id,
            is_active: true,
            name: "Diego Alves",
            bio: "Mestre em barbas e bigodes.",
            phone: "11987654334",
            rate: 4.7,
            specialties: "Barba, Bigode, Design de barba",
          },
          {
            user_id: barberUsers[4].id,
            enterprise_id: Enterprises[2].id,
            is_active: true,
            name: "Antonio Barbosa",
            bio: "Tradição e elegância.",
            phone: "11987654335",
            rate: 4.8,
            specialties: "Cortes clássicos, Bigode vintage, Barba tradicional",
          },
          {
            user_id: barberUsers[5].id,
            enterprise_id: Enterprises[3].id,
            is_active: true,
            name: "Rafael Costa",
            bio: "Atendimento premium e personalizado.",
            phone: "11987654336",
            rate: 5.0,
            specialties: "Cortes premium, Barba de luxo, Atendimento VIP",
          },
          {
            user_id: barberUsers[6].id,
            enterprise_id: Enterprises[3].id,
            is_active: true,
            name: "Gabriel Lima",
            bio: "Jovem promessa com técnicas avançadas.",
            phone: "11987654337",
            rate: 4.9,
            specialties:
              "Cortes artísticos, Barba criativa, Técnicas avançadas",
          },
        ])
        .returning("*");

      // Criar horários de trabalho
      const workingHours: WorkingHours[] = [];
      barbers.forEach((barber, index) => {
        for (let day = 1; day <= 5; day++) {
          workingHours.push({
            enterprise_id: barber.enterprise_id,
            week_day: "monday",
            time_slots: ["08:00", "18:00"],
            is_open: true,
            id: index + 1,
          });
        }
      });

      await knex("barber_working_hours").insert(workingHours);
      console.log("✅ Barbeiros criados");
    } else {
      console.log("⚠️  Barbeiros já existem, pulando...");
    }

    // 5. BRANDING
    console.log("\n🎨 Criando branding...");
    const existingBranding = await knex("branding").count("* as count").first();

    if (Number(existingBranding?.count) === 0) {
      const Enterprises = await knex("Enterprise").select("id", "name");

      const brandingThemes = [
        {
          name: "Tema Clássico",
          theme: "light",
          primary_color: "#4A90E2",
          secondary_color: "#7ED321",
          tertiary_color: "#F5A623",
          quaternary_color: "#BD10E0",
          background_color: "#FFFFFF",
          surface_color: "#F8F9FA",
          text_primary_color: "#212529",
          text_secondary_color: "#6C757D",
          border_color: "#DEE2E6",
          error_color: "#DC3545",
          success_color: "#28A745",
          btn_primary_bg: "#4A90E2",
          btn_primary_text: "#FFFFFF",
          btn_secondary_bg: "#6C757D",
          btn_secondary_text: "#FFFFFF",
          btn_tertiary_bg: "#F8F9FA",
          btn_tertiary_text: "#212529",
          btn_quaternary_bg: "#E9ECEF",
          btn_quaternary_text: "#495057",
          heading_color: "#212529",
          subheading_color: "#495057",
          text_default: "#212529",
          text_muted: "#6C757D",
          link_color: "#4A90E2",
          link_hover_color: "#357ABD",
          input_bg: "#FFFFFF",
          input_text: "#212529",
          input_border: "#CED4DA",
          input_placeholder: "#6C757D",
          input_focus_border: "#4A90E2",
          app_background: "#F8F9FA",
          card_background: "#FFFFFF",
          card_border: "#DEE2E6",
          card_shadow: "0 2px 4px rgba(0,0,0,0.1)",
          drawer_bg: "#FFFFFF",
          drawer_text: "#212529",
          drawer_border: "#DEE2E6",
          drawer_hover_bg: "#F8F9FA",
          drawer_active_bg: "#E3F2FD",
          logo: "https://via.placeholder.com/200x80/4A90E2/FFFFFF?text=Classica",
          favicon: "https://via.placeholder.com/32x32/4A90E2/FFFFFF?text=C",
        },
        {
          name: "Tema Moderno",
          theme: "light",
          primary_color: "#7ED321",
          secondary_color: "#50E3C2",
          tertiary_color: "#9013FE",
          quaternary_color: "#417505",
          background_color: "#FFFFFF",
          surface_color: "#F5F7FA",
          text_primary_color: "#1A1A1A",
          text_secondary_color: "#666666",
          border_color: "#E1E5E9",
          error_color: "#FF6B6B",
          success_color: "#51CF66",
          btn_primary_bg: "#7ED321",
          btn_primary_text: "#FFFFFF",
          btn_secondary_bg: "#50E3C2",
          btn_secondary_text: "#FFFFFF",
          btn_tertiary_bg: "#F5F7FA",
          btn_tertiary_text: "#1A1A1A",
          btn_quaternary_bg: "#E1E5E9",
          btn_quaternary_text: "#666666",
          heading_color: "#1A1A1A",
          subheading_color: "#333333",
          text_default: "#1A1A1A",
          text_muted: "#666666",
          link_color: "#7ED321",
          link_hover_color: "#6BC41A",
          input_bg: "#FFFFFF",
          input_text: "#1A1A1A",
          input_border: "#E1E5E9",
          input_placeholder: "#999999",
          input_focus_border: "#7ED321",
          app_background: "#F5F7FA",
          card_background: "#FFFFFF",
          card_border: "#E1E5E9",
          card_shadow: "0 4px 12px rgba(0,0,0,0.15)",
          drawer_bg: "#FFFFFF",
          drawer_text: "#1A1A1A",
          drawer_border: "#E1E5E9",
          drawer_hover_bg: "#F5F7FA",
          drawer_active_bg: "#E8F5E8",
          logo: "https://via.placeholder.com/200x80/7ED321/FFFFFF?text=Moderna",
          favicon: "https://via.placeholder.com/32x32/7ED321/FFFFFF?text=M",
        },
        {
          name: "Tema Vintage",
          theme: "light",
          primary_color: "#F5A623",
          secondary_color: "#B8E986",
          tertiary_color: "#D0021B",
          quaternary_color: "#4A4A4A",
          background_color: "#FFF8E1",
          surface_color: "#FFFFFF",
          text_primary_color: "#2C2C2C",
          text_secondary_color: "#757575",
          border_color: "#D4AF37",
          error_color: "#D32F2F",
          success_color: "#388E3C",
          btn_primary_bg: "#F5A623",
          btn_primary_text: "#FFFFFF",
          btn_secondary_bg: "#B8E986",
          btn_secondary_text: "#2C2C2C",
          btn_tertiary_bg: "#FFF8E1",
          btn_tertiary_text: "#2C2C2C",
          btn_quaternary_bg: "#D4AF37",
          btn_quaternary_text: "#FFFFFF",
          heading_color: "#2C2C2C",
          subheading_color: "#4A4A4A",
          text_default: "#2C2C2C",
          text_muted: "#757575",
          link_color: "#F5A623",
          link_hover_color: "#E65100",
          input_bg: "#FFFFFF",
          input_text: "#2C2C2C",
          input_border: "#D4AF37",
          input_placeholder: "#9E9E9E",
          input_focus_border: "#F5A623",
          app_background: "#FFF8E1",
          card_background: "#FFFFFF",
          card_border: "#D4AF37",
          card_shadow: "0 2px 8px rgba(245,166,35,0.3)",
          drawer_bg: "#FFFFFF",
          drawer_text: "#2C2C2C",
          drawer_border: "#D4AF37",
          drawer_hover_bg: "#FFF8E1",
          drawer_active_bg: "#FFE0B2",
          logo: "https://via.placeholder.com/200x80/F5A623/FFFFFF?text=Vintage",
          favicon: "https://via.placeholder.com/32x32/F5A623/FFFFFF?text=V",
        },
        {
          name: "Tema Premium",
          theme: "dark",
          primary_color: "#BD10E0",
          secondary_color: "#50E3C2",
          tertiary_color: "#F5A623",
          quaternary_color: "#4A90E2",
          background_color: "#1A1A1A",
          surface_color: "#2D2D2D",
          text_primary_color: "#FFFFFF",
          text_secondary_color: "#B0B0B0",
          border_color: "#404040",
          error_color: "#FF6B6B",
          success_color: "#51CF66",
          btn_primary_bg: "#BD10E0",
          btn_primary_text: "#FFFFFF",
          btn_secondary_bg: "#50E3C2",
          btn_secondary_text: "#1A1A1A",
          btn_tertiary_bg: "#2D2D2D",
          btn_tertiary_text: "#FFFFFF",
          btn_quaternary_bg: "#404040",
          btn_quaternary_text: "#FFFFFF",
          heading_color: "#FFFFFF",
          subheading_color: "#E0E0E0",
          text_default: "#FFFFFF",
          text_muted: "#B0B0B0",
          link_color: "#BD10E0",
          link_hover_color: "#9C0DB8",
          input_bg: "#2D2D2D",
          input_text: "#FFFFFF",
          input_border: "#404040",
          input_placeholder: "#808080",
          input_focus_border: "#BD10E0",
          app_background: "#1A1A1A",
          card_background: "#2D2D2D",
          card_border: "#404040",
          card_shadow: "0 4px 20px rgba(189,16,224,0.3)",
          drawer_bg: "#2D2D2D",
          drawer_text: "#FFFFFF",
          drawer_border: "#404040",
          drawer_hover_bg: "#404040",
          drawer_active_bg: "#BD10E0",
          logo: "https://via.placeholder.com/200x80/BD10E0/FFFFFF?text=Premium",
          favicon: "https://via.placeholder.com/32x32/BD10E0/FFFFFF?text=P",
        },
      ];

      const brandings = Enterprises.map((shop, index) => ({
        enterprise_id: shop.id,
        name: brandingThemes[index].name,
        theme: brandingThemes[index].theme as "light" | "dark" | "custom",
        id: index + 1,
      }));

      await knex("branding").insert(brandings);
      console.log("✅ Branding criado");
    } else {
      console.log("⚠️  Branding já existe, pulando...");
    }

    // 6. ASSINATURAS
    console.log("\n💳 Criando assinaturas...");
    const existingSubscriptions = await knex("subscription")
      .count("* as count")
      .first();

    if (Number(existingSubscriptions?.count) === 0) {
      const Enterprises = await knex("Enterprise").select(
        "id",
        "plan_price_id"
      );
      const now = new Date();

      const subscriptions = Enterprises.map((shop, index) => {
        const startDate = new Date(now);
        startDate.setDate(startDate.getDate() - index * 30);

        let endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        let trialEndDate = new Date(startDate);
        trialEndDate.setDate(trialEndDate.getDate() + 7);

        let status = "active";
        if (index === 1) status = "past_due";
        if (index === 2) status = "canceled";

        return {
          enterprise_id: shop.id,
          plan_price_id: shop.plan_price_id,
          status: status,
          start_date: startDate.toISOString().split("T")[0],
          end_date: endDate.toISOString().split("T")[0],
          trial_end_date: trialEndDate.toISOString().split("T")[0],
        };
      });

      await knex("subscription").insert(subscriptions);
      console.log("✅ Assinaturas criadas");
    } else {
      console.log("⚠️  Assinaturas já existem, pulando...");
    }

    // 7. PRODUTOS
    console.log("\n📦 Criando produtos...");
    const existingProducts = await knex("products").count("* as count").first();

    if (Number(existingProducts?.count) === 0) {
      const Enterprises = await knex("Enterprise").select("id");

      await knex("products").insert([
        {
          enterprise_id: Enterprises[0].id,
          title: "Pomada Modeladora Premium",
          description:
            "Pomada de alta qualidade para modelar cabelos com fixação média e brilho natural.",
          image_url:
            "https://via.placeholder.com/300x300/4A90E2/FFFFFF?text=Pomada",
          price: 25.9,
          stock: 50,
          type: "physical",
          category: "Pomadas",
          is_active: true,
          is_deleted: false,
        },
        {
          enterprise_id: Enterprises[0].id,
          title: "Gel Fixador Extra Forte",
          description:
            "Gel com fixação extra forte, ideal para penteados que precisam durar o dia todo.",
          image_url:
            "https://via.placeholder.com/300x300/7ED321/FFFFFF?text=Gel",
          price: 18.5,
          stock: 30,
          type: "physical",
          category: "Géis",
          is_active: true,
          is_deleted: false,
        },
        {
          enterprise_id: Enterprises[1].id,
          title: "Shampoo Antirresíduos",
          description:
            "Shampoo especial para remover resíduos de produtos e limpar profundamente o couro cabeludo.",
          image_url:
            "https://via.placeholder.com/300x300/F5A623/FFFFFF?text=Shampoo",
          price: 32.0,
          stock: 25,
          type: "physical",
          category: "Shampoos",
          is_active: true,
          is_deleted: false,
        },
        {
          enterprise_id: Enterprises[1].id,
          title: "Creme para Barba Hidratante",
          description:
            "Creme nutritivo para manter a barba macia, hidratada e com aspecto saudável.",
          image_url:
            "https://via.placeholder.com/300x300/BD10E0/FFFFFF?text=Creme+Barba",
          price: 28.75,
          stock: 40,
          type: "physical",
          category: "Barba",
          is_active: true,
          is_deleted: false,
        },
        {
          enterprise_id: Enterprises[2].id,
          title: "Óleo para Barba Premium",
          description:
            "Óleo essencial para barba com ingredientes naturais, proporcionando maciez e brilho.",
          image_url:
            "https://via.placeholder.com/300x300/50E3C2/FFFFFF?text=Oleo+Barba",
          price: 45.0,
          stock: 20,
          type: "physical",
          category: "Barba",
          is_active: true,
          is_deleted: false,
        },
        {
          enterprise_id: Enterprises[2].id,
          title: "E-book: Guia Completo de Cuidados Masculinos",
          description:
            "E-book digital com dicas profissionais para cuidados com cabelo, barba e pele masculina.",
          image_url:
            "https://via.placeholder.com/300x300/9013FE/FFFFFF?text=E-book",
          price: 19.9,
          stock: 999,
          type: "digital",
          category: "E-books",
          is_active: true,
          is_deleted: false,
        },
        {
          enterprise_id: Enterprises[3].id,
          title: "Curso Online: Técnicas de Corte Modernas",
          description:
            "Curso digital com videoaulas ensinando as principais técnicas de corte masculino da atualidade.",
          image_url:
            "https://via.placeholder.com/300x300/417505/FFFFFF?text=Curso",
          price: 89.9,
          stock: 999,
          type: "digital",
          category: "Cursos",
          is_active: true,
          is_deleted: false,
        },
        {
          enterprise_id: Enterprises[3].id,
          title: "Kit Completo Barbearia",
          description:
            "Kit com pomada, gel, shampoo e creme para barba. Perfeito para presentear.",
          image_url:
            "https://via.placeholder.com/300x300/4A90E2/FFFFFF?text=Kit+Completo",
          price: 89.9,
          stock: 15,
          type: "physical",
          category: "Kits",
          is_active: true,
          is_deleted: false,
        },
      ]);
      console.log("✅ Produtos criados");
    } else {
      console.log("⚠️  Produtos já existem, pulando...");
    }

    // 8. PEDIDOS
    console.log("\n🛒 Criando pedidos...");
    const existingOrders = await knex("orders").count("* as count").first();

    if (Number(existingOrders?.count) === 0) {
      const Enterprises = await knex("Enterprise").select("id");
      const products = await knex("products")
        .where("is_active", true)
        .where("is_deleted", false)
        .limit(5);

      const users = await knex("users").limit(3);

      if (products.length > 0 && users.length > 0) {
        const orders = await knex("orders")
          .insert([
            {
              enterprise_id: Enterprises[0].id,
              client_id: users[0].id,
              total: 74.4,
              discount: 1.25,
              status: "confirmed",
              notes: "Cliente preferencial, entrega rápida",
              is_deleted: false,
            },
            {
              enterprise_id: Enterprises[1].id,
              client_id: users[1]?.id || users[0].id,
              total: 109.8,
              discount: 12.9,
              status: "pending",
              notes: "Primeira compra do cliente",
              is_deleted: false,
            },
            {
              enterprise_id: Enterprises[2].id,
              client_id: users[2]?.id || users[0].id,
              total: 89.9,
              discount: 0,
              status: "canceled",
              notes: "Cliente cancelou por mudança de endereço",
              is_deleted: false,
            },
          ])
          .returning("*");

        await knex("order_items").insert([
          {
            order_id: orders[0].id,
            product_id: products[0].id,
            quantity: 1,
            unit_price: 25.9,
            is_deleted: false,
          },
          {
            order_id: orders[0].id,
            product_id: products[1].id,
            quantity: 1,
            unit_price: 18.5,
            is_deleted: false,
          },
          {
            order_id: orders[0].id,
            product_id: products[3].id,
            quantity: 1,
            unit_price: 28.75,
            is_deleted: false,
          },
          {
            order_id: orders[1].id,
            product_id: products[2].id,
            quantity: 1,
            unit_price: 32.0,
            is_deleted: false,
          },
          {
            order_id: orders[1].id,
            product_id: products[4].id,
            quantity: 1,
            unit_price: 45.0,
            is_deleted: false,
          },
          {
            order_id: orders[1].id,
            product_id: products[5].id,
            quantity: 1,
            unit_price: 19.9,
            is_deleted: false,
          },
          {
            order_id: orders[2].id,
            product_id: products[6].id,
            quantity: 1,
            unit_price: 89.9,
            is_deleted: false,
          },
        ]);
        console.log("✅ Pedidos criados");
      }
    } else {
      console.log("⚠️  Pedidos já existem, pulando...");
    }

    console.log("\n🎉 População completa do banco de dados concluída!");
    console.log("\n📊 Resumo dos dados criados:");
    console.log("   👤 Usuários administradores e barbeiros");
    console.log("   📋 Planos e preços (Básico, Profissional, Premium)");
    console.log("   🏪 4 Barbearias com diferentes características");
    console.log("   💇 7 Barbeiros com especialidades variadas");
    console.log("   🎨 Temas de branding personalizados");
    console.log("   💳 Assinaturas com diferentes status");
    console.log("   📦 Produtos físicos e digitais");
    console.log("   🛒 Pedidos com diferentes status");
    console.log("   📞 Telefones e redes sociais");
    console.log("   ⏰ Horários de trabalho dos barbeiros");
  } catch (error) {
    console.error("❌ Erro ao popular o banco de dados:", error);
    throw error;
  }
}
