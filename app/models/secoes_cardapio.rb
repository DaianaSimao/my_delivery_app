class SecoesCardapio < ApplicationRecord
  belongs_to :restaurante
  has_many :produto_secoes
  has_many :produtos, through: :produto_secoes
end
