export interface ChartOptions {
  labels?: string[];
  colors?: string[];
  legend?: {
    position?: string;
    [key: string]: any;
  };
  xaxis?: {
    categories?: string[];
    [key: string]: any;
  };
  [key: string]: any;
}

export interface ChartConfig {
  type: "bar" | "line" | "pie" | "area" | "donut" | string;
  height: number;
  series: number[] | { name: string; data: number[] }[];
  options: ChartOptions;
}

export interface ChartCardProps {
  title: string;
  value: string;
  chart: ChartConfig;
  periodo: number;
  onPeriodoChange: (periodo: number) => void;
}