class Produto < ApplicationRecord
  belongs_to :restaurante
  has_many :produto_acompanhamentos
  has_many :acompanhamentos, through: :produto_acompanhamentos
end
