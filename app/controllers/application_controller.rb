class ApplicationController < ActionController::API
  before_action :authenticate_user!
  before_action :configure_permitted_parameters, if: :devise_controller?
  respond_to :json

  private

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [ :email, :password, :password_confirmation ])
  end

  def current_user
    return unless request.headers["Authorization"].present? || @current_user
    @current_user ||= begin
      jwt_payload = JWT.decode(request.headers["Authorization"].split.last,
                    Rails.application.credentials.devise_jwt_secret_key!).first
      User.find(jwt_payload["sub"])
    end
  end


  def extract_locale_from_accept_language_header
    request.env["HTTP_ACCEPT_LANGUAGE"]&.scan(/^[a-z]{2}-[A-Z]{2}/)&.first
  end

  # Para incluir o parâmetro locale em todos os URLs gerados
  def default_url_options
    { locale: I18n.locale }
  end
end
