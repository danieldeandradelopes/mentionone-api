# Guia de Implementação de Refresh Token

## Visão Geral

Este sistema implementa um mecanismo de refresh token para melhorar a segurança da autenticação. O refresh token permite renovar access tokens sem exigir que o usuário faça login novamente.

## Como Funciona

### 1. Login Inicial

- O usuário faz login com email/senha
- O sistema gera um **access token** (válido por 15 minutos)
- O sistema gera um **refresh token** (válido por 7 dias)
- Ambos os tokens são retornados na resposta

### 2. Uso do Access Token

- O access token é usado para autenticar requisições
- Quando expira (15 minutos), o cliente deve usar o refresh token

### 3. Renovação de Tokens

- O cliente envia o refresh token para `/refresh-token`
- O sistema valida o refresh token
- Gera um novo access token e um novo refresh token
- Revoga o refresh token antigo

## Endpoints Disponíveis

### POST /refresh-token

Renova o access token usando o refresh token.

**Request:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "access_level": "admin",
    "enterprise_Id": 123
  }
}
```

### POST /revoke-token

Revoga um refresh token específico.

**Request:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### POST /revoke-all-tokens

Revoga todos os refresh tokens do usuário autenticado.

**Headers:**

```
Authorization: Bearer <access_token>
```

## Implementação no Frontend

### 1. Armazenamento de Tokens

```javascript
// Armazenar tokens após login
localStorage.setItem("accessToken", response.accessToken);
localStorage.setItem("refreshToken", response.refreshToken);
```

### 2. Interceptor para Renovação Automática

```javascript
// Axios interceptor para renovar tokens automaticamente
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          const response = await axios.post("/refresh-token", {
            refreshToken,
          });

          localStorage.setItem("accessToken", response.data.accessToken);
          localStorage.setItem("refreshToken", response.data.refreshToken);

          // Repetir a requisição original
          return axios.request(error.config);
        } catch (refreshError) {
          // Refresh token inválido, redirecionar para login
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);
```

### 3. Uso nos Headers

```javascript
// Adicionar access token nas requisições
const accessToken = localStorage.getItem("accessToken");
axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
```

## Segurança

### 1. Rotação de Tokens

- A cada renovação, um novo refresh token é gerado
- O refresh token antigo é revogado
- Isso previne ataques de replay

### 2. Expiração

- Access tokens expiram em 15 minutos
- Refresh tokens expiram em 7 dias
- Tokens expirados são automaticamente removidos do banco

### 3. Revogação

- Usuários podem revogar todos os seus tokens
- Tokens podem ser revogados individualmente
- Logout revoga o refresh token atual

## Configuração de Ambiente

Adicione as seguintes variáveis de ambiente:

```env
JWT_SECRET=sua_chave_secreta_para_access_tokens
JWT_REFRESH_SECRET=sua_chave_secreta_para_refresh_tokens
```

## Migração do Banco

Execute a migração para criar a tabela de refresh tokens:

```bash
npm run knex migrate:latest
```

## Limpeza Automática

Configure um job/cron para limpar tokens expirados:

```javascript
// Exemplo de limpeza automática
setInterval(async () => {
  const refreshTokenGateway = container.get(Registry.RefreshTokenGateway);
  await refreshTokenGateway.deleteExpiredTokens();
}, 24 * 60 * 60 * 1000); // A cada 24 horas
```

## Troubleshooting

### Erro: "Refresh token inválido"

- Verifique se o token não expirou
- Verifique se o token não foi revogado
- Verifique se a chave JWT_REFRESH_SECRET está correta

### Erro: "Refresh token não encontrado"

- O token pode ter sido revogado
- O token pode ter expirado e sido removido
- Verifique se o token está sendo enviado corretamente

### Tokens não são renovados

- Verifique se o interceptor está configurado corretamente
- Verifique se as rotas de refresh token estão registradas
- Verifique se o ContainerRegistry está configurado corretamente
