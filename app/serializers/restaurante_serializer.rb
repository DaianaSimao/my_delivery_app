class RestauranteSerializer
  include FastJsonapi::ObjectSerializer

  attributes :id, :nome, :descricao,
            :categoria, :taxa_entrega,
            :tempo_medio_entrega, :avaliacao,
            :ativo, :fechamento, :abertura,
            :cnpj, :telefone, :email
            
  belongs_to :endereco
  has_many :produtos
end
