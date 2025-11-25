#!/bin/bash

# Script para configuração inicial do VPS para deploy automático
# Execute este script no seu VPS antes de configurar o GitHub Actions

echo "🚀 Configurando VPS para deploy automático..."

# Atualizar sistema
echo "📦 Atualizando sistema..."
sudo apt update && sudo apt upgrade -y

# Instalar Docker
echo "🐳 Instalando Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Instalar Docker Compose
echo "🐳 Instalando Docker Compose..."
sudo apt-get install docker-compose-plugin -y

# Instalar Git (caso não esteja instalado)
echo "📦 Instalando Git..."
sudo apt install git -y

# Criar diretório do projeto (se não existir)
echo "📁 Criando diretório do projeto..."
mkdir -p ~/agende7-backend

echo "✅ Configuração inicial concluída!"
echo ""
echo "📋 Próximos passos:"
echo "1. Clone o repositório: git clone [URL_DO_REPOSITORIO] ~/agende7-backend"
echo "2. Configure as variáveis de ambiente no arquivo .env"
echo "3. Configure os secrets no GitHub Actions"
echo "4. Faça o primeiro deploy manual ou via GitHub Actions"
echo ""
echo "🔧 Para verificar a instalação:"
echo "- Docker: docker --version"
echo "- Docker Compose: docker compose version"
echo "- Git: git --version"
echo ""
echo "⚠️ IMPORTANTE: Você precisa fazer logout e login novamente para que o Docker funcione sem sudo"
echo "Ou execute: newgrp docker" 