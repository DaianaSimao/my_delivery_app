class Endereco < ApplicationRecord
  belongs_to :regioes_entrega, class_name: "RegioesEntrega", optional: true

  has_many :restaurante

  validates :rua, :numero, presence: true
end
