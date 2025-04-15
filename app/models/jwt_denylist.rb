class JwtDenylist < ApplicationRecord
  include Devise::JWT::RevocationStrategies::Denylist

  validates :jti, presence: true, uniqueness: true

  self.table_name = "jwt_denylists"
end
