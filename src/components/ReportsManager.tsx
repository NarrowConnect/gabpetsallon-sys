
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileText, Calendar } from "lucide-react";
import { useAgendamentos } from '@/hooks/useAgendamentos';
import { useFinancas } from '@/hooks/useSupabase';
import { useToast } from "@/hooks/use-toast";

const ReportsManager = () => {
  const { agendamentos } = useAgendamentos();
  const { contasPagar, valoresRecebidos } = useFinancas();
  const { toast } = useToast();
  
  const [reportType, setReportType] = useState<'agendamentos' | 'financeiro'>('agendamentos');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });

  const generateAgendamentosReport = () => {
    let filteredAgendamentos = agendamentos;

    if (dateRange.start && dateRange.end) {
      filteredAgendamentos = agendamentos.filter(agendamento => {
        const dataAgendamento = new Date(agendamento.data_servico);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        return dataAgendamento >= startDate && dataAgendamento <= endDate;
      });
    }

    const csvContent = [
      '\uFEFF', // BOM para UTF-8
      'RELATÓRIO DE AGENDAMENTOS\n\n',
      'Data,Hora,Tutor,Telefone,Pet,Raça,Porte,Serviço,Status,Valor,Observações\n',
      ...filteredAgendamentos.map(agendamento => 
        `${new Date(agendamento.data_servico).toLocaleDateString('pt-BR')},` +
        `${agendamento.hora_servico},` +
        `"${agendamento.tutor_nome}",` +
        `"${agendamento.tutor_telefone || ''}",` +
        `"${agendamento.pet_nome}",` +
        `"${agendamento.pet_raca || ''}",` +
        `"${agendamento.pet_porte || ''}",` +
        `"${agendamento.servico}",` +
        `"${agendamento.status || 'Agendado'}",` +
        `"R$ ${agendamento.valor ? agendamento.valor.toFixed(2).replace('.', ',') : '0,00'}",` +
        `"${(agendamento.observacoes || '').replace(/"/g, '""')}"`
      )
    ].join('\n');

    downloadFile(csvContent, `relatorio-agendamentos-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const generateFinanceiroReport = () => {
    const mesReferencia = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
    
    const receitas = valoresRecebidos.find(v => v.mes_referencia === mesReferencia);
    const despesas = contasPagar.find(c => c.mes_referencia === mesReferencia);

    const csvContent = [
      '\uFEFF', // BOM para UTF-8
      `RELATÓRIO FINANCEIRO - ${String(selectedMonth).padStart(2, '0')}/${selectedYear}\n\n`,
      'RECEITAS\n',
      'Categoria,Valor\n',
      `Banhos Porte Pequeno,R$ ${(receitas?.banhos_porte_pequeno || 0).toFixed(2).replace('.', ',')}\n`,
      `Banhos Porte Grande,R$ ${(receitas?.banhos_porte_grande || 0).toFixed(2).replace('.', ',')}\n`,
      `Banhos Medicamentosos,R$ ${(receitas?.banhos_medicamentosos || 0).toFixed(2).replace('.', ',')}\n`,
      `Tosas,R$ ${(receitas?.tosas || 0).toFixed(2).replace('.', ',')}\n`,
      `Hospedagens,R$ ${(receitas?.hospedagens || 0).toFixed(2).replace('.', ',')}\n`,
      `Boutique,R$ ${(receitas?.boutique || 0).toFixed(2).replace('.', ',')}\n`,
      `Taxi Dog,R$ ${(receitas?.taxi_dog || 0).toFixed(2).replace('.', ',')}\n`,
      `TOTAL RECEITAS,R$ ${(receitas?.total_entradas || 0).toFixed(2).replace('.', ',')}\n\n`,
      'DESPESAS\n',
      'Categoria,Valor\n',
      `Aluguel,R$ ${(despesas?.aluguel || 0).toFixed(2).replace('.', ',')}\n`,
      `COPEL,R$ ${(despesas?.copel || 0).toFixed(2).replace('.', ',')}\n`,
      `SANEPAR,R$ ${(despesas?.sanepar || 0).toFixed(2).replace('.', ',')}\n`,
      `Internet,R$ ${(despesas?.internet || 0).toFixed(2).replace('.', ',')}\n`,
      `Segurança,R$ ${(despesas?.seguranca_mensalidade || 0).toFixed(2).replace('.', ',')}\n`,
      `MEI,R$ ${(despesas?.mei || 0).toFixed(2).replace('.', ',')}\n`,
      `Celular,R$ ${(despesas?.celular_mes || 0).toFixed(2).replace('.', ',')}\n`,
      `Toalha,R$ ${(despesas?.toalhas || 0).toFixed(2).replace('.', ',')}\n`,
      `Gasolina,R$ ${(despesas?.gasolina || 0).toFixed(2).replace('.', ',')}\n`,
      `Tarifa Bancária,R$ ${(despesas?.tarifa_bancaria || 0).toFixed(2).replace('.', ',')}\n`,
      `Cartão Santander,R$ ${(despesas?.cartao_santander || 0).toFixed(2).replace('.', ',')}\n`,
      `Cartão BB,R$ ${(despesas?.cartao_bb || 0).toFixed(2).replace('.', ',')}\n`,
      `Cartão Nu,R$ ${(despesas?.cartao_nu || 0).toFixed(2).replace('.', ',')}\n`,
      `Cartão GAB,R$ ${(despesas?.cartao_gab || 0).toFixed(2).replace('.', ',')}\n`,
      `Boleto Biocom,R$ ${(despesas?.boleto_biocom || 0).toFixed(2).replace('.', ',')}\n`,
      `Boleto Euroshop,R$ ${(despesas?.boleto_euroshop || 0).toFixed(2).replace('.', ',')}\n`,
      `TOTAL DESPESAS,R$ ${(despesas?.total_saidas || 0).toFixed(2).replace('.', ',')}\n\n`,
      `SALDO FINAL,R$ ${((receitas?.total_entradas || 0) - (despesas?.total_saidas || 0)).toFixed(2).replace('.', ',')}\n`
    ].join('');

    downloadFile(csvContent, `relatorio-financeiro-${mesReferencia}.csv`);
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Relatório gerado",
        description: `O arquivo ${filename} foi baixado com sucesso.`,
      });
    }
  };

  const handleGenerateReport = () => {
    try {
      if (reportType === 'agendamentos') {
        generateAgendamentosReport();
      } else {
        generateFinanceiroReport();
      }
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast({
        title: "Erro ao gerar relatório",
        description: "Ocorreu um erro ao gerar o relatório. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 font-poppins">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-poppins">
            <FileText className="h-5 w-5" />
            Gerador de Relatórios
          </CardTitle>
          <CardDescription className="font-poppins">
            Gere relatórios personalizados em formato CSV
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="report-type" className="font-poppins">Tipo de Relatório</Label>
              <Select value={reportType} onValueChange={(value: 'agendamentos' | 'financeiro') => setReportType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de relatório" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agendamentos">Relatório de Agendamentos</SelectItem>
                  <SelectItem value="financeiro">Relatório Financeiro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {reportType === 'agendamentos' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold font-poppins">Filtros para Agendamentos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date" className="font-poppins">Data Início</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date" className="font-poppins">Data Fim</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  />
                </div>
              </div>
              <p className="text-sm text-gray-600 font-poppins">
                Deixe as datas em branco para incluir todos os agendamentos
              </p>
            </div>
          )}

          {reportType === 'financeiro' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold font-poppins">Período do Relatório Financeiro</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="month" className="font-poppins">Mês</Label>
                  <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o mês" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {new Date(2024, i).toLocaleDateString('pt-BR', { month: 'long' })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year" className="font-poppins">Ano</Label>
                  <Input
                    id="year"
                    type="number"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    min="2020"
                    max="2030"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <Button onClick={handleGenerateReport} className="flex items-center gap-2 font-poppins">
              <Download className="h-4 w-4" />
              Gerar e Baixar Relatório
            </Button>
          </div>

          <div className="text-sm text-gray-600 space-y-2 font-poppins">
            <p><strong>Formatos disponíveis:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>CSV (Comma Separated Values) - Compatível com Excel e Google Sheets</li>
              <li>Codificação UTF-8 com BOM para caracteres especiais</li>
              <li>Dados exportados conforme filtros selecionados</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-poppins">Estatísticas Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-blue-600 font-poppins">
                {agendamentos.length}
              </div>
              <div className="text-sm text-gray-600 font-poppins">Total de Agendamentos</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-green-600 font-poppins">
                {agendamentos.filter(a => a.status === 'Concluído').length}
              </div>
              <div className="text-sm text-gray-600 font-poppins">Agendamentos Concluídos</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-orange-600 font-poppins">
                R$ {agendamentos.reduce((sum, a) => sum + (a.valor || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-sm text-gray-600 font-poppins">Valor Total dos Serviços</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsManager;
