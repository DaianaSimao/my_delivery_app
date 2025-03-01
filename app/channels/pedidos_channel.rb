class PedidosChannel < ApplicationCable::Channel
  def subscribed
    restaurante_id = params[:restaurante_id]
    stream_from "pedidos_channel_#{restaurante_id}"
  end

  def unsubscribed
    # Limpeza quando o cliente se desconecta
  end
end
