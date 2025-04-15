class Users::SessionsController < Devise::SessionsController
  respond_to :json

  private

  def respond_with(resource, _opt = {})
    @token = request.env["warden-jwt_auth.token"]
    headers["Authorization"] = @token
    resource.update(jti: request.env["warden-jwt_auth.token"]) # Atualizar o jti do usuário
    request.env["restaurante_id"] = resource.restaurante_ativo
    render json: {
      status: {
        code: 200, message: "Logged in successfully.",
        data: {
          token: @token,
          user: UserSerializer.new(resource).serializable_hash[:data][:attributes],
          active_restaurante: resource.restaurante_ativo
        }
      }
    }, status: :ok
  end

  def respond_to_on_destroy
    if request.headers["Authorization"].present?
      jwt_payload = JWT.decode(request.headers["Authorization"].split.last,
                               Rails.application.credentials.devise_jwt_secret_key!).first

      current_user = User.find(jwt_payload["sub"])
    end

    if current_user
      render json: {
        status: 200,
        message: "Logout successfully."
      }, status: :ok
    else
      render json: {
        status: 401,
        message: "Couldn't find an active session."
      }, status: :unauthorized
    end
  end
end
