class Endereco < ApplicationRecord
  has_many :restaurante

  validates :rua, :numero, :bairro, :cidade, :estado, :cep, presence: true
end
