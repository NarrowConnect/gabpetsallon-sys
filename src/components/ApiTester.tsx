
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Code, Play, Copy, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

interface TestResult {
  status: number;
  data: any;
  error?: string;
  timestamp: string;
}

const API_ENDPOINTS = [
  {
    name: 'Listar Tutores',
    method: 'GET',
    endpoint: 'tutores',
    description: 'Busca todos os tutores cadastrados'
  },
  {
    name: 'Criar Tutor',
    method: 'POST',
    endpoint: 'tutores',
    description: 'Cria um novo tutor',
    sampleBody: JSON.stringify({
      nome: "João Silva",
      celular: "41999999999",
      endereco: "Rua das Flores, 123",
      cidade: "Curitiba",
      estado: "PR"
    }, null, 2)
  },
  {
    name: 'Listar Pets',
    method: 'GET',
    endpoint: 'pets',
    description: 'Busca todos os pets cadastrados'
  },
  {
    name: 'Criar Pet',
    method: 'POST',
    endpoint: 'pets',
    description: 'Cria um novo pet',
    sampleBody: JSON.stringify({
      nome_tutor: "João Silva",
      nome_pet: "Rex",
      especie: "Cão",
      raca: "Golden Retriever",
      porte: "Grande",
      idade: 3
    }, null, 2)
  },
  {
    name: 'Listar Agendamentos',
    method: 'GET',
    endpoint: 'agendamentos',
    description: 'Busca todos os agendamentos'
  },
  {
    name: 'Criar Agendamento',
    method: 'POST',
    endpoint: 'agendamentos',
    description: 'Cria um novo agendamento',
    sampleBody: JSON.stringify({
      tutor_nome: "João Silva",
      tutor_telefone: "41999999999",
      pet_nome: "Rex",
      pet_raca: "Golden Retriever",
      pet_porte: "Grande",
      data_servico: "2024-07-15",
      hora_servico: "14:00",
      servico: "Banho e Tosa"
    }, null, 2)
  },
  {
    name: 'Agendamentos Tutores',
    method: 'GET',
    endpoint: 'agendamentos_tutores',
    description: 'Busca solicitações de agendamento dos tutores'
  }
];

// ===== BLOCO DE CONFIGURAÇÃO DE API SUPABASE =====
// ⚠️  SUBSTITUA AS CHAVES ABAIXO PELAS SUAS QUANDO NECESSÁRIO:
// 1. SUPABASE_URL: Substitua pela URL do seu projeto Supabase
// 2. SUPABASE_ANON_KEY: Substitua pela chave anônima do seu projeto
// ✅ Encontre suas chaves em: https://supabase.com/dashboard/project/[SEU-PROJETO]/settings/api
const SUPABASE_URL = 'https://zwykvxtufkcovqyifhfg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3eWt2eHR1Zmtjb3ZxeWlmaGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1OTkxODAsImV4cCI6MjA2NzE3NTE4MH0.jZos1WwH4o1HqkkAiZsmmYpARATVZDe01E0p4lPOxHE';
// ===== FIM DO BLOCO DE CONFIGURAÇÃO =====

export default function ApiTester() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(API_ENDPOINTS[0]);
  const [requestBody, setRequestBody] = useState('');
  const [customHeaders, setCustomHeaders] = useState('');
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEndpointChange = (endpointName: string) => {
    const endpoint = API_ENDPOINTS.find(e => e.name === endpointName);
    if (endpoint) {
      setSelectedEndpoint(endpoint);
      setRequestBody(endpoint.sampleBody || '');
      setResult(null);
    }
  };

  const executeTest = async () => {
    setLoading(true);
    setResult(null);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      };

      // Adicionar headers customizados
      if (customHeaders) {
        try {
          const parsedHeaders = JSON.parse(customHeaders);
          Object.assign(headers, parsedHeaders);
        } catch (e) {
          toast.error('Headers customizados devem estar em formato JSON válido');
          setLoading(false);
          return;
        }
      }

      const url = `${SUPABASE_URL}/rest/v1/${selectedEndpoint.endpoint}`;
      
      const requestOptions: RequestInit = {
        method: selectedEndpoint.method,
        headers,
      };

      if (selectedEndpoint.method !== 'GET' && requestBody) {
        requestOptions.body = requestBody;
      }

      const response = await fetch(url, requestOptions);
      
      let data;
      if (response.headers.get('content-type')?.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      setResult({
        status: response.status,
        data,
        timestamp: new Date().toISOString(),
      });

      if (response.ok) {
        toast.success('Requisição executada com sucesso!');
      } else {
        toast.error(`Erro na requisição: ${response.status}`);
      }

    } catch (error: any) {
      console.error('Erro ao executar teste:', error);
      setResult({
        status: 0,
        data: null,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      toast.error('Erro ao executar requisição');
    } finally {
      setLoading(false);
    }
  };

  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      toast.success('Resultado copiado para o clipboard');
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-600';
    if (status >= 400 && status < 500) return 'text-yellow-600';
    if (status >= 500) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6 font-poppins">
      <div>
        <h3 className="text-lg font-bold font-poppins">Testador de API</h3>
        <p className="text-gray-600 text-sm font-poppins">Teste todos os endpoints da API do sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-poppins">
              <Code className="h-5 w-5" />
              Configurar Requisição
            </CardTitle>
            <CardDescription className="font-poppins">Configure e execute testes de API</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="font-poppins">Endpoint</Label>
              <Select value={selectedEndpoint.name} onValueChange={handleEndpointChange}>
                <SelectTrigger className="font-poppins">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {API_ENDPOINTS.map(endpoint => (
                    <SelectItem key={endpoint.name} value={endpoint.name} className="font-poppins">
                      <div className="flex items-center gap-2">
                        <Badge className="text-xs font-poppins">
                          {endpoint.method}
                        </Badge>
                        {endpoint.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500 mt-1 font-poppins">{selectedEndpoint.description}</p>
            </div>

            {selectedEndpoint.method !== 'GET' && (
              <div>
                <Label className="font-poppins">Body da Requisição (JSON)</Label>
                <Textarea
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  placeholder="Cole aqui o JSON da requisição"
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>
            )}

            <div>
              <Label className="font-poppins">Headers Customizados (JSON - Opcional)</Label>
              <Textarea
                value={customHeaders}
                onChange={(e) => setCustomHeaders(e.target.value)}
                placeholder='{"Custom-Header": "valor"}'
                rows={3}
                className="font-mono text-sm"
              />
            </div>

            <Button 
              onClick={executeTest} 
              disabled={loading}
              className="w-full font-poppins"
            >
              <Play className="h-4 w-4 mr-2" />
              {loading ? 'Executando...' : 'Executar Teste'}
            </Button>
          </CardContent>
        </Card>

        {/* Response Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between font-poppins">
              <span>Resultado</span>
              {result && (
                <div className="flex items-center gap-2">
                  <Badge
                    className={`${getStatusColor(result.status)} font-poppins`}
                  >
                    {result.error ? 'ERROR' : result.status}
                  </Badge>
                  <Button onClick={copyResult} className="font-poppins">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {result.error ? (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  <span className="text-sm text-gray-500 font-poppins">
                    {new Date(result.timestamp).toLocaleString('pt-BR')}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 overflow-auto max-h-96">
                  <pre className="text-sm font-mono">
                    {result.error ? (
                      <span className="text-red-600">{result.error}</span>
                    ) : (
                      JSON.stringify(result.data, null, 2)
                    )}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="font-poppins">Execute um teste para ver os resultados aqui</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="font-poppins">Exemplos de Uso com cURL</CardTitle>
          <CardDescription className="font-poppins">Comandos prontos para usar no terminal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <h4 className="text-sm font-semibold mb-2 text-green-400 font-poppins"># Listar tutores</h4>
              <code className="text-sm break-all font-mono">
                curl -X GET "{SUPABASE_URL}/rest/v1/tutores" \<br/>
                &nbsp;&nbsp;-H "apikey: {SUPABASE_ANON_KEY}" \<br/>
                &nbsp;&nbsp;-H "Authorization: Bearer {SUPABASE_ANON_KEY}"
              </code>
            </div>

            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <h4 className="text-sm font-semibold mb-2 text-green-400 font-poppins"># Criar novo tutor</h4>
              <code className="text-sm break-all font-mono">
                curl -X POST "{SUPABASE_URL}/rest/v1/tutores" \<br/>
                &nbsp;&nbsp;-H "apikey: {SUPABASE_ANON_KEY}" \<br/>
                &nbsp;&nbsp;-H "Authorization: Bearer {SUPABASE_ANON_KEY}" \<br/>
                &nbsp;&nbsp;-H "Content-Type: application/json" \<br/>
                &nbsp;&nbsp;-d '{JSON.stringify({ nome: "João Silva", celular: "41999999999" })}'
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
