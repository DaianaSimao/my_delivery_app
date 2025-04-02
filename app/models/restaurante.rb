class Restaurante < ApplicationRecord
  belongs_to :endereco

  has_many :pedidos
  has_many :produtos
  has_many :user_restaurantes
  has_many :users, through: :user_restaurantes
  has_many :regioes_entrega, dependent: :destroy
  has_many :secoes_cardapios, dependent: :destroy

  # Associações para despesas
  has_many :categorias_despesas, dependent: :destroy
  has_many :despesas, dependent: :destroy

  accepts_nested_attributes_for :endereco
  accepts_nested_attributes_for :regioes_entrega, allow_destroy: true
end
