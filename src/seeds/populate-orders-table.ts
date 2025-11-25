import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Buscar uma barbearia e usuários existentes
  const Enterprise = await knex("Enterprise").first();
  const users = await knex("users").limit(3);

  if (!Enterprise || users.length === 0) {
    console.log(
      "Barbearia ou usuários não encontrados. Execute primeiro os seeds de usuários/barbearia."
    );
    return;
  }

  // Buscar alguns produtos para criar pedidos
  const products = await knex("products")
    .where("is_active", true)
    .where("is_deleted", false)
    .limit(8);

  if (products.length === 0) {
    console.log(
      "Nenhum produto encontrado. Execute primeiro o seed de produtos."
    );
    return;
  }

  // Criar pedidos de exemplo
  const orders = [
    {
      enterprise_Id: Enterprise.id,
      client_id: users[0].id,
      total: 7440, // 2590 + 1850 + 2875 + 125 (desconto) em centavos
      discount: 125, // R$ 1,25 em centavos
      status: "confirmed",
      notes: "Cliente preferencial, entrega rápida",
      is_deleted: false,
    },
    {
      enterprise_Id: Enterprise.id,
      client_id: users[1]?.id || users[0].id,
      total: 10980, // 3200 + 4500 + 1990 + 1290 (desconto) em centavos
      discount: 1290, // R$ 12,90 em centavos
      status: "pending",
      notes: "Primeira compra do cliente",
      is_deleted: false,
    },
    {
      enterprise_Id: Enterprise.id,
      client_id: users[2]?.id || users[0].id,
      total: 8990, // R$ 89,90 em centavos
      discount: 0,
      status: "canceled",
      notes: "Cliente cancelou por mudança de endereço",
      is_deleted: false,
    },
    {
      enterprise_Id: Enterprise.id,
      client_id: users[0].id,
      total: 2250, // R$ 22,50 em centavos
      discount: 0,
      status: "confirmed",
      notes: "Pedido simples, apenas um produto",
      is_deleted: false,
    },
  ];

  // Inserir pedidos
  const insertedOrders = await knex("orders").insert(orders).returning("*");

  // Criar itens para cada pedido
  const orderItems = [
    // Pedido 1 - Kit com pomada, gel e creme para barba
    {
      order_id: insertedOrders[0].id,
      product_id: products[0].id, // Pomada
      quantity: 1,
      unit_price: 2590, // R$ 25,90 em centavos
      is_deleted: false,
    },
    {
      order_id: insertedOrders[0].id,
      product_id: products[1].id, // Gel
      quantity: 1,
      unit_price: 1850, // R$ 18,50 em centavos
      is_deleted: false,
    },
    {
      order_id: insertedOrders[0].id,
      product_id: products[3].id, // Creme para barba
      quantity: 1,
      unit_price: 2875, // R$ 28,75 em centavos
      is_deleted: false,
    },

    // Pedido 2 - Shampoo, óleo para barba e e-book
    {
      order_id: insertedOrders[1].id,
      product_id: products[2].id, // Shampoo
      quantity: 1,
      unit_price: 3200, // R$ 32,00 em centavos
      is_deleted: false,
    },
    {
      order_id: insertedOrders[1].id,
      product_id: products[4].id, // Óleo para barba
      quantity: 1,
      unit_price: 4500, // R$ 45,00 em centavos
      is_deleted: false,
    },
    {
      order_id: insertedOrders[1].id,
      product_id: products[5]?.id, // E-book
      quantity: 1,
      unit_price: 1990, // R$ 19,90 em centavos
      is_deleted: false,
    },

    // Pedido 3 - Curso online (cancelado)
    {
      order_id: insertedOrders[2].id,
      product_id: products[6]?.id, // Curso
      quantity: 1,
      unit_price: 8990, // R$ 89,90 em centavos
      is_deleted: false,
    },

    // Pedido 4 - Kit completo
    {
      order_id: insertedOrders[3].id,
      product_id: products[6]?.id, // Kit completo
      quantity: 1,
      unit_price: 8990, // R$ 89,90 em centavos
      is_deleted: false,
    },
  ];

  // Inserir itens dos pedidos
  await knex("order_items").insert(orderItems);

  // Atualizar estoque dos produtos (simulando a venda)
  const stockUpdates = [
    { id: products[0].id, quantity: 1 }, // Pomada
    { id: products[1].id, quantity: 1 }, // Gel
    { id: products[2].id, quantity: 1 }, // Shampoo
    { id: products[3].id, quantity: 1 }, // Creme para barba
    { id: products[4].id, quantity: 1 }, // Óleo para barba
    { id: products[6]?.id, quantity: 1 }, // Kit completo
  ];

  for (const update of stockUpdates) {
    await knex("products")
      .where("id", update.id)
      .decrement("stock", update.quantity);
  }

  console.log("✅ Pedidos e itens inseridos com sucesso!");
  console.log(
    `📊 Criados ${insertedOrders.length} pedidos com diferentes status`
  );
  console.log(`📦 Criados ${orderItems.length} itens de pedido`);
  console.log(`📉 Estoque atualizado para ${stockUpdates.length} produtos`);
}
