import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Primeiro, vamos buscar uma barbearia existente para associar os produtos
  const Enterprise = await knex("Enterprise").first();

  if (!Enterprise) {
    console.log(
      "Nenhuma barbearia encontrada. Execute primeiro o seed de usuários/barbearia."
    );
    return;
  }

  // Inserir produtos de exemplo
  await knex("products").insert([
    {
      enterprise_Id: Enterprise.id,
      title: "Pomada Modeladora Premium",
      description:
        "Pomada de alta qualidade para modelar cabelos com fixação média e brilho natural.",
      image_url: "https://picsum.photos/200/300",
      price: 2590, // R$ 25,90 em centavos
      stock: 50,
      type: "physical",
      category: "Pomadas",
      is_active: true,
      is_deleted: false,
    },
    {
      enterprise_Id: Enterprise.id,
      title: "Gel Fixador Extra Forte",
      description:
        "Gel com fixação extra forte, ideal para penteados que precisam durar o dia todo.",
      image_url: "https://picsum.photos/200/300",
      price: 1850, // R$ 18,50 em centavos
      stock: 30,
      type: "physical",
      category: "Géis",
      is_active: true,
      is_deleted: false,
    },
    {
      enterprise_Id: Enterprise.id,
      title: "Shampoo Antirresíduos",
      description:
        "Shampoo especial para remover resíduos de produtos e limpar profundamente o couro cabeludo.",
      image_url: "https://picsum.photos/200/300",
      price: 3200, // R$ 32,00 em centavos
      stock: 25,
      type: "physical",
      category: "Shampoos",
      is_active: true,
      is_deleted: false,
    },
    {
      enterprise_Id: Enterprise.id,
      title: "Creme para Barba Hidratante",
      description:
        "Creme nutritivo para manter a barba macia, hidratada e com aspecto saudável.",
      image_url: "https://picsum.photos/200/300",
      price: 2875, // R$ 28,75 em centavos
      stock: 40,
      type: "physical",
      category: "Barba",
      is_active: true,
      is_deleted: false,
    },
    {
      enterprise_Id: Enterprise.id,
      title: "Óleo para Barba Premium",
      description:
        "Óleo essencial para barba com ingredientes naturais, proporcionando maciez e brilho.",
      image_url: "https://picsum.photos/200/300",
      price: 4500, // R$ 45,00 em centavos
      stock: 20,
      type: "physical",
      category: "Barba",
      is_active: true,
      is_deleted: false,
    },
    {
      enterprise_Id: Enterprise.id,
      title: "E-book: Guia Completo de Cuidados Masculinos",
      description:
        "E-book digital com dicas profissionais para cuidados com cabelo, barba e pele masculina.",
      image_url: "https://picsum.photos/200/300",
      price: 1990, // R$ 19,90 em centavos
      stock: 999,
      type: "digital",
      category: "E-books",
      is_active: true,
      is_deleted: false,
    },
    {
      enterprise_Id: Enterprise.id,
      title: "Curso Online: Técnicas de Corte Modernas",
      description:
        "Curso digital com videoaulas ensinando as principais técnicas de corte masculino da atualidade.",
      image_url: "https://picsum.photos/200/300",
      price: 8990, // R$ 89,90 em centavos
      stock: 999,
      type: "digital",
      category: "Cursos",
      is_active: true,
      is_deleted: false,
    },
    {
      enterprise_Id: Enterprise.id,
      title: "Pomada Clássica Vintage",
      description:
        "Pomada com fórmula clássica, ideal para penteados retrô e estilo vintage.",
      image_url: "https://picsum.photos/200/300",
      price: 2250, // R$ 22,50 em centavos
      stock: 0, // Produto sem estoque para testar
      type: "physical",
      category: "Pomadas",
      is_active: true,
      is_deleted: false,
    },
    {
      enterprise_Id: Enterprise.id,
      title: "Produto Descontinuado",
      description: "Este produto foi descontinuado e não está mais disponível.",
      image_url: "https://picsum.photos/200/300",
      price: 1500, // R$ 15,00 em centavos
      stock: 0,
      type: "physical",
      category: "Outros",
      is_active: false, // Produto inativo
      is_deleted: false,
    },
    {
      enterprise_Id: Enterprise.id,
      title: "Kit Completo Barbearia",
      description:
        "Kit com pomada, gel, shampoo e creme para barba. Perfeito para presentear.",
      image_url: "https://picsum.photos/200/300",
      price: 8990, // R$ 89,90 em centavos
      stock: 15,
      type: "physical",
      category: "Kits",
      is_active: true,
      is_deleted: false,
    },
  ]);

  console.log("✅ Produtos inseridos com sucesso!");
}
