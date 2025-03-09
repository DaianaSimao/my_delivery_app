class Pagamento < ApplicationRecord
  belongs_to :pedido

  after_create :atualiza_metodo_pagamento

  def atualiza_metodo_pagamento
    case self.metodo
    when "credit"
      self.update!(metodo: "Cartão de Crédito")
    when "debit"
      self.update!(metodo: "Cartão de Débito")
    when "pix"
      self.update!(metodo: "PIX")
    when "cash"
      self.update!(metodo: "Dinheiro")
    end
  end
end
