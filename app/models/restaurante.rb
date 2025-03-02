class Restaurante < ApplicationRecord
  belongs_to :endereco

  has_many :pedidos
  has_many :produtos
  has_many :user_restaurantes
  has_many :users, through: :user_restaurantes

  accepts_nested_attributes_for :endereco
end
