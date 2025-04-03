import React from 'react';
import { MetricCard } from './MetricCard';
import { FiltrosRelatorio } from './FiltrosRelatorio';
import { GraficosRelatorio } from './GraficosRelatorio';
import { TabelaDadosDiarios } from './TabelaDadosDiarios';
import { useRelatorioFinanceiro } from '../../../hooks/useRelatorioFinanceiro';

const RelatorioFinanceiro: React.FC = () => {
  const {
    relatorio,
    loading,
    dataInicio,
    dataFim,
    categorias,
    categoriaSelecionada,
    periodo,
    setDataInicio,
    setDataFim,
    setCategoriaSelecionada,
    handlePeriodoChange
  } = useRelatorioFinanceiro();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white dark:bg-gray-900 p-8 mt-8 rounded-lg shadow">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Carregando dados financeiros...</p>
        </div>
      </div>
    );
  }

  if (!relatorio) {
    return (
      <div className="flex justify-center items-center h-64 bg-white dark:bg-gray-900 p-8 mt-8 rounded-lg shadow">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Nenhum dado disponível</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Tente ajustar os filtros de data ou categoria.</p>
        </div>
      </div>
    );
  }

  const metricCardsData = [
    {
      icon: "/icons/entradas.svg",
      title: "Total de Entradas",
      value: `R$ ${Number(relatorio.totais.entradas).toFixed(2)}`,
      description: `Período: ${new Date(relatorio.periodo.data_inicio).toLocaleDateString()} - ${new Date(relatorio.periodo.data_fim).toLocaleDateString()}`,
    },
    {
      icon: "/icons/prejuizo.svg",
      title: "Total de Saídas",
      value: `R$ ${Number(relatorio.totais.saidas).toFixed(2)}`,
      description: `Período: ${new Date(relatorio.periodo.data_inicio).toLocaleDateString()} - ${new Date(relatorio.periodo.data_fim).toLocaleDateString()}`,
    },
    {
      icon: "/icons/entrada_saida.svg", 
      title: relatorio.totais.saldo >= 0 ? "Lucro" : "Prejuízo",
      value: `R$ ${Math.abs(relatorio.totais.saldo).toFixed(2)}`,
      description: `Período: ${new Date(relatorio.periodo.data_inicio).toLocaleDateString()} - ${new Date(relatorio.periodo.data_fim).toLocaleDateString()}`,
    },
  ];
  
  return (
    <section className="bg-white dark:bg-gray-900 p-8 mt-8">
      <div className="max-w-screen-xl mx-auto mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Relatório Financeiro - Entradas e Saídas
        </h1>

        {/* Componente de filtros */}
        <FiltrosRelatorio
          dataInicio={dataInicio}
          dataFim={dataFim}
          categoriaSelecionada={categoriaSelecionada}
          categorias={categorias}
          onDataInicioChange={setDataInicio}
          onDataFimChange={setDataFim}
          onCategoriaChange={setCategoriaSelecionada}
        />

        {/* Cards de métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {metricCardsData.map((props, index) => (
            <MetricCard key={index} {...props} />
          ))}
        </div>

        {/* Gráficos do relatório */}
        <GraficosRelatorio
          dadosDiarios={relatorio.dados_diarios}
          despesasPorCategoria={relatorio.despesas_por_categoria}
          totalSaidas={relatorio.totais.saidas}
          periodo={periodo}
          onPeriodoChange={handlePeriodoChange}
        />

        {/* Tabela de dados diários */}
        <TabelaDadosDiarios 
          dados={relatorio.dados_diarios}
          totais={relatorio.totais}
        />
      </div>
    </section>
  );
};

export default RelatorioFinanceiro;
