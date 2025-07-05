
# Schema do Banco de Dados - Supabase (Atualizado)

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

### 3. Tabela: agendamentos (ATUALIZADA)
```sql
CREATE TABLE agendamentos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tutor_id UUID REFERENCES tutores(id) ON DELETE CASCADE,
    pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
    tutor_nome VARCHAR(255) NOT NULL,
    tutor_telefone VARCHAR(20),
    pet_nome VARCHAR(255) NOT NULL,
    pet_raca VARCHAR(100),
    pet_porte VARCHAR(50),
    data_servico DATE NOT NULL,
    hora_servico TIME NOT NULL,
    servico VARCHAR(100) NOT NULL,
    valor DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'Agendado',
    observacoes TEXT,
    origem VARCHAR(20) DEFAULT 'admin', -- 'admin' ou 'tutor'
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
    banhos_medicamentosos DECIMAL(10,2) DEFAULT 0,
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

### 9. Tabela: usuarios_admin (NOVA)
```sql
CREATE TABLE usuarios_admin (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 10. Tabela: agendamentos_tutores (NOVA - para agendamentos feitos pelos tutores)
```sql
CREATE TABLE agendamentos_tutores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tutor_nome VARCHAR(255) NOT NULL,
    tutor_telefone VARCHAR(20) NOT NULL,
    pet_nome VARCHAR(255) NOT NULL,
    pet_raca VARCHAR(100),
    pet_porte VARCHAR(50),
    data_servico DATE NOT NULL,
    hora_servico TIME NOT NULL,
    servico VARCHAR(100) NOT NULL,
    observacoes TEXT,
    status VARCHAR(50) DEFAULT 'Solicitado', -- 'Solicitado', 'Confirmado', 'Rejeitado'
    data_resposta TIMESTAMP WITH TIME ZONE,
    observacoes_admin TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Endpoints para HTTP Requests

### Base URL: https://[seu-projeto].supabase.co/rest/v1/

### Headers obrigatórios:
```
apikey: [sua-api-key]
Authorization: Bearer [sua-api-key]
Content-Type: application/json
```

### 1. Tutores
```javascript
// Criar tutor
POST /tutores
Body: {
  "nome": "João Silva",
  "celular": "(41) 99999-9999",
  "endereco": "Rua das Flores, 123",
  // ... outros campos
}

// Listar tutores
GET /tutores

// Atualizar tutor
PATCH /tutores?id=eq.[uuid]
Body: { "nome": "Novo Nome" }

// Deletar tutor
DELETE /tutores?id=eq.[uuid]
```

### 2. Pets
```javascript
// Criar pet
POST /pets
Body: {
  "tutor_id": "[uuid-do-tutor]",
  "nome_pet": "Rex",
  "raca": "Golden Retriever",
  // ... outros campos
}
```

### 3. Agendamentos
```javascript
// Criar agendamento
POST /agendamentos
Body: {
  "tutor_nome": "João Silva",
  "pet_nome": "Rex",
  "data_servico": "2024-07-10",
  "hora_servico": "14:00",
  "servico": "Banho e Tosa",
  "status": "Agendado"
}
```

### 4. Agendamentos de Tutores
```javascript
// Criar solicitação de agendamento
POST /agendamentos_tutores
Body: {
  "tutor_nome": "Maria Silva",
  "tutor_telefone": "(41) 98888-8888",
  "pet_nome": "Luna",
  "pet_raca": "SRD",
  "data_servico": "2024-07-15",
  "servico": "Banho Medicamentoso"
}
```

### 5. Receitas Personalizadas
```javascript
// Adicionar receita personalizada
POST /receitas_personalizadas
Body: {
  "mes_referencia": "2024-07",
  "descricao": "Banho especial para cliente VIP",
  "valor": 120.00,
  "data_receita": "2024-07-05"
}
```

### 6. Despesas Personalizadas
```javascript
// Adicionar despesa personalizada
POST /despesas_personalizadas
Body: {
  "mes_referencia": "2024-07",
  "descricao": "Compra de shampoo especial",
  "valor": 85.50,
  "data_despesa": "2024-07-05"
}
```

## Configuração de Políticas RLS

```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE tutores ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendamentos_tutores ENABLE ROW LEVEL SECURITY;
-- ... para todas as outras tabelas

-- Políticas para permitir acesso total para usuários autenticados
CREATE POLICY "Permitir tudo para usuários autenticados" ON tutores
    FOR ALL USING (auth.role() = 'authenticated');

-- Política específica para agendamentos de tutores (permite inserção pública)
CREATE POLICY "Permitir inserção pública" ON agendamentos_tutores
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir leitura para autenticados" ON agendamentos_tutores
    FOR SELECT USING (auth.role() = 'authenticated');
```

## Como Testar as APIs

### 1. Via curl:
```bash
curl -X POST 'https://[seu-projeto].supabase.co/rest/v1/tutores' \
-H "apikey: [sua-api-key]" \
-H "Authorization: Bearer [sua-api-key]" \
-H "Content-Type: application/json" \
-d '{
  "nome": "Teste API",
  "celular": "(41) 99999-9999"
}'
```

### 2. Via JavaScript:
```javascript
const response = await fetch('https://[seu-projeto].supabase.co/rest/v1/tutores', {
  method: 'POST',
  headers: {
    'apikey': '[sua-api-key]',
    'Authorization': 'Bearer [sua-api-key]',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nome: 'Teste API',
    celular: '(41) 99999-9999'
  })
});
```

## Raças de Pets (Lista Atualizada)
```sql
-- Inserir na tabela de configurações ou usar como enum
INSERT INTO configuracoes (chave, valor) VALUES 
('racas_pets', '["SRD", "Akita-Inu", "American Bully", "Border Collie", "Bull Terrier", "Bulldog Francês", "Bulldog Inglês", "Cane Corso", "Chow Chow", "Chihuahua", "Dogo Alemão", "Dogo Argentino", "Fila Brasileiro", "Golden Retriever", "Husky Siberiano", "Kangal", "Pastor Alemão", "Pastor Belga", "Pastor de Malinoa", "Pastor Malemano", "Pincher", "Pit Bull", "Pit Monster", "Presa Canário", "Rottweiler Americano", "Rottweiler Inglês", "Samoieda", "São Bernardo", "Schnauzer", "Scottish Terrier", "Shiba-Inu"]');
```

## Serviços Disponíveis (Lista Atualizada)
```sql
INSERT INTO configuracoes (chave, valor) VALUES 
('servicos_disponiveis', '["Banho", "Tosa", "Banho e Tosa", "Banho Medicamentoso", "Hospedagem", "Pet Sitter", "Taxi Dog"]');
```

Lembre-se de:
1. Substituir [seu-projeto] pela URL real do seu projeto Supabase
2. Substituir [sua-api-key] pela sua chave API real
3. Configurar as variáveis de ambiente no código
4. Testar cada endpoint antes de usar em produção
