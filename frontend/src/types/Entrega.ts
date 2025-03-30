export interface Entrega {
  id: number;
  status: string;
  pedido_id: number;
  created_at: string;
  pedido: {
    id: number;
    forma_pagamento: string;
    observacoes: string;
    valor_total: string;
    cliente: {
      nome: string;
      telefone: string;
      endereco: {
        rua: string;
        numero: string;
        bairro: string;
        cidade: string;
        estado: string;
        cep: string;
        complemento?: string;
        ponto_referencia?: string;
      };
    };
    troco?: string;
  };
  entregador?: {
    id: number;
    nome: string;
    telefone: string;
    veiculo: string;
    ativo: boolean;
    placa: string;
  };
}