class Entrega < ApplicationRecord
  belongs_to :pedido
  belongs_to :entregador, optional: true

  after_update :atualizar_status_pedido, if: :status_changed?

  def atualizar_status_pedido
    if self.status == "Entregue"
      self.pedido.update(status: "Finalizado")
    end
  end
end
