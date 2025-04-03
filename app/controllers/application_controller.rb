class ApplicationController < ActionController::API
  before_action :authenticate_user!
  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :set_locale
  respond_to :json

  private

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:email, :password, :password_confirmation])
  end

  def set_locale
    # Ordem de prioridade para definir o idioma:
    # 1. Parâmetro na URL (?locale=pt-BR)
    # 2. Cabeçalho HTTP Accept-Language
    # 3. Idioma padrão configurado (pt-BR)
    locale = params[:locale] || extract_locale_from_accept_language_header || I18n.default_locale
    I18n.locale = locale if I18n.available_locales.include?(locale.to_sym)
  end

  def extract_locale_from_accept_language_header
    request.env['HTTP_ACCEPT_LANGUAGE']&.scan(/^[a-z]{2}-[A-Z]{2}/)&.first
  end

  # Para incluir o parâmetro locale em todos os URLs gerados
  def default_url_options
    { locale: I18n.locale }
  end
end
