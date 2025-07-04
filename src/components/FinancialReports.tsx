
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, FileText, Calendar } from "lucide-react";
import { useState } from "react";

interface ReportData {
  month: string;
  year: string;
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
}

interface FinancialReportsProps {
  reportData: ReportData[];
  onGenerateReport: (month: string, year: string) => void;
}

const FinancialReports = ({ reportData, onGenerateReport }: FinancialReportsProps) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const handleGenerateReport = () => {
    onGenerateReport(selectedMonth.toString().padStart(2, '0'), selectedYear.toString());
  };

  const exportToCSV = (data: ReportData[]) => {
    const csvContent = [
      ['Mês/Ano', 'Receitas', 'Despesas', 'Saldo'],
      ...data.map(row => [
        `${row.month}/${row.year}`,
        row.totalIncome.toFixed(2),
        row.totalExpenses.toFixed(2),
        row.netBalance.toFixed(2)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio-financeiro-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Relatórios Financeiros
        </CardTitle>
        <CardDescription>Gere e exporte relatórios mensais</CardDescription>
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
              <h4 className="font-medium">Relatórios Gerados</h4>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => exportToCSV(reportData)}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Exportar CSV
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 p-2 text-left">Período</th>
                    <th className="border border-gray-300 p-2 text-right">Receitas</th>
                    <th className="border border-gray-300 p-2 text-right">Despesas</th>
                    <th className="border border-gray-300 p-2 text-right">Saldo</th>
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
