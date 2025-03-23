import { Endereco } from './Endereco';

export interface Restaurante {
  id: number;
  nome: string;
  descricao: string;
  categoria: string;
  taxa_entrega: number;
  tempo_medio_entrega: string;
  avaliacao: number;
  ativo: boolean;
  abertura: string;
  fechamento: string;
  cnpj: string;
  telefone: string;
  email: string;
  endereco: Endereco;
  created_at?: string;
  updated_at?: string;
  regioes_entrega: {
    id: number;
    bairro: string;
    taxa_entrega: number;
  }[];
}