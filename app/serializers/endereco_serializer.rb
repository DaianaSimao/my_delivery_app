class EnderecoSerializer
  include FastJsonapi::ObjectSerializer

  attributes :rua, :numero, :complemento, :bairro, :cidade, :estado, :cep

  has_many :pedidos
  has_many :restaurantes
end
