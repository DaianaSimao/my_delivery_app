class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
          :recoverable, :rememberable, :validatable,
          :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  has_many :jwt_denylist, dependent: :destroy

  before_create :generate_jti

  def generate_jti
    self.jti = request.env['warden-jwt_auth.token']
  end
end
