class Endereco < ApplicationRecord
  belongs_to :regioes_entrega, class_name: "RegioesEntrega", optional: true

  has_many :restaurante

  validates :rua, :numero, presence: true

  validate :regiao_obrigatoria_para_clientes

  private
  def regiao_obrigatoria_para_clientes
    if self.tipo != "Restaurante" && regioes_entrega_id.blank?
      errors.add("Região de entrega é obrigatório")
    end
  end
end
