class Restaurante < ApplicationRecord
  belongs_to :endereco

  has_many :pedidos
  has_many :produtos
end
