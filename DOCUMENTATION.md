
# GabPetSallon - Documentação do Sistema (Atualizada)

## Visão Geral
Sistema de gestão para petshop desenvolvido em React + TypeScript com integração Supabase, incluindo sistema de login para administradores e tutores.

## Estrutura do Projeto

### Tecnologias Utilizadas
- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **Fontes**: Pacify (títulos) + Poppins (texto geral)
- **Banco de Dados**: Supabase (PostgreSQL)
- **Estado**: React Hooks + Context API
- **Formulários**: React Hook Form + Zod
- **Gráficos**: Recharts
- **Autenticação**: Sistema customizado para Admin/Tutor

## Identidade Visual

### Logotipo
- Arquivo principal: `/lovable-uploads/becdcf34-2926-47cf-86b4-0d3e413832f7.png`
- Usado como favicon e logo principal do sistema

### Tipografia
- **Títulos e Logo**: Pacify (Google Fonts)
- **Texto Geral**: Poppins (Google Fonts)
- **Configuração**: Definida no `tailwind.config.ts`

```typescript
fontFamily: {
  'pacify': ['Pacify', 'cursive'],
  'poppins': ['Poppins', 'sans-serif'],
  'sans': ['Poppins', 'sans-serif'],
}
```

## Sistema de Autenticação

### 1. Login Administrativo (`src/components/LoginPage.tsx`)
- Acesso completo ao sistema
- Campos: email + senha
- Funcionalidades: todos os módulos (Dashboard, Tutores, Pets, Agendamentos, Financeiro)

### 2. Login de Tutor (`src/components/TutorScheduling.tsx`)
- Acesso limitado para agendamentos
- Campos: nome + telefone
- Funcionalidades: apenas formulário de agendamento

### Como Customizar Autenticação

```typescript
// Em LoginPage.tsx - validação admin
const handleAdminLogin = (e: React.FormEvent) => {
  // Integrar com Supabase Auth
  const { data, error } = await supabase.auth.signInWithPassword({
    email: adminForm.email,
    password: adminForm.password
  });
};

// Em LoginPage.tsx - validação tutor
const handleTutorLogin = (e: React.FormEvent) => {
  // Buscar tutor no banco
  const { data, error } = await supabase
    .from('tutores')
    .select('*')
    .eq('nome', tutorForm.nome)
    .eq('celular', tutorForm.telefone);
};
```

## Componentes Principais

### 1. Dashboard (`src/components/Dashboard.tsx`)
- Métricas gerais do sistema
- Gráficos de receitas e despesas
- Cards com totalizadores
- **Funcionalidade**: Conecta com todas as tabelas financeiras

### 2. Gestão de Tutores (`src/components/TutorsManager.tsx`)
- CRUD completo de tutores
- Formulário com dados pessoais e contatos
- Informações do veterinário
- **Novidade**: Sincronização com pets

### 3. Gestão de Pets (`src/components/PetsManager.tsx`)
- CRUD completo de pets
- **Raças Atualizadas**: Inclui "SRD" em ordem alfabética
- Vinculação com tutores existentes
- **Novidade**: Possibilidade de criar tutor durante cadastro do pet

### 4. Agendamentos (`src/components/ScheduleManager.tsx`)
- **Serviços Atualizados**: Inclui "Banho Medicamentoso"
- Calendário mensal com seleção de mês/ano
- Gestão de status personalizável
- **Melhoria**: Visualização maior para controle mensal

### 5. Financeiro (`src/components/FinanceManager.tsx`)
- **Receitas Personalizadas**: Adicionar receitas específicas
- **Despesas Personalizadas**: Gerenciar despesas extras
- **Relatórios Detalhados**: Exportação CSV/XLS com dados completos
- Controle de fluxo de caixa mensal

### 6. Relatórios Financeiros (`src/components/FinancialReports.tsx`)
- **Exportação Melhorada**: CSV UTF-8 e Excel
- **Dados Detalhados**: Todas as receitas e despesas discriminadas
- Controle mensal com seleção de período

## Lista de Raças (Atualizada e Alfabética)

```typescript
const racas = [
  "SRD", "Akita-Inu", "American Bully", "Border Collie", "Bull Terrier",
  "Bulldog Francês", "Bulldog Inglês", "Cane Corso", "Chow Chow", 
  "Chihuahua", "Dogo Alemão", "Dogo Argentino", "Fila Brasileiro",
  "Golden Retriever", "Husky Siberiano", "Kangal", "Pastor Alemão",
  "Pastor Belga", "Pastor de Malinoa", "Pastor Malemano", "Pincher",
  "Pit Bull", "Pit Monster", "Presa Canário", "Rottweiler Americano",
  "Rottweiler Inglês", "Samoieda", "São Bernardo", "Schnauzer",
  "Scottish Terrier", "Shiba-Inu"
].sort();
```

## Lista de Serviços (Atualizada)

```typescript
const servicos = [
  "Banho", "Tosa", "Banho e Tosa", "Banho Medicamentoso",
  "Hospedagem", "Pet Sitter", "Taxi Dog"
];
```

## Integrações HTTP Request

### Configuração Base
```typescript
const SUPABASE_URL = 'https://[seu-projeto].supabase.co';
const SUPABASE_KEY = '[sua-chave-api]';

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json'
};
```

### 1. Criar Tutor via HTTP
```typescript
const criarTutor = async (dadosTutor) => {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/tutores`, {
    method: 'POST',
    headers,
    body: JSON.stringify(dadosTutor)
  });
  return await response.json();
};
```

### 2. Criar Pet via HTTP
```typescript
const criarPet = async (dadosPet) => {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/pets`, {
    method: 'POST',
    headers,
    body: JSON.stringify(dadosPet)
  });
  return await response.json();
};
```

### 3. Adicionar Receita Personalizada
```typescript
const adicionarReceita = async (receita) => {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/receitas_personalizadas`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      mes_referencia: receita.mes,
      descricao: receita.descricao,
      valor: receita.valor,
      data_receita: receita.data
    })
  });
  return await response.json();
};
```

### 4. Adicionar Despesa Personalizada
```typescript
const adicionarDespesa = async (despesa) => {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/despesas_personalizadas`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      mes_referencia: despesa.mes,
      descricao: despesa.descricao,
      valor: despesa.valor,
      data_despesa: despesa.data
    })
  });
  return await response.json();
};
```

### 5. Agendamento por Tutor (Público)
```typescript
const criarAgendamentoTutor = async (agendamento) => {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/agendamentos_tutores`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      tutor_nome: agendamento.tutorNome,
      tutor_telefone: agendamento.tutorTelefone,
      pet_nome: agendamento.petNome,
      pet_raca: agendamento.petRaca,
      data_servico: agendamento.dataServico,
      hora_servico: agendamento.horaServico,
      servico: agendamento.servico,
      observacoes: agendamento.observacoes
    })
  });
  return await response.json();
};
```

## Exportação de Relatórios

### Formato CSV UTF-8 (Compatível com Excel)
- **Codificação**: UTF-8 com BOM
- **Separador**: Vírgula
- **Dados Inclusos**: 
  - Receitas discriminadas por categoria
  - Receitas personalizadas com data
  - Despesas discriminadas por categoria  
  - Despesas personalizadas com data
  - Totalizadores mensais

### Estrutura do CSV Exportado
```
RELATÓRIO FINANCEIRO DETALHADO

MÊS/ANO,07/2024

RECEITAS
Categoria,Valor
Banhos Pequeno,R$ 1.200,00
Banhos Grande,R$ 800,00
Tosas,R$ 600,00

RECEITAS PERSONALIZADAS
Descrição,Valor,Data
Banho especial VIP,R$ 120,00,2024-07-05

TOTAL RECEITAS,R$ 2.720,00

DESPESAS
Categoria,Valor
Aluguel,R$ 1.000,00
Energia,R$ 200,00

DESPESAS PERSONALIZADAS
Descrição,Valor,Data
Shampoo especial,R$ 85,50,2024-07-05

TOTAL DESPESAS,R$ 1.285,50
SALDO FINAL,R$ 1.434,50
```

## Configuração do Supabase

### Variáveis de Ambiente Necessárias
```javascript
// No código, configure:
const SUPABASE_URL = 'https://[seu-projeto].supabase.co';
const SUPABASE_ANON_KEY = '[sua-chave-publica]';
```

### Tabelas Principais
1. **tutores** - Dados dos tutores
2. **pets** - Dados dos pets (vinculados aos tutores)
3. **agendamentos** - Agendamentos administrativos
4. **agendamentos_tutores** - Solicitações de tutores
5. **receitas_personalizadas** - Receitas extras
6. **despesas_personalizadas** - Despesas extras
7. **usuarios_admin** - Login administrativo

### Políticas RLS
- **Administradores**: Acesso total após autenticação
- **Tutores**: Apenas inserção em agendamentos_tutores
- **Público**: Leitura limitada para formulário de agendamento

## Responsividade Mobile

### Melhorias Implementadas
- **Container Responsivo**: `ResponsiveContainer` component
- **Grid Adaptativo**: `ResponsiveGrid` para layouts
- **Cards Flexíveis**: `ResponsiveCard` com backdrop blur
- **Navegação Mobile**: Tabs com ícones adaptativos
- **Formulários**: Layouts que se adaptam a telas pequenas

### Classes Tailwind Utilizadas
```typescript
// Exemplo de responsividade
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
className="text-xs sm:text-sm lg:text-base"
className="px-2 sm:px-4 lg:px-6"
```

## Como Personalizar o Sistema

### 1. Cores e Temas
```typescript
// Em tailwind.config.ts - adicionar cores personalizadas
colors: {
  'petshop': {
    'primary': '#your-color',
    'secondary': '#your-color',
  }
}
```

### 2. Adicionar Novos Serviços
```typescript
// Em ScheduleManager.tsx e TutorScheduling.tsx
const servicos = [
  // ... serviços existentes
  "Novo Serviço Personalizado"
];
```

### 3. Campos Personalizados em Formulários
```typescript
// Exemplo: adicionar campo "observações" em tutores
const [observacoes, setObservacoes] = useState('');

// No formulário:
<div>
  <Label htmlFor="observacoes">Observações</Label>
  <Textarea
    id="observacoes"
    value={observacoes}
    onChange={(e) => setObservacoes(e.target.value)}
  />
</div>
```

## Troubleshooting

### Problemas Comuns

1. **Erro de CORS**: Verificar configuração do Supabase
2. **Fontes não carregando**: Conferir links no index.html
3. **Imagens não aparecendo**: Verificar caminhos dos uploads
4. **CSV com caracteres estranhos**: Usar UTF-8 com BOM

### Debug de APIs
```typescript
// Sempre logar responses para debug
console.log('Response da API:', response);
console.log('Status:', response.status);
console.log('Data:', await response.json());
```

## Próximos Passos

1. **Configurar Supabase**: Executar o schema fornecido
2. **Configurar Variáveis**: URL e chaves da API
3. **Testar Endpoints**: Usar curl ou Postman
4. **Configurar Autenticação**: Implementar Supabase Auth para admins
5. **Testar Responsividade**: Em diferentes dispositivos
6. **Backup Regular**: Configurar backups automáticos do Supabase

O sistema está pronto para produção após a configuração do Supabase!
