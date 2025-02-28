class ItensPedido < ApplicationRecord
  belongs_to :pedido
  belongs_to :produto
  has_many :acompanhamentos_pedidos
  has_many :item_acompanhamentos, through: :acompanhamentos_pedidos
end
