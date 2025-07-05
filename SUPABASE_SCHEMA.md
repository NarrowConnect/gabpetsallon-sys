
# Schema do Banco de Dados - Supabase

## Configuração das Tabelas

### 1. Tabela: tutores
```sql
CREATE TABLE tutores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    telefone_residencial VARCHAR(20),
    celular VARCHAR(20) NOT NULL,
    endereco TEXT,
    cep VARCHAR(10),
    cidade VARCHAR(100),
    estado VARCHAR(50),
    nome_veterinario VARCHAR(255),
    telefone_veterinario VARCHAR(20),
    celular_veterinario VARCHAR(20),
    endereco_veterinario TEXT,
    cidade_veterinario VARCHAR(100),
    estado_veterinario VARCHAR(50),
    contato_adicional_1_nome VARCHAR(255),
    contato_adicional_1_telefone VARCHAR(20),
    contato_adicional_2_nome VARCHAR(255),
    contato_adicional_2_telefone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Tabela: pets
```sql
CREATE TABLE pets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tutor_id UUID REFERENCES tutores(id) ON DELETE CASCADE,
    nome_tutor VARCHAR(255) NOT NULL,
    nome_pet VARCHAR(255) NOT NULL,
    idade INTEGER,
    especie VARCHAR(50),
    raca VARCHAR(100),
    sexo VARCHAR(20),
    porte VARCHAR(50),
    castrado BOOLEAN DEFAULT FALSE,
    peso DECIMAL(5,2),
    temperamento TEXT,
    necessidades_especiais TEXT,
    rotina TEXT,
    saude TEXT,
    toma_medicamentos BOOLEAN DEFAULT FALSE,
    medicamentos TEXT,
    vacinas_vermifugos TEXT,
    controle_parasitario TEXT,
    nome_veterinario VARCHAR(255),
    telefone_veterinario VARCHAR(20),
    celular_veterinario VARCHAR(20),
    endereco_veterinario TEXT,
    cidade_veterinario VARCHAR(100),
    estado_veterinario VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Tabela: agendamentos
```sql
CREATE TABLE agendamentos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tutor_id UUID REFERENCES tutores(id) ON DELETE CASCADE,
    pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
    data_servico DATE NOT NULL,
    hora_servico TIME NOT NULL,
    servico VARCHAR(100) NOT NULL,
    valor DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'Agendado',
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Tabela: contas_a_pagar
```sql
CREATE TABLE contas_a_pagar (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    mes_referencia VARCHAR(7) NOT NULL, -- formato: 2024-01
    aluguel DECIMAL(10,2) DEFAULT 0,
    copel DECIMAL(10,2) DEFAULT 0,
    sanepar DECIMAL(10,2) DEFAULT 0,
    internet DECIMAL(10,2) DEFAULT 0,
    seguranca_mensalidade DECIMAL(10,2) DEFAULT 0,
    mei DECIMAL(10,2) DEFAULT 0,
    celular_mes DECIMAL(10,2) DEFAULT 0,
    lavanderia DECIMAL(10,2) DEFAULT 0,
    gasolina DECIMAL(10,2) DEFAULT 0,
    tarifa_bancaria DECIMAL(10,2) DEFAULT 0,
    cartao_santander DECIMAL(10,2) DEFAULT 0,
    cartao_bb DECIMAL(10,2) DEFAULT 0,
    cartao_nu DECIMAL(10,2) DEFAULT 0,
    cartao_gab DECIMAL(10,2) DEFAULT 0,
    boleto_biocom DECIMAL(10,2) DEFAULT 0,
    boleto_euroshop DECIMAL(10,2) DEFAULT 0,
    total_saidas DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(mes_referencia)
);
```

### 5. Tabela: valores_recebidos
```sql
CREATE TABLE valores_recebidos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    mes_referencia VARCHAR(7) NOT NULL, -- formato: 2024-01
    banhos_porte_pequeno DECIMAL(10,2) DEFAULT 0,
    banhos_porte_grande DECIMAL(10,2) DEFAULT 0,
    tosas DECIMAL(10,2) DEFAULT 0,
    hospedagens DECIMAL(10,2) DEFAULT 0,
    roupas DECIMAL(10,2) DEFAULT 0,
    taxi_dog DECIMAL(10,2) DEFAULT 0,
    total_entradas DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(mes_referencia)
);
```

### 6. Tabela: controle_financeiro
```sql
CREATE TABLE controle_financeiro (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    mes_referencia VARCHAR(7) NOT NULL, -- formato: 2024-01
    saldo_anterior DECIMAL(10,2) DEFAULT 0,
    total_entradas DECIMAL(10,2) DEFAULT 0,
    total_saidas DECIMAL(10,2) DEFAULT 0,
    saldo_atual DECIMAL(10,2) DEFAULT 0,
    saldo_transportar DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(mes_referencia)
);
```

### 7. Tabela: receitas_personalizadas
```sql
CREATE TABLE receitas_personalizadas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    mes_referencia VARCHAR(7) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    data_receita DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 8. Tabela: despesas_personalizadas
```sql
CREATE TABLE despesas_personalizadas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    mes_referencia VARCHAR(7) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    data_despesa DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Índices Recomendados
```sql
-- Para melhor performance nas consultas
CREATE INDEX idx_pets_tutor_id ON pets(tutor_id);
CREATE INDEX idx_agendamentos_tutor_id ON agendamentos(tutor_id);
CREATE INDEX idx_agendamentos_pet_id ON agendamentos(pet_id);
CREATE INDEX idx_agendamentos_data ON agendamentos(data_servico);
CREATE INDEX idx_financeiro_mes ON controle_financeiro(mes_referencia);
CREATE INDEX idx_receitas_mes ON valores_recebidos(mes_referencia);
CREATE INDEX idx_despesas_mes ON contas_a_pagar(mes_referencia);
```

## Row Level Security (RLS)
```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE tutores ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE contas_a_pagar ENABLE ROW LEVEL SECURITY;
ALTER TABLE valores_recebidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE controle_financeiro ENABLE ROW LEVEL SECURITY;
ALTER TABLE receitas_personalizadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE despesas_personalizadas ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (ajuste conforme necessário)
CREATE POLICY "Permitir tudo para usuários autenticados" ON tutores
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir tudo para usuários autenticados" ON pets
    FOR ALL USING (auth.role() = 'authenticated');

-- Repita para todas as tabelas...
```

## Como Conectar no Código

### 1. Configurar Variáveis de Ambiente
Adicione no seu projeto Lovable as seguintes variáveis:
- `REACT_APP_SUPABASE_URL`: Sua URL do Supabase
- `REACT_APP_SUPABASE_ANON_KEY`: Sua chave pública do Supabase

### 2. O arquivo `src/lib/supabaseClient.ts` já está preparado
Apenas substitua os valores das variáveis pelos seus dados reais do Supabase.

### 3. Os hooks `src/hooks/useSupabase.ts` já estão implementados
Eles farão toda a comunicação com o banco automaticamente.

## Comandos de Setup Rápido
Execute estes comandos no SQL Editor do Supabase:

1. Copie e cole cada CREATE TABLE acima
2. Execute os comandos de índices
3. Configure as políticas RLS
4. Teste a conexão com o sistema

Depois disso, o sistema funcionará completamente integrado com o Supabase!
