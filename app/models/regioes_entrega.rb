# app/models/regiao_entrega.rb
class RegioesEntrega < ApplicationRecord
  belongs_to :restaurante

  has_many :enderecos
end
