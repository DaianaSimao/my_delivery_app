import { Produto } from './Produto';

export interface Promocao {
  id: number;
  nome: string;
  descricao: string;
  tipo: 'de_para' | 'desconto_percentual';
  valor_de?: number;
  valor_para?: number;
  desconto_percentual?: number;
  data_inicio: string;
  data_fim: string;
  ativa: boolean;
  restaurante_id?: number;
  produto_ids?: number[]; // Array de números (IDs dos produtos)
  produtos?: Produto[]; // Array de objetos (Produtos)
}