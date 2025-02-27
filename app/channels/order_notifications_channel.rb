# app/channels/order_notifications_channel.rb
class OrderNotificationsChannel < ApplicationCable::Channel
  def subscribed
    # Este método é chamado quando o cliente assina o canal
    restaurante_id = params[:restaurante_id]
    stream_from "order_notifications_channel_#{restaurante_id}"
  end

  def unsubscribed
    # Limpeza quando o cliente se desconecta
  end
end
