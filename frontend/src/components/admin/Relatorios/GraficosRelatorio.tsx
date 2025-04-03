import React from 'react';
import { ChartCard } from './ChartCard';
import { chartsConfig } from '../../../utils/chartConfig';
import { DadosDiarios } from '../../../types/RelatorioFinanceiro';

interface GraficosRelatorioProps {
  dadosDiarios: DadosDiarios[];
  despesasPorCategoria: Record<string, number>;
  totalSaidas: number;
  periodo: number;
  onPeriodoChange: (periodo: number) => void;
}

export const GraficosRelatorio: React.FC<GraficosRelatorioProps> = ({
  dadosDiarios,
  despesasPorCategoria,
  totalSaidas,
  periodo,
  onPeriodoChange
}) => {
  const despesasFiltradas = Object.entries(despesasPorCategoria)
    .filter(([_, valor]) => Number(valor) > 0)
    .reduce((acc, [categoria, valor]) => {
      acc[categoria] = Number(valor);
      return acc;
    }, {} as Record<string, number>);
  
  const categorias_labels = Object.keys(despesasFiltradas);
  const categorias_valores = Object.values(despesasFiltradas);
  
  const pieChartLabels = categorias_labels.length > 0 ? categorias_labels : ['Sem despesas'];
  const pieChartValues = categorias_valores.length > 0 ? categorias_valores : [1];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Entradas vs Saídas
        </h2>
        <div className="h-[420px]">
          <ChartCard
            title="Entradas vs Saídas"
            value={`R$ ${dadosDiarios.reduce((acc, item) => acc + item.saldo, 0).toFixed(2)}`}
            chart={{
              type: "bar",
              height: 300,
              series: [
                {
                  name: "Entradas",
                  data: dadosDiarios.map(item => item.entradas),
                },
                {
                  name: "Saídas",
                  data: dadosDiarios.map(item => item.saidas),
                },
              ],
              options: {
                ...chartsConfig,
                colors: ["#4CAF50", "#F44336"],
                xaxis: {
                  ...chartsConfig.xaxis,
                  categories: dadosDiarios.map(item => item.data),
                },
              },
            }}
            periodo={periodo}
            onPeriodoChange={onPeriodoChange}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Despesas por Categoria
        </h2>
        <div className="h-[420px]">
          <ChartCard
            title="Despesas por Categoria"
            value={`R$ ${Number(totalSaidas).toFixed(2)}`}
            chart={{
              type: "pie",
              height: 300,
              series: pieChartValues,
              options: {
                ...chartsConfig,
                labels: pieChartLabels,
                colors: [
                  "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
                  "#FF9F40", "#8BC34A", "#FF5722", "#607D8B", "#E91E63"
                ],
                legend: {
                  position: "bottom",
                },
                plotOptions: {
                  pie: {
                    donut: {
                      size: '65%'
                    }
                  }
                },
              },
            }}
            periodo={periodo}
            onPeriodoChange={onPeriodoChange}
          />
        </div>
      </div>
    </div>
  );
};
