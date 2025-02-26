class EntregaSerializer
  include FastJsonapi::ObjectSerializer
  attributes :status, :pedido_id, :entregador_id
  belongs_to :pedido
  belongs_to :entregador
end
