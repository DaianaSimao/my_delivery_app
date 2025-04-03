class Cliente < ApplicationRecord
  has_many :pedidos

  validates :nome, :sobrenome, presence: true
  validates :telefone, presence: true, uniqueness: true, length: { minimum: 11 }

  belongs_to :endereco, optional: true
end
