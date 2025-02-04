class ClienteSerializer
  include FastJsonapi::ObjectSerializer

  attributes :id, :nome, :telefone

  has_many :pedidos
end
