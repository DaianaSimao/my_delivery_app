class Produto < ApplicationRecord
  belongs_to :restaurante
  has_many :produto_acompanhamentos, dependent: :destroy
  has_many :acompanhamentos, through: :produto_acompanhamentos

  accepts_nested_attributes_for :produto_acompanhamentos, allow_destroy: true
end
