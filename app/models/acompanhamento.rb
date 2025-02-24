class Acompanhamento < ApplicationRecord
  has_many :item_acompanhamentos
  has_many :produto_acompanhamentos
  has_many :produtos, through: :produto_acompanhamentos

  accepts_nested_attributes_for :item_acompanhamentos, allow_destroy: true
end
