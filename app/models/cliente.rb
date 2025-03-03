class Cliente < ApplicationRecord
  has_many :pedidos
  has_one :endereco

  validates :nome, presence: true

  accepts_nested_attributes_for :endereco
end

