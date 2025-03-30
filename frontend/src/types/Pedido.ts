export interface Pedido {
  id: number;
  status: string;
  created_at: string;
  forma_pagamento: string;
  cliente: {
    id: number;
    nome: string;
    telefone: string;
    endereco: {
      rua: string;
      numero: string;
      bairro: string;
      cidade: string;
      estado: string;
      cep: string;
      complemento: string;
      tipo: string;
    };
  };
  valor_total: number;
  itens_pedidos: Array<{
    produto: {
      nome: string;
      preco: number;
      acompanhamentos?: Array<{
        id: number;
        nome: string;
        quantidade_maxima: number;
        item_acompanhamentos?: Array<{
          id: number;
          nome: string;
          preco: number;
        }>;
      }>;
    };
    acompanhamentos_pedidos?: Array<{
      item_acompanhamento: any;
      id: number;
      itens_acompanhamentos_pedidos?: Array<{
        id: number;
        acompanhamento: {
          id: number;
          nome: string;
          quantidade_maxima: number;
        };
      }>;
      quantidade: number;
      preco_unitario: number;
    }>;
    quantidade: number;
  }>;
  pagamento?: {
    metodo: string;
    status: string;
    valor: string;
  };
  observacoes?: string;
}