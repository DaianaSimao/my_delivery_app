class ProdutoSecao < ApplicationRecord
  belongs_to :produto
  belongs_to :secoes_cardapio
end
