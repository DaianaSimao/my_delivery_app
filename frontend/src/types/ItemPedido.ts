export interface ItemPedido {
  id: number;
  produto: {
    id: number;
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
  quantidade: number;
  acompanhamentos_pedidos?: Array<{
    id: number;
    item_acompanhamento: {
      id: number;
      nome: string;
      preco: number;
    };
    quantidade: number;
    preco_unitario: number;
  }>;
}