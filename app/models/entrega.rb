class Entrega < ApplicationRecord
  belongs_to :pedido
  belongs_to :entregador, optional: true

  after_update :mudanca_status_pedido, if: -> { saved_change_to_status? }

  def mudanca_status_pedido
    if self.status == "Em Entrega"
      self.pedido.update!(status: "Em Entrega")
    elsif self.status == "Entregue"
      self.pedido.update!(status: "Entregue")
    end
    PedidoStatusChannel.broadcast_to(self.pedido, { status: self.pedido.status })
  end
end
