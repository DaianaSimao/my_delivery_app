class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
          :recoverable, :rememberable, :validatable,
          :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  has_many :jwt_denylist, dependent: :destroy
  has_many :user_restaurantes
  has_many :restaurantes, through: :user_restaurantes
end
