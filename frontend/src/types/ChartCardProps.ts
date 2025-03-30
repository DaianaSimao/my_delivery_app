export interface ChartCardProps {
  title: string;
  value: string;
  chart: object;
  periodo: number;
  onPeriodoChange: (periodo: number) => void;
}