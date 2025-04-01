export interface PedidoData {
  id: number;
  status: string;
  cliente: {
    nome: string;
  };
  forma_entrega: string;
  forma_pagamento: string;
}

export interface PedidoSalvo {
  data: PedidoData;
}