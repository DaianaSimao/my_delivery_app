class Produto < ApplicationRecord
  belongs_to :restaurante
  has_many :produto_acompanhamentos, dependent: :destroy
  has_many :acompanhamentos, through: :produto_acompanhamentos
  has_many :itens_pedidos
  has_many :promocoes

  accepts_nested_attributes_for :produto_acompanhamentos, allow_destroy: true
end
