export interface Despesa {
  id?: number;
  descricao: string;
  valor: number;
  data: string;
  status: string;
  observacoes: string | null;
  categorias_despesa_id: number;
  restaurante_id: number;
}