class Cliente < ApplicationRecord
  has_many :pedidos

  validates :nome, presence: true

  belongs_to :endereco, optional: true
end
