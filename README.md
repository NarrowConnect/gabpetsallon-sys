# 🐾 Pet Shop Management System

Um sistema completo de gestão para petshops desenvolvido em React + TypeScript com integração Supabase, incluindo controle financeiro, agendamentos, cadastro de tutores e pets.

## 🚀 Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **Formulários**: React Hook Form + Zod validation
- **Gráficos**: Recharts
- **Fontes**: Pacify (títulos) + Poppins (texto geral)
- **Deploy**: Lovable Platform

## 📋 Funcionalidades Principais

### 🔐 Sistema de Autenticação
- **Login Administrativo**: Acesso completo ao sistema
- **Login de Tutor**: Acesso limitado para agendamentos
- **RLS (Row Level Security)**: Proteção de dados sensíveis

### 👥 Gestão de Tutores
- CRUD completo de tutores
- Busca por CEP automática (ViaCEP/BrasilAPI)
- Dados de contato e emergência
- Informações do veterinário

### 🐕 Gestão de Pets
- CRUD completo de pets
- Vinculação com tutores
- Informações de saúde e medicamentos
- Raças ordenadas alfabeticamente (inclui SRD)

### 📅 Sistema de Agendamentos
- **Admin**: Agendamentos internos com controle completo
- **Tutores**: Solicitações públicas de agendamento
- Calendário mensal interativo
- Status personalizáveis
- Serviços atualizados (inclui Banho Medicamentoso)

### 💰 Controle Financeiro
- Receitas categorizadas (banhos, tosas, hospedagens, etc.)
- Despesas detalhadas (aluguel, energia, cartões, etc.)
- Receitas e despesas personalizadas
- Relatórios exportáveis (CSV/Excel)
- Dashboard com gráficos interativos

### 🔄 Sistema de Webhooks
- Configuração de webhooks para eventos
- Logs de execução
- Processamento automático via Edge Functions

### 📊 Relatórios e Analytics
- Exportação em CSV (UTF-8 com BOM)
- Relatórios mensais detalhados
- Gráficos de receitas vs despesas
- Controle de fluxo de caixa

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+
- Conta no Supabase
- Projeto Lovable (opcional para deploy)

### 1. Clone o Repositório
```bash
git clone [seu-repositorio]
cd pet-shop-management
npm install
```

### 2. Configuração do Supabase

#### 2.1. Crie um projeto no [Supabase](https://supabase.com)

#### 2.2. Execute o SQL Schema
```sql
-- Execute o script completo disponível em SUPABASE_SCHEMA.md
-- Inclui todas as tabelas, políticas RLS e triggers
```

#### 2.3. Configure as Chaves de API
Substitua as chaves nos seguintes arquivos:

**src/integrations/supabase/client.ts:**
```typescript
const SUPABASE_URL = "https://SEU-PROJETO.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "SUA-CHAVE-PUBLICA";
```

**src/components/ApiTester.tsx:**
```typescript
const SUPABASE_URL = 'https://SEU-PROJETO.supabase.co';
const SUPABASE_ANON_KEY = 'SUA-CHAVE-PUBLICA';
```

**src/components/WebhookManager.tsx:**
```typescript
const SUPABASE_ANON_KEY = 'SUA-CHAVE-PUBLICA';
```

### 3. Executar o Projeto
```bash
npm run dev
```

O sistema estará disponível em `http://localhost:8080`

## 🔑 Configuração de Autenticação

### Login Administrativo
1. Acesse a aba "Login" no sistema
2. Crie um usuário admin diretamente no banco:
```sql
INSERT INTO usuarios_admin (nome, email, senha_hash, ativo)
VALUES ('Admin', 'admin@petshop.com', 'hash-da-senha', true);
```

### Login de Tutor
- Os tutores fazem login apenas com nome e telefone
- Não requer senha, apenas validação dos dados cadastrados

## 📚 Documentação da API

Consulte o arquivo [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) para detalhes completos sobre:
- Endpoints disponíveis
- Métodos de autenticação
- Exemplos de requests/responses
- Códigos de erro
- Webhooks

## 🎨 Personalização

### Cores e Temas
```typescript
// tailwind.config.ts
colors: {
  'primary': 'hsl(var(--primary))',
  'secondary': 'hsl(var(--secondary))',
  // Adicione suas cores personalizadas
}
```

### Adicionar Novos Serviços
```typescript
// Em ScheduleManager.tsx
const servicos = [
  "Banho", "Tosa", "Banho e Tosa", "Banho Medicamentoso",
  "Hospedagem", "Pet Sitter", "Taxi Dog",
  "Seu Novo Serviço" // Adicione aqui
];
```

### Novas Raças de Pets
```typescript
// Em PetsManager.tsx
const racas = [
  "SRD", "Akita-Inu", "American Bully", 
  // ... raças existentes
  "Nova Raça" // Adicione aqui
].sort();
```

## 📱 Responsividade

O sistema é totalmente responsivo com:
- Grid adaptativo para diferentes telas
- Navegação mobile otimizada
- Formulários que se adaptam ao dispositivo
- Cards com backdrop blur para melhor experiência

## 🔒 Segurança

### Row Level Security (RLS)
- Todas as tabelas possuem políticas RLS configuradas
- Acesso restrito por autenticação
- Dados sensíveis protegidos

### Políticas Implementadas
- **Tutores/Pets**: Apenas usuários autenticados
- **Agendamentos**: Leitura pública, escrita autenticada
- **Financeiro**: Acesso restrito a admins
- **Webhooks**: Configuração apenas para admins

## 🚀 Deploy

### Via Lovable (Recomendado)
1. Conecte seu repositório ao Lovable
2. Configure as variáveis de ambiente
3. Deploy automático

### Via Vercel/Netlify
```bash
npm run build
# Deploy da pasta dist/
```

## 🐛 Troubleshooting

### Problemas Comuns

**1. Erro de CORS**
- Verifique a configuração do Supabase
- Confirme se as chaves estão corretas

**2. Fontes não carregando**
- Verifique os links no index.html
- Confirme se as fontes Google estão disponíveis

**3. CEP não preenchendo endereço**
- Verifique se a API ViaCEP está funcionando
- O sistema usa fallback para BrasilAPI

**4. Exports CSV com caracteres estranhos**
- O sistema usa UTF-8 com BOM
- Abra no Excel com "Dados > Obter Dados > Do Arquivo"

## 📞 Suporte

Para dúvidas e suporte:
- Crie uma issue no repositório
- Consulte a documentação do Supabase
- Verifique os logs do console para debugging

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

⚡ **Desenvolvido com Lovable** - A plataforma de desenvolvimento visual mais rápida do mundo.