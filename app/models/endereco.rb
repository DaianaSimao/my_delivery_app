class Endereco < ApplicationRecord
  has_many :restaurante
  has_many :pedidos
  has_many :clientes

  validates :rua, :numero, :bairro, :cidade, :estado, :cep, presence: true
end
