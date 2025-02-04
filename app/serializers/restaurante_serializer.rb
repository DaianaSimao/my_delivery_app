class RestauranteSerializer
  include FastJsonapi::ObjectSerializer

  attributes :id, :nome, :descricao, :categoria, :taxa_entrega, :tempo_medio_entrega, :avaliacao, :ativo
  has_many :produtos
end
