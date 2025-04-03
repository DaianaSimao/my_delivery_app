export interface CategoriasDespesa {
  id?: number;
  nome: string;
  descricao: string | null;
  ativo: boolean;
  restaurante_id: number;
} 