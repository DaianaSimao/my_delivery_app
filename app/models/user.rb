class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: self
  
  # Método para gerar o JWT
  before_create :generate_jti

  def generate_jti
    self.jti = request.env['warden-jwt_auth.token']
  end
end