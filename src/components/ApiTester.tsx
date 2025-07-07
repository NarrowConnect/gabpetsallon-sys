
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  },
  {
    name: 'Processar Webhooks',
    method: 'POST',
    endpoint: 'functions/v1/webhook-processor',
    description: 'Processa webhooks pendentes',
    isFunction: true
  }
];

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
      let response;
      let data;
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
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

      if (selectedEndpoint.isFunction) {
        // Edge Function
        response = await fetch(`/functions/v1/${selectedEndpoint.endpoint.replace('functions/v1/', '')}`, {
          method: selectedEndpoint.method,
          headers: {
            ...headers,
            'Authorization': `Bearer ${supabase.supabaseKey}`,
          },
          body: selectedEndpoint.method !== 'GET' ? requestBody : undefined,
        });
        data = await response.json();
      } else {
        // Supabase REST API
        const supabaseUrl = 'https://zwykvxtufkcovqyifhfg.supabase.co';
        const url = `${supabaseUrl}/rest/v1/${selectedEndpoint.endpoint}`;
        
        const requestOptions: RequestInit = {
          method: selectedEndpoint.method,
          headers: {
            ...headers,
            'apikey': supabase.supabaseKey,
            'Authorization': `Bearer ${supabase.supabaseKey}`,
          },
        };

        if (selectedEndpoint.method !== 'GET' && requestBody) {
          requestOptions.body = requestBody;
        }

        response = await fetch(url, requestOptions);
        
        if (response.headers.get('content-type')?.includes('application/json')) {
          data = await response.json();
        } else {
          data = await response.text();
        }
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
    <div className="container mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Testador de API</h1>
        <p className="text-gray-600 text-sm sm:text-base">Teste todos os endpoints da API do sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Configurar Requisição
            </CardTitle>
            <CardDescription>Configure e execute testes de API</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Endpoint</Label>
              <Select value={selectedEndpoint.name} onValueChange={handleEndpointChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {API_ENDPOINTS.map(endpoint => (
                    <SelectItem key={endpoint.name} value={endpoint.name}>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {endpoint.method}
                        </Badge>
                        {endpoint.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500 mt-1">{selectedEndpoint.description}</p>
            </div>

            {selectedEndpoint.method !== 'GET' && (
              <div>
                <Label>Body da Requisição (JSON)</Label>
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
              <Label>Headers Customizados (JSON - Opcional)</Label>
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
              className="w-full"
            >
              <Play className="h-4 w-4 mr-2" />
              {loading ? 'Executando...' : 'Executar Teste'}
            </Button>
          </CardContent>
        </Card>

        {/* Response Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Resultado</span>
              {result && (
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={result.status >= 200 && result.status < 300 ? "default" : "destructive"}
                    className={getStatusColor(result.status)}
                  >
                    {result.error ? 'ERROR' : result.status}
                  </Badge>
                  <Button size="sm" variant="outline" onClick={copyResult}>
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
                  <span className="text-sm text-gray-500">
                    {new Date(result.timestamp).toLocaleString('pt-BR')}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 overflow-auto max-h-96">
                  <pre className="text-sm">
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
                <p>Execute um teste para ver os resultados aqui</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Exemplos de Uso com cURL</CardTitle>
          <CardDescription>Comandos prontos para usar no terminal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <h4 className="text-sm font-semibold mb-2 text-green-400"># Listar tutores</h4>
              <code className="text-sm break-all">
                curl -X GET "https://zwykvxtufkcovqyifhfg.supabase.co/rest/v1/tutores" \<br/>
                &nbsp;&nbsp;-H "apikey: {supabase.supabaseKey}" \<br/>
                &nbsp;&nbsp;-H "Authorization: Bearer {supabase.supabaseKey}"
              </code>
            </div>

            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <h4 className="text-sm font-semibold mb-2 text-green-400"># Criar novo tutor</h4>
              <code className="text-sm break-all">
                curl -X POST "https://zwykvxtufkcovqyifhfg.supabase.co/rest/v1/tutores" \<br/>
                &nbsp;&nbsp;-H "apikey: {supabase.supabaseKey}" \<br/>
                &nbsp;&nbsp;-H "Authorization: Bearer {supabase.supabaseKey}" \<br/>
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
