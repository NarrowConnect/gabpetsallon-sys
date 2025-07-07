
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Activity, AlertCircle, CheckCircle } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

interface WebhookConfig {
  id: string;
  event_type: string;
  webhook_url: string;
  is_active: boolean;
  secret_key?: string;
  created_at: string;
  updated_at: string;
}

interface WebhookLog {
  id: string;
  event_type: string;
  webhook_url: string;
  http_status?: number;
  error_message?: string;
  sent_at: string;
}

const EVENT_TYPES = [
  { value: 'tutor.created', label: 'Tutor Criado' },
  { value: 'tutor.updated', label: 'Tutor Atualizado' },
  { value: 'tutor.deleted', label: 'Tutor Deletado' },
  { value: 'pet.created', label: 'Pet Criado' },
  { value: 'pet.updated', label: 'Pet Atualizado' },
  { value: 'pet.deleted', label: 'Pet Deletado' },
  { value: 'agendamento.created', label: 'Agendamento Criado' },
  { value: 'agendamento.updated', label: 'Agendamento Atualizado' },
  { value: 'agendamento.deleted', label: 'Agendamento Deletado' },
];

export default function WebhookManager() {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'configs' | 'logs'>('configs');

  const [formData, setFormData] = useState({
    event_type: '',
    webhook_url: '',
    is_active: true,
    secret_key: '',
  });

  useEffect(() => {
    fetchWebhooks();
    fetchLogs();
  }, []);

  const fetchWebhooks = async () => {
    try {
      const { data, error } = await supabase
        .from('webhook_configurations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWebhooks(data || []);
    } catch (error) {
      console.error('Erro ao buscar webhooks:', error);
      toast.error('Erro ao carregar webhooks');
    }
  };

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('webhook_logs')
        .select('*')
        .order('sent_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Erro ao buscar logs:', error);
      toast.error('Erro ao carregar logs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.event_type || !formData.webhook_url) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const { error } = await supabase
        .from('webhook_configurations')
        .insert([formData]);

      if (error) throw error;

      toast.success('Webhook configurado com sucesso!');
      setFormData({ event_type: '', webhook_url: '', is_active: true, secret_key: '' });
      setShowForm(false);
      fetchWebhooks();
    } catch (error) {
      console.error('Erro ao criar webhook:', error);
      toast.error('Erro ao configurar webhook');
    }
  };

  const toggleWebhook = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('webhook_configurations')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) throw error;
      
      toast.success(isActive ? 'Webhook ativado' : 'Webhook desativado');
      fetchWebhooks();
    } catch (error) {
      console.error('Erro ao atualizar webhook:', error);
      toast.error('Erro ao atualizar webhook');
    }
  };

  const deleteWebhook = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este webhook?')) return;

    try {
      const { error } = await supabase
        .from('webhook_configurations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Webhook deletado');
      fetchWebhooks();
    } catch (error) {
      console.error('Erro ao deletar webhook:', error);
      toast.error('Erro ao deletar webhook');
    }
  };

  const processWebhooks = async () => {
    try {
      const response = await fetch('/functions/v1/webhook-processor', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabase.supabaseKey}`,
        },
      });

      const result = await response.json();
      toast.success(`${result.processed} webhooks processados`);
      fetchLogs();
    } catch (error) {
      console.error('Erro ao processar webhooks:', error);
      toast.error('Erro ao processar webhooks');
    }
  };

  const getStatusIcon = (log: WebhookLog) => {
    if (!log.http_status) return <Activity className="h-4 w-4 text-yellow-500" />;
    if (log.http_status >= 200 && log.http_status < 300) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <AlertCircle className="h-4 w-4 text-red-500" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Gerenciar Webhooks</h1>
          <p className="text-gray-600 text-sm sm:text-base">Configure webhooks para integração com chatbots e outros sistemas</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button 
            onClick={() => setShowForm(!showForm)} 
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Webhook
          </Button>
          <Button 
            onClick={processWebhooks} 
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Activity className="h-4 w-4 mr-2" />
            Processar Pendentes
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b overflow-x-auto">
        <button
          onClick={() => setActiveTab('configs')}
          className={`px-4 py-2 whitespace-nowrap ${activeTab === 'configs' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
        >
          Configurações ({webhooks.length})
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 whitespace-nowrap ${activeTab === 'logs' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
        >
          Logs ({logs.length})
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Novo Webhook</CardTitle>
            <CardDescription>Configure um novo webhook para receber eventos do sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="event_type">Tipo de Evento</Label>
                  <Select value={formData.event_type} onValueChange={(value) => setFormData(prev => ({ ...prev, event_type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o evento" />
                    </SelectTrigger>
                    <SelectContent>
                      {EVENT_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="webhook_url">URL do Webhook</Label>
                  <Input
                    id="webhook_url"
                    type="url"
                    value={formData.webhook_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, webhook_url: e.target.value }))}
                    placeholder="https://exemplo.com/webhook"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="secret_key">Chave Secreta (Opcional)</Label>
                  <Input
                    id="secret_key"
                    type="password"
                    value={formData.secret_key}
                    onChange={(e) => setFormData(prev => ({ ...prev, secret_key: e.target.value }))}
                    placeholder="Chave secreta para autenticação"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="is_active">Ativo</Label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button type="submit" className="w-full sm:w-auto">Criar Webhook</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="w-full sm:w-auto">
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Content */}
      {activeTab === 'configs' ? (
        <div className="grid gap-4">
          {webhooks.map(webhook => (
            <Card key={webhook.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant={webhook.is_active ? "default" : "secondary"}>
                        {EVENT_TYPES.find(t => t.value === webhook.event_type)?.label || webhook.event_type}
                      </Badge>
                      {!webhook.is_active && <Badge variant="outline">Inativo</Badge>}
                    </div>
                    <p className="text-sm text-gray-600 break-all">{webhook.webhook_url}</p>
                    <p className="text-xs text-gray-400">
                      Criado em: {new Date(webhook.created_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Switch
                      checked={webhook.is_active}
                      onCheckedChange={(checked) => toggleWebhook(webhook.id, checked)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteWebhook(webhook.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {webhooks.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">Nenhum webhook configurado</p>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map(log => (
            <Card key={log.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(log)}
                      <Badge variant="outline">
                        {EVENT_TYPES.find(t => t.value === log.event_type)?.label || log.event_type}
                      </Badge>
                      {log.http_status && (
                        <Badge variant={log.http_status >= 200 && log.http_status < 300 ? "default" : "destructive"}>
                          {log.http_status}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 break-all mb-1">{log.webhook_url}</p>
                    {log.error_message && (
                      <p className="text-sm text-red-600">{log.error_message}</p>
                    )}
                    <p className="text-xs text-gray-400">
                      {new Date(log.sent_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {logs.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">Nenhum log encontrado</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
