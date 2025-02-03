class Restaurante < ApplicationRecord
  has_many :pedidos
  has_many :produtos
end
