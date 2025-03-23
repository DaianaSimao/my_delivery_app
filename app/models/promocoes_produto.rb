class PromocoesProduto < ApplicationRecord
  belongs_to :promocao
  belongs_to :produto
end
