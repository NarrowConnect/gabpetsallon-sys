
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, FileText, Calendar } from "lucide-react";
import { useState } from "react";

interface DetailedReportData {
  month: string;
  year: string;
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  incomeDetails: { [key: string]: number };
  expenseDetails: { [key: string]: number };
  customIncomes: Array<{ descricao: string; valor: number; data: string }>;
  customExpenses: Array<{ descricao: string; valor: number; data: string }>;
}

interface FinancialReportsProps {
  reportData: DetailedReportData[];
  onGenerateReport: (month: string, year: string) => void;
}

const FinancialReports = ({ reportData, onGenerateReport }: FinancialReportsProps) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const handleGenerateReport = () => {
    onGenerateReport(selectedMonth.toString().padStart(2, '0'), selectedYear.toString());
  };

  const exportToCSV = (data: DetailedReportData[]) => {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    
    // Cabeçalho principal
    csvContent += "RELATÓRIO FINANCEIRO DETALHADO\n\n";
    
    data.forEach(report => {
      csvContent += `MÊS/ANO,${report.month}/${report.year}\n\n`;
      
      // Receitas
      csvContent += "RECEITAS\n";
      csvContent += "Categoria,Valor\n";
      Object.entries(report.incomeDetails).forEach(([key, value]) => {
        csvContent += `${key},R$ ${value.toFixed(2).replace('.', ',')}\n`;
      });
      
      // Receitas personalizadas
      if (report.customIncomes?.length > 0) {
        csvContent += "\nRECEITAS PERSONALIZADAS\n";
        csvContent += "Descrição,Valor,Data\n";
        report.customIncomes.forEach(item => {
          csvContent += `${item.descricao},R$ ${item.valor.toFixed(2).replace('.', ',')},${item.data}\n`;
        });
      }
      
      csvContent += `\nTOTAL RECEITAS,R$ ${report.totalIncome.toFixed(2).replace('.', ',')}\n\n`;
      
      // Despesas
      csvContent += "DESPESAS\n";
      csvContent += "Categoria,Valor\n";
      Object.entries(report.expenseDetails).forEach(([key, value]) => {
        csvContent += `${key},R$ ${value.toFixed(2).replace('.', ',')}\n`;
      });
      
      // Despesas personalizadas
      if (report.customExpenses?.length > 0) {
        csvContent += "\nDESPESAS PERSONALIZADAS\n";
        csvContent += "Descrição,Valor,Data\n";
        report.customExpenses.forEach(item => {
          csvContent += `${item.descricao},R$ ${item.valor.toFixed(2).replace('.', ',')},${item.data}\n`;
        });
      }
      
      csvContent += `\nTOTAL DESPESAS,R$ ${report.totalExpenses.toFixed(2).replace('.', ',')}\n`;
      csvContent += `SALDO FINAL,R$ ${report.netBalance.toFixed(2).replace('.', ',')}\n\n`;
      csvContent += "=" + "=".repeat(50) + "\n\n";
    });

    // Criar e baixar arquivo
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `relatorio-financeiro-detalhado-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToXLS = (data: DetailedReportData[]) => {
    // Para uma implementação completa de XLS, seria necessário usar uma biblioteca como xlsx
    // Por ora, vamos usar CSV com BOM UTF-8 que abre corretamente no Excel
    exportToCSV(data);
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Relatórios Financeiros Detalhados
        </CardTitle>
        <CardDescription>Gere e exporte relatórios mensais com detalhamento completo</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-4">
          <div>
            <Label htmlFor="month">Mês</Label>
            <select
              id="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(2024, i).toLocaleDateString('pt-BR', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="year">Ano</Label>
            <Input
              id="year"
              type="number"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-24"
            />
          </div>
          <Button onClick={handleGenerateReport} className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Gerar Relatório
          </Button>
        </div>

        {reportData.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Relatórios Detalhados Gerados</h4>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => exportToCSV(reportData)}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  CSV (UTF-8)
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => exportToXLS(reportData)}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Excel
                </Button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 p-2 text-left">Período</th>
                    <th className="border border-gray-300 p-2 text-right">Receitas</th>
                    <th className="border border-gray-300 p-2 text-right">Despesas</th>
                    <th className="border border-gray-300 p-2 text-right">Saldo</th>
                    <th className="border border-gray-300 p-2 text-center">Detalhes</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-2">{row.month}/{row.year}</td>
                      <td className="border border-gray-300 p-2 text-right text-green-600">
                        R$ {row.totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="border border-gray-300 p-2 text-right text-red-600">
                        R$ {row.totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className={`border border-gray-300 p-2 text-right font-medium ${
                        row.netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'
                      }`}>
                        R$ {row.netBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        <span className="text-sm text-gray-600">
                          {Object.keys(row.incomeDetails).length + (row.customIncomes?.length || 0)} receitas, {' '}
                          {Object.keys(row.expenseDetails).length + (row.customExpenses?.length || 0)} despesas
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialReports;
