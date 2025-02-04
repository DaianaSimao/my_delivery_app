class Endereco < ApplicationRecord
  has_many :pedidos
  has_many :restaurantes

  validates :rua, :numero, :bairro, :cidade, :estado, :cep, presence: true
end
