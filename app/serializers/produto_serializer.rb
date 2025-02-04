class ProdutoSerializer
  include FastJsonapi::ObjectSerializer
  attributes :id, :restaurante_id, :nome, :descricao, :preco, :imagem_url, :disponivel
  belongs_to :restaurante
end
