# app/channels/application_cable/connection.rb
module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_restaurante

    def connect
      self.current_restaurante = find_verified_restaurante
    end

    private

    def find_verified_restaurante
      token = request.params[:token]
      restaurante_id = request.params[:restaurante_id]

      if token
        # Autenticação via token JWT (para restaurantes)
        decoded_token = JWT.decode(token, Rails.application.credentials.devise_jwt_secret_key!)
        restaurante_id_from_token = decoded_token[0]["restaurante_id"]
        Restaurante.find_by(id: restaurante_id_from_token)
      elsif restaurante_id
        # Autenticação via restaurante_id (para clientes)
        Restaurante.find_by(id: restaurante_id)
      else
        reject_unauthorized_connection
      end
    rescue JWT::DecodeError
      reject_unauthorized_connection
    end
  end
end
