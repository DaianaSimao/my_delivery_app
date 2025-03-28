import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import {
  Menu,
  Card,
  Button,
  CardBody,
  MenuItem,
  MenuList,
  CardHeader,
  Typography,
  MenuHandler,
} from "@material-tailwind/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import salesIcon from "/icons/sales.svg";
import ordersIcon from "/icons/orders.svg";
import statsIcon from "/icons/stats.svg";
import deliveryIcon from "/icons/delivery.svg";
import api from "../../services/api";

interface MetricCardPropsType {
  icon: string;
  title: string;
  value: string;
  description: string;
}

interface ChartCardPropsType {
  title: string;
  value: string;
  chart: object;
  periodo: number;
  onPeriodoChange: (periodo: number) => void;
}

// Card de Métricas
function MetricCard({ icon, title, value, description }: MetricCardPropsType) {
  return (
    <Card className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
      <CardBody className="p-4" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <img src={icon} className="h-6 w-6 mb-5 dark:filter dark:invert" alt={title} />
        <Typography
          variant="small"
          className="text-gray-600 dark:text-gray-300 font-medium mb-1"
          placeholder={undefined}
          onPointerEnterCapture={undefined} 
          onPointerLeaveCapture={undefined}
        >
          {title}
        </Typography>
        <Typography 
          variant="h3" 
          className="text-blue-gray-900 dark:text-white"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          {value}
        </Typography>
        <Typography 
          variant="small" 
          className="text-gray-500 dark:text-gray-400"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          {description}
        </Typography>
      </CardBody>
    </Card>
  );
}

// Card de Gráfico
function ChartCard({ title, value, chart, periodo, onPeriodoChange }: ChartCardPropsType) {
  return (
    <Card className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800 w-full h-fit" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
      <CardHeader
        floated={false}
        shadow={false}
        className="flex items-start justify-between rounded-none dark:bg-gray-800"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <div>
          <Typography
            variant="small"
            className="text-gray-600 dark:text-gray-300 font-medium mb-1"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            {title}
          </Typography>
          <Typography 
            variant="h3" 
            className="text-blue-gray-900 dark:text-white"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            {value}
          </Typography>
        </div>
        <Menu>
          <MenuHandler>
            <Button
              size="sm"
              variant="outlined"
              className="flex items-center gap-1 border-gray-300 dark:border-gray-600 dark:text-gray-300"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              {periodo === 7 ? "Últimos 7 dias" : periodo === 30 ? "Últimos 30 dias" : "Últimos 90 dias"}
              <ChevronDownIcon
                strokeWidth={4}
                className="w-3 h-3 text-gray-900 dark:text-gray-300"
              />
            </Button>
          </MenuHandler>
          <MenuList 
            className="dark:bg-gray-700 dark:border-gray-600"
            placeholder={undefined}
            onPointerEnterCapture={undefined} 
            onPointerLeaveCapture={undefined}
          >
            <MenuItem 
              className="dark:text-gray-300 dark:hover:bg-gray-600"
              onClick={() => onPeriodoChange(7)}
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Últimos 7 dias
            </MenuItem>
            <MenuItem 
              className="dark:text-gray-300 dark:hover:bg-gray-600"
              onClick={() => onPeriodoChange(30)}
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Últimos 30 dias
            </MenuItem>
            <MenuItem 
              className="dark:text-gray-300 dark:hover:bg-gray-600"
              onClick={() => onPeriodoChange(90)}
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Últimos 90 dias
            </MenuItem>
          </MenuList>
        </Menu>
      </CardHeader>
      <Chart {...chart} />
    </Card>
  );
}

// Configuração dos gráficos
const chartsConfig = {
  chart: {
    toolbar: {
      show: false,
    },
    foreColor: "#6B7280",
  },
  title: {
    show: "",
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    axisTicks: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
    labels: {
      style: {
        colors: "#6B7280",
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: "#6B7280",
      },
    },
  },
  grid: {
    show: true,
    borderColor: "#EEEEEE",
    strokeDashArray: 5,
    xaxis: {
      lines: {
        show: false,
      },
    },
    padding: {
      top: 5,
      right: 20,
    },
  },
  fill: {
    opacity: 0.8,
  },
  tooltip: {
    theme: "dark",
  },
};

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
      if (!token) {
        throw new Error("Token de autenticação não encontrado.");
      }

      const response = await api.get(`/api/v1/relatorios/dashboard?periodo=${novoPeriodo}`);
      setDashboardData(response.data.data);
      setPeriodo(novoPeriodo);
    } catch (err) {
      console.error("Erro ao carregar dados do dashboard:", err);
    }
  };

  useEffect(() => {
    fetchDashboardData(periodo);
  }, []);

  const handlePeriodoChange = (novoPeriodo: number) => {
    fetchDashboardData(novoPeriodo);
  };

  // Dados dos cards de métricas
  const metricCardsData = [
    {
      icon: salesIcon,
      title: "Vendas Hoje",
      value: `R$ ${dashboardData.vendas_do_dia.toFixed(2)}`,
      description: `${dashboardData.crescimento_vendas}% em relação a ontem`,
    },
    {
      icon: ordersIcon,
      title: "Pedidos Hoje",
      value: dashboardData.pedidos_total.toString(),
      description: `${dashboardData.crescimento_pedidos}% em relação a ontem`,
    },
    {
      icon: statsIcon,
      title: "Ticket Médio",
      value: `R$ ${dashboardData.ticket_medio.toFixed(2)}`,
      description: `${dashboardData.crescimento_ticket_medio}% em relação a ontem`,
    },
    {
      icon: deliveryIcon,
      title: "Entregas Hoje",
      value: dashboardData.entregas_total.toString(),
      description: `${dashboardData.crescimento_entregas}% em relação a ontem`,
    },
  ];

  // Dados dos gráficos principais
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
  ];

  return (
    <section className="px-8 py-10 bg-gray-50 dark:bg-gray-900 mt-10">
      <div className="grid xl:grid-cols-5 lg:grid-cols-4 grid-cols-1 lg:gap-x-5 gap-y-5">
        {/* Cards de Métricas */}
        <div className="col-span-full xl:col-span-1 w-full grid-cols-1 md:grid grid-cols-3 xl:grid-cols-1 gap-5 space-y-5 md:space-y-0">
          {metricCardsData.map((props, key) => (
            <MetricCard key={key} {...props} />
          ))}
        </div>

        {/* Gráficos Principais */}
        <div className="col-span-4 lg:grid grid-cols-2 lg:space-y-0 space-y-5 gap-5">
          {chartCardsData.map((props, key) => (
            <ChartCard 
              key={key} 
              {...props} 
              periodo={periodo}
              onPeriodoChange={handlePeriodoChange}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Dashboard;