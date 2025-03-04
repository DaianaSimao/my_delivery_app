class Endereco < ApplicationRecord
  has_many :restaurante

  validates :rua, :numero, presence: true
end
