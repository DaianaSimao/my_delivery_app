class Entrega < ApplicationRecord
  belongs_to :pedido
  belongs_to :entregador, optional: true
end
