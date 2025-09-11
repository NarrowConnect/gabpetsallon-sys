# 📡 API Documentation - Pet Shop Management System

Esta documentação detalha todos os endpoints, métodos de autenticação e funcionalidades da API do sistema de gestão para petshops.

## 🔗 Base URL

```
https://[SEU-PROJETO].supabase.co/rest/v1/
```

## 🔐 Autenticação

### Headers Obrigatórios
Todos os requests devem incluir os seguintes headers:

```javascript
{
  'apikey': 'SUA-CHAVE-PUBLICA-SUPABASE',
  'Authorization': 'Bearer SUA-CHAVE-PUBLICA-SUPABASE',
  'Content-Type': 'application/json'
}
```

### Tipos de Acesso

#### 1. **Público (Anônimo)**
- Apenas INSERT em `agendamentos_tutores`
- Usado para formulário público de agendamento

#### 2. **Autenticado**
- Acesso completo a todas as operações
- Requer autenticação válida do Supabase

## 📋 Endpoints Disponíveis

### 👥 Tutores (`/tutores`)

#### Listar Tutores
```http
GET /tutores
```

**Response:**
```json
[
  {
    "id": "uuid",
    "nome": "João Silva",
    "celular": "41999999999",
    "telefone_residencial": "4133334444",
    "endereco": "Rua das Flores, 123",
    "cidade": "Curitiba",
    "estado": "PR",
    "cep": "80000-000",
    "nome_veterinario": "Dr. Carlos",
    "telefone_veterinario": "4133335555",
    "celular_veterinario": "41888888888",
    "endereco_veterinario": "Av. Vet, 456",
    "cidade_veterinario": "Curitiba",
    "estado_veterinario": "PR",
    "contato_adicional_1_nome": "Maria",
    "contato_adicional_1_telefone": "41777777777",
    "contato_adicional_2_nome": "José",
    "contato_adicional_2_telefone": "41666666666",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Criar Tutor
```http
POST /tutores
```

**Body:**
```json
{
  "nome": "João Silva",
  "celular": "41999999999",
  "telefone_residencial": "4133334444",
  "endereco": "Rua das Flores, 123",
  "cidade": "Curitiba",
  "estado": "PR",
  "cep": "80000-000",
  "nome_veterinario": "Dr. Carlos",
  "telefone_veterinario": "4133335555",
  "celular_veterinario": "41888888888",
  "endereco_veterinario": "Av. Vet, 456",
  "cidade_veterinario": "Curitiba",
  "estado_veterinario": "PR",
  "contato_adicional_1_nome": "Maria",
  "contato_adicional_1_telefone": "41777777777",
  "contato_adicional_2_nome": "José",
  "contato_adicional_2_telefone": "41666666666"
}
```

#### Atualizar Tutor
```http
PATCH /tutores?id=eq.{tutor_id}
```

#### Deletar Tutor
```http
DELETE /tutores?id=eq.{tutor_id}
```

### 🐕 Pets (`/pets`)

#### Listar Pets
```http
GET /pets
```

**Response:**
```json
[
  {
    "id": "uuid",
    "nome_pet": "Rex",
    "nome_tutor": "João Silva",
    "tutor_id": "uuid",
    "especie": "Canino",
    "raca": "Golden Retriever",
    "sexo": "Macho",
    "idade": 3,
    "porte": "Grande",
    "peso": 30.5,
    "castrado": true,
    "temperamento": "Dócil e brincalhão",
    "necessidades_especiais": "Nenhuma",
    "rotina": "Passeios diários",
    "saude": "Boa",
    "toma_medicamentos": false,
    "medicamentos": null,
    "vacinas_vermifugos": "Em dia",
    "controle_parasitario": "Mensal",
    "nome_veterinario": "Dr. Carlos",
    "telefone_veterinario": "4133335555",
    "celular_veterinario": "41888888888",
    "endereco_veterinario": "Av. Vet, 456",
    "cidade_veterinario": "Curitiba",
    "estado_veterinario": "PR",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Criar Pet
```http
POST /pets
```

**Body:**
```json
{
  "nome_pet": "Rex",
  "nome_tutor": "João Silva",
  "tutor_id": "uuid",
  "especie": "Canino",
  "raca": "Golden Retriever",
  "sexo": "Macho",
  "idade": 3,
  "porte": "Grande",
  "peso": 30.5,
  "castrado": true,
  "temperamento": "Dócil e brincalhão",
  "necessidades_especiais": "Nenhuma",
  "rotina": "Passeios diários",
  "saude": "Boa",
  "toma_medicamentos": false,
  "medicamentos": null,
  "vacinas_vermifugos": "Em dia",
  "controle_parasitario": "Mensal"
}
```

### 📅 Agendamentos Administrativos (`/agendamentos`)

#### Listar Agendamentos
```http
GET /agendamentos
```

#### Criar Agendamento
```http
POST /agendamentos
```

**Body:**
```json
{
  "tutor_nome": "João Silva",
  "tutor_telefone": "41999999999",
  "tutor_id": "uuid",
  "pet_nome": "Rex",
  "pet_id": "uuid",
  "pet_raca": "Golden Retriever",
  "pet_porte": "Grande",
  "data_servico": "2024-12-25",
  "hora_servico": "14:00",
  "servico": "Banho e Tosa",
  "valor": 80.00,
  "status": "Agendado",
  "observacoes": "Pet muito dócil",
  "origem": "admin"
}
```

### 📝 Agendamentos de Tutores (`/agendamentos_tutores`)

#### Listar Solicitações (Admin)
```http
GET /agendamentos_tutores
```

#### Criar Solicitação (Público)
```http
POST /agendamentos_tutores
```

**Body:**
```json
{
  "tutor_nome": "João Silva",
  "tutor_telefone": "41999999999",
  "pet_nome": "Rex",
  "pet_raca": "Golden Retriever",
  "pet_porte": "Grande",
  "data_servico": "2024-12-25",
  "hora_servico": "14:00",
  "servico": "Banho e Tosa",
  "observacoes": "Pet muito dócil"
}
```

**Response:**
```json
{
  "id": "uuid",
  "status": "Solicitado",
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### Atualizar Status (Admin)
```http
PATCH /agendamentos_tutores?id=eq.{agendamento_id}
```

**Body:**
```json
{
  "status": "Aprovado",
  "observacoes_admin": "Agendamento confirmado",
  "data_resposta": "2024-01-01T12:00:00Z"
}
```

### 💰 Financeiro

#### Valores Recebidos (`/valores_recebidos`)

**GET /valores_recebidos**
```json
[
  {
    "id": "uuid",
    "mes_referencia": "2024-01",
    "banhos_porte_pequeno": 500.00,
    "banhos_porte_medio": 800.00,
    "banhos_porte_grande": 600.00,
    "banhos_medicamentosos": 200.00,
    "tosas": 1200.00,
    "boutique": 300.00,
    "hospedagens": 400.00,
    "taxi_dog": 150.00,
    "creche": 600.00,
    "total_entradas": 4750.00
  }
]
```

#### Contas a Pagar (`/contas_a_pagar`)

**GET /contas_a_pagar**
```json
[
  {
    "id": "uuid",
    "mes_referencia": "2024-01",
    "aluguel": 1000.00,
    "copel": 200.00,
    "sanepar": 80.00,
    "internet": 100.00,
    "celular_mes": 50.00,
    "seguranca_mensalidade": 120.00,
    "mei": 67.00,
    "gasolina": 300.00,
    "toalhas": 50.00,
    "tarifa_bancaria": 30.00,
    "publicidade": 200.00,
    "banhista": 800.00,
    "cartao_santander": 150.00,
    "cartao_bb": 100.00,
    "cartao_nu": 75.00,
    "cartao_gab": 50.00,
    "boleto_biocom": 80.00,
    "boleto_euroshop": 60.00,
    "total_saidas": 3562.00
  }
]
```

#### Receitas Personalizadas (`/receitas_personalizadas`)

**POST /receitas_personalizadas**
```json
{
  "mes_referencia": "2024-01",
  "descricao": "Banho especial VIP",
  "valor": 120.00,
  "data_receita": "2024-01-15"
}
```

#### Despesas Personalizadas (`/despesas_personalizadas`)

**POST /despesas_personalizadas**
```json
{
  "mes_referencia": "2024-01",
  "descricao": "Shampoo especial",
  "valor": 85.50,
  "data_despesa": "2024-01-15"
}
```

### ⚙️ Webhooks

#### Configurações (`/webhook_configurations`)

**GET /webhook_configurations**
```json
[
  {
    "id": "uuid",
    "event_type": "tutor.created",
    "webhook_url": "https://api.exemplo.com/webhook",
    "secret_key": "chave-secreta",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

**POST /webhook_configurations**
```json
{
  "event_type": "tutor.created",
  "webhook_url": "https://api.exemplo.com/webhook",
  "secret_key": "chave-secreta",
  "is_active": true
}
```

#### Logs (`/webhook_logs`)

**GET /webhook_logs**
```json
[
  {
    "id": "uuid",
    "event_type": "tutor.created",
    "webhook_url": "https://api.exemplo.com/webhook",
    "event_data": {"id": "uuid", "nome": "João"},
    "http_status": 200,
    "response_body": "OK",
    "error_message": null,
    "sent_at": "2024-01-01T00:00:00Z"
  }
]
```

## 🔄 Edge Functions

### Webhook Processor

**Endpoint:** `/functions/v1/webhook-processor`

**Método:** POST

**Descrição:** Processa webhooks pendentes na fila

**Headers:**
```javascript
{
  'Authorization': 'Bearer SUA-CHAVE-PUBLICA'
}
```

**Response:**
```json
{
  "message": "Processed 3 webhooks",
  "results": [
    {
      "id": "uuid",
      "success": true,
      "status": 200
    }
  ]
}
```

## 📊 Filtros e Consultas

### Operadores Supabase

#### Filtros Básicos
```http
GET /tutores?nome=eq.João Silva
GET /pets?porte=eq.Grande
GET /agendamentos?data_servico=gte.2024-01-01
```

#### Ordenação
```http
GET /tutores?order=nome.asc
GET /agendamentos?order=data_servico.desc
```

#### Paginação
```http
GET /tutores?limit=10&offset=20
```

#### Seleção de Campos
```http
GET /tutores?select=id,nome,celular
```

#### Joins
```http
GET /pets?select=*,tutores(nome,celular)
```

## ❌ Códigos de Erro

### Códigos HTTP
- **200**: Sucesso
- **201**: Criado com sucesso
- **400**: Requisição inválida
- **401**: Não autorizado
- **403**: Acesso negado
- **404**: Não encontrado
- **422**: Dados inválidos
- **500**: Erro interno do servidor

### Exemplos de Erro
```json
{
  "code": "PGRST116",
  "details": "The result contains 0 rows",
  "hint": null,
  "message": "JSON object requested, multiple (or no) rows returned"
}
```

## 🚀 Exemplos de Uso

### JavaScript/Fetch
```javascript
// Criar tutor
const criarTutor = async (dadosTutor) => {
  const response = await fetch('https://SEU-PROJETO.supabase.co/rest/v1/tutores', {
    method: 'POST',
    headers: {
      'apikey': 'SUA-CHAVE',
      'Authorization': 'Bearer SUA-CHAVE',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dadosTutor)
  });
  
  if (!response.ok) {
    throw new Error(`Erro: ${response.status}`);
  }
  
  return await response.json();
};
```

### cURL
```bash
# Listar tutores
curl -X GET "https://SEU-PROJETO.supabase.co/rest/v1/tutores" \
  -H "apikey: SUA-CHAVE" \
  -H "Authorization: Bearer SUA-CHAVE"

# Criar agendamento público
curl -X POST "https://SEU-PROJETO.supabase.co/rest/v1/agendamentos_tutores" \
  -H "apikey: SUA-CHAVE" \
  -H "Authorization: Bearer SUA-CHAVE" \
  -H "Content-Type: application/json" \
  -d '{
    "tutor_nome": "João Silva",
    "tutor_telefone": "41999999999",
    "pet_nome": "Rex",
    "pet_raca": "Golden Retriever",
    "data_servico": "2024-12-25",
    "hora_servico": "14:00",
    "servico": "Banho e Tosa"
  }'
```

### Python
```python
import requests

# Configuração
BASE_URL = "https://SEU-PROJETO.supabase.co/rest/v1"
HEADERS = {
    "apikey": "SUA-CHAVE",
    "Authorization": "Bearer SUA-CHAVE",
    "Content-Type": "application/json"
}

# Listar pets
def listar_pets():
    response = requests.get(f"{BASE_URL}/pets", headers=HEADERS)
    return response.json()

# Criar agendamento
def criar_agendamento(dados):
    response = requests.post(
        f"{BASE_URL}/agendamentos_tutores", 
        headers=HEADERS, 
        json=dados
    )
    return response.json()
```

## 🔐 Segurança

### Row Level Security (RLS)
Todas as tabelas possuem políticas RLS configuradas:

- **Públicas**: `agendamentos_tutores` (apenas INSERT)
- **Autenticadas**: Todas as outras operações
- **Restritas**: Dados financeiros e administrativos

### Webhook Security
- Use `secret_key` para validar webhooks
- Implemente verificação de assinatura
- Use HTTPS sempre

### Rate Limiting
O Supabase implementa rate limiting automático:
- 1000 requests por minuto por IP
- 100 requests por segundo por IP

## 📝 Changelog

### v1.0.0
- API inicial com todos os endpoints
- Sistema de autenticação RLS
- Webhooks configuráveis
- Edge Functions para processamento

---

Para mais informações, consulte:
- [Documentação do Supabase](https://supabase.com/docs)
- [PostgREST API](https://postgrest.org/en/stable/)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)