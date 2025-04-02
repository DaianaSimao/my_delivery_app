import React, { useEffect, useState } from 'react';
import { RelatorioFinanceiro as RelatorioFinanceiroType } from '../../../types/RelatorioFinanceiro';
import api from '../../../services/api';
import { ChartCard } from './ChartCard';
import { chartsConfig } from '../../../utils/chartConfig';
import { MetricCard } from './MetricCard';
import { CategoriasDespesa } from '../../../types/CategoriasDespesa';

const RelatorioFinanceiro: React.FC = () => {
  const [relatorio, setRelatorio] = useState<RelatorioFinanceiroType | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataInicio, setDataInicio] = useState<string>(
    new Date(new Date().setDate(1)).toISOString().split('T')[0]
  );
  const [dataFim, setDataFim] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [categorias, setCategorias] = useState<CategoriasDespesa[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>('');
  const [periodo, setPeriodo] = useState<number>(7); // Padrão: 30 dias
  const restauranteId = localStorage.getItem('restauranteId');

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await api.get(`/api/v1/restaurantes/${restauranteId}/categorias_despesas/lista`);
        setCategorias(response.data);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    };

    fetchCategorias();
  }, [restauranteId]);

  useEffect(() => {
    fetchRelatorio();
  }, [dataInicio, dataFim, categoriaSelecionada]);
  
  // Função para atualizar o período e as datas
  const handlePeriodoChange = (novoPeriodo: number) => {
    setPeriodo(novoPeriodo);
    
    // Calcular novas datas com base no período
    const hoje = new Date();
    const novaDataFim = hoje.toISOString().split('T')[0];
    
    const novaDataInicio = new Date();
    novaDataInicio.setDate(hoje.getDate() - novoPeriodo);
    
    setDataFim(novaDataFim);
    setDataInicio(novaDataInicio.toISOString().split('T')[0]);
  };

  const fetchRelatorio = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/v1/financeiro/relatorio_entradas_saidas', {
        params: {
          restaurante_id: restauranteId,
          data_inicio: dataInicio,
          data_fim: dataFim,
          categoria_despesa_id: categoriaSelecionada || undefined
        }
      });
      // Garantir que todos os dados são números
      const dadosProcessados = {
        ...response.data,
        dados_diarios: response.data.dados_diarios.map((item: { data: string; entradas: any; saidas: any; saldo: any }) => ({
          ...item,
          entradas: Number(item.entradas),
          saidas: Number(item.saidas),
          saldo: Number(item.saldo)
        }))
      };
      setRelatorio(dadosProcessados);
    } catch (error) {
      console.error('Erro ao carregar relatório financeiro:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Carregando...</div>;
  }

  if (!relatorio) {
    return <div className="flex justify-center items-center h-64">Nenhum dado disponível</div>;
  }

  // Removido dadosGraficoEntradaSaida pois não estava sendo utilizado

  // Preparar dados para o gráfico de despesas por categoria
  // Filtrar apenas categorias com valores maiores que zero
  const despesasFiltradas = Object.entries(relatorio.despesas_por_categoria)
    .filter(([_, valor]) => Number(valor) > 0)
    .reduce((acc, [categoria, valor]) => {
      acc[categoria] = Number(valor);
      return acc;
    }, {} as Record<string, number>);
  
  const categorias_labels = Object.keys(despesasFiltradas);
  const categorias_valores = Object.values(despesasFiltradas);
  
  // Garantir que temos pelo menos um valor para o gráfico de pizza
  if (categorias_valores.length === 0) {
    categorias_labels.push('Sem despesas');
    categorias_valores.push(1); // Usar 1 para garantir que o gráfico seja renderizado
  }

  const metricCardsData = [
    {
      icon: "/icons/sales.svg",
      title: "Total de Entradas",
      value: `R$ ${Number(relatorio.totais.entradas).toFixed(2)}`,
      description: `Período: ${new Date(relatorio.periodo.data_inicio).toLocaleDateString()} - ${new Date(relatorio.periodo.data_fim).toLocaleDateString()}`,
    },
    {
      icon: "/icons/expenses.svg",
      title: "Total de Saídas",
      value: `R$ ${Number(relatorio.totais.saidas).toFixed(2)}`,
      description: `Período: ${new Date(relatorio.periodo.data_inicio).toLocaleDateString()} - ${new Date(relatorio.periodo.data_fim).toLocaleDateString()}`,
    },
    {
      icon: relatorio.totais.saldo >= 0 ? "/icons/profit.svg" : "/icons/loss.svg",
      title: relatorio.totais.saldo >= 0 ? "Lucro" : "Prejuízo",
      value: `R$ ${Math.abs(relatorio.totais.saldo).toFixed(2)}`,
      description: `Período: ${new Date(relatorio.periodo.data_inicio).toLocaleDateString()} - ${new Date(relatorio.periodo.data_fim).toLocaleDateString()}`,
    },
  ];
  // Logs de depuração removidos
  
  return (
    <section className="bg-white dark:bg-gray-900 p-8 mt-8">
      <div className="max-w-screen-xl mx-auto mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Relatório Financeiro - Entradas e Saídas
        </h1>

        {/* Filtros */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Data Início
              </label>
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Data Fim
              </label>
              <input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Categoria de Despesa
              </label>
              <select
                value={categoriaSelecionada}
                onChange={(e) => setCategoriaSelecionada(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              >
                <option value="">Todas as categorias</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Cards de métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {metricCardsData.map((props, index) => (
            <MetricCard key={index} {...props} />
          ))}
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Entradas e Saídas */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Entradas vs Saídas
            </h2>
            <div className="h-[420px]">
              <ChartCard
                title="Entradas vs Saídas"
                value={`R$ ${Number(relatorio.totais.saldo).toFixed(2)}`}
                chart={{
                  type: "bar",
                  height: 300,
                  series: [
                    {
                      name: "Entradas",
                      data: relatorio.dados_diarios.map(item => item.entradas),
                    },
                    {
                      name: "Saídas",
                      data: relatorio.dados_diarios.map(item => item.saidas),
                    },
                  ],
                  options: {
                    ...chartsConfig,
                    colors: ["#4CAF50", "#F44336"],
                    xaxis: {
                      ...chartsConfig.xaxis,
                      categories: relatorio.dados_diarios.map(item => item.data),
                    },
                  },
                }}
                periodo={periodo}
                onPeriodoChange={handlePeriodoChange}
              />
            </div>
          </div>

          {/* Gráfico de Despesas por Categoria */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Despesas por Categoria
            </h2>
            <div className="h-[420px]">
              <ChartCard
                title="Despesas por Categoria"
                value={`R$ ${Number(relatorio.totais.saidas).toFixed(2)}`}
                chart={{
                  type: "pie",
                  height: 300,
                  // Garantir que os valores são números e não estão vazios
                  series: categorias_valores.length > 0 ? categorias_valores : [1],
                  options: {
                    ...chartsConfig,
                    // Garantir que há labels mesmo que não haja categorias
                    labels: categorias_labels.length > 0 ? categorias_labels : ['Sem despesas'],
                    colors: [
                      "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
                      "#FF9F40", "#8BC34A", "#FF5722", "#607D8B", "#E91E63"
                    ],
                    legend: {
                      position: "bottom",
                    },
                    // Adicionar configurações para melhorar a renderização
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
                onPeriodoChange={handlePeriodoChange}
              />
            </div>
          </div>
        </div>

        {/* Tabela de dados diários */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white p-4 border-b dark:border-gray-700">
            Dados Diários
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Data</th>
                  <th scope="col" className="px-6 py-3">Entradas (R$)</th>
                  <th scope="col" className="px-6 py-3">Saídas (R$)</th>
                  <th scope="col" className="px-6 py-3">Saldo (R$)</th>
                </tr>
              </thead>
              <tbody>
                {relatorio.dados_diarios.map((item, index) => (
                  <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td className="px-6 py-4">{item.data}</td>
                    <td className="px-6 py-4 text-green-600">{Number(item.entradas).toFixed(2)}</td>
                    <td className="px-6 py-4 text-red-600">{Number(item.saidas).toFixed(2)}</td>
                    <td className={`px-6 py-4 ${Number(item.saldo) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Number(item.saldo).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-semibold text-gray-900 dark:text-white">
                  <th scope="row" className="px-6 py-3 text-base">Total</th>
                  <td className="px-6 py-3 text-green-600">{Number(relatorio.totais.entradas).toFixed(2)}</td>
                  <td className="px-6 py-3 text-red-600">{Number(relatorio.totais.saidas).toFixed(2)}</td>
                  <td className={`px-6 py-3 ${Number(relatorio.totais.saldo) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Number(relatorio.totais.saldo).toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RelatorioFinanceiro;
