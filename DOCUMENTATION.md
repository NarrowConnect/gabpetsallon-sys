
# GabPetSallon - Documentação do Sistema

## Visão Geral
Sistema de gestão para petshop desenvolvido em React + TypeScript com integração Supabase.

## Estrutura do Projeto

### Tecnologias Utilizadas
- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **Banco de Dados**: Supabase (PostgreSQL)
- **Estado**: React Hooks + Context API
- **Formulários**: React Hook Form + Zod
- **Gráficos**: Recharts

## Componentes Principais

### 1. Dashboard (`src/components/Dashboard.tsx`)
- Exibe métricas gerais do sistema
- Gráficos de receitas e despesas
- Cards com totalizadores

### 2. Gestão de Tutores (`src/components/TutorsManager.tsx`)
- CRUD completo de tutores
- Formulário com dados pessoais e contatos
- Informações do veterinário

### 3. Gestão de Pets (`src/components/PetsManager.tsx`)
- CRUD completo de pets
- Vinculação com tutores
- Dados de saúde e comportamento

### 4. Agendamentos (`src/components/ScheduleManager.tsx`)
- Calendário mensal
- Gestão de status dos serviços
- Filtros por período

### 5. Financeiro (`src/components/FinanceManager.tsx`)
- Receitas e despesas personalizáveis
- Relatórios mensais
- Controle de fluxo de caixa

## Como Customizar em TypeScript

### 1. Adicionando Novos Campos

**Para Tutores:**
```typescript
// Em src/lib/supabaseClient.ts
export interface TutorDB extends Record<string, any> {
  // Campos existentes...
  novo_campo: string; // Adicione aqui
}

// Em src/components/TutorsManager.tsx
const [novoCampo, setNovoCampo] = useState('');
```

**Para Pets:**
```typescript
// Em src/lib/supabaseClient.ts
export interface PetDB extends Record<string, any> {
  // Campos existentes...
  novo_campo_pet: boolean; // Adicione aqui
}
```

### 2. Modificando Validações
```typescript
// Use Zod para validações
import { z } from "zod";

const tutorSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  // Adicione novas validações aqui
});
```

### 3. Personalizando Cores e Estilos
```typescript
// Em tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        'petshop-primary': '#your-color',
        'petshop-secondary': '#your-color',
      }
    }
  }
} satisfies Config;
```

### 4. Adicionando Novos Serviços
```typescript
// Em src/components/ScheduleManager.tsx
const SERVICOS_DISPONIVEIS = [
  'Banho',
  'Tosa',
  'Hospedagem',
  'Taxi Dog',
  'Novo Serviço', // Adicione aqui
];
```

## Hooks Customizados

### useSupabase
Gerencia operações CRUD com Supabase:
```typescript
const { tutors, addTutor, updateTutor, deleteTutor } = useTutors();
```

### useApiIntegration
Para integrações externas via HTTP:
```typescript
const { createTutor, createPet, loading } = useApiIntegration();
```

## Pontos de Extensão

### 1. Novos Relatórios
- Crie componentes em `src/components/reports/`
- Use o hook `useFinancas()` para dados

### 2. Integrações API
- Modifique `src/hooks/useApiIntegration.ts`
- Adicione novas funções de sincronização

### 3. Novos Módulos
- Crie pasta em `src/components/`
- Adicione rota em `src/pages/Index.tsx`
- Crie hooks específicos em `src/hooks/`

## Estrutura de Pastas Recomendada
```
src/
├── components/          # Componentes principais
│   ├── ui/             # Componentes shadcn/ui
│   └── reports/        # Relatórios específicos
├── hooks/              # Hooks customizados
├── lib/                # Utilitários e clientes
├── pages/              # Páginas da aplicação
└── types/              # Definições de tipos
```

## Boas Práticas

1. **Componentes Pequenos**: Mantenha componentes com menos de 200 linhas
2. **Hooks Reutilizáveis**: Extraia lógica para hooks customizados
3. **TypeScript Strict**: Use tipos explícitos sempre
4. **Responsividade**: Use classes Tailwind responsivas (sm:, md:, lg:)
5. **Performance**: Use React.memo() para componentes pesados

## Troubleshooting Comum

### Erro de Conexão Supabase
```typescript
// Verifique as variáveis de ambiente
console.log('URL:', process.env.REACT_APP_SUPABASE_URL);
console.log('Key:', process.env.REACT_APP_SUPABASE_ANON_KEY);
```

### Problemas de Estado
```typescript
// Use useEffect para debugging
useEffect(() => {
  console.log('Estado atual:', data);
}, [data]);
```

### Erros de Tipo
```typescript
// Use type assertions com cuidado
const data = response.data as TutorDB[];
```
