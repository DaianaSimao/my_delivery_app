class ItensPedido < ApplicationRecord
  belongs_to :pedido
  belongs_to :produto

  has_many :acompanhamentos_pedidos

  accepts_nested_attributes_for :acompanhamentos_pedidos
end
