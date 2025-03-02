class RestauranteSerializer
  include FastJsonapi::ObjectSerializer

  attributes :id, :nome, :descricao,
            :categoria, :taxa_entrega,
            :tempo_medio_entrega, :avaliacao,
            :ativo, :endereco_id, :fechamento, :abertura

  has_many :produtos
end
