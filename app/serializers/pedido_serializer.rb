class PedidoSerializer
  include FastJsonapi::ObjectSerializer

  attributes :id, :status, :forma_pagamento, :troco, :valor_total, :observacoes, :created_at

  belongs_to :restaurante
  belongs_to :cliente
  belongs_to :endereco
  has_many :itens_pedidos
  has_one :pagamento
  has_one :entrega
end
