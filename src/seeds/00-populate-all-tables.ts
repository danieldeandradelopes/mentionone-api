import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  console.log("🌱 Iniciando população de todas as tabelas...\n");

  try {
    // 1. Verificar se já existem dados
    const existingProducts = await knex("products").count("* as count").first();
    const existingOrders = await knex("orders").count("* as count").first();

    if (Number(existingProducts?.count) > 0) {
      console.log("⚠️  Produtos já existem na base de dados. Pulando...");
    } else {
      console.log("📦 Populando tabela de produtos...");
      await knex("products").insert([
        {
          enterprise_id: 1, // Assumindo que existe uma barbearia com ID 1
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
          enterprise_id: 1,
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
          enterprise_id: 1,
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
          enterprise_id: 1,
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
          enterprise_id: 1,
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
          enterprise_id: 1,
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
          enterprise_id: 1,
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
          enterprise_id: 1,
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
      console.log("✅ Produtos inseridos com sucesso!");
    }

    // 2. Criar pedidos se não existirem
    if (Number(existingOrders?.count) > 0) {
      console.log("⚠️  Pedidos já existem na base de dados. Pulando...");
    } else {
      console.log("🛒 Populando tabela de pedidos...");

      // Buscar produtos para criar pedidos
      const products = await knex("products")
        .where("is_active", true)
        .where("is_deleted", false)
        .limit(8);

      if (products.length > 0) {
        // Criar pedidos
        const orders = await knex("orders")
          .insert([
            {
              enterprise_id: 1,
              client_id: 1, // Assumindo que existe um usuário com ID 1
              total: 74.4,
              discount: 1.25,
              status: "confirmed",
              notes: "Cliente preferencial, entrega rápida",
              is_deleted: false,
            },
            {
              enterprise_id: 1,
              client_id: 1,
              total: 109.8,
              discount: 12.9,
              status: "pending",
              notes: "Primeira compra do cliente",
              is_deleted: false,
            },
            {
              enterprise_id: 1,
              client_id: 1,
              total: 89.9,
              discount: 0,
              status: "canceled",
              notes: "Cliente cancelou por mudança de endereço",
              is_deleted: false,
            },
          ])
          .returning("*");

        // Criar itens dos pedidos
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

        console.log("✅ Pedidos e itens inseridos com sucesso!");
      }
    }

    console.log("\n🎉 População de dados concluída com sucesso!");
    console.log("📊 Dados disponíveis:");
    console.log("   - Produtos físicos e digitais");
    console.log("   - Pedidos com diferentes status");
    console.log("   - Itens de pedido com preços variados");
    console.log("   - Produtos com estoque baixo e inativos para testes");
  } catch (error) {
    console.error("❌ Erro ao popular as tabelas:", error);
    throw error;
  }
}
