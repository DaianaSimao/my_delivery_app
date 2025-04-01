export interface Restaurante {
  id: number;
  nome: string;
  descricao?: string;
  categoria?: string;
  abertura: string;
  fechamento: string;
  pedido_minimo: number;
  taxa_entrega: number;
  tempo_medio_entrega: number;
  avaliacao?: number;
  telefone?: string;
  email?: string;
  dias_funcionamento?: string;
  endereco?: {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    complemento?: string;
    cep: string;
  };
}