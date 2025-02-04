class ItensPedidoSerializer
  include FastJsonapi::ObjectSerializer

  attributes :id, :quantidade, :preco_unitario

  belongs_to :pedido
  belongs_to :produto
end
