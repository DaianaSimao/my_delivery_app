class Pedido < ApplicationRecord
  belongs_to :restaurante
  has_many :itens_pedido
  has_one :pagamento
  has_one :entrega
  has_one :avaliacao
end
