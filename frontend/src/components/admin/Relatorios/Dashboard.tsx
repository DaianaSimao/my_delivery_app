import { useEffect, useState } from "react";
import { MetricCard } from "./MetricCard";
import { ChartCard } from "./ChartCard";
import { chartsConfig } from "../../../utils/chartConfig";
import api from "../../../services/api";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    vendas_do_dia: 0,
    crescimento_vendas: 0,
    pedidos_total: 0,
    crescimento_pedidos: 0,
    entregas_total: 0,
    crescimento_entregas: 0,
    ticket_medio: 0,
    crescimento_ticket_medio: 0,
    vendas_semanais: [0, 0, 0, 0, 0, 0, 0],
    pedidos_semanais: [0, 0, 0, 0, 0, 0, 0],
    entregas_semanais: [0, 0, 0, 0, 0, 0, 0],
  });
  const [periodo, setPeriodo] = useState(7);

  const fetchDashboardData = async (novoPeriodo: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token de autenticação não encontrado.");

      const response = await api.get(`/api/v1/relatorios/dashboard?periodo=${novoPeriodo}`);
      setDashboardData(response.data.data);
      setPeriodo(novoPeriodo);
      console.log("Dados do dashboard:", response.data.data);
      console.log("Período:", novoPeriodo);
    } catch (err) {
      console.error("Erro ao carregar dados do dashboard:", err);
    }
  };

  useEffect(() => {
    fetchDashboardData(periodo);
  }, []);

  const metricCardsData = [
    {
      icon: "/icons/sales.svg",
      title: "Vendas Hoje",
      value: `R$ ${dashboardData.vendas_do_dia.toFixed(2)}`,
      description: `${dashboardData.crescimento_vendas}% em relação a ontem`,
    },
    {
      icon: "/icons/orders.svg",
      title: "Pedidos Hoje",
      value: dashboardData.pedidos_total.toString(),
      description: `${dashboardData.crescimento_pedidos}% em relação a ontem`,
    },
    {
      icon: "/icons/stats.svg",
      title: "Ticket Médio",
      value: `R$ ${dashboardData.ticket_medio}`,
      description: `${dashboardData.crescimento_ticket_medio}% em relação a ontem`,
    },
    {
      icon: "/icons/delivery.svg",
      title: "Entregas Hoje",
      value: dashboardData.entregas_total.toString(),
      description: `${dashboardData.crescimento_entregas}% em relação a ontem`,
    },
  ];

  const chartCardsData = [
    {
      title: "Vendas Semanais",
      value: `R$ ${dashboardData.vendas_semanais.reduce((a, b) => a + b, 0).toFixed(2)}`,
      chart: {
        type: "area",
        height: 220,
        series: [
          {
            name: "Vendas",
            data: dashboardData.vendas_semanais,
          },
        ],
        options: {
          ...chartsConfig,
          colors: ["#388e3c"],
          stroke: {
            lineCap: "round",
            width: 2,
          },
          fill: {
            opacity: 0,
            type: "outline",
          },
          xaxis: {
            ...chartsConfig.xaxis,
            categories: Array.from({ length: periodo }, (_, i) => {
              const data = new Date();
              data.setDate(data.getDate() - (periodo - 1 - i));
              return data.toLocaleDateString('pt-BR', { weekday: 'short' });
            }),
          },
        },
      },
    },
    {
      title: "Pedidos Semanais",
      value: dashboardData.pedidos_semanais.reduce((a, b) => a + b, 0).toString(),
      chart: {
        type: "area",
        height: 220,
        series: [
          {
            name: "Pedidos",
            data: dashboardData.pedidos_semanais,
          },
        ],
        options: {
          ...chartsConfig,
          colors: ["#2196F3"],
          stroke: {
            lineCap: "round",
            width: 2,
          },
          fill: {
            opacity: 0,
            type: "outline",
          },
          xaxis: {
            ...chartsConfig.xaxis,
            categories: Array.from({ length: periodo }, (_, i) => {
              const data = new Date();
              data.setDate(data.getDate() - (periodo - 1 - i));
              return data.toLocaleDateString('pt-BR', { weekday: 'short' });
            }),
          },
        },
      },
    },
    {
      title: "Entregas Semanais",
      value: dashboardData.entregas_semanais.reduce((a, b) => a + b, 0).toString(),
      chart: {
        type: "area",
        height: 220,
        series: [
          {
            name: "Entregas",
            data: dashboardData.entregas_semanais,
          },
        ],
        options: {
          ...chartsConfig,
          colors: ["#FF9800"],
          stroke: {
            lineCap: "round",
            width: 2,
          },
          fill: {
            opacity: 0,
            type: "outline",
          },
          xaxis: {
            ...chartsConfig.xaxis,
            categories: Array.from({ length: periodo }, (_, i) => {
              const data = new Date();
              data.setDate(data.getDate() - (periodo - 1 - i));
              return data.toLocaleDateString('pt-BR', { weekday: 'short' });
            }),
          },
        },
      },
    },
  ]

  return (
    <section className="px-8 py-10 bg-gray-50 dark:bg-gray-900 mt-10">
      <div className="grid xl:grid-cols-5 lg:grid-cols-4 grid-cols-1 lg:gap-x-5 gap-y-5">
        <div className="col-span-full xl:col-span-1 w-full grid-cols-1 md:grid grid-cols-3 xl:grid-cols-1 gap-5 space-y-5 md:space-y-0">
          {metricCardsData.map((props, key) => (
            <MetricCard key={key} {...props} />
          ))}
        </div>
        <div className="col-span-4 lg:grid grid-cols-2 lg:space-y-0 space-y-5 gap-5">
          {chartCardsData.map((props, key) => (
            <ChartCard key={key} {...props} periodo={periodo} onPeriodoChange={fetchDashboardData} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Dashboard;