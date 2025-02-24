class ProdutoAcompanhamento < ApplicationRecord
  belongs_to :produto
  belongs_to :acompanhamento

  # Define a quantidade máxima de itens que podem ser escolhidos
  validates :quantidade_maxima, presence: true
end
