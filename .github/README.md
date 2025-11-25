# Configuração do GitHub Actions para Deploy

Este diretório contém os workflows do GitHub Actions para automatizar o deploy da aplicação no VPS do Hostinger usando Docker Compose.

## Secrets Necessários

Para que o deploy funcione corretamente, você precisa configurar os seguintes secrets no seu repositório GitHub:

### Como configurar os secrets:

1. Vá para o seu repositório no GitHub
2. Clique em **Settings** (Configurações)
3. No menu lateral, clique em **Secrets and variables** → **Actions**
4. Clique em **New repository secret** para adicionar cada secret

### Secrets que você precisa configurar:

| Secret         | Descrição              | Valor                 |
| -------------- | ---------------------- | --------------------- |
| `VPS_HOST`     | IP do seu VPS          | ``                    |
| `VPS_USERNAME` | Nome do usuário no VPS | Seu usuário no VPS    |
| `VPS_SSH_KEY`  | Chave SSH privada      | Sua chave SSH privada |
| `VPS_PORT`     | Porta SSH (opcional)   | `` (padrão)           |

### Como obter a chave SSH:

Se você já tem uma chave SSH configurada no GitHub, você pode usar a mesma chave privada. Caso contrário:

1. Gere uma nova chave SSH:

   ```bash
   ssh-keygen -t rsa -b 4096 -C "seu-email@exemplo.com"
   ```

2. Adicione a chave pública ao seu VPS:

   ```bash
   ssh-copy-id usuario@195.200.4.224
   ```

3. Copie o conteúdo da chave privada (arquivo `~/.ssh/id_rsa`) e adicione como secret `VPS_SSH_KEY`

## Como funciona o deploy:

1. **Trigger**: O deploy é executado quando você faz push para a branch `main` ou `master`
2. **Git Pull**: O código mais recente é baixado do repositório
3. **Docker Down**: Os containers atuais são parados
4. **Docker Up**: Os containers são reconstruídos e iniciados
5. **Migrações**: As migrações do banco de dados são executadas
6. **Verificação**: Status dos containers e logs são verificados

## Estrutura esperada no VPS:

O workflow assume que o projeto está localizado em:

```
pasta do projeto
```

E que você tem o Docker e Docker Compose instalados no servidor.

## Pré-requisitos no VPS:

1. **Docker instalado**:

   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   ```

2. **Docker Compose instalado**:

   ```bash
   sudo apt-get install docker-compose-plugin
   ```

3. **Repositório clonado**:

   ```bash
   git clone [URL_DO_REPOSITORIO] ~/agende7-backend
   ```

4. **Arquivo .env configurado** com as variáveis de ambiente

## Verificação do deploy:

Após o deploy, você pode verificar se tudo está funcionando:

1. Verificar status dos containers:

   ```bash
   docker compose ps
   ```

2. Verificar logs da aplicação:

   ```bash
   docker logs app-backend
   ```

3. Testar a API:
   ```bash
   curl http://195.200.4.224:3000/health
   ```

## Comandos manuais (se necessário):

Se precisar fazer deploy manualmente no servidor:

```bash
cd /var/www/agende7-backend
git pull
docker compose down
docker compose up -d --build
docker exec app-backend sh -c "npm run migration:run"
```
