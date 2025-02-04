class Pedido < ApplicationRecord
  belongs_to :restaurante
  belongs_to :cliente
  belongs_to :endereco, optional: true

  has_many :itens_pedidos
  has_one :pagamento
  has_one :entrega
end
