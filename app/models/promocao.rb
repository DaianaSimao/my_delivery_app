# app/models/promocao.rb
class Promocao < ApplicationRecord
  belongs_to :restaurante
  belongs_to :produto
  
  validates :nome, presence: true
  validates :tipo, presence: true, inclusion: { in: %w[de_para desconto_percentual] }
  validates :valor_de, presence: true, if: :de_para?
  validates :valor_para, presence: true, if: :de_para?
  validates :desconto_percentual, presence: true, if: :desconto_percentual?

  def de_para?
    tipo == "de_para"
  end

  def desconto_percentual?
    tipo == "desconto_percentual"
  end

  def ativa?
    ativa && data_inicio <= Date.today && data_fim >= Date.today
  end
end