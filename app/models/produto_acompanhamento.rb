class ProdutoAcompanhamento < ApplicationRecord
  belongs_to :produto
  belongs_to :acompanhamento
end
