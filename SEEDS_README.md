# 🌱 Seeds do Banco de Dados

Este documento explica como usar os seeds para popular o banco de dados com dados de teste.

## 📋 Ordem de Execução

Os seeds devem ser executados na seguinte ordem para evitar erros de dependência:

### 1. **Usuários** (`populate-users-table.ts`)

- Cria usuários base (admin, barbeiros, clientes)
- **Dependências**: Nenhuma
- **Cria**: `users`

### 2. **Planos e Preços** (`populate-plans-table.ts`)

- Cria planos de assinatura e preços
- **Dependências**: Nenhuma
- **Cria**: `plan`, `plan_price`

### 3. **Barbearias** (`populate-Enterprises-table.ts`)

- Cria barbearias com dados completos
- **Dependências**: `users`, `plan_price`
- **Cria**: `Enterprise`, `phones`, `social_medias`

### 4. **Barbeiros** (`populate-barbers-table.ts`)

- Cria barbeiros associados às barbearias
- **Dependências**: `users`, `Enterprise`
- **Cria**: `barbers`

### 5. **Clientes** (`populate-customers-table.ts`)

- Cria clientes associados às barbearias
- **Dependências**: `users`, `Enterprise`
- **Cria**: `customers`

### 6. **Serviços** (`populate-services-table.ts`)

- Cria serviços oferecidos pelas barbearias
- **Dependências**: `Enterprise`
- **Cria**: `services`

### 7. **Produtos** (`populate-products-table.ts`)

- Cria produtos para venda
- **Dependências**: `Enterprise`
- **Cria**: `products`

### 8. **Pedidos** (`populate-orders-table.ts`)

- Cria pedidos e itens de pedido
- **Dependências**: `products`, `users`, `Enterprise`
- **Cria**: `orders`, `order_items`

### 9. **Branding** (`populate-branding-table.ts`)

- Cria temas personalizados para barbearias
- **Dependências**: `Enterprise`
- **Cria**: `branding`

### 10. **Assinaturas** (`populate-subscriptions-table.ts`)

- Cria assinaturas das barbearias
- **Dependências**: `Enterprise`, `plan_price`
- **Cria**: `subscription`, `payment`

### 11. **Horários de Funcionamento** (`populate-working-hours-table.ts`)

- Cria horários de funcionamento das barbearias
- **Dependências**: `Enterprise`
- **Cria**: `working_hours`, `working_hours_time_slots`

## 🚀 Como Executar

### Opção 1: Seed Master (Recomendado)

```bash
# Executa todos os seeds na ordem correta
npm run seed:master
```

### Opção 2: Limpar e Recriar (Recomendado para desenvolvimento)

```bash
# Limpa todas as tabelas e executa os seeds novamente
npm run seed:restart
```

### Opção 3: Reset Completo (Estrutura + Dados)

```bash
# Remove todas as tabelas, recria e popula
npm run seed:reset
```

### Opção 4: Apenas Limpar

```bash
# Limpa apenas os dados das tabelas (mantém estrutura)
npm run seed:clean
```

### Opção 3: Seeds Individuais

```bash
# Executar seeds individuais (na ordem correta)
npx knex seed:run --specific=populate-users-table.ts
npx knex seed:run --specific=populate-plans-table.ts
npx knex seed:run --specific=populate-Enterprises-table.ts
npx knex seed:run --specific=populate-barbers-table.ts
npx knex seed:run --specific=populate-customers-table.ts
npx knex seed:run --specific=populate-products-table.ts
npx knex seed:run --specific=populate-orders-table.ts
npx knex seed:run --specific=populate-branding-table.ts
npx knex seed:run --specific=populate-subscriptions-table.ts
npx knex seed:run --specific=populate-working-hours-table.ts
```

## 📊 Dados Criados

Após executar todos os seeds, você terá:

- **👤 Usuários**: Admin, barbeiros e clientes
- **🏪 Barbearias**: 4 barbearias com dados completos
- **💇 Barbeiros**: Barbeiros associados às barbearias
- **👥 Clientes**: Clientes associados às barbearias
- **💇 Serviços**: Serviços variados para cada barbearia
- **📦 Produtos**: 10 produtos variados
- **🛒 Pedidos**: 4 pedidos com itens
- **🎨 Branding**: 4 temas personalizados
- **💳 Assinaturas**: 4 assinaturas com diferentes status
- **⏰ Horários**: Horários de funcionamento para todas as barbearias

## ⚠️ Observações

1. **Ordem Importante**: Sempre execute na ordem correta para evitar erros de foreign key
2. **Dados Limpos**: Os seeds verificam se os dados já existem antes de criar
3. **Rollback**: Use `npm run seed:reset` para limpar e recriar tudo
4. **Desenvolvimento**: Ideal para ambiente de desenvolvimento e testes

## 🔧 Troubleshooting

### Erro de Foreign Key

- Verifique se executou os seeds na ordem correta
- Use `npm run seed:reset` para recomeçar

### Dados Duplicados

- Os seeds verificam se os dados já existem
- Se necessário, limpe as tabelas manualmente

### Erro de Conexão

- Verifique se o banco está rodando
- Confirme as configurações no `knexfile.ts`
