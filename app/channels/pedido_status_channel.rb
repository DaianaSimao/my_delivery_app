class PedidoStatusChannel < ApplicationCable::Channel
  def subscribed
    pedido = Pedido.find(params[:pedido_id])
    stream_for pedido
  end

  def unsubscribed
    # Limpeza quando o cliente se desconecta
  end
end
