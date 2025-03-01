class Acompanhamento < ApplicationRecord
  has_many :item_acompanhamentos
  has_many :produto_acompanhamentos
  has_many :produtos, through: :produto_acompanhamentos
  has_many :acompanhamentos_pedidos, through: :item_acompanhamentos
  belongs_to :restaurante

  accepts_nested_attributes_for :item_acompanhamentos, allow_destroy: true
end
